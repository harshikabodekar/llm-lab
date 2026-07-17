"use client";

import { useEffect, useState } from "react";
import { getApiKey, setApiKey } from "../lib/gemini";

export default function SettingsModal() {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setKey(getApiKey());
  }, [open]);

  useEffect(() => {
    const openIt = () => setOpen(true);
    window.addEventListener("open-settings", openIt);
    return () => window.removeEventListener("open-settings", openIt);
  }, []);

  function save() {
    setApiKey(key.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function clear() {
    setApiKey("");
    setKey("");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="settings"
        className="fixed right-4 top-4 z-40 border-[1.5px] border-ink bg-paper px-2.5 py-2 font-mono text-sm shadow-[3px_3px_0_0_rgba(26,29,33,0.25)] hover:-translate-y-0.5 transition-transform"
      >
        ⚙
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end bg-ink/20 p-4 pt-16"
          onClick={() => setOpen(false)}
        >
          <div className="sheet w-full max-w-sm bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-lg font-semibold">settings</p>
              <button onClick={() => setOpen(false)} className="font-mono text-sm text-faded hover:text-ink">
                ✕
              </button>
            </div>

            <label className="block font-mono text-xs text-faded">gemini api key</label>
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              type="password"
              placeholder="paste your key here"
              spellCheck={false}
              className="mt-1 w-full border-[1.5px] border-ink bg-paper px-3 py-2 font-mono text-sm focus:outline-none"
            />

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button onClick={save} className="btn-ink px-3 py-1.5 font-mono text-xs">
                save
              </button>
              <button onClick={clear} className="btn-paper px-3 py-1.5 font-mono text-xs">
                clear
              </button>
              {saved && <span className="font-mono text-xs text-signal">✓ saved</span>}
            </div>

            <p className="margin-note mt-4">
              free key in 30 seconds: open{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-inkblue underline"
              >
                aistudio.google.com/apikey
              </a>
              , click "create api key", paste it above. it's stored only in your browser — never sent anywhere but
              google's API.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
