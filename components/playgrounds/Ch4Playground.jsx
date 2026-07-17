"use client";

import { useEffect, useRef, useState } from "react";
import { Net, mseGrad } from "../../engine/tinynn";
import StartHere from "../StartHere";
import PredictBlock from "../Predict";

const PREDICT = {
  question: "will gradient descent beat your hand-tuned accuracy?",
  options: ["yes, easily", "no, I'll beat it", "about the same"],
  answerIndex: 0
};

/* real tanh neurons, real backprop (via engine/tinynn), no faking.
   the human and gradient descent both tune the SAME 9 numbers
   (a fixed 2x3 hidden layer) — the output layer is frozen identically
   for both, so it's a fair fight. */

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}
const rand = seeded(7);
// fixed, deterministic point set — same on server and client every time
const POINTS = Array.from({ length: 36 }, () => {
  const x = rand() * 2 - 1;
  const y = rand() * 2 - 1;
  const label = Math.hypot(x, y) < 0.6 ? 1 : -1;
  return { x, y, label };
});

const LAYER2 = { w: [[1, 1, 1]], b: [0] };
const tanh = Math.tanh;

function forward(x, layer1) {
  const h = layer1.w.map((row, i) => tanh(row[0] * x[0] + row[1] * x[1] + layer1.b[i]));
  return tanh(LAYER2.w[0].reduce((s, wt, i) => s + wt * h[i], LAYER2.b[0]));
}

function evaluate(layer1) {
  let correct = 0;
  let loss = 0;
  for (const p of POINTS) {
    const out = forward([p.x, p.y], layer1);
    if ((out >= 0 ? 1 : -1) === p.label) correct++;
    loss += (out - p.label) ** 2;
  }
  return { accuracy: correct / POINTS.length, loss: loss / POINTS.length };
}

function runGradientDescent(steps = 400, lr = 0.6) {
  const net = new Net([2, 3, 1]);
  net.layers[1].w = LAYER2.w.map((r) => [...r]);
  net.layers[1].b = [...LAYER2.b];
  for (let s = 0; s < steps; s++) {
    for (const p of POINTS) {
      const out = net.forward([p.x, p.y]);
      net.backward(mseGrad(out, [p.label]));
      net.layers[0].step(lr); // only the shared 9-number layer trains
    }
  }
  return { w: net.layers[0].w.map((r) => [...r]), b: [...net.layers[0].b] };
}

const START_WEIGHTS = {
  w: [
    [1.4, -1.2, 0],
    [-0.8, -0.9, 1.1],
    [0.6, 0.7, -1.3]
  ],
  b: [0.4, -0.3, 0.2]
};

const GREEN_BG = "#C9F2D0";
const ROSE_BG = "#FFD9C9";
const GREEN_DOT = "#12A150";
const ROSE_DOT = "#D64545";
const INK = "#1A1D21";

function DecisionCanvas({ layer1, title }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !layer1) return;
    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    const cells = 24;
    const cellSize = size / cells;

    for (let cy = 0; cy < cells; cy++) {
      for (let cx = 0; cx < cells; cx++) {
        const x = (cx / (cells - 1)) * 2 - 1;
        const y = (cy / (cells - 1)) * 2 - 1;
        const out = forward([x, y], layer1);
        ctx.fillStyle = out >= 0 ? GREEN_BG : ROSE_BG;
        ctx.fillRect(cx * cellSize, cy * cellSize, cellSize + 1, cellSize + 1);
      }
    }

    for (const p of POINTS) {
      const px = ((p.x + 1) / 2) * size;
      const py = ((p.y + 1) / 2) * size;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = p.label === 1 ? GREEN_DOT : ROSE_DOT;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = INK;
      ctx.stroke();
    }
  }, [layer1]);

  const stats = layer1 ? evaluate(layer1) : null;

  return (
    <div>
      <p className="margin-note mb-2">{title}</p>
      <canvas ref={ref} width={240} height={240} className="w-full border-[1.5px] border-ink" />
      <p className="mt-2 font-mono text-xs">
        {stats ? (
          <>
            accuracy: <strong>{(stats.accuracy * 100).toFixed(0)}%</strong> · loss:{" "}
            <strong>{stats.loss.toFixed(3)}</strong>
          </>
        ) : (
          "press the button below →"
        )}
      </p>
    </div>
  );
}

export default function Ch4Playground() {
  const [w, setW] = useState(() => START_WEIGHTS.w.map((r) => [...r]));
  const [b, setB] = useState(() => [...START_WEIGHTS.b]);
  const [gdResult, setGdResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [predicted, setPredicted] = useState(null);

  const layer1 = { w, b };

  function updateW(i, j, val) {
    const next = w.map((row) => [...row]);
    next[i][j] = val;
    setW(next);
  }
  function updateB(i, val) {
    const next = [...b];
    next[i] = val;
    setB(next);
  }

  function reset() {
    setW(START_WEIGHTS.w.map((r) => [...r]));
    setB([...START_WEIGHTS.b]);
    setGdResult(null);
  }

  async function handleRunGD() {
    if (predicted === null) return;
    setRunning(true);
    await new Promise((r) => setTimeout(r, 30));
    setGdResult(runGradientDescent());
    setRunning(false);
  }

  const you = evaluate(layer1);
  const gd = gdResult ? evaluate(gdResult) : null;

  return (
    <div className="sheet p-5">
      <StartHere>drag any slider and watch the left canvas repaint.</StartHere>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <DecisionCanvas layer1={layer1} title="your weights" />
        <DecisionCanvas layer1={gdResult} title="gradient descent" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {w.map((row, i) => (
          <div key={i} className="sheet-flat bg-white p-3">
            <p className="mb-2 font-mono text-xs text-inkblue">neuron {i + 1}</p>
            {["w1", "w2"].map((label, j) => (
              <label key={label} className="mb-1 block font-mono text-[0.7rem] text-faded">
                {label}: {row[j].toFixed(1)}
                <input
                  type="range"
                  min={-3}
                  max={3}
                  step={0.1}
                  value={row[j]}
                  onChange={(e) => updateW(i, j, parseFloat(e.target.value))}
                  className="block w-full"
                />
              </label>
            ))}
            <label className="block font-mono text-[0.7rem] text-faded">
              bias: {b[i].toFixed(1)}
              <input
                type="range"
                min={-3}
                max={3}
                step={0.1}
                value={b[i]}
                onChange={(e) => updateB(i, parseFloat(e.target.value))}
                className="block w-full"
              />
            </label>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <PredictBlock predict={PREDICT} picked={predicted} onPick={setPredicted} revealed={!!gdResult} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={handleRunGD}
          disabled={running || predicted === null}
          className="btn-ink px-4 py-2 font-mono text-xs disabled:opacity-50"
        >
          {running ? "training…" : "▶ run gradient descent"}
        </button>
        <button onClick={reset} className="btn-paper px-4 py-2 font-mono text-xs">
          reset sliders
        </button>
      </div>

      {gd && (
        <p className="margin-note mt-4">
          you: {(you.accuracy * 100).toFixed(0)}% · gradient descent: {(gd.accuracy * 100).toFixed(0)}%
          {gd.accuracy > you.accuracy
            ? ` — GD wins by ${((gd.accuracy - you.accuracy) * 100).toFixed(0)} points.`
            : gd.accuracy < you.accuracy
            ? " — you actually won this round. rare! drag some more, or brag about it."
            : " — a tie. impressive hand-tuning."}
        </p>
      )}
    </div>
  );
}
