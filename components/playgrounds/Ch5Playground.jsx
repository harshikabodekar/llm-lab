"use client";

import { Fragment, useMemo, useState } from "react";
import StartHere from "../StartHere";

/* real scaled dot-product attention: scores = QK^T / sqrt(d), softmax per row.
   embeddings are hand-placed (like ch3's map) so the pronoun in each sentence
   lands on the word it should — same "real math, chosen inputs" trick. filler
   words get a small deterministic vector so nothing is ever exactly zero. */

const DIM = 4;

function hashVec(word) {
  let h = 0;
  for (let i = 0; i < word.length; i++) h = (h * 31 + word.charCodeAt(i)) % 97;
  const base = (h % 20) / 200 - 0.05; // small, deterministic, in [-0.05, 0.05]
  return [base, base * 0.5, -base * 0.3, base * 0.2];
}

const SENTENCES = [
  {
    text: "the trophy didn't fit in the suitcase because it was too big",
    focus: "it",
    embeddings: {
      trophy: [1.3, 1.0, 0, 0],
      suitcase: [1.2, -1.0, 0, 0],
      it: [1, 0.75, 0, 0.1],
      big: [0.2, 0.9, 0.3, 0]
    }
  },
  {
    text: "the cat chased the mouse because it was hungry",
    focus: "it",
    embeddings: {
      cat: [1.3, 1.0, 0, 0],
      mouse: [1.2, -1.0, 0, 0],
      it: [1, 0.7, 0, 0.1]
    }
  },
  {
    text: "sarah gave the book to maria because she was tired",
    focus: "she",
    embeddings: {
      sarah: [1.3, 1.0, 0, 0],
      maria: [1.2, -1.0, 0, 0],
      she: [1, 0.7, 0, 0.1]
    }
  }
];

function dot(a, b) {
  return a.reduce((s, v, i) => s + v * b[i], 0);
}
function softmax(row) {
  const m = Math.max(...row);
  const exps = row.map((v) => Math.exp(v - m));
  const sum = exps.reduce((a, v) => a + v, 0);
  return exps.map((v) => v / sum);
}

function buildAttention(sentence) {
  const tokens = sentence.text.split(" ");
  const vecs = tokens.map((t) => sentence.embeddings[t] || hashVec(t));
  const scale = Math.sqrt(DIM);
  const scores = vecs.map((qi) => vecs.map((kj) => dot(qi, kj) / scale));
  const weights = scores.map((row) => softmax(row));
  return { tokens, weights };
}

export default function Ch5Playground() {
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [focusRow, setFocusRow] = useState(null);

  const sentence = SENTENCES[sentenceIdx];
  const { tokens, weights } = useMemo(() => buildAttention(sentence), [sentence]);

  const activeRow = focusRow ?? tokens.indexOf(sentence.focus);

  return (
    <div className="sheet p-5">
      <StartHere>click the word 'it' (or 'she') and see who it's really talking about.</StartHere>

      <div className="mb-5 flex flex-wrap gap-2">
        {SENTENCES.map((s, i) => (
          <button
            key={s.text}
            onClick={() => {
              setSentenceIdx(i);
              setFocusRow(null);
            }}
            className={`px-3 py-1.5 font-mono text-xs ${
              sentenceIdx === i ? "btn-ink" : "btn-paper"
            }`}
          >
            sentence {i + 1}
          </button>
        ))}
      </div>

      <p className="mb-4 font-mono text-sm leading-relaxed">
        {tokens.map((t, i) => (
          <span
            key={i}
            onClick={() => setFocusRow(i)}
            className={`mr-1 cursor-pointer border-b-2 px-0.5 ${
              i === activeRow ? "border-inkblue bg-marker/40 font-bold" : "border-transparent hover:border-ink/30"
            }`}
          >
            {t}
          </span>
        ))}
      </p>

      <div className="overflow-x-auto">
        <div
          className="grid gap-[1px] bg-ink/10"
          style={{ gridTemplateColumns: `80px repeat(${tokens.length}, 1fr)`, minWidth: tokens.length * 44 + 80 }}
        >
          <div />
          {tokens.map((t, j) => (
            <div key={j} className="flex items-end justify-center bg-paper pb-1 font-mono text-[0.6rem] text-faded">
              <span style={{ writingMode: "vertical-rl" }}>{t}</span>
            </div>
          ))}
          {weights.map((row, i) => (
            <Fragment key={i}>
              <button
                key={`label-${i}`}
                onClick={() => setFocusRow(i)}
                className={`truncate bg-paper px-2 py-1.5 text-left font-mono text-[0.65rem] ${
                  i === activeRow ? "font-bold text-inkblue" : "text-faded"
                }`}
              >
                {tokens[i]}
              </button>
              {row.map((wgt, j) => (
                <div
                  key={`cell-${i}-${j}`}
                  onClick={() => setFocusRow(i)}
                  title={`${tokens[i]} → ${tokens[j]}: ${(wgt * 100).toFixed(0)}%`}
                  className="flex aspect-square cursor-pointer items-center justify-center bg-paper"
                  style={{
                    background: `rgba(43, 79, 216, ${wgt})`,
                    outline: i === activeRow ? "1.5px solid #1A1D21" : "none",
                    outlineOffset: "-1.5px"
                  }}
                />
              ))}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t-2 border-ink/10 pt-4">
        <p className="margin-note mb-2">
          '{tokens[activeRow]}' is paying attention to:
        </p>
        <div className="flex flex-wrap gap-2">
          {weights[activeRow]
            .map((w, j) => ({ token: tokens[j], w, j }))
            .sort((a, b) => b.w - a.w)
            .slice(0, 5)
            .map(({ token, w, j }) => (
              <span
                key={j}
                className="token-chip"
                style={{ background: `rgba(43, 79, 216, ${Math.max(w, 0.08)})` }}
              >
                {token} {(w * 100).toFixed(0)}%
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
