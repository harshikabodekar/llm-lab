"use client";

import { useState } from "react";
import StartHere from "../StartHere";

const STATEMENTS = [
  {
    text: "Accuracy on internal eval set: 98.7%, based on 12 hand-picked examples written by the feature's own engineer.",
    flag: true,
    why: "tiny sample, and written by the same person who built the feature — not independent, not representative."
  },
  {
    text: "Eval set was sampled from the same conversation logs used during finetuning.",
    flag: true,
    why: "train/eval contamination — the model may have already seen these exact examples, so the score proves memorization, not generalization."
  },
  {
    text: "Average response latency: 340ms, well within the 500ms target.",
    flag: false,
    why: "a legitimate, unrelated performance metric — no issue here."
  },
  {
    text: "Zero test cases covering adversarial inputs or prompt injection attempts.",
    flag: true,
    why: "a known, well-documented risk category (ch19) that's completely untested before ship."
  },
  {
    text: "User satisfaction rating: 4.8/5 across 3,200 responses in the beta.",
    flag: false,
    why: "a reasonably large, real signal — not a red flag on its own."
  },
  {
    text: "Model card and version number are documented in the internal wiki.",
    flag: false,
    why: "good practice, unrelated to whether the eval itself is trustworthy."
  }
];

export default function Boss4Playground() {
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  function toggle(i) {
    if (submitted) return;
    setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
  }

  const correctCount = submitted ? STATEMENTS.filter((s, i) => s.flag === selected.includes(i)).length : null;

  return (
    <div className="sheet p-5">
      <StartHere>flag whichever statements you think are red flags, then submit.</StartHere>

      <p className="margin-note mb-4">CustomerBot v2 — Ship Readiness Report</p>

      <div className="flex flex-col gap-2">
        {STATEMENTS.map((s, i) => {
          const isSelected = selected.includes(i);
          let cls = isSelected ? "border-marker bg-marker/20 border-[1.5px]" : "sheet-flat bg-white";
          if (submitted) {
            if (s.flag && isSelected) cls = "border-signal bg-signal/10 border-[1.5px]";
            else if (s.flag && !isSelected) cls = "border-alarm bg-alarm/10 border-[1.5px]";
            else if (!s.flag && isSelected) cls = "border-alarm bg-alarm/10 border-[1.5px]";
            else cls = "sheet-flat bg-white";
          }
          return (
            <button key={i} onClick={() => toggle(i)} disabled={submitted} className={`p-3 text-left transition-colors ${cls}`}>
              <p className="font-mono text-xs">
                {isSelected && !submitted && "🚩 "}
                {s.text}
              </p>
              {submitted && (
                <p className={`mt-1 font-mono text-[0.65rem] ${s.flag ? "text-signal" : "text-faded"}`}>
                  {s.flag ? "✓ this was a real red flag — " : "not a flag — "} {s.why}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button onClick={() => setSubmitted(true)} disabled={selected.length === 0} className="btn-ink mt-4 px-4 py-2 font-mono text-xs disabled:opacity-50">
          ▶ submit
        </button>
      ) : (
        <p className={`mt-4 font-mono text-sm ${correctCount === STATEMENTS.length ? "text-signal" : "text-alarm"}`}>
          {correctCount} / {STATEMENTS.length} correct calls — {correctCount === STATEMENTS.length ? "you caught all 3 flags and correctly cleared the rest." : "review the highlighted rows above."}
        </p>
      )}
    </div>
  );
}
