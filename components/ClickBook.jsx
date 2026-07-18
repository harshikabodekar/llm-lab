"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getClicks } from "../lib/clickbook";
import { CHAPTERS } from "../lib/chapters";

export default function ClickBook() {
  const [clicks, setClicks] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    function refresh() {
      setClicks(getClicks());
    }
    refresh();
    window.addEventListener("clickbook-updated", refresh);
    return () => window.removeEventListener("clickbook-updated", refresh);
  }, []);

  if (clicks.length === 0) return null;

  const entries = [...clicks].reverse(); // newest first

  return (
    <div className="sheet-flat mb-8 bg-white p-4">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between font-mono text-sm"
      >
        <span>
          💡 click book — {entries.length} moment{entries.length === 1 ? "" : "s"} that clicked
        </span>
        <span className="text-inkblue">{expanded ? "hide ▲" : "show ▼"}</span>
      </button>
      {expanded && (
        <div className="mt-4 flex flex-col gap-2">
          <p className="margin-note mb-1">your journey, in lightbulb moments</p>
          {entries.map((c, i) => {
            const chapter = CHAPTERS.find((ch) => ch.id === c.chapterId);
            return (
              <Link
                key={i}
                href={`/chapter/${c.chapterId}`}
                className="sheet-flat flex items-center justify-between gap-3 bg-marker/10 px-3 py-2 hover:-translate-y-0.5 transition-transform"
              >
                <span className="font-mono text-xs">
                  <span className="text-inkblue">{chapter?.title || c.chapterId}</span> — {c.sectionTitle}
                </span>
                <span className="shrink-0 font-mono text-[0.65rem] text-faded">
                  {new Date(c.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
