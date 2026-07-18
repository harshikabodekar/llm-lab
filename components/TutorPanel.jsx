"use client";

import { useEffect, useState } from "react";
import { hasApiKey } from "../lib/gemini";
import { askTutor, getTutorContext } from "../lib/tutor";

export default function TutorPanel({ chapter, content }) {
  const [open, setOpen] = useState(false);
  const [keyPresent, setKeyPresent] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    setKeyPresent(hasApiKey());
    const refresh = () => setKeyPresent(hasApiKey());
    window.addEventListener("gemini-key-updated", refresh);
    return () => window.removeEventListener("gemini-key-updated", refresh);
  }, []);

  useEffect(() => {
    function handler(e) {
      setOpen(true);
      send(e.detail?.question);
    }
    window.addEventListener("ask-tutor", handler);
    return () => window.removeEventListener("ask-tutor", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, input]);

  async function send(text) {
    const q = (text ?? input).trim();
    if (!q || asking) return;
    setInput("");
    const nextMessages = [...messages, { role: "user", text: q }];
    setMessages(nextMessages);
    setAsking(true);
    const context = getTutorContext(chapter, content);
    const res = await askTutor(q, context, messages);
    setMessages([...nextMessages, { role: "tutor", text: res.ok ? res.text : `(${res.message})` }]);
    setAsking(false);
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-ink/20 p-4" onClick={() => setOpen(false)}>
          <div
            className="sheet flex h-[70vh] w-full max-w-sm flex-col bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="font-display text-lg font-semibold">lab assistant 🎓</p>
              <button onClick={() => setOpen(false)} className="font-mono text-sm text-faded hover:text-ink">
                ✕
              </button>
            </div>

            {!keyPresent ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                <p className="font-mono text-sm font-bold">🔒 needs a free Gemini key</p>
                <p className="font-mono text-xs text-faded">
                  add one via the ⚙ icon, top-right, then come back here.
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto">
                  {messages.length === 0 && (
                    <p className="font-mono text-xs text-faded">
                      ask anything about this chapter — I'll guide you with questions and analogies, not just hand
                      you the answer.
                    </p>
                  )}
                  {messages.map((m, i) => (
                    <p key={i} className={`mb-2 font-mono text-xs ${m.role === "user" ? "text-inkblue" : "text-ink"}`}>
                      <strong>{m.role === "user" ? "you: " : "tutor: "}</strong>
                      {m.text}
                    </p>
                  ))}
                  {asking && <p className="font-mono text-xs text-faded">thinking…</p>}
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                    placeholder="ask a question…"
                    disabled={asking}
                    className="flex-1 border-[1.5px] border-ink bg-paper px-2 py-1.5 font-mono text-xs focus:outline-none disabled:opacity-60"
                  />
                  <button onClick={() => send()} disabled={asking} className="btn-ink px-3 py-1.5 font-mono text-xs disabled:opacity-50">
                    send
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
