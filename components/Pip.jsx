"use client";

import { useEffect, useRef, useState } from "react";
import { hasApiKey } from "../lib/gemini";
import { recordDismiss, recordEngage } from "../lib/pipCooldown";

const EYE_MAX_OFFSET = 2.5;

// pip — the lab companion. lives bottom-right on every chapter page,
// watches the cursor, and is the one entry point into the tutor now.
// stuck-detection lives in the components that can actually see it
// (CodeCell, Checkpoint, ConceptSection) — they dispatch "pip-stuck"
// through lib/pipCooldown so pip only ever has to render what it's told.
export default function Pip() {
  const containerRef = useRef(null);
  const lastMoveRef = useRef(0);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [bubble, setBubble] = useState(null); // { message, question }
  const [hop, setHop] = useState(false);
  const [keyPresent, setKeyPresent] = useState(false);

  useEffect(() => {
    setKeyPresent(hasApiKey());
    const refreshKey = () => setKeyPresent(hasApiKey());
    window.addEventListener("gemini-key-updated", refreshKey);
    return () => window.removeEventListener("gemini-key-updated", refreshKey);
  }, []);

  // cheap throttled eye-follow — one bounding-rect read + one state
  // update per ~60ms of mouse movement, never per-frame.
  useEffect(() => {
    function onMove(e) {
      const now = performance.now();
      if (now - lastMoveRef.current < 60) return;
      lastMoveRef.current = now;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const mag = Math.min(EYE_MAX_OFFSET, dist / 40);
      setPupil({ x: (dx / dist) * mag, y: (dy / dist) * mag });
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    function onStuck(e) {
      setBubble((current) => current || e.detail);
    }
    function onCelebrate() {
      setHop(true);
      setTimeout(() => setHop(false), 1100);
    }
    window.addEventListener("pip-stuck", onStuck);
    window.addEventListener("pip-celebrate", onCelebrate);
    return () => {
      window.removeEventListener("pip-stuck", onStuck);
      window.removeEventListener("pip-celebrate", onCelebrate);
    };
  }, []);

  function openTutor(question) {
    window.dispatchEvent(new CustomEvent("ask-tutor", { detail: question ? { question } : {} }));
  }

  function handleYesExplain() {
    recordEngage();
    openTutor(bubble?.question);
    setBubble(null);
  }

  function handleImGood() {
    recordDismiss();
    setBubble(null);
  }

  return (
    <div className="fixed bottom-3 right-3 z-40 flex flex-col items-end gap-2 sm:bottom-4 sm:right-4">
      {bubble && (
        <div className="sheet w-56 bg-white p-3 sm:w-64">
          <p className="font-mono text-xs leading-relaxed text-ink/90">{bubble.message}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={handleYesExplain} className="btn-ink px-2.5 py-1 font-mono text-[0.65rem]">
              {keyPresent ? "yes, explain" : "yes, explain (needs a key)"}
            </button>
            <button onClick={handleImGood} className="btn-paper px-2.5 py-1 font-mono text-[0.65rem]">
              i'm good
            </button>
          </div>
        </div>
      )}

      <button
        ref={containerRef}
        onClick={() => openTutor()}
        aria-label="pip, the lab companion — open the tutor"
        className={`relative h-14 w-14 shrink-0 sm:h-16 sm:w-16 ${hop ? "pip-hop" : "pip-idle"} ${
          bubble ? "pip-lean" : ""
        }`}
      >
        <svg viewBox="0 0 64 64" className="h-full w-full drop-shadow-[3px_3px_0_rgba(26,29,33,0.25)]">
          <circle cx="21" cy="40" r="6" fill="#FFD644" opacity="0.55" />
          <circle cx="43" cy="40" r="6" fill="#FFD644" opacity="0.55" />
          <path
            d="M12,34 C9,19 21,8 33,9 C48,10 57,19 54,35 C56,49 43,58 31,57 C17,56 9,49 12,34 Z"
            fill="#FAFAF7"
            stroke="#1A1D21"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="29" r="5.5" fill="#fff" stroke="#1A1D21" strokeWidth="1.6" />
          <circle cx="40" cy="29" r="5.5" fill="#fff" stroke="#1A1D21" strokeWidth="1.6" />
          <circle cx={24 + pupil.x} cy={29 + pupil.y} r="2.3" fill="#1A1D21" />
          <circle cx={40 + pupil.x} cy={29 + pupil.y} r="2.3" fill="#1A1D21" />
          {hop ? (
            <path d="M27,40 C29,44 35,44 37,40" stroke="#1A1D21" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M27,41 C29,43 35,43 37,41" stroke="#1A1D21" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          )}
        </svg>
      </button>
    </div>
  );
}
