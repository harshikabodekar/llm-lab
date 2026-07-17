"use client";

import { useState } from "react";
import CodeCell from "../CodeCell";
import StartHere from "../StartHere";

function computeCurve(flipSign, lr, steps = 6) {
  let x = 5;
  const losses = [x * x];
  for (let i = 0; i < steps; i++) {
    const grad = 2 * x;
    x = flipSign ? x + lr * grad : x - lr * grad;
    losses.push(x * x);
  }
  return losses;
}

const CURVE_A = computeCurve(true, 0.1); // wrong sign
const CURVE_B = computeCurve(false, 1.5); // lr too high

function MiniChart({ losses, color }) {
  const w = 300;
  const h = 100;
  const pad = 8;
  const max = Math.max(...losses) || 1;
  const points = losses
    .map((v, i) => {
      const px = pad + (i / (losses.length - 1)) * (w - pad * 2);
      const py = h - pad - (v / max) * (h - pad * 2);
      return `${px.toFixed(1)},${py.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full border-[1.5px] border-ink bg-paper">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

function Diagnosis({ options, answerIndex, why }) {
  const [picked, setPicked] = useState(null);
  return (
    <div className="mt-3">
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => {
          const isPicked = picked === i;
          const isAnswer = i === answerIndex;
          let cls = "btn-paper";
          if (picked !== null && isPicked && isAnswer) cls = "border-signal bg-signal/10";
          if (picked !== null && isPicked && !isAnswer) cls = "border-alarm bg-alarm/10";
          if (picked !== null && !isPicked && isAnswer) cls = "border-signal";
          return (
            <button
              key={i}
              onClick={() => picked === null && setPicked(i)}
              disabled={picked !== null}
              className={`border-[1.5px] px-3 py-2 text-left font-mono text-xs transition-colors ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <p className={`mt-2 font-mono text-xs ${picked === answerIndex ? "text-signal" : "text-alarm"}`}>
          {picked === answerIndex ? "✓ " : "✗ "} {why}
        </p>
      )}
    </div>
  );
}

export default function Boss2Playground() {
  return (
    <div className="flex flex-col gap-8">
      <StartHere>look at each curve's shape and diagnose the bug before touching any code.</StartHere>

      <div>
        <p className="margin-note mb-3 uppercase tracking-wide">run A</p>
        <div className="sheet-flat bg-white p-4">
          <MiniChart losses={CURVE_A} color="#D64545" />
          <Diagnosis
            options={[
              "the gradient sign is flipped — it's ascending, not descending",
              "the learning rate is too high — steps are overshooting",
              "there's no bug, this is normal training"
            ]}
            answerIndex={0}
            why="loss climbs steadily every step — that's the signature of adding the gradient instead of subtracting it."
          />
        </div>
        <div className="mt-4">
          <CodeCell
            what="fix the flipped gradient sign so the loss actually decreases."
            why="this exact bug — a plus where a minus should be — silently turns training into un-training. it's one character."
            how="run it first, see the loss climb, then flip the sign in the update line."
            prompt="the loss should DECREASE each step. run it, find the sign bug, fix it."
            predict={{
              question: "once you fix the sign, will x move toward 0 or away from it?",
              options: ["toward 0", "away from 0"],
              answerIndex: 0
            }}
            layers={{
              hints: {
                starter:
                  'def loss_fn(x):\n    return x ** 2\n\ndef grad_fn(x):\n    return 2 * x\n\nx = 5.0\nlr = 0.1\nfor step in range(5):\n    grad = grad_fn(x)\n    x = x + lr * grad\n    print(f"step {step}: x={x:.2f}, loss={loss_fn(x):.2f}")',
                hints: [
                  "run it first — loss should go DOWN, not up. gradient descent means you SUBTRACT the gradient, not add it.",
                  "x = x ___ lr * grad",
                  'def loss_fn(x):\n    return x ** 2\n\ndef grad_fn(x):\n    return 2 * x\n\nx = 5.0\nlr = 0.1\nfor step in range(5):\n    grad = grad_fn(x)\n    x = x - lr * grad\n    print(f"step {step}: x={x:.2f}, loss={loss_fn(x):.2f}")  # -> converges toward x=0'
                ]
              }
            }}
            check="step 4: x=1.64"
          />
        </div>
      </div>

      <div>
        <p className="margin-note mb-3 uppercase tracking-wide">run B</p>
        <div className="sheet-flat bg-white p-4">
          <MiniChart losses={CURVE_B} color="#D64545" />
          <Diagnosis
            options={[
              "the gradient sign is flipped",
              "the learning rate is too high — steps are overshooting the minimum",
              "there's no bug, this is normal training"
            ]}
            answerIndex={1}
            why="loss bounces wildly and grows — that's overshoot, not a sign error. the sign is right, the step is just way too big."
          />
        </div>
        <div className="mt-4">
          <CodeCell
            what="fix the learning rate so training actually converges."
            why="this exact failure mode — loss exploding instead of shrinking — is the #1 symptom of a learning rate set too high."
            how="run it first, watch loss explode, then lower lr to something stable (try 0.1)."
            prompt="the loss should shrink toward 0, not explode. run it, then fix the learning rate."
            predict={{
              question: "will lowering the learning rate make training more stable or less?",
              options: ["more stable", "less stable"],
              answerIndex: 0
            }}
            layers={{
              hints: {
                starter:
                  'def loss_fn(x):\n    return x ** 2\n\ndef grad_fn(x):\n    return 2 * x\n\nx = 5.0\nlr = 1.5\nfor step in range(5):\n    grad = grad_fn(x)\n    x = x - lr * grad\n    print(f"step {step}: x={x:.2f}, loss={loss_fn(x):.2f}")',
                hints: [
                  "run it first — loss should shrink, not explode. the update direction is correct here, only the step size is the problem. try a much smaller lr, like 0.1.",
                  "lr = ___  # try something under 1.0",
                  'def loss_fn(x):\n    return x ** 2\n\ndef grad_fn(x):\n    return 2 * x\n\nx = 5.0\nlr = 0.1\nfor step in range(5):\n    grad = grad_fn(x)\n    x = x - lr * grad\n    print(f"step {step}: x={x:.2f}, loss={loss_fn(x):.2f}")  # -> shrinks toward 0'
                ]
              }
            }}
            check={(output) => {
              const matches = [...output.matchAll(/loss=([\d.]+)/g)];
              if (matches.length < 5) return false;
              return parseFloat(matches[matches.length - 1][1]) < 5;
            }}
          />
        </div>
      </div>
    </div>
  );
}
