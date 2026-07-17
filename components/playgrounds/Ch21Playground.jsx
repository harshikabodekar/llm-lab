"use client";

import { useState } from "react";
import StartHere from "../StartHere";
import WhatWhyHow from "../WhatWhyHow";

function formatBytes(bytes) {
  if (bytes < 1e6) return `${(bytes / 1e3).toFixed(0)} KB`;
  if (bytes < 1e9) return `${(bytes / 1e6).toFixed(1)} MB`;
  if (bytes < 1e12) return `${(bytes / 1e9).toFixed(1)} GB`;
  return `${(bytes / 1e12).toFixed(1)} TB`;
}

function formatCount(n) {
  if (n < 1e6) return `${(n / 1e3).toFixed(0)}K`;
  if (n < 1e9) return `${(n / 1e6).toFixed(0)}M`;
  if (n < 1e12) return `${(n / 1e9).toFixed(0)}B`;
  return `${(n / 1e12).toFixed(1)}T`;
}

const ABILITY_THRESHOLDS = [
  [1e4, "basic grammar patterns"],
  [1e6, "coherent short sentences"],
  [1e8, "simple question answering"],
  [1e9, "few-shot learning, basic reasoning"],
  [1e10, "multi-step reasoning, following complex instructions"],
  [1e11, "nuanced reasoning, tool use, coding"],
  [5e11, "strong multi-domain expertise, multimodal understanding"]
];

function ScalingSlider() {
  const [logParams, setLogParams] = useState(9);
  const params = Math.pow(10, logParams);
  const dataTokens = params * 20; // Chinchilla-optimal-ish ratio, illustrative
  const memoryBytes = params * 2; // fp16

  const abilities = ABILITY_THRESHOLDS.filter(([t]) => params >= t).map(([, a]) => a);

  return (
    <div className="sheet p-5">
      <StartHere>drag the slider from 10K to 1T parameters and watch the numbers change.</StartHere>

      <label className="block font-mono text-xs text-faded">
        parameters: <strong className="text-ink">{formatCount(params)}</strong>
      </label>
      <input
        type="range"
        min={4}
        max={12}
        step={0.1}
        value={logParams}
        onChange={(e) => setLogParams(parseFloat(e.target.value))}
        className="mt-1 block w-full"
      />

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sheet-flat bg-white p-3">
          <p className="mb-1 font-mono text-xs text-inkblue">training data (illustrative)</p>
          <p className="font-mono text-sm font-bold">{formatCount(dataTokens)} tokens</p>
          <p className="mt-1 font-mono text-[0.65rem] text-faded">~20 tokens per parameter (Chinchilla-style ratio)</p>
        </div>
        <div className="sheet-flat bg-white p-3">
          <p className="mb-1 font-mono text-xs text-inkblue">memory footprint (fp16)</p>
          <p className="font-mono text-sm font-bold">{formatBytes(memoryBytes)}</p>
          <p className="mt-1 font-mono text-[0.65rem] text-faded">2 bytes × parameter count</p>
        </div>
        <div className="sheet-flat bg-white p-3">
          <p className="mb-1 font-mono text-xs text-inkblue">abilities at this scale</p>
          <p className="font-mono text-[0.7rem] leading-relaxed">{abilities[abilities.length - 1] || "barely coherent output"}</p>
        </div>
      </div>

      <div className="mt-3">
        <p className="margin-note mb-2">everything unlocked so far:</p>
        <div className="flex flex-wrap gap-2">
          {abilities.map((a) => (
            <span key={a} className="token-chip" style={{ background: "#BFD7FF" }}>
              {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const EXAMPLE_PARAMS = 7e9;
const PRECISIONS = [
  { name: "fp32", bytesPerParam: 4 },
  { name: "fp16", bytesPerParam: 2 },
  { name: "int8", bytesPerParam: 1 },
  { name: "int4", bytesPerParam: 0.5 }
];

function QuantizationDemo() {
  return (
    <div className="mb-8">
      <p className="margin-note mb-3 uppercase tracking-wide">bonus · quantization</p>
      <WhatWhyHow
        what="see the same 7B-parameter model's memory footprint at 4 different precisions."
        why="this is the literal reason a model can run on your laptop instead of needing a data center — fewer bits per number, not fewer numbers."
        how="compare the 4 cards — a typical laptop has 8-16GB of RAM."
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        {PRECISIONS.map((p) => {
          const bytes = EXAMPLE_PARAMS * p.bytesPerParam;
          const fitsLaptop = bytes < 8e9;
          return (
            <div key={p.name} className={`sheet-flat bg-white p-3 text-center ${fitsLaptop ? "border-signal" : "border-alarm"}`}>
              <p className="mb-1 font-mono text-xs font-bold">{p.name}</p>
              <p className="font-mono text-sm">{formatBytes(bytes)}</p>
              <p className={`mt-1 font-mono text-[0.6rem] ${fitsLaptop ? "text-signal" : "text-alarm"}`}>
                {fitsLaptop ? "fits a laptop" : "needs a server"}
              </p>
            </div>
          );
        })}
      </div>
      <p className="margin-note mt-3">
        same 7-billion-parameter model, every time — only the number of bits per parameter changes.
      </p>
    </div>
  );
}

function MultimodalDemo() {
  return (
    <div>
      <p className="margin-note mb-3 uppercase tracking-wide">bonus · multimodality in one minute</p>
      <WhatWhyHow
        what="see how an image gets chopped into patches that become tokens, just like words."
        why="this patch-embedding trick is most of how 'multimodal' models see images at all."
        how="look at the grid — each colored patch becomes one token, fed into the same transformer as text."
      />
      <div className="flex flex-wrap items-center gap-4">
        <div className="grid grid-cols-4 gap-[2px] border-[1.5px] border-ink p-[2px]" style={{ width: 120 }}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-6"
              style={{ background: ["#FFD644", "#BFD7FF", "#C9F2D0", "#FFD9C9", "#EAD9FF"][i % 5] }}
            />
          ))}
        </div>
        <span className="font-mono text-lg">→</span>
        <div className="flex flex-wrap gap-1" style={{ maxWidth: 220 }}>
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="token-chip" style={{ background: ["#FFD644", "#BFD7FF", "#C9F2D0", "#FFD9C9", "#EAD9FF"][i % 5] }}>
              img{i}
            </span>
          ))}
        </div>
      </div>
      <p className="margin-note mt-3">16 patches → 16 tokens, mixed right in with your text tokens in the same sequence.</p>
    </div>
  );
}

export default function Ch21Playground() {
  return (
    <div className="flex flex-col gap-8">
      <ScalingSlider />
      <QuantizationDemo />
      <MultimodalDemo />
    </div>
  );
}
