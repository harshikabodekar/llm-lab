"use client";

import { useState } from "react";
import StartHere from "../StartHere";
import PredictBlock from "../Predict";
import WhatWhyHow from "../WhatWhyHow";

const TANK_CAPACITY = 40;
const SEED = "my favorite color is teal, and my dog's name is Biscuit.";
const FILLERS = [
  "by the way, traffic was awful this morning.",
  "did you catch the game last night? wild finish.",
  "I'm thinking about repainting the kitchen this weekend.",
  "the new coffee place downtown is actually really good.",
  "my phone battery has been draining so fast lately.",
  "we should plan that trip we keep talking about."
];

function countTokens(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function activeWindow(messages) {
  let total = messages.reduce((s, m) => s + m.tokens, 0);
  const active = [...messages];
  const evicted = [];
  while (total > TANK_CAPACITY && active.length > 0) {
    const dropped = active.shift();
    evicted.push(dropped);
    total -= dropped.tokens;
  }
  return { active, evicted, total };
}

export default function Ch14Playground() {
  const [messages, setMessages] = useState(() => [{ text: SEED, tokens: countTokens(SEED) }]);
  const [fillerIdx, setFillerIdx] = useState(0);
  const [custom, setCustom] = useState("");
  const [predicted, setPredicted] = useState(null);
  const [asked, setAsked] = useState(false);

  const { active, evicted, total } = activeWindow(messages);
  const seedEvicted = evicted.some((m) => m.text === SEED);

  function addFiller() {
    const text = FILLERS[fillerIdx % FILLERS.length];
    setFillerIdx((i) => i + 1);
    setMessages((m) => [...m, { text, tokens: countTokens(text) }]);
    setAsked(false);
  }

  function addCustom() {
    if (!custom.trim()) return;
    setMessages((m) => [...m, { text: custom.trim(), tokens: countTokens(custom.trim()) }]);
    setCustom("");
    setAsked(false);
  }

  function reset() {
    setMessages([{ text: SEED, tokens: countTokens(SEED) }]);
    setAsked(false);
    setPredicted(null);
  }

  function ask() {
    if (predicted === null) return;
    setAsked(true);
  }

  return (
    <div className="sheet p-5">
      <StartHere>add filler messages until the tank overflows, then ask about the very first message.</StartHere>

      <p className="margin-note mb-3">
        tank capacity: {TANK_CAPACITY} tokens (word count, as a stand-in for real subword tokens from ch2)
      </p>

      <div className="border-[1.5px] border-ink bg-paper p-2" style={{ minHeight: 160 }}>
        <div className="flex flex-col-reverse gap-1">
          {active.map((m, i) => (
            <div key={i} className="border-[1.5px] border-ink bg-white px-2 py-1 font-mono text-xs">
              {m.text} <span className="text-faded">({m.tokens}t)</span>
            </div>
          ))}
        </div>
      </div>
      <p className={`mt-1 font-mono text-xs ${total > TANK_CAPACITY * 0.85 ? "text-alarm" : "text-faded"}`}>
        {total} / {TANK_CAPACITY} tokens used
      </p>

      {evicted.length > 0 && (
        <div className="mt-3">
          <p className="margin-note mb-1">pushed out (no longer visible to the model)</p>
          <div className="flex flex-col gap-1">
            {evicted.map((m, i) => (
              <div key={i} className="border-[1.5px] border-alarm/40 bg-alarm/5 px-2 py-1 font-mono text-xs text-ink/40 line-through">
                {m.text}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button onClick={addFiller} className="btn-paper px-3 py-1.5 font-mono text-xs">
          + add filler message
        </button>
        <button onClick={reset} className="btn-paper px-3 py-1.5 font-mono text-xs">
          reset tank
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="or type your own message…"
          className="min-w-[200px] flex-1 border-[1.5px] border-ink bg-paper px-3 py-1.5 font-mono text-xs focus:outline-none"
        />
        <button onClick={addCustom} className="btn-paper px-3 py-1.5 font-mono text-xs">
          send
        </button>
      </div>

      <div className="mt-5 border-t-2 border-ink/10 pt-4">
        <PredictBlock
          predict={{
            question: "if you ask about my dog's name RIGHT NOW, will the model still know it?",
            options: ["yes, it's still in context", "no, it got pushed out"],
            answerIndex: () => (seedEvicted ? 1 : 0)
          }}
          picked={predicted}
          onPick={setPredicted}
          revealed={asked}
        />
        <button onClick={ask} disabled={predicted === null} className="btn-ink mt-2 px-4 py-2 font-mono text-xs disabled:opacity-50">
          ▶ ask: "what's my dog's name?"
        </button>
        {asked && (
          <p className={`mt-3 font-mono text-sm ${seedEvicted ? "text-alarm" : "text-signal"}`}>
            {seedEvicted
              ? "✗ the seed message is gone — the model has no way to know. it would guess, or say it doesn't know."
              : "✓ the seed message is still in the active window — the model can answer: Biscuit."}
          </p>
        )}
      </div>

      <KVCacheDemo />
    </div>
  );
}

function KVCacheDemo() {
  const [n, setN] = useState(50);
  const withoutCache = n * n;
  const withCache = n;
  const ratio = Math.round(withoutCache / withCache);

  return (
    <div className="mt-8 border-t-2 border-ink/10 pt-5">
      <p className="margin-note mb-3 uppercase tracking-wide">bonus · the KV cache</p>
      <WhatWhyHow
        what="drag a conversation-length slider and watch the compute cost with vs without caching."
        why="this quadratic-vs-linear gap is the literal reason long chats get slower and pricier."
        how="drag the slider, watch both numbers, read the multiplier at the bottom."
      />
      <label className="block font-mono text-xs text-faded">
        conversation length: <strong className="text-ink">{n} tokens</strong>
      </label>
      <input
        type="range"
        min={10}
        max={500}
        step={5}
        value={n}
        onChange={(e) => setN(parseInt(e.target.value, 10))}
        className="mt-1 block w-full"
      />
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sheet-flat bg-white p-3">
          <p className="mb-1 font-mono text-xs text-alarm">without KV cache</p>
          <p className="font-mono text-sm">≈ {withoutCache.toLocaleString("en-US")} compute units / new token</p>
          <p className="mt-1 font-mono text-[0.65rem] text-faded">re-attends over every past token, every step</p>
        </div>
        <div className="sheet-flat bg-white p-3">
          <p className="mb-1 font-mono text-xs text-signal">with KV cache</p>
          <p className="font-mono text-sm">≈ {withCache.toLocaleString("en-US")} compute units / new token</p>
          <p className="mt-1 font-mono text-[0.65rem] text-faded">reuses cached keys/values, only computes the new token</p>
        </div>
      </div>
      <p className="margin-note mt-3">
        at {n} tokens of conversation, caching saves roughly {ratio}× the compute per new token — but the cache itself
        still holds all {n} tokens in memory, which is why cost never fully flattens out.
      </p>
    </div>
  );
}
