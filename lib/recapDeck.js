const KEY = "llm-lab-recap-deck";

export function getCollected() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function addCollected(chapterId) {
  if (typeof window === "undefined") return;
  const current = getCollected();
  if (current.includes(chapterId)) return;
  window.localStorage.setItem(KEY, JSON.stringify([...current, chapterId]));
  window.dispatchEvent(new Event("recap-deck-updated"));
}
