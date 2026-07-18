"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { wasShownToday, markShownToday, pickRecallQuestion } from "../lib/spacedRecall";

export default function RecallCard() {
  const [recall, setRecall] = useState(null); // { chapterId, chapterTitle, question }
  const [dismissed, setDismissed] = useState(false);
  const [picked, setPicked] = useState(null);

  useEffect(() => {
    if (wasShownToday()) return;
    const r = pickRecallQuestion();
    if (!r) return;
    setRecall(r);
    markShownToday();
  }, []);

  if (!recall || dismissed) return null;

  const { question } = recall;
  const answered = picked !== null;

  return (
    <div className="sheet mb-8 bg-inkblue/5 p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="margin-note">🧠 spaced recall — remember this one?</p>
        <button onClick={() => setDismissed(true)} className="font-mono text-xs text-faded hover:text-ink">
          ✕
        </button>
      </div>

      {!answered ? (
        <>
          <p className="font-medium">
            from <Link href={`/chapter/${recall.chapterId}`} className="text-inkblue hover:underline">{recall.chapterTitle}</Link>: {question.q}
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setPicked(i)}
                className="btn-paper border-[1.5px] px-4 py-2 text-left text-sm"
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div>
          <p className={`font-mono text-sm ${picked === question.answer ? "text-signal" : "text-alarm"}`}>
            {picked === question.answer ? "✓ yes. " : "✗ not quite. "}
            <span className="text-ink/80">{question.why}</span>
          </p>
          <p className="mt-3 font-mono text-xs text-faded">thanks for the recall — see you tomorrow.</p>
        </div>
      )}
    </div>
  );
}
