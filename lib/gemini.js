const KEY = "llm-lab-gemini-key";
const MODEL = "gemini-2.0-flash";

export function getApiKey() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(KEY) || "";
}

export function setApiKey(key) {
  if (typeof window === "undefined") return;
  if (key) window.localStorage.setItem(KEY, key);
  else window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("gemini-key-updated"));
}

export function hasApiKey() {
  return getApiKey().length > 0;
}

/* one plain REST call — no SDK, so the network request itself stays readable.
   returns { ok, text } or { ok: false, kind: "no-key" | "rate-limited" | "error", message }. */
export async function callGemini(prompt, { temperature = 0.7 } = {}) {
  const apiKey = getApiKey();
  if (!apiKey) return { ok: false, kind: "no-key", message: "no API key set." };

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature }
        })
      }
    );

    if (res.status === 429) {
      return { ok: false, kind: "rate-limited", message: "rate limited — Gemini's free tier allows a handful of requests per minute. wait a moment and try again." };
    }
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, kind: "error", message: `request failed (${res.status}). ${body.slice(0, 200)}` };
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      const blockReason = data?.promptFeedback?.blockReason;
      return { ok: false, kind: "error", message: blockReason ? `blocked: ${blockReason}` : "no text in response." };
    }
    return { ok: true, text };
  } catch (e) {
    return { ok: false, kind: "error", message: `network error — ${e.message}` };
  }
}
