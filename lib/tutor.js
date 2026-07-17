import { callGemini } from "./gemini";

/* a lightweight global side-channel: CodeCell reports its own state here
   whenever it runs, so the tutor can see "what code is the student looking
   at right now" without needing React context plumbing through every page. */
let lastCodeCellState = { code: "", output: "", ok: true };

export function reportCodeCellState(code, result) {
  lastCodeCellState = { code, output: result?.output || "", ok: result?.ok !== false };
}

export function getTutorContext(chapter, content) {
  const concept = (content?.concept || []).slice(0, 3).join(" ");
  const codeSnippet = lastCodeCellState.code
    ? `\n\nThe student's current code cell:\n${lastCodeCellState.code}`
    : "";
  const errorSnippet =
    !lastCodeCellState.ok && lastCodeCellState.output
      ? `\n\nTheir last error/output:\n${lastCodeCellState.output}`
      : "";
  return `Chapter: ${chapter?.title} (${chapter?.id})\nConcept so far: ${concept}${codeSnippet}${errorSnippet}`;
}

const SYSTEM_PROMPT = `You are a friendly, patient tutor inside an interactive LLM course called LLM Lab. Guide the student toward understanding using questions and everyday analogies, the way a good TA would in office hours. If they're stuck on code, point at the general area or kind of mistake (e.g. "check your loop's starting index" or "look at the sign in your update step") — but NEVER write the corrected code or give the complete answer. This course already has a dedicated 3-stage hint system for that; your job is different: build intuition, not hand over solutions. If asked to "explain differently", use a genuinely different analogy than whatever the chapter text already uses. Keep answers short — 3-5 sentences, conversational, no headers, no bullet lists, no markdown formatting.`;

export async function askTutor(message, context, history = []) {
  const historyText = history.map((h) => `${h.role === "user" ? "Student" : "Tutor"}: ${h.text}`).join("\n");
  const prompt = `${SYSTEM_PROMPT}\n\nCONTEXT:\n${context}\n\n${historyText ? historyText + "\n" : ""}Student: ${message}\nTutor:`;
  return callGemini(prompt, { temperature: 0.6 });
}
