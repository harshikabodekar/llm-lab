"use client";

import { useEffect, useState } from "react";
import { getCollected } from "../lib/recapDeck";
import { CHAPTERS } from "../lib/chapters";

export default function PartProgress({ partId, total }) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    function refresh() {
      const collected = getCollected();
      const idsInPart = new Set(CHAPTERS.filter((c) => c.part === partId).map((c) => c.id));
      setDone(collected.filter((id) => idsInPart.has(id)).length);
    }
    refresh();
    window.addEventListener("recap-deck-updated", refresh);
    return () => window.removeEventListener("recap-deck-updated", refresh);
  }, [partId]);

  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  if (total === 0) return null;

  return (
    <div className="ml-2 flex items-center gap-2">
      <div className="h-2 w-24 border-[1.5px] border-ink bg-paper">
        <div className="h-full bg-marker" style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-xs text-faded">
        {done}/{total}
      </span>
    </div>
  );
}
