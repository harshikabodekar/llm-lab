// pip's pacing: never naggy. every dismissal doubles how long pip waits
// before speaking again, capped at 30 minutes. state lives in localStorage
// so the cooldown survives navigation between chapters.

const KEY = "llm-lab-pip-cooldown";
const BASELINE_MS = 60_000;
const MAX_MS = 30 * 60_000;
const ENGAGE_QUIET_MS = 90_000;

function readState() {
  if (typeof window === "undefined") return { nextAllowedAt: 0, baseline: BASELINE_MS };
  try {
    return JSON.parse(window.localStorage.getItem(KEY)) || { nextAllowedAt: 0, baseline: BASELINE_MS };
  } catch {
    return { nextAllowedAt: 0, baseline: BASELINE_MS };
  }
}

function writeState(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function canSpeak() {
  return Date.now() >= readState().nextAllowedAt;
}

export function recordDismiss() {
  const state = readState();
  const baseline = Math.min(state.baseline * 2, MAX_MS);
  writeState({ baseline, nextAllowedAt: Date.now() + baseline });
}

export function recordEngage() {
  const state = readState();
  writeState({ ...state, nextAllowedAt: Date.now() + ENGAGE_QUIET_MS });
}

// dispatches "pip-stuck" only if pip is allowed to speak right now.
// returns whether it actually fired, so one-shot nudges can decide
// whether to mark themselves as "shown" or try again later.
export function firePipStuck(detail) {
  if (!canSpeak()) return false;
  window.dispatchEvent(new CustomEvent("pip-stuck", { detail }));
  return true;
}

export function firePipCelebrate() {
  window.dispatchEvent(new Event("pip-celebrate"));
}
