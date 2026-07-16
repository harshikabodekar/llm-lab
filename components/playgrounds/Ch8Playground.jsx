"use client";

import { useEffect, useRef, useState } from "react";
import StartHere from "../StartHere";

/* real gradient descent, animated one step at a time.
   f(x) = x^2 + 0.4*sin(2x) — a hilly curve with one main valley, steep
   enough that lr ~0.01 creeps, ~0.3-0.5 glides in, and >1.1 genuinely
   diverges (contraction factor |1 - 2*lr| exceeds 1 past lr=1) — all
   3 behaviors the chapter promises are reachable within the slider range.
   f'(x) computed analytically, no approximation. */

const X_MIN = -3.5;
const X_MAX = 3.5;
const START_X = -3;
const MAX_STEPS = 300;

function f(x) {
  return x * x + 0.4 * Math.sin(2 * x);
}
function fPrime(x) {
  return 2 * x + 0.8 * Math.cos(2 * x);
}

// precompute the curve's y-range for a stable viewport
let Y_MIN = Infinity;
let Y_MAX = -Infinity;
for (let x = X_MIN; x <= X_MAX; x += 0.05) {
  const y = f(x);
  if (y < Y_MIN) Y_MIN = y;
  if (y > Y_MAX) Y_MAX = y;
}

const VB_W = 400;
const VB_H = 240;
const PAD = 24;

function toPx(x) {
  return PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (VB_W - PAD * 2);
}
function toPy(y) {
  const yLo = Y_MIN - 0.4;
  const yHi = Y_MAX + 0.4;
  return VB_H - PAD - ((y - yLo) / (yHi - yLo)) * (VB_H - PAD * 2);
}

const CURVE_PATH = (() => {
  let d = "";
  for (let x = X_MIN; x <= X_MAX; x += 0.05) {
    d += `${d ? "L" : "M"}${toPx(x).toFixed(1)},${toPy(f(x)).toFixed(1)} `;
  }
  return d;
})();

export default function Ch8Playground() {
  const [lr, setLr] = useState(0.3);
  const [x, setX] = useState(START_X);
  const [history, setHistory] = useState([START_X]);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState(null); // { kind: "converged" | "diverged" | "stopped", steps }
  const intervalRef = useRef(null);
  const stepCountRef = useRef(0);
  const stableCountRef = useRef(0);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  function stop() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
  }

  function reset() {
    stop();
    setX(START_X);
    setHistory([START_X]);
    setStatus(null);
    stepCountRef.current = 0;
    stableCountRef.current = 0;
  }

  function run() {
    if (running) return;
    setStatus(null);
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setX((prevX) => {
        const grad = fPrime(prevX);
        const nextX = prevX - lr * grad;
        stepCountRef.current += 1;

        setHistory((h) => [...h.slice(-39), nextX]);

        if (Math.abs(nextX) > 8 || !Number.isFinite(nextX)) {
          setStatus({ kind: "diverged", steps: stepCountRef.current });
          stop();
          return prevX;
        }
        if (Math.abs(fPrime(nextX)) < 0.01) {
          stableCountRef.current += 1;
        } else {
          stableCountRef.current = 0;
        }
        if (stableCountRef.current >= 5) {
          setStatus({ kind: "converged", steps: stepCountRef.current });
          stop();
          return nextX;
        }
        if (stepCountRef.current >= MAX_STEPS) {
          setStatus({ kind: "stopped", steps: stepCountRef.current });
          stop();
          return nextX;
        }
        return nextX;
      });
    }, 120);
  }

  const clampedX = Math.max(X_MIN - 0.5, Math.min(X_MAX + 0.5, x));
  const ballOffscreen = Math.abs(x) > X_MAX + 0.5;

  return (
    <div className="sheet p-5">
      <StartHere>set the learning rate, hit run, watch the ball.</StartHere>

      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full border-[1.5px] border-ink bg-paper">
        <path d={CURVE_PATH} fill="none" stroke="#1A1D21" strokeWidth="1.5" />
        {history.map((hx, i) => (
          <circle
            key={i}
            cx={toPx(Math.max(X_MIN, Math.min(X_MAX, hx)))}
            cy={toPy(f(Math.max(X_MIN, Math.min(X_MAX, hx)))) }
            r="2.5"
            fill="#2B4FD8"
            opacity={((i + 1) / history.length) * 0.5}
          />
        ))}
        {!ballOffscreen && (
          <circle cx={toPx(clampedX)} cy={toPy(f(clampedX))} r="7" fill="#FFD644" stroke="#1A1D21" strokeWidth="1.5" />
        )}
      </svg>

      <div className="mt-4">
        <label className="block font-mono text-xs text-faded">
          learning rate: <strong className="text-ink">{lr.toFixed(2)}</strong>
        </label>
        <input
          type="range"
          min={0.01}
          max={1.2}
          step={0.01}
          value={lr}
          onChange={(e) => setLr(parseFloat(e.target.value))}
          disabled={running}
          className="mt-1 block w-full"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button onClick={run} disabled={running} className="btn-ink px-4 py-2 font-mono text-xs disabled:opacity-50">
          {running ? "running…" : "▶ run"}
        </button>
        <button onClick={reset} className="btn-paper px-4 py-2 font-mono text-xs">
          reset
        </button>
        <span className="font-mono text-xs text-faded">
          x: {x.toFixed(2)} · loss: {f(x).toFixed(2)} · |gradient|: {Math.abs(fPrime(x)).toFixed(2)}
        </span>
      </div>

      {status && (
        <p
          className={`mt-4 font-mono text-sm ${
            status.kind === "converged" ? "text-signal" : status.kind === "diverged" ? "text-alarm" : "text-faded"
          }`}
        >
          {status.kind === "converged" && `✓ converged in ${status.steps} steps.`}
          {status.kind === "diverged" && `✗ the ball flew off the landscape after ${status.steps} steps — learning rate was too high.`}
          {status.kind === "stopped" && `stopped after ${status.steps} steps without settling — try a different rate.`}
        </p>
      )}
    </div>
  );
}
