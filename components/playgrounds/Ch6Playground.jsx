"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import StartHere from "../StartHere";

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
function runStack(nBlocks) {
  const states = [INPUT];
  let x = INPUT;
  for (let i = 0; i < nBlocks; i++) {
    x = runBlock(x, BLOCK_PARAMS[i]);
    states.push(x);
  }
  return states;
}

function MatrixHeatmap({ matrix }) {
  return (
    <div className="inline-grid gap-[2px] bg-ink/10 p-[2px]" style={{ gridTemplateColumns: `repeat(${DIM}, 1fr)` }}>
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

  const states = useMemo(() => runStack(nBlocks), [nBlocks]);
  const clampedStep = Math.min(step, nBlocks);

  return (
    <div className="sheet p-5">
      <StartHere>order the 4 steps, then step through the block stack below.</StartHere>

      <OrderExercise />

      <p className="margin-note mb-3 uppercase tracking-wide">step 2 · stack blocks, watch shapes flow</p>

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
      </div>

      <p className="margin-note mt-4">
        same shape at every step ({N_TOKENS} × {DIM}) — only the values (and the cell colors above) change as data passes through each block.
      </p>
    </div>
  );
}
