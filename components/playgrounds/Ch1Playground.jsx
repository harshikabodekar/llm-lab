"use client";

import { useMemo, useState } from "react";
import StartHere from "../StartHere";

/* a real (mini) tokenizer, not a fake demo.
   - char mode: every character = one token
   - word mode: split on spaces/punctuation
   - subword mode: greedy longest-match against a mini vocabulary,
     which is genuinely how BPE-style tokenizers behave at inference:
     common chunks survive, rare words get shredded. */

const SUBWORD_VOCAB = [
  // common english words survive whole
  "the","and","ing","tion","is","are","was","you","hai","bro","kya",
  "what","how","why","can","not","have","this","that","with","for",
  "hello","world","time","day","night","love","code","model","token",
  "straw","berry","str","aw","er","ed","ly","un","re","in","on","at",
  "an","a","i","to","of","it","my","me","we","he","she","chat","gpt",
  "claude","train","learn","neural","net","work","play","ground","scene"
];
// sort by length desc for greedy longest match
const VOCAB = [...SUBWORD_VOCAB].sort((a, b) => b.length - a.length);

function subwordTokenize(text) {
  const tokens = [];
  const words = text.split(/(\s+)/);
  for (const w of words) {
    if (!w) continue;
    if (/^\s+$/.test(w)) continue; // spaces become part of next token display
    let rest = w.toLowerCase();
    while (rest.length > 0) {
      let matched = null;
      for (const v of VOCAB) {
        if (rest.startsWith(v)) { matched = v; break; }
      }
      if (!matched) { matched = rest[0]; } // unknown char = its own token
      tokens.push(matched);
      rest = rest.slice(matched.length);
    }
  }
  return tokens;
}

function tokenize(text, mode) {
  if (!text) return [];
  if (mode === "char") return text.split("");
  if (mode === "word") return text.split(/\s+/).filter(Boolean);
  return subwordTokenize(text);
}

// stable fake token IDs (hash) so the same chunk always gets the same number,
// which is exactly how real vocabularies behave
function tokenId(t) {
  let h = 0;
  for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) % 50257;
  return h;
}

const CHIP_COLORS = ["#FFD644", "#BFD7FF", "#C9F2D0", "#FFD9C9", "#EAD9FF"];

export default function Ch1Playground() {
  const [text, setText] = useState("the strawberry model is learning");
  const [mode, setMode] = useState("subword");
  const tokens = useMemo(() => tokenize(text, mode), [text, mode]);

  return (
    <div className="sheet p-5">
      <StartHere>type your name below and switch between the three modes.</StartHere>

      <label className="font-mono text-xs text-faded">
        type anything — english, hinglish, emojis, go wild
      </label>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="mt-2 w-full border-[1.5px] border-ink bg-paper px-3 py-2 font-mono text-sm focus:outline-none"
        placeholder="type here..."
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          ["char", "characters"],
          ["word", "words"],
          ["subword", "subwords (what GPT does)"]
        ].map(([m, label]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 font-mono text-xs ${
              mode === m ? "btn-ink" : "btn-paper"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {tokens.map((t, i) => (
          <span
            key={i + t}
            className="token-chip"
            style={{ background: CHIP_COLORS[i % CHIP_COLORS.length] }}
            title={`token id: ${tokenId(t)}`}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t-2 border-ink/10 pt-4 font-mono text-xs">
        <span>
          token count: <strong>{tokens.length}</strong>
        </span>
        <span className="text-faded">hover a chip to see its ID number →</span>
      </div>

      <p className="margin-note mt-4">
        what the model actually receives: [
        {tokens.slice(0, 8).map((t) => tokenId(t)).join(", ")}
        {tokens.length > 8 ? ", …" : ""}] — just numbers. no letters. ever.
      </p>
    </div>
  );
}
