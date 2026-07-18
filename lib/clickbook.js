// "that clicked 💡" moments — a running log of exactly where understanding
// landed. purely local, purely a diary; nothing here gates progress.

const KEY = "llm-lab-clickbook";
const NUDGED_KEY = "llm-lab-clickbook-nudged";

export function getClicks() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function addClick(chapterId, sectionTitle) {
  if (typeof window === "undefined") return;
  const current = getClicks();
  current.push({ chapterId, sectionTitle, timestamp: Date.now() });
  window.localStorage.setItem(KEY, JSON.stringify(current));
  window.dispatchEvent(new Event("clickbook-updated"));
}

export function countForChapter(chapterId) {
  return getClicks().filter((c) => c.chapterId === chapterId).length;
}

export function hasZeroClicks(chapterId) {
  return countForChapter(chapterId) === 0;
}

// the "nothing clicked?" nudge is a one-shot per chapter, forever —
// separate from pip's general cooldown so it never repeats once shown.
export function wasNudged(chapterId) {
  if (typeof window === "undefined") return true;
  try {
    const nudged = JSON.parse(window.localStorage.getItem(NUDGED_KEY) || "[]");
    return nudged.includes(chapterId);
  } catch {
    return true;
  }
}

export function markNudged(chapterId) {
  if (typeof window === "undefined") return;
  const nudged = JSON.parse(window.localStorage.getItem(NUDGED_KEY) || "[]");
  if (!nudged.includes(chapterId)) {
    window.localStorage.setItem(NUDGED_KEY, JSON.stringify([...nudged, chapterId]));
  }
}
