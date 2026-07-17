/* 3 real local tools an agent loop can call. calculator is sandboxed by a
   strict whitelist regex before ever touching Function() — only digits,
   operators, parens and whitespace can reach it, so it can't run arbitrary JS. */

export function safeCalculate(expression) {
  if (!/^[\d+\-*/().\s]+$/.test(expression)) {
    return { error: "invalid characters in expression — only numbers and + - * / ( ) allowed" };
  }
  try {
    const result = Function(`"use strict"; return (${expression});`)();
    if (typeof result !== "number" || !Number.isFinite(result)) {
      return { error: "that didn't evaluate to a valid number" };
    }
    return { result };
  } catch {
    return { error: "couldn't evaluate that expression" };
  }
}

export const FACTS = [
  { topic: "rag", fact: "RAG stands for Retrieval-Augmented Generation — retrieve relevant text, then generate an answer grounded in it." },
  { topic: "attention", fact: "Attention lets every token weigh how relevant every other token is, before generating the next word." },
  { topic: "token", fact: "A token is a chunk of text — sometimes a whole word, sometimes a few letters — that a model reads as one unit." },
  { topic: "gradient descent", fact: "Gradient descent nudges weights a little in the downhill direction of the loss, repeated thousands of times." },
  { topic: "embedding", fact: "An embedding is a token turned into a point in space — similar meaning, nearby points." },
  { topic: "lora", fact: "LoRA freezes the original model and trains small add-on matrices instead — much cheaper than full finetuning." }
];

export function searchFacts(query) {
  const q = (query || "").toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const f of FACTS) {
    const score = q.includes(f.topic) ? f.topic.length : 0;
    if (score > bestScore) {
      bestScore = score;
      best = f;
    }
  }
  return best ? best.fact : "no matching fact found in the local knowledge base.";
}

export function makeNotepad() {
  const notes = [];
  return {
    write: (text) => {
      notes.push(text);
      return "saved.";
    },
    read: () => (notes.length ? notes.join(" | ") : "(empty)")
  };
}

export const TOOLS_DESCRIPTION = `You have access to 3 tools:
1. calculator(expression: string) — evaluates a basic arithmetic expression, returns a number.
2. search(query: string) — searches a small local knowledge base about LLMs, returns a fact or "no matching fact found".
3. notepad(action: "write"|"read", text?: string) — write appends text to a notepad, read returns everything saved so far.

Respond with STRICT JSON only, no markdown, no code fences, matching exactly one of these two shapes:
{"thought": "your reasoning", "tool": "calculator" | "search" | "notepad", "args": { ... }}
{"thought": "your reasoning", "final_answer": "your final answer to the user"}`;
