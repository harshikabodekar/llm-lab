"use client";

import { useState } from "react";

export default function Checkpoint({ questions }) {
  return (
    <div className="space-y-5">
      {questions.map((q, i) => (
        <Question key={i} q={q} n={i + 1} />
      ))}
    </div>
  );
}

function Question({ q, n }) {
  const [picked, setPicked] = useState(null);
  const answered = picked !== null;

  return (
    <div className="sheet-flat bg-white p-5">
      <p className="font-medium">
        <span className="font-mono text-inkblue">{n}.</span> {q.q}
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.answer;
          const isPicked = picked === i;
          let cls = "btn-paper";
          if (answered && isPicked && isCorrect) cls = "border-signal bg-signal/10";
          if (answered && isPicked && !isCorrect) cls = "border-alarm bg-alarm/10";
          if (answered && !isPicked && isCorrect) cls = "border-signal";
          return (
            <button
              key={i}
              onClick={() => setPicked(i)}
              className={`border-[1.5px] px-4 py-2 text-left text-sm transition-colors ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <p
          className={`mt-3 font-mono text-sm ${
            picked === q.answer ? "text-signal" : "text-alarm"
          }`}
        >
          {picked === q.answer ? "✓ yes. " : "✗ not quite. "}
          <span className="text-ink/80">{q.why}</span>
        </p>
      )}
    </div>
  );
}
