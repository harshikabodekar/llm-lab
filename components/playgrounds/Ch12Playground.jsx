"use client";

import { useEffect, useRef, useState } from "react";
import { softmax } from "../../engine/tinynn";
import CodeCell from "../CodeCell";
import StartHere from "../StartHere";
import PredictBlock from "../Predict";
import WhatWhyHow from "../WhatWhyHow";

/* real softmax (engine/tinynn) over hand-placed logits — same trick used
   everywhere else: real math, chosen numbers, so the demo tells a clean story. */

const STEPS = [
  {
    prompt: "the weather today is",
    words: ["sunny", "nice", "warm", "perfect", "cold", "raining", "terrible", "unpredictable"],
    logits: [3.0, 2.5, 2.0, 1.5, 1.0, 0.5, -0.5, -1.0]
  },
  {
    prompt: "and I feel",
    words: ["great", "happy", "fine", "energetic", "sleepy", "hopeful", "exhausted", "annoyed"],
    logits: [2.8, 2.4, 1.8, 1.3, 0.6, 0.4, -0.6, -1.2]
  },
  {
    prompt: "so I think I'll",
    words: ["go out", "take a walk", "relax", "work", "read", "cook", "nap", "stay in"],
    logits: [2.6, 2.2, 1.7, 1.0, 0.7, 0.3, -0.4, -1.0]
  }
];

function argmax(arr) {
  return arr.reduce((best, v, i) => (v > arr[best] ? i : best), 0);
}
function weightedSample(probs) {
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < probs.length; i++) {
    acc += probs[i];
    if (r <= acc) return i;
  }
  return probs.length - 1;
}

function SamplingDemo() {
  const [temperature, setTemperature] = useState(1.0);
  const [stepIndex, setStepIndex] = useState(0);
  const [sampledChain, setSampledChain] = useState([]);
  const [greedyChain, setGreedyChain] = useState([]);
  const [predicted, setPredicted] = useState(null);
  const [everSampled, setEverSampled] = useState(false);
  const [lastMatched, setLastMatched] = useState(null);

  const step = STEPS[stepIndex];
  const probs = softmax(step.logits, temperature);
  const greedyIdx = argmax(step.logits);

  function sample() {
    if (predicted === null) return;
    const idx = weightedSample(probs);
    setSampledChain((c) => [...c, step.words[idx]]);
    setGreedyChain((c) => [...c, step.words[greedyIdx]]);
    setLastMatched(idx === greedyIdx);
    setEverSampled(true);
    setStepIndex((s) => (s + 1) % STEPS.length);
  }

  function resetChain() {
    setSampledChain([]);
    setGreedyChain([]);
    setStepIndex(0);
    setEverSampled(false);
    setLastMatched(null);
  }

  return (
    <div className="sheet p-5">
      <StartHere>drag temperature, predict, then hit sample a few times and watch the sentence build.</StartHere>

      <p className="margin-note mb-3">next word after: "{[...sampledChain].join(" ") || step.prompt}"</p>

      <div className="space-y-2">
        {step.words.map((w, i) => (
          <div key={w} className="flex items-center gap-2">
            <span className={`w-24 shrink-0 truncate font-mono text-xs ${i === greedyIdx ? "font-bold text-inkblue" : "text-faded"}`}>
              {w}
            </span>
            <div className="h-4 flex-1 border-[1.5px] border-ink bg-paper">
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${probs[i] * 100}%`, background: i === greedyIdx ? "#2B4FD8" : "#1A1D21" }}
              />
            </div>
            <span className="w-12 shrink-0 text-right font-mono text-xs text-faded">{(probs[i] * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <label className="block font-mono text-xs text-faded">
          temperature: <strong className="text-ink">{temperature.toFixed(2)}</strong>
        </label>
        <input
          type="range"
          min={0.1}
          max={2.0}
          step={0.05}
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="mt-1 block w-full"
        />
      </div>

      <div className="mt-4">
        <PredictBlock
          predict={{
            question: "at THIS temperature, will the sampled word probably match the greedy (safe) pick?",
            options: ["yes, probably match", "no, probably diverge"],
            answerIndex: () => (temperature <= 0.5 ? 0 : 1)
          }}
          picked={predicted}
          onPick={setPredicted}
          revealed={everSampled}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={sample}
          disabled={predicted === null}
          className="btn-ink px-4 py-2 font-mono text-xs disabled:opacity-50"
        >
          ▶ sample
        </button>
        <button onClick={resetChain} className="btn-paper px-4 py-2 font-mono text-xs">
          reset chain
        </button>
        {everSampled && (
          <span className={`font-mono text-xs ${lastMatched ? "text-signal" : "text-alarm"}`}>
            {lastMatched ? "✓ matched the greedy pick" : "✗ diverged from the greedy pick"}
          </span>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sheet-flat bg-white p-3">
          <p className="mb-1 font-mono text-xs text-inkblue">sampled (temperature {temperature.toFixed(2)})</p>
          <p className="font-mono text-sm">the weather today is {sampledChain.join(" ") || "…"}</p>
        </div>
        <div className="sheet-flat bg-white p-3">
          <p className="mb-1 font-mono text-xs text-inkblue">greedy (always safe)</p>
          <p className="font-mono text-sm">the weather today is {greedyChain.join(" ") || "…"}</p>
        </div>
      </div>
    </div>
  );
}

function StreamingDemo() {
  const RESPONSE = "training is just predict, measure loss, backprop, nudge weights, repeat";
  const words = RESPONSE.split(" ");
  const [mode, setMode] = useState("streaming");
  const [revealed, setRevealed] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  function generate() {
    setRevealed(0);
    setRunning(true);
    if (mode === "streaming") {
      let i = 0;
      intervalRef.current = setInterval(() => {
        i += 1;
        setRevealed(i);
        if (i >= words.length) {
          clearInterval(intervalRef.current);
          setRunning(false);
        }
      }, 220);
    } else {
      setTimeout(() => {
        setRevealed(words.length);
        setRunning(false);
      }, words.length * 220);
    }
  }

  return (
    <div className="mb-8">
      <p className="margin-note mb-3 uppercase tracking-wide">bonus · streaming</p>
      <WhatWhyHow
        what="watch the same response arrive two ways — streamed token-by-token, or dumped all at once."
        why="the model generates one token at a time either way — streaming just decides WHEN you get to see each one."
        how="pick a mode, hit generate, and time how long it feels before you see anything."
      />
      <div className="mb-3 flex flex-wrap gap-2">
        <button onClick={() => setMode("streaming")} className={`px-3 py-1.5 font-mono text-xs ${mode === "streaming" ? "btn-ink" : "btn-paper"}`}>
          streaming
        </button>
        <button onClick={() => setMode("batch")} className={`px-3 py-1.5 font-mono text-xs ${mode === "batch" ? "btn-ink" : "btn-paper"}`}>
          wait for the whole thing
        </button>
        <button onClick={generate} disabled={running} className="btn-ink px-3 py-1.5 font-mono text-xs disabled:opacity-50">
          {running ? "generating…" : "▶ generate"}
        </button>
      </div>
      <div className="sheet-flat min-h-[3rem] bg-white p-3 font-mono text-sm">
        {words.slice(0, revealed).join(" ")}
        {running && mode === "streaming" && <span className="animate-pulse">▌</span>}
      </div>
    </div>
  );
}

export default function Ch12Playground() {
  return (
    <div className="flex flex-col gap-8">
      <SamplingDemo />

      <StreamingDemo />

      <CodeCell
        what="implement temperature scaling in numpy: logits / temperature, then softmax."
        why="this exact 2-line trick — divide, then softmax — is the real implementation behind the slider you just played with."
        how="scale logits by temperature first, then apply the standard softmax formula."
        prompt="given logits and temperature, compute probs. round probs[0] to 2 decimals when printing. stuck? there's a hint button."
        predict={{
          question: "at temperature=0.5, will the top candidate's probability be higher or lower than at temperature=1.0?",
          options: ["higher — low temperature sharpens the peak", "lower — low temperature flattens it out"],
          answerIndex: 0
        }}
        layers={{
          hints: {
            starter:
              "import numpy as np\n\nlogits = np.array([3.0, 2.5, 2.0, 1.0, 1.5, 0.5, -0.5, -1.0])\ntemperature = 0.5\n\n# your code here — scale logits by temperature, then softmax\nprobs = None\nprint(round(float(probs[0]), 2))",
            hints: [
              "divide logits by temperature FIRST, then run the standard softmax: subtract the max (for stability), exponentiate, normalize by the sum.",
              "import numpy as np\n\nlogits = np.array([3.0, 2.5, 2.0, 1.0, 1.5, 0.5, -0.5, -1.0])\ntemperature = 0.5\n\nscaled = logits / ___\nexps = np.exp(scaled - np.___(scaled))\nprobs = exps / np.___(exps)\nprint(round(float(probs[0]), 2))",
              "import numpy as np\n\nlogits = np.array([3.0, 2.5, 2.0, 1.0, 1.5, 0.5, -0.5, -1.0])\ntemperature = 0.5\n\nscaled = logits / temperature\nexps = np.exp(scaled - np.max(scaled))\nprobs = exps / np.sum(exps)\nprint(round(float(probs[0]), 2))  # -> 0.63 — low temperature sharpens the winner's lead"
            ]
          }
        }}
        check="0.63"
      />
    </div>
  );
}
