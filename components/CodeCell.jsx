"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { runPython } from "../lib/pyodide";
import WhatWhyHow from "./WhatWhyHow";
import PredictBlock from "./Predict";

/* the code cell — every python exercise in the app runs through this.
   4 difficulty layers, pick whichever you supply data for:
   - blank:    fill-in-the-blank. template string, blanks marked "___"
   - parsons:  arrange-the-blocks. give correct-order lines, we shuffle them
   - hints:    freehand + a 3-stage hint button (plain english -> half code -> full answer)
   - freehand: just a textarea

   pass only the layers a chapter needs — the mode switcher hides itself
   when there's nothing to switch. */

const LAYER_META = {
  blank: { label: "fill the blanks" },
  parsons: { label: "arrange the blocks" },
  hints: { label: "write it (hints on)" },
  freehand: { label: "freehand" }
};
const LAYER_ORDER = ["blank", "parsons", "hints", "freehand"];

function shuffledOnce(arr) {
  if (arr.length < 2) return [...arr];
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // guard against an accidental identity shuffle on short lists
  if (a.every((v, i) => v === arr[i])) return shuffledOnce(arr);
  return a;
}

export default function CodeCell({ prompt, layers, defaultLayer, check, what, why, how, onPass, predict }) {
  const [predicted, setPredicted] = useState(null);
  const [everRan, setEverRan] = useState(false);
  const available = useMemo(
    () => LAYER_ORDER.filter((k) => layers?.[k]),
    [layers]
  );
  const [layer, setLayer] = useState(
    defaultLayer && layers?.[defaultLayer] ? defaultLayer : available[0]
  );

  // ---- blank mode ----
  const blankData = layers?.blank;
  const segments = useMemo(
    () => (blankData ? blankData.template.split("___") : []),
    [blankData]
  );
  const blankCount = Math.max(0, segments.length - 1);
  const [blankValues, setBlankValues] = useState(() =>
    Array.from({ length: blankCount }, (_, i) => blankData?.defaults?.[i] ?? "")
  );

  // ---- parsons mode ----
  // starts in original order (must match server render exactly) and shuffles
  // client-side after mount, so SSR/hydration never disagrees on the order
  const parsonsData = layers?.parsons;
  const [order, setOrder] = useState(() => (parsonsData ? [...parsonsData.lines] : []));
  useEffect(() => {
    if (parsonsData) setOrder(shuffledOnce(parsonsData.lines));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dragIndex = useRef(null);

  // ---- hints mode ----
  const [hintCode, setHintCode] = useState(layers?.hints?.starter ?? "");
  const [hintStage, setHintStage] = useState(0);

  // ---- freehand mode ----
  const [freeCode, setFreeCode] = useState(layers?.freehand?.starter ?? "");

  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null); // { ok, output, passed }

  function currentCode() {
    if (layer === "blank") {
      return segments.reduce(
        (acc, seg, i) => acc + seg + (i < blankValues.length ? blankValues[i] || "___" : ""),
        ""
      );
    }
    if (layer === "parsons") return order.join("\n");
    if (layer === "hints") return hintCode;
    return freeCode;
  }

  async function handleRun() {
    if (predict && predicted === null) return;
    setRunning(true);
    setResult(null);
    const res = await runPython(currentCode());
    const passed =
      res.ok && check
        ? typeof check === "function"
          ? check(res.output)
          : res.output.includes(check)
        : null;
    setResult({ ...res, passed });
    setEverRan(true);
    if (passed) onPass?.();
    setRunning(false);
  }

  function handleReset() {
    setResult(null);
    if (layer === "blank") {
      setBlankValues(Array.from({ length: blankCount }, (_, i) => blankData?.defaults?.[i] ?? ""));
    } else if (layer === "parsons") {
      setOrder(shuffledOnce(parsonsData.lines));
    } else if (layer === "hints") {
      setHintCode(layers.hints.starter ?? "");
      setHintStage(0);
    } else if (layer === "freehand") {
      setFreeCode(layers.freehand.starter ?? "");
    }
  }

  function moveLine(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  }

  function switchLayer(k) {
    setLayer(k);
    setResult(null);
  }

  return (
    <div className="sheet p-5">
      {(what || why || how) && <WhatWhyHow what={what} why={why} how={how} />}
      <PredictBlock predict={predict} picked={predicted} onPick={setPredicted} revealed={everRan} />
      {prompt && <p className="margin-note mb-4">{prompt}</p>}

      {available.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {available.map((k) => (
            <button
              key={k}
              onClick={() => switchLayer(k)}
              className={`px-3 py-1.5 font-mono text-xs ${layer === k ? "btn-ink" : "btn-paper"}`}
            >
              {LAYER_META[k].label}
            </button>
          ))}
        </div>
      )}

      {layer === "blank" && (
        <div className="whitespace-pre-wrap border-[1.5px] border-ink bg-paper p-3 font-mono text-sm leading-relaxed">
          {segments.map((seg, i) => (
            <span key={i}>
              {seg}
              {i < blankValues.length && (
                <input
                  value={blankValues[i]}
                  onChange={(e) => {
                    const v = [...blankValues];
                    v[i] = e.target.value;
                    setBlankValues(v);
                  }}
                  spellCheck={false}
                  placeholder="___"
                  style={{ width: `${Math.max(3, (blankValues[i] || "").length + 2)}ch` }}
                  className="mx-0.5 border-b-2 border-inkblue bg-marker/20 px-1 font-mono text-sm focus:outline-none"
                />
              )}
            </span>
          ))}
        </div>
      )}

      {layer === "parsons" && (
        <div className="flex flex-col gap-1.5">
          {order.map((line, i) => (
            <div
              key={line + i}
              draggable
              onDragStart={() => (dragIndex.current = i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex.current === null || dragIndex.current === i) return;
                const next = [...order];
                const [moved] = next.splice(dragIndex.current, 1);
                next.splice(i, 0, moved);
                setOrder(next);
                dragIndex.current = null;
              }}
              className="sheet-flat flex cursor-grab items-center gap-2 bg-white px-3 py-2 font-mono text-sm active:cursor-grabbing"
            >
              <span className="select-none text-faded">⠿</span>
              <span className="flex-1 whitespace-pre">{line}</span>
              <div className="flex flex-col gap-0.5">
                <button
                  aria-label="move line up"
                  onClick={() => moveLine(i, -1)}
                  className="px-1 text-[0.65rem] leading-none text-faded hover:text-ink"
                >
                  ▲
                </button>
                <button
                  aria-label="move line down"
                  onClick={() => moveLine(i, 1)}
                  className="px-1 text-[0.65rem] leading-none text-faded hover:text-ink"
                >
                  ▼
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {layer === "hints" && (
        <div>
          <textarea
            value={hintCode}
            onChange={(e) => setHintCode(e.target.value)}
            rows={6}
            spellCheck={false}
            className="w-full border-[1.5px] border-ink bg-paper p-3 font-mono text-sm focus:outline-none"
          />
          {hintStage < 3 && (
            <button
              onClick={() => setHintStage(hintStage + 1)}
              className="btn-paper mt-3 px-3 py-1.5 font-mono text-xs"
            >
              {hintStage === 0
                ? "need a hint?"
                : hintStage === 1
                ? "still stuck? show more"
                : "just show me the answer"}
            </button>
          )}
          {hintStage >= 1 && (
            <p className="margin-note mt-3">hint 1 — {layers.hints.hints[0]}</p>
          )}
          {hintStage >= 2 && (
            <pre className="mt-2 whitespace-pre-wrap border-[1.5px] border-ink/30 bg-paper p-3 font-mono text-xs">
              {layers.hints.hints[1]}
            </pre>
          )}
          {hintStage >= 3 && (
            <div className="mt-2 border-[1.5px] border-inkblue/40 bg-inkblue/5 p-3">
              <p className="font-mono text-xs text-inkblue">the full answer, explained:</p>
              <pre className="mt-1 whitespace-pre-wrap font-mono text-xs">{layers.hints.hints[2]}</pre>
            </div>
          )}
        </div>
      )}

      {layer === "freehand" && (
        <textarea
          value={freeCode}
          onChange={(e) => setFreeCode(e.target.value)}
          rows={6}
          spellCheck={false}
          className="w-full border-[1.5px] border-ink bg-paper p-3 font-mono text-sm focus:outline-none"
        />
      )}

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={handleRun}
          disabled={running || (predict && predicted === null)}
          className="btn-ink px-4 py-2 font-mono text-xs disabled:opacity-50"
        >
          {running ? "running…" : "▶ run"}
        </button>
        <button onClick={handleReset} className="btn-paper px-4 py-2 font-mono text-xs">
          reset
        </button>
      </div>

      {result && (
        <div
          className={`mt-4 whitespace-pre-wrap border-[1.5px] p-3 font-mono text-xs ${
            result.ok ? "border-signal bg-signal/10" : "border-alarm bg-alarm/10"
          }`}
        >
          <p className={`mb-1 font-medium ${result.ok ? "text-signal" : "text-alarm"}`}>
            {result.ok ? "✓ output" : "✗ error"}
          </p>
          <span className="text-ink/90">{result.output}</span>
          {result.passed === true && <p className="mt-2 text-signal">✓ that's exactly it.</p>}
        </div>
      )}
    </div>
  );
}
