"use client";

import { useState } from "react";
import CodeCell from "../CodeCell";
import StartHere from "../StartHere";
import PredictBlock from "../Predict";

const CLASSES = ["cat", "dog", "car", "cup"];
const TRUE_INDEX = 0;

const PREDICT = {
  question: "which gets punished HARDER: being confidently wrong, or just unsure (uniform)?",
  options: ["confidently wrong", "unsure / uniform", "same either way"],
  answerIndex: 0
};

function softmax(logits) {
  const m = Math.max(...logits);
  const exps = logits.map((v) => Math.exp(v - m));
  const sum = exps.reduce((a, v) => a + v, 0);
  return exps.map((v) => v / sum);
}

const PRESETS = {
  "confident & correct": [5, -2, -2, -2],
  "confident & WRONG": [-5, 5, -2, -2],
  "clueless (uniform)": [0, 0, 0, 0]
};

function LossDemo() {
  const [logits, setLogits] = useState(PRESETS["clueless (uniform)"]);
  const [predicted, setPredicted] = useState(null);
  const [everRan, setEverRan] = useState(false);
  const probs = softmax(logits);
  const loss = -Math.log(Math.max(probs[TRUE_INDEX], 1e-9));

  const lossColor = loss < 0.7 ? "text-signal" : loss > 2.5 ? "text-alarm" : "text-ink";

  function updateLogit(i, val) {
    const next = [...logits];
    next[i] = val;
    setLogits(next);
  }

  function tryPreset(vals) {
    if (predicted === null) return;
    setLogits(vals);
    setEverRan(true);
  }

  return (
    <div className="sheet p-5">
      <p className="margin-note mb-4">correct answer: {CLASSES[TRUE_INDEX]}</p>

      <PredictBlock predict={PREDICT} picked={predicted} onPick={setPredicted} revealed={everRan} />

      <div className="mb-5 flex flex-wrap gap-2">
        {Object.entries(PRESETS).map(([label, vals]) => (
          <button
            key={label}
            onClick={() => tryPreset(vals)}
            disabled={predicted === null}
            className="btn-paper px-3 py-1.5 font-mono text-xs disabled:opacity-50"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {CLASSES.map((cls, i) => (
          <div key={cls}>
            <div className="mb-1 flex items-center justify-between font-mono text-xs">
              <span className={i === TRUE_INDEX ? "font-bold text-inkblue" : "text-faded"}>
                {cls} {i === TRUE_INDEX ? "(correct)" : ""}
              </span>
              <span>{(probs[i] * 100).toFixed(1)}%</span>
            </div>
            <div className="h-4 border-[1.5px] border-ink bg-paper">
              <div
                className="h-full"
                style={{
                  width: `${probs[i] * 100}%`,
                  background: i === TRUE_INDEX ? "#12A150" : "#1A1D21"
                }}
              />
            </div>
            <input
              type="range"
              min={-5}
              max={5}
              step={0.5}
              value={logits[i]}
              onChange={(e) => updateLogit(i, parseFloat(e.target.value))}
              className="mt-1 block w-full"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 border-t-2 border-ink/10 pt-4">
        <p className="font-mono text-sm">
          cross-entropy loss: <span className={`text-2xl font-bold ${lossColor}`}>{loss.toFixed(3)}</span>
        </p>
      </div>
    </div>
  );
}

export default function Ch7Playground() {
  return (
    <div className="flex flex-col gap-8">
      <StartHere>hit a preset button, then drag the sliders and watch the loss number.</StartHere>

      <LossDemo />

      <CodeCell
        what="write the cross-entropy loss formula in python."
        why="this exact formula — negative log of the correct class's probability — is what every model minimizes during training."
        how="use math.log() to compute -log(probs[true_index]), press run."
        prompt="given probs (a list of probabilities) and true_index, compute the loss. stuck? there's a hint button."
        predict={{
          question: "with probs=[0.7, 0.1, 0.1, 0.1] and true_index=0, will the loss be small or large?",
          options: ["small — 0.7 is a fairly confident correct guess", "large — any imperfection gets punished hard", "exactly zero"],
          answerIndex: 0
        }}
        layers={{
          hints: {
            starter:
              "import math\n\nprobs = [0.7, 0.1, 0.1, 0.1]\ntrue_index = 0\n\n# your code here — compute the cross-entropy loss\nloss = None\nprint(loss)",
            hints: [
              "cross-entropy loss = negative log of the probability the model gave to the correct class. grab probs[true_index], then take -math.log(...) of it.",
              "import math\n\nprobs = [0.7, 0.1, 0.1, 0.1]\ntrue_index = 0\n\ncorrect_prob = probs[___]\nloss = -math.___(correct_prob)\nprint(loss)",
              "import math\n\nprobs = [0.7, 0.1, 0.1, 0.1]\ntrue_index = 0\n\ncorrect_prob = probs[true_index]\nloss = -math.log(correct_prob)\nprint(loss)  # -> about 0.357 — small loss, since 0.7 is a fairly confident correct guess"
            ]
          },
          freehand: {
            starter: "import math\n\nprobs = [0.7, 0.1, 0.1, 0.1]\ntrue_index = 0\n\n"
          }
        }}
        check="0.35"
      />
    </div>
  );
}
