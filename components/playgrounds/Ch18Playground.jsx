"use client";

import { useState } from "react";
import StartHere from "../StartHere";
import WhatWhyHow from "../WhatWhyHow";

function LoRADiagram() {
  const [d, setD] = useState(1024);
  const [r, setR] = useState(8);

  const fullParams = d * d;
  const loraParams = 2 * d * r;
  const pct = (loraParams / fullParams) * 100;
  const adapterSize = Math.max(6, Math.min(r * 3, 60));

  return (
    <div className="sheet p-5">
      <StartHere>drag the rank slider and watch the real parameter math change below.</StartHere>

      <div className="flex flex-wrap items-center gap-8">
        <div className="text-center">
          <p className="mb-2 font-mono text-xs text-faded">🔒 frozen weight matrix (never updated)</p>
          <div className="grid grid-cols-12 gap-[1px] bg-ink/20 p-[2px]" style={{ width: 148 }}>
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="h-2.5 w-2.5 bg-ink/70" />
            ))}
          </div>
          <p className="mt-2 font-mono text-xs">
            {d} × {d} = {fullParams.toLocaleString("en-US")} params
          </p>
        </div>

        <div className="text-center">
          <p className="mb-2 font-mono text-xs text-inkblue">✓ trainable adapters (A × B)</p>
          <div className="flex items-center justify-center gap-2" style={{ height: 148 }}>
            <div style={{ width: adapterSize, height: 148 }} className="border-[1.5px] border-ink bg-marker" />
            <span className="font-mono text-lg">×</span>
            <div style={{ width: 148, height: adapterSize }} className="border-[1.5px] border-ink bg-marker" />
          </div>
          <p className="mt-2 font-mono text-xs">
            2 × {d} × {r} = {loraParams.toLocaleString("en-US")} params
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block font-mono text-xs text-faded">
            matrix size (d): <strong className="text-ink">{d} × {d}</strong>
          </label>
          <input type="range" min={64} max={4096} step={32} value={d} onChange={(e) => setD(parseInt(e.target.value, 10))} className="mt-1 block w-full" />
        </div>
        <div>
          <label className="block font-mono text-xs text-faded">
            rank (r): <strong className="text-ink">{r}</strong>
          </label>
          <input type="range" min={1} max={64} step={1} value={r} onChange={(e) => setR(parseInt(e.target.value, 10))} className="mt-1 block w-full" />
        </div>
      </div>

      <p className="margin-note mt-4">
        LoRA trains {loraParams.toLocaleString("en-US")} parameters instead of {fullParams.toLocaleString("en-US")} — just{" "}
        {pct.toFixed(2)}% of full finetuning, and the frozen matrix above never moves.
      </p>
    </div>
  );
}

const QUESTIONS = {
  start: {
    q: "does your use case need the model to know NEW FACTS it wasn't trained on (like your company's docs)?",
    yes: "facts",
    no: "behavior"
  },
  behavior: {
    q: "do you need to change the model's STYLE, tone, or behavior (a consistent persona, a specific output format)?",
    yes: "lora",
    no: "prompt"
  }
};
const OUTCOMES = {
  facts: "→ use RAG (ch15). LoRA can't teach a model facts it never saw — it can only reshape HOW it uses what it already knows.",
  lora: "→ use LoRA (or full finetuning with a bigger budget). this is exactly the low-rank behavior change LoRA is built for.",
  prompt: "→ you might not need either yet — try prompting first (ch13). it's free, instant, and often enough."
};

function DecisionTree() {
  const [step, setStep] = useState("start");
  const [outcome, setOutcome] = useState(null);

  function answer(yes) {
    const node = QUESTIONS[step];
    const next = yes ? node.yes : node.no;
    if (OUTCOMES[next]) {
      setOutcome(next);
    } else {
      setStep(next);
    }
  }

  function reset() {
    setStep("start");
    setOutcome(null);
  }

  return (
    <div className="sheet-flat bg-white p-4">
      {!outcome ? (
        <>
          <p className="mb-3 font-mono text-sm">{QUESTIONS[step].q}</p>
          <div className="flex gap-2">
            <button onClick={() => answer(true)} className="btn-ink px-4 py-1.5 font-mono text-xs">
              yes
            </button>
            <button onClick={() => answer(false)} className="btn-paper px-4 py-1.5 font-mono text-xs">
              no
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="font-mono text-sm text-signal">{OUTCOMES[outcome]}</p>
          <button onClick={reset} className="btn-paper mt-3 px-3 py-1.5 font-mono text-xs">
            start over
          </button>
        </>
      )}
    </div>
  );
}

const MODEL_ROWS = [
  ["weights", "download & own them (Llama, Gemma, Mistral)", "never see them (GPT, Claude, Gemini)"],
  ["cost model", "pay once for hosting/compute", "pay per token, forever"],
  ["finetuning", "fully free — LoRA, full finetune, anything", "limited to what the provider's API allows"],
  ["getting started", "need your own GPU or cloud instance", "an API key and you're done in minutes"],
  ["quality ceiling", "improving fast, usually a bit behind frontier", "usually the most capable models available"]
];

function OpenVsClosed() {
  return (
    <div className="mb-8">
      <p className="margin-note mb-3 uppercase tracking-wide">bonus · open vs closed models</p>
      <WhatWhyHow
        what="compare open-weight models (Llama, Gemma, Mistral) against closed API models (GPT, Claude, Gemini)."
        why="this decision shapes cost, control, and what you're even allowed to do with a model — pick wrong and you'll feel it later."
        how="scan the table, then use the decision tree below for YOUR specific case."
      />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b-2 border-ink">
              <th className="p-2 text-left"></th>
              <th className="p-2 text-left text-inkblue">open (Llama, Gemma, Mistral)</th>
              <th className="p-2 text-left text-inkblue">closed (GPT, Claude, Gemini)</th>
            </tr>
          </thead>
          <tbody>
            {MODEL_ROWS.map(([label, open, closed]) => (
              <tr key={label} className="border-b border-ink/10">
                <td className="p-2 font-bold">{label}</td>
                <td className="p-2">{open}</td>
                <td className="p-2">{closed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Ch18Playground() {
  return (
    <div className="flex flex-col gap-8">
      <LoRADiagram />
      <div>
        <p className="margin-note mb-3 uppercase tracking-wide">finetune vs RAG — decide for your case</p>
        <DecisionTree />
      </div>
      <OpenVsClosed />
    </div>
  );
}
