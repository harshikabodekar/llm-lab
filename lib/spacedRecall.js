import { getCollectedTimestamps } from "./recapDeck";
import { CONTENT } from "./contentRegistry";
import { CHAPTERS } from "./chapters";

const SHOWN_KEY = "llm-lab-recall-last-shown";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function wasShownToday() {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(SHOWN_KEY) === todayStr();
}

export function markShownToday() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SHOWN_KEY, todayStr());
}

// a random checkpoint question from a chapter completed 1+ days ago.
// returns null if nothing qualifies yet.
export function pickRecallQuestion() {
  const timestamps = getCollectedTimestamps();
  const now = Date.now();
  const eligible = Object.entries(timestamps)
    .filter(([, ts]) => now - ts >= ONE_DAY_MS)
    .map(([id]) => id)
    .filter((id) => CONTENT[id]?.checkpoint?.length > 0);

  if (eligible.length === 0) return null;

  const chapterId = eligible[Math.floor(Math.random() * eligible.length)];
  const questions = CONTENT[chapterId].checkpoint;
  const question = questions[Math.floor(Math.random() * questions.length)];
  const chapter = CHAPTERS.find((c) => c.id === chapterId);

  return { chapterId, chapterTitle: chapter?.title || chapterId, question };
}
