"use client";

import { useEffect, useState } from "react";
import { getCollected } from "../lib/recapDeck";
import { CHAPTERS } from "../lib/chapters";

export default function RecapDeck() {
  const [collected, setCollected] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    function refresh() {
      setCollected(getCollected());
    }
    refresh();
    window.addEventListener("recap-deck-updated", refresh);
    return () => window.removeEventListener("recap-deck-updated", refresh);
  }, []);

  if (collected.length === 0) return null;

  const cards = collected.map((id) => CHAPTERS.find((c) => c.id === id)).filter(Boolean);

  return (
    <div className="sheet-flat mb-8 bg-white p-4">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between font-mono text-sm"
      >
        <span>
          📚 recap deck — {cards.length} card{cards.length === 1 ? "" : "s"} collected
        </span>
        <span className="text-inkblue">{expanded ? "hide ▲" : "show ▼"}</span>
      </button>
      {expanded && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {cards.map((c) => (
            <div key={c.id} className="sheet bg-marker/30 p-3">
              <p className="mb-1 font-mono text-xs text-inkblue">{c.title}</p>
              <p className="font-mono text-xs leading-relaxed">{c.recap}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
