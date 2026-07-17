"use client";

import { useEffect, useState } from "react";

export default function Checkpoint({ questions, onComplete }) {
  const [answeredCount, setAnsweredCount] = useState(0);

  useEffect(() => {
    if (questions.length > 0 && answeredCount >= questions.length) onComplete?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answeredCount]);

  return (
    <div className="space-y-5">
      {questions.map((q, i) => (
        <Question key={i} q={q} n={i + 1} onFirstAnswer={() => setAnsweredCount((c) => c + 1)} />
      ))}
    </div>
  );
}

function Question({ q, n, onFirstAnswer }) {
  const [picked, setPicked] = useState(null);
  const answered = picked !== null;

  function pick(i) {
    if (picked === null) onFirstAnswer();
    setPicked(i);
  }

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
              onClick={() => pick(i)}
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
