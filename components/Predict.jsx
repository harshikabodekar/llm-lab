"use client";

/* predict-before-run: a small gate that shows a question with 2-3 options
   before the "real" action (run/train/demo) is allowed. after that action
   has happened once, options reveal correct/incorrect like Checkpoint does,
   and a one-line "you predicted X, reality was Y" appears. */

export default function PredictBlock({ predict, picked, onPick, revealed }) {
  if (!predict) return null;
  const answerIndex = typeof predict.answerIndex === "function" ? predict.answerIndex() : predict.answerIndex;

  return (
    <div className="sheet-flat mb-4 bg-white p-3">
      <p className="mb-2 font-mono text-xs text-inkblue">predict first: {predict.question}</p>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {predict.options.map((opt, i) => {
          const isPicked = picked === i;
          const isAnswer = i === answerIndex;
          let cls = picked === null ? "btn-paper" : isPicked ? "btn-ink" : "btn-paper";
          if (revealed) {
            cls = "btn-paper";
            if (isPicked && isAnswer) cls = "border-signal bg-signal/10";
            if (isPicked && !isAnswer) cls = "border-alarm bg-alarm/10";
            if (!isPicked && isAnswer) cls = "border-signal";
          }
          return (
            <button
              key={i}
              onClick={() => picked === null && onPick(i)}
              disabled={picked !== null}
              className={`px-3 py-1.5 text-left font-mono text-xs transition-colors ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && !revealed && (
        <p className="mt-2 font-mono text-xs text-faded">locked in — now run it and see.</p>
      )}
      {revealed && (
        <p className={`mt-2 font-mono text-xs ${picked === answerIndex ? "text-signal" : "text-alarm"}`}>
          you predicted "{predict.options[picked]}" —{" "}
          {picked === answerIndex ? "✓ nailed it." : `reality: "${predict.options[answerIndex]}"`}
        </p>
      )}
    </div>
  );
}
