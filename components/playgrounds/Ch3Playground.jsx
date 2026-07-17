"use client";

import { useRef, useState } from "react";
import StartHere from "../StartHere";
import PredictBlock from "../Predict";

const PREDICT = {
  question: "which word do you think will be closest to king − man + woman?",
  options: ["queen", "apple", "dog"],
  answerIndex: 0
};

function computeDemo(points) {
  const k = points.king, m = points.man, w = points.woman;
  const rx = k.x - m.x + w.x;
  const ry = k.y - m.y + w.y;
  let nearest = null;
  let best = Infinity;
  for (const word in points) {
    if (word === "king" || word === "man" || word === "woman") continue;
    const d = Math.hypot(points[word].x - rx, points[word].y - ry);
    if (d < best) { best = d; nearest = word; }
  }
  return { x: rx, y: ry, nearest, dist: best };
}

/* a hand-placed 2D embedding space — no real model, but real vector math.
   coordinates are picked so king - man + woman lands exactly on queen,
   same as it would in a trained 300-dim space. drag points around and
   that arithmetic starts missing — that's the whole lesson. */

const INITIAL_POINTS = {
  king: { x: 22, y: 16, group: "royalty" },
  queen: { x: 40, y: 24, group: "royalty" },
  prince: { x: 14, y: 24, group: "royalty" },
  princess: { x: 20, y: 31, group: "royalty" },
  man: { x: 18, y: 70, group: "person" },
  woman: { x: 36, y: 78, group: "person" },
  dog: { x: 75, y: 22, group: "animal" },
  wolf: { x: 68, y: 14, group: "animal" },
  cat: { x: 82, y: 30, group: "animal" },
  apple: { x: 66, y: 74, group: "fruit" },
  orange: { x: 79, y: 82, group: "fruit" },
  banana: { x: 72, y: 90, group: "fruit" }
};

const GROUP_COLOR = {
  royalty: "#FFD644",
  person: "#BFD7FF",
  animal: "#C9F2D0",
  fruit: "#FFD9C9"
};

function clonePoints() {
  const out = {};
  for (const k in INITIAL_POINTS) out[k] = { ...INITIAL_POINTS[k] };
  return out;
}

export default function Ch3Playground() {
  const [points, setPoints] = useState(clonePoints);
  const [demo, setDemo] = useState(null);
  const [predicted, setPredicted] = useState(null);
  const [everRan, setEverRan] = useState(false);
  const containerRef = useRef(null);
  const draggingRef = useRef(null);

  function onPointerDown(word, e) {
    draggingRef.current = word;
    e.target.setPointerCapture(e.pointerId);
  }

  function onPointerMove(word, e) {
    if (draggingRef.current !== word || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;
    x = Math.min(97, Math.max(3, x));
    y = Math.min(97, Math.max(3, y));
    const next = { ...points, [word]: { ...points[word], x, y } };
    setPoints(next);
    // once the demo's been run, keep it live while dragging — that's the
    // whole point of letting people drag 'king' and watch the distance move
    setDemo((d) => (d ? computeDemo(next) : d));
  }

  function onPointerUp(word) {
    if (draggingRef.current === word) draggingRef.current = null;
  }

  function runDemo() {
    if (predicted === null) return;
    setDemo(computeDemo(points));
    setEverRan(true);
  }

  function resetLayout() {
    setPoints(clonePoints());
    setDemo(null);
  }

  return (
    <div className="sheet p-5">
      <StartHere>drag 'king' around and watch the queen distance change.</StartHere>

      <label className="font-mono text-xs text-faded">
        drag any point — notice how the clusters mean something. king is near queen, not near banana.
      </label>

      <PredictBlock predict={PREDICT} picked={predicted} onPick={setPredicted} revealed={everRan} />

      <div
        ref={containerRef}
        className="relative mt-3 aspect-square w-full max-w-md select-none border-[1.5px] border-ink bg-paper"
      >
        {Object.entries(points).map(([word, p]) => {
          const isDemoInput = demo && ["king", "man", "woman"].includes(word);
          const isNearest = demo && demo.nearest === word;
          return (
            <div
              key={word}
              onPointerDown={(e) => onPointerDown(word, e)}
              onPointerMove={(e) => onPointerMove(word, e)}
              onPointerUp={() => onPointerUp(word)}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                background: GROUP_COLOR[p.group],
                boxShadow: isNearest ? "0 0 0 3px var(--inkblue)" : "none"
              }}
              className="token-chip absolute -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none active:cursor-grabbing"
            >
              {word}
              {isDemoInput && <span className="ml-1 text-inkblue">•</span>}
            </div>
          );
        })}

        {demo && (
          <div
            style={{
              left: `${Math.min(100, Math.max(0, demo.x))}%`,
              top: `${Math.min(100, Math.max(0, demo.y))}%`
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 border-[1.5px] border-dashed border-inkblue bg-white px-1.5 py-0.5 font-mono text-xs font-bold text-inkblue"
            title="king − man + woman"
          >
            ?
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={runDemo}
          disabled={predicted === null}
          className="btn-ink px-4 py-2 font-mono text-xs disabled:opacity-50"
        >
          ▶ king − man + woman = ?
        </button>
        <button onClick={resetLayout} className="btn-paper px-4 py-2 font-mono text-xs">
          reset layout
        </button>
      </div>

      {demo && (
        <p className="margin-note mt-4">
          closest point to the result: <strong>{demo.nearest}</strong> (distance{" "}
          {demo.dist.toFixed(1)}).{" "}
          {demo.nearest === "queen"
            ? "the math found queen — nobody told it about royalty."
            : "not queen this time — you moved something. that's the point: wreck the positions, wreck the meaning."}
        </p>
      )}

      <p className="mt-4 border-t-2 border-ink/10 pt-3 font-mono text-xs text-faded">
        {Object.entries(points)
          .map(([w, p]) => `${w}(${p.x.toFixed(0)},${p.y.toFixed(0)})`)
          .join("  ")}
      </p>
    </div>
  );
}
