// generic checkbox-progress persistence, used by the capstone (ch22) and
// the pytorch bridge roadmap (ch23). one localStorage key per list id.

export function getChecked(listId) {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(`llm-lab-progress-${listId}`) || "[]");
  } catch {
    return [];
  }
}

export function toggleChecked(listId, itemId) {
  if (typeof window === "undefined") return [];
  const current = getChecked(listId);
  const next = current.includes(itemId) ? current.filter((i) => i !== itemId) : [...current, itemId];
  window.localStorage.setItem(`llm-lab-progress-${listId}`, JSON.stringify(next));
  return next;
}
