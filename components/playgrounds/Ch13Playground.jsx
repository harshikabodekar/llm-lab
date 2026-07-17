"use client";

import { useEffect, useState } from "react";
import { callGemini, hasApiKey } from "../../lib/gemini";
import StartHere from "../StartHere";
import PredictBlock from "../Predict";

const STYLE_META = {
  bare: { label: "bare", desc: "just the question, nothing else" },
  system: { label: "system-prompted", desc: "rules set before the question" },
  fewshot: { label: "few-shot", desc: "2 example answers shown first" },
  structured: { label: "structured output", desc: "demands strict JSON back" }
};

function buildPrompts(question) {
  return {
    bare: question,
    system: `You are a concise, expert teacher. Answer in at most 2 sentences, no fluff.\n\nQuestion: ${question}`,
    fewshot: `Q: What's the best way to stay healthy?\nA: - Sleep 7-8 hours\n- Move daily, even a short walk\n- Eat mostly whole foods\n\nQ: What's the best way to save money?\nA: - Track every expense for a month\n- Automate savings before you can spend it\n- Cut one recurring subscription\n\nQ: ${question}\nA:`,
    structured: `Answer the question and respond with STRICT JSON only, no markdown, no code fences, matching exactly this shape: {"answer": "your answer here", "confidence": "high" | "medium" | "low"}\n\nQuestion: ${question}`
  };
}

const PREDICT = {
  question: "which style will give the most consistently code-parseable answer?",
  options: ["structured output", "bare", "few-shot"],
  answerIndex: 0
};

function ResultCard({ style, prompt, result, running }) {
  return (
    <div className="sheet-flat bg-white p-3">
      <p className="mb-1 font-mono text-xs font-bold text-inkblue">{STYLE_META[style].label}</p>
      <p className="mb-2 font-mono text-[0.65rem] text-faded">{STYLE_META[style].desc}</p>
      <details className="mb-2">
        <summary className="cursor-pointer font-mono text-[0.65rem] text-faded">show prompt sent</summary>
        <pre className="mt-1 whitespace-pre-wrap border-[1.5px] border-ink/20 bg-paper p-2 font-mono text-[0.65rem]">{prompt}</pre>
      </details>
      {running && !result && <p className="font-mono text-xs text-faded">running…</p>}
      {result && result.ok && (
        <p className="whitespace-pre-wrap border-[1.5px] border-signal bg-signal/10 p-2 font-mono text-xs">{result.text}</p>
      )}
      {result && !result.ok && (
        <p className="whitespace-pre-wrap border-[1.5px] border-alarm bg-alarm/10 p-2 font-mono text-xs text-alarm">
          {result.message}
        </p>
      )}
    </div>
  );
}

export default function Ch13Playground() {
  const [keyPresent, setKeyPresent] = useState(false);
  const [question, setQuestion] = useState("what's the best way to learn to code?");
  const [results, setResults] = useState({});
  const [running, setRunning] = useState(false);
  const [predicted, setPredicted] = useState(null);
  const [everRan, setEverRan] = useState(false);

  useEffect(() => {
    setKeyPresent(hasApiKey());
    const refresh = () => setKeyPresent(hasApiKey());
    window.addEventListener("gemini-key-updated", refresh);
    return () => window.removeEventListener("gemini-key-updated", refresh);
  }, []);

  const prompts = buildPrompts(question);

  async function runAll() {
    if (!keyPresent || predicted === null || running) return;
    setRunning(true);
    setResults({});
    await Promise.all(
      Object.entries(prompts).map(async ([style, prompt]) => {
        const res = await callGemini(prompt);
        setResults((r) => ({ ...r, [style]: res }));
      })
    );
    setEverRan(true);
    setRunning(false);
  }

  if (!keyPresent) {
    return (
      <div className="sheet p-5">
        <StartHere>add a free gemini key via the ⚙ icon, top-right — takes about 30 seconds.</StartHere>
        <div className="sheet-flat bg-white p-5">
          <p className="mb-3 font-mono text-sm font-bold">🔒 this playground needs a free Gemini API key.</p>
          <ol className="ml-4 list-decimal space-y-1 font-mono text-xs text-ink/80">
            <li>
              open{" "}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-inkblue underline">
                aistudio.google.com/apikey
              </a>
            </li>
            <li>sign in, click "create api key" — it's free, no card needed</li>
            <li>copy the key</li>
            <li>click the ⚙ icon top-right of this page, paste it in, hit save</li>
          </ol>
          <button
            onClick={() => window.dispatchEvent(new Event("open-settings"))}
            className="btn-ink mt-4 px-4 py-2 font-mono text-xs"
          >
            open settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sheet p-5">
      <StartHere>type a question, predict, then run all 4 prompt styles and compare.</StartHere>

      <label className="block font-mono text-xs text-faded">your question</label>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        disabled={running}
        className="mt-1 w-full border-[1.5px] border-ink bg-paper px-3 py-2 font-mono text-sm focus:outline-none disabled:opacity-60"
      />

      <div className="mt-4">
        <PredictBlock predict={PREDICT} picked={predicted} onPick={setPredicted} revealed={everRan} />
      </div>

      <button
        onClick={runAll}
        disabled={running || predicted === null}
        className="btn-ink mt-2 px-4 py-2 font-mono text-xs disabled:opacity-50"
      >
        {running ? "running all 4…" : "▶ run all 4 styles"}
      </button>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Object.keys(STYLE_META).map((style) => (
          <ResultCard key={style} style={style} prompt={prompts[style]} result={results[style]} running={running} />
        ))}
      </div>
    </div>
  );
}
