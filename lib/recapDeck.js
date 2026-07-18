const KEY = "llm-lab-recap-deck";
const TS_KEY = "llm-lab-recap-deck-ts";

export function getCollected() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

// chapterId -> completion timestamp (ms). additive to getCollected() so
// existing callers (RecapDeck, PartProgress) don't need to change.
export function getCollectedTimestamps() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(TS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function addCollected(chapterId) {
  if (typeof window === "undefined") return;
  const current = getCollected();
  if (current.includes(chapterId)) return;
  window.localStorage.setItem(KEY, JSON.stringify([...current, chapterId]));
  const timestamps = getCollectedTimestamps();
  timestamps[chapterId] = Date.now();
  window.localStorage.setItem(TS_KEY, JSON.stringify(timestamps));
  window.dispatchEvent(new Event("recap-deck-updated"));
}
