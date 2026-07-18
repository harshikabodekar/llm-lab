const KEY = "llm-lab-gemini-key";

// google retires gemini models on a rolling basis, sometimes with only a
// few weeks' notice, and closes older families to new API keys even
// before they're fully shut down. if calls start 404ing again, check the
// current generally-available model ids at
// https://ai.google.dev/gemini-api/docs/pricing and update these two.
//
// history: gemini-2.0-flash was shut down 2026-06-01. gemini-2.5-flash-lite
// followed shortly after ("no longer available to new users" 404s) as the
// 2.5 family closed to new keys. current as of july 2026:
const MODEL = "gemini-3.1-flash-lite";
const FALLBACK_MODEL = "gemini-3.5-flash"; // tried once, only if MODEL 404s

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

/* one plain REST call against a specific model — no SDK, so the network
   request itself stays readable. returns { ok, text } on success, or on
   failure: { ok: false, kind, status, googleMessage, message } where
   googleMessage is google's raw wording and message is the full,
   model-aware string ready to show a user. */
async function requestGemini(model, apiKey, prompt, generationConfig) {
  let res;
  try {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
      googleMessage: e.message,
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

    console.error(`[gemini] request failed — HTTP ${res.status} ${googleStatus} (model: ${model})`, parsed || bodyText);

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
        googleMessage,
        message: `your API key looks invalid or unauthorized (HTTP ${res.status}). double-check it was copied correctly from aistudio.google.com and re-save it in settings. google says: "${googleMessage}"`
      };
    }

    if (res.status === 404 || googleStatus === "NOT_FOUND") {
      return {
        ok: false,
        kind: "not-found",
        status: res.status,
        googleMessage,
        message: `the model "${model}" wasn't found (HTTP 404) — it may have been renamed, retired, or closed to new keys since this app was built. google says: "${googleMessage}"`
      };
    }

    if (res.status === 429 || googleStatus === "RESOURCE_EXHAUSTED") {
      return {
        ok: false,
        kind: "rate-limited",
        status: res.status,
        googleMessage,
        message: `rate limited or out of quota (HTTP 429). google says: "${googleMessage}"`
      };
    }

    return {
      ok: false,
      kind: "error",
      status: res.status,
      googleMessage,
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
      googleMessage: blockReason || "empty response",
      message: blockReason ? `blocked by google: ${blockReason}` : "google returned no text in its response."
    };
  }
  return { ok: true, text };
}

export async function callGemini(prompt, { temperature = 0.7, maxOutputTokens } = {}) {
  const apiKey = getApiKey();
  if (!apiKey) return { ok: false, kind: "no-key", message: "no API key set." };

  const generationConfig = { temperature };
  if (maxOutputTokens) generationConfig.maxOutputTokens = maxOutputTokens;

  const primary = await requestGemini(MODEL, apiKey, prompt, generationConfig);
  if (primary.ok || primary.kind !== "not-found") return primary;

  console.warn(`[gemini] "${MODEL}" 404'd — retrying once with fallback "${FALLBACK_MODEL}"`);
  const fallback = await requestGemini(FALLBACK_MODEL, apiKey, prompt, generationConfig);

  if (!fallback.ok && fallback.kind === "not-found") {
    return {
      ...fallback,
      message: `neither "${MODEL}" nor the fallback "${FALLBACK_MODEL}" could be found (both 404) — google's model lineup has likely shifted again. check https://ai.google.dev/gemini-api/docs/pricing for current model ids. google says: "${fallback.googleMessage}"`
    };
  }
  return fallback;
}

// used by the settings modal's "test key" button — one tiny, cheap call
// that reports exactly what came back, success or failure.
export async function testApiKey() {
  return callGemini('Reply with exactly one word: "pong".', { temperature: 0, maxOutputTokens: 10 });
}
