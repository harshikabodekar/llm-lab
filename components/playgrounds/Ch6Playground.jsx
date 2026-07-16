"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import StartHere from "../StartHere";
import WhatWhyHow from "../WhatWhyHow";

/* a real (tiny) transformer block: attention -> add & norm -> feedforward ->
   add & norm. deterministic seeded weights (no Math.random at render time,
   so server and client always agree — same trick as ch4/ch5). */

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}
const rnd = seeded(11);
const DIM = 6;
const N_TOKENS = 4;
const MAX_BLOCKS = 4;

const INPUT = Array.from({ length: N_TOKENS }, () =>
  Array.from({ length: DIM }, () => rnd() * 2 - 1)
);
const BLOCK_PARAMS = Array.from({ length: MAX_BLOCKS }, () => ({
  w: Array.from({ length: DIM }, () => Array.from({ length: DIM }, () => (rnd() * 2 - 1) * 0.4)),
  b: Array.from({ length: DIM }, () => (rnd() * 2 - 1) * 0.2)
}));

function dot(a, b) {
  return a.reduce((s, v, i) => s + v * b[i], 0);
}
function softmax(row) {
  const m = Math.max(...row);
  const exps = row.map((v) => Math.exp(v - m));
  const sum = exps.reduce((a, v) => a + v, 0);
  return exps.map((v) => v / sum);
}
function attention(x) {
  const scale = Math.sqrt(DIM);
  return x.map((qi) => {
    const weights = softmax(x.map((kj) => dot(qi, kj) / scale));
    return x[0].map((_, d) => x.reduce((s, v, j) => s + weights[j] * v[d], 0));
  });
}
function layerNorm(vec) {
  const mean = vec.reduce((a, v) => a + v, 0) / vec.length;
  const variance = vec.reduce((a, v) => a + (v - mean) ** 2, 0) / vec.length;
  const std = Math.sqrt(variance + 1e-5);
  return vec.map((v) => (v - mean) / std);
}
function feedForward(vec, params) {
  return params.w.map((row, i) => Math.tanh(dot(row, vec) + params.b[i]));
}
function addMat(a, b) {
  return a.map((row, i) => row.map((v, j) => v + b[i][j]));
}
function runBlock(x, params) {
  const attnOut = attention(x);
  let y = addMat(x, attnOut).map(layerNorm);
  const ffOut = y.map((vec) => feedForward(vec, params));
  y = addMat(y, ffOut).map(layerNorm);
  return y;
}
function runStack(nBlocks, useResidualNorm) {
  const states = [INPUT];
  let x = INPUT;
  for (let i = 0; i < nBlocks; i++) {
    x = useResidualNorm ? runBlock(x, BLOCK_PARAMS[i]) : runBlockRaw(x, BLOCK_PARAMS[i]);
    states.push(x);
  }
  return states;
}

function MatrixHeatmap({ matrix }) {
  const cols = matrix[0].length;
  return (
    <div className="inline-grid gap-[2px] bg-ink/10 p-[2px]" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {matrix.flatMap((row, i) =>
        row.map((v, j) => {
          const clamped = Math.max(-2, Math.min(2, v)) / 2;
          const color = clamped >= 0 ? `rgba(43, 79, 216, ${clamped})` : `rgba(214, 69, 69, ${-clamped})`;
          return <div key={`${i}-${j}`} className="h-5 w-5 bg-paper" style={{ background: color }} title={v.toFixed(2)} />;
        })
      )}
    </div>
  );
}

function cosineSim(matA, matB) {
  const af = matA.flat();
  const bf = matB.flat();
  const dp = af.reduce((s, v, i) => s + v * bf[i], 0);
  const na = Math.sqrt(af.reduce((s, v) => s + v * v, 0));
  const nb = Math.sqrt(bf.reduce((s, v) => s + v * v, 0));
  return na && nb ? dp / (na * nb) : 0;
}

function runBlockRaw(x, params) {
  // no residual, no norm — each step REPLACES the state instead of adding to it
  const attnOut = attention(x);
  return attnOut.map((vec) => feedForward(vec, params));
}

// ---- positional encoding demo ----
const PE_DIM = 4;
const PE_WORDS = {
  dog: [0.8, 0.2, 0.1, 0.3],
  bites: [0.1, 0.9, 0.2, 0.1],
  man: [0.3, 0.1, 0.7, 0.2]
};
const SENTENCE_A = ["dog", "bites", "man"];
const SENTENCE_B = ["man", "bites", "dog"];

function positionalEncoding(pos, dim) {
  const pe = [];
  for (let i = 0; i < dim; i++) {
    const angle = pos / Math.pow(10000, (2 * Math.floor(i / 2)) / dim);
    pe.push(i % 2 === 0 ? Math.sin(angle) : Math.cos(angle));
  }
  return pe;
}
function addVec(a, b) {
  return a.map((v, i) => v + b[i]);
}

function PositionalEncodingDemo() {
  const [sentence, setSentence] = useState("A");
  const [showPE, setShowPE] = useState(true);

  const words = sentence === "A" ? SENTENCE_A : SENTENCE_B;
  const embeddings = words.map((w) => PE_WORDS[w]);
  const display = showPE ? embeddings.map((e, i) => addVec(e, positionalEncoding(i, PE_DIM))) : embeddings;

  return (
    <div className="mb-8">
      <p className="margin-note mb-3 uppercase tracking-wide">step 0 · positional encoding</p>
      <WhatWhyHow
        what="add real position vectors to token embeddings, then compare 'dog bites man' vs 'man bites dog'."
        why="attention treats tokens as an unordered set — position vectors are the only thing telling the model where each word actually sits."
        how="toggle positional encoding on/off and watch whether 'dog' looks different depending on where it sits."
      />
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setSentence("A")}
          className={`px-3 py-1.5 font-mono text-xs ${sentence === "A" ? "btn-ink" : "btn-paper"}`}
        >
          "dog bites man"
        </button>
        <button
          onClick={() => setSentence("B")}
          className={`px-3 py-1.5 font-mono text-xs ${sentence === "B" ? "btn-ink" : "btn-paper"}`}
        >
          "man bites dog"
        </button>
        <span className="mx-1 text-faded">·</span>
        <button
          onClick={() => setShowPE((v) => !v)}
          className={`px-3 py-1.5 font-mono text-xs ${showPE ? "border-[1.5px] border-ink bg-marker" : "btn-paper"}`}
        >
          {showPE ? "with positional encoding" : "without positional encoding"}
        </button>
      </div>
      <div className="flex flex-wrap gap-4">
        {words.map((w, i) => (
          <div key={i} className="sheet-flat bg-white p-2 text-center">
            <p className={`mb-1 font-mono text-xs ${w === "dog" ? "font-bold text-inkblue" : "text-faded"}`}>
              {w} (pos {i})
            </p>
            <MatrixHeatmap matrix={[display[i]]} />
          </div>
        ))}
      </div>
      <p className="margin-note mt-4">
        {showPE
          ? "watch 'dog's card — its colors change depending on which position it lands in, because position 0 and position 2 get added different position vectors."
          : "without positional encoding, 'dog's card is IDENTICAL in both sentences — the model has no way to tell where anything sits."}
      </p>
    </div>
  );
}

const STEPS_CORRECT = ["Attention", "Add & Norm", "Feed-Forward", "Add & Norm"];
const STEPS_START = [
  { id: "ff", label: "Feed-Forward" },
  { id: "an1", label: "Add & Norm" },
  { id: "attn", label: "Attention" },
  { id: "an2", label: "Add & Norm" }
];

function OrderExercise() {
  const [order, setOrder] = useState(STEPS_START);
  const dragIndex = useRef(null);

  useEffect(() => {
    // shuffle client-side only, after mount — keeps server/client HTML identical on first paint
    const shuffled = [...STEPS_START];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setOrder(shuffled);
  }, []);

  const correct = order.map((s) => s.label).join("|") === STEPS_CORRECT.join("|");

  function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  }

  return (
    <div className="mb-8">
      <p className="margin-note mb-3 uppercase tracking-wide">step 1 · order the block</p>
      <div className="flex flex-col gap-1.5">
        {order.map((step, i) => (
          <div
            key={step.id}
            draggable
            onDragStart={() => (dragIndex.current = i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex.current === null || dragIndex.current === i) return;
              const next = [...order];
              const [moved] = next.splice(dragIndex.current, 1);
              next.splice(i, 0, moved);
              setOrder(next);
              dragIndex.current = null;
            }}
            className="sheet-flat flex cursor-grab items-center gap-2 bg-white px-3 py-2 font-mono text-sm active:cursor-grabbing"
          >
            <span className="select-none text-faded">⠿</span>
            <span className="flex-1">
              {i + 1}. {step.label}
            </span>
            <div className="flex flex-col gap-0.5">
              <button aria-label="move up" onClick={() => move(i, -1)} className="px-1 text-[0.65rem] leading-none text-faded hover:text-ink">▲</button>
              <button aria-label="move down" onClick={() => move(i, 1)} className="px-1 text-[0.65rem] leading-none text-faded hover:text-ink">▼</button>
            </div>
          </div>
        ))}
      </div>
      {correct && <p className="mt-3 font-mono text-sm text-signal">✓ that's the order — every transformer block, every time.</p>}
    </div>
  );
}

export default function Ch6Playground() {
  const [nBlocks, setNBlocks] = useState(2);
  const [step, setStep] = useState(0);
  const [useResidualNorm, setUseResidualNorm] = useState(true);

  const states = useMemo(() => runStack(nBlocks, useResidualNorm), [nBlocks, useResidualNorm]);
  const clampedStep = Math.min(step, nBlocks);
  const signalRetained = cosineSim(INPUT, states[clampedStep]);

  return (
    <div className="sheet p-5">
      <StartHere>order the 4 steps, then step through the block stack below.</StartHere>

      <PositionalEncodingDemo />

      <OrderExercise />

      <p className="margin-note mb-3 uppercase tracking-wide">step 2 · stack blocks, watch shapes flow</p>
      <WhatWhyHow
        what="stack real transformer blocks and step through them, with residual+norm on or off."
        why="residual connections are the plumbing that stops deep nets from dying — turn them off and watch the original signal disappear."
        how="pick a block count, toggle residual+norm, then click through each step and watch 'signal retained' below."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-faded">blocks:</span>
        {[1, 2, 3, 4].map((n) => (
          <button
            key={n}
            onClick={() => {
              setNBlocks(n);
              setStep((s) => Math.min(s, n));
            }}
            className={`px-3 py-1.5 font-mono text-xs ${nBlocks === n ? "btn-ink" : "btn-paper"}`}
          >
            {n}
          </button>
        ))}
        <span className="mx-1 text-faded">·</span>
        <span className="font-mono text-xs text-faded">residual + norm:</span>
        <button
          onClick={() => setUseResidualNorm(true)}
          className={`px-3 py-1.5 font-mono text-xs ${useResidualNorm ? "btn-ink" : "btn-paper"}`}
        >
          on
        </button>
        <button
          onClick={() => setUseResidualNorm(false)}
          className={`px-3 py-1.5 font-mono text-xs ${!useResidualNorm ? "btn-ink" : "btn-paper"}`}
        >
          off
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-faded">viewing:</span>
        {states.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`px-3 py-1.5 font-mono text-xs ${clampedStep === i ? "btn-ink" : "btn-paper"}`}
          >
            {i === 0 ? "input" : `after block ${i}`}
          </button>
        ))}
      </div>

      <div className="sheet-flat inline-block bg-white p-4">
        <MatrixHeatmap matrix={states[clampedStep]} />
        <p className="mt-3 font-mono text-xs text-faded">shape: {N_TOKENS} tokens × {DIM} dims</p>
        <p className={`mt-1 font-mono text-xs ${signalRetained > 0.5 ? "text-signal" : "text-alarm"}`}>
          signal retained (similarity to original input): {(signalRetained * 100).toFixed(0)}%
        </p>
      </div>

      <p className="margin-note mt-4">
        same shape at every step ({N_TOKENS} × {DIM}) regardless of the toggle — only "signal retained" and the cell
        colors tell you whether the original input is still in there. {!useResidualNorm && "watch it collapse faster with residual+norm off."}
      </p>
    </div>
  );
}
