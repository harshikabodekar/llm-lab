const KEY = "llm-lab-gemini-key";

// gemini-2.0-flash was shut down by google on 2026-06-01 — every call
// against it now fails immediately (google's error for a decommissioned
// model can surface as 429 RESOURCE_EXHAUSTED rather than a clean 404,
// which is why it looked like instant rate-limiting instead of a dead
// model name). flash-lite is also the more generous free-tier model for
// a lab full of small, frequent calls: 15 rpm / 1000 rpd vs flash's
// 10 rpm / 250 rpd.
const MODEL = "gemini-2.5-flash-lite";

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
   returns { ok, text } on success, or on failure:
   { ok: false, kind: "no-key" | "invalid-key" | "not-found" | "rate-limited" | "network" | "error",
     status, message } — message always includes google's own wording, not a guess. */
export async function callGemini(prompt, { temperature = 0.7, maxOutputTokens } = {}) {
  const apiKey = getApiKey();
  if (!apiKey) return { ok: false, kind: "no-key", message: "no API key set." };

  const generationConfig = { temperature };
  if (maxOutputTokens) generationConfig.maxOutputTokens = maxOutputTokens;

  let res;
  try {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig })
      }
    );
  } catch (e) {
    console.error("[gemini] network error — request never reached google", e);
    return {
      ok: false,
      kind: "network",
      message: `couldn't reach Gemini at all — check your internet connection. (${e.message})`
    };
  }

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    let parsed = null;
    try {
      parsed = JSON.parse(bodyText);
    } catch {
      // body wasn't JSON — fall through, we'll show the raw text
    }
    const googleMessage = parsed?.error?.message || bodyText.slice(0, 300) || `HTTP ${res.status}`;
    const googleStatus = parsed?.error?.status || "";

    console.error(`[gemini] request failed — HTTP ${res.status} ${googleStatus} (model: ${MODEL})`, parsed || bodyText);

    const looksLikeBadKey =
      res.status === 401 ||
      res.status === 403 ||
      googleStatus === "UNAUTHENTICATED" ||
      googleStatus === "PERMISSION_DENIED" ||
      /api key not valid|api_key_invalid/i.test(googleMessage);

    if (looksLikeBadKey) {
      return {
        ok: false,
        kind: "invalid-key",
        status: res.status,
        message: `your API key looks invalid or unauthorized (HTTP ${res.status}). double-check it was copied correctly from aistudio.google.com and re-save it in settings. google says: "${googleMessage}"`
      };
    }

    if (res.status === 404 || googleStatus === "NOT_FOUND") {
      return {
        ok: false,
        kind: "not-found",
        status: res.status,
        message: `the model "${MODEL}" wasn't found (HTTP 404) — it may have been renamed or retired since this app was built. google says: "${googleMessage}"`
      };
    }

    if (res.status === 429 || googleStatus === "RESOURCE_EXHAUSTED") {
      return {
        ok: false,
        kind: "rate-limited",
        status: res.status,
        message: `rate limited or out of quota (HTTP 429). google says: "${googleMessage}"`
      };
    }

    return {
      ok: false,
      kind: "error",
      status: res.status,
      message: `request failed (HTTP ${res.status}${googleStatus ? " " + googleStatus : ""}). google says: "${googleMessage}"`
    };
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    const blockReason = data?.promptFeedback?.blockReason;
    console.error("[gemini] 200 OK but no text in response", data);
    return {
      ok: false,
      kind: "error",
      message: blockReason ? `blocked by google: ${blockReason}` : "google returned no text in its response."
    };
  }
  return { ok: true, text };
}

// used by the settings modal's "test key" button — one tiny, cheap call
// that reports exactly what came back, success or failure.
export async function testApiKey() {
  return callGemini('Reply with exactly one word: "pong".', { temperature: 0, maxOutputTokens: 10 });
}
