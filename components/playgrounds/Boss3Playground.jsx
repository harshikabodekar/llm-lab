"use client";

import CodeCell from "../CodeCell";
import StartHere from "../StartHere";

export default function Boss3Playground() {
  return (
    <div className="flex flex-col gap-8">
      <StartHere>run each cell first — the wrong output is your first clue.</StartHere>

      <div>
        <p className="margin-note mb-3 uppercase tracking-wide">bug 1 · the chunker</p>
        <CodeCell
          what="find and fix the bug in this chunking function."
          why="a chunker that silently ignores its own chunk_size argument produces tiny, context-starved chunks no matter what the caller asks for — exactly the failure ch15's challenge warned about, but hidden."
          how="run it, compare the chunk lengths to the chunk_size you passed in, then dig into the slicing."
          prompt="this should produce chunks of length 30. run it — check the actual lengths. stuck? there's a hint button."
          layers={{
            hints: {
              starter:
                'def chunk_text(text, chunk_size, overlap):\n    chunks = []\n    i = 0\n    while i < len(text):\n        chunks.append(text[i:i+20])\n        if i + chunk_size >= len(text):\n            break\n        i += chunk_size - overlap\n    return chunks\n\ntext = "the quick brown fox jumps over the lazy dog while the cat watches quietly from the fence"\nresult = chunk_text(text, 30, 5)\nprint([len(c) for c in result])',
              hints: [
                "run it and check the printed lengths — they're all 20, no matter what chunk_size you pass in. somewhere the code is ignoring its own parameter.",
                "chunks.append(text[i:i+___])  — should this be a literal number, or the parameter you were given?",
                'def chunk_text(text, chunk_size, overlap):\n    chunks = []\n    i = 0\n    while i < len(text):\n        chunks.append(text[i:i+chunk_size])\n        if i + chunk_size >= len(text):\n            break\n        i += chunk_size - overlap\n    return chunks\n\ntext = "the quick brown fox jumps over the lazy dog while the cat watches quietly from the fence"\nresult = chunk_text(text, 30, 5)\nprint([len(c) for c in result])  # -> chunks of length 30 (except maybe the last)'
              ]
            }
          }}
          check={(output) => {
            const nums = (output.match(/\d+/g) || []).map(Number);
            return nums.length > 0 && nums.slice(0, -1).every((n) => n === 30);
          }}
        />
      </div>

      <div>
        <p className="margin-note mb-3 uppercase tracking-wide">bug 2 · the retrieval sort</p>
        <CodeCell
          what="find and fix the bug in this top-k retrieval function."
          why="this exact function decides which chunks get stuffed into the prompt — sorted backwards, it hands the model the LEAST relevant context every single time."
          how="run it, notice the top result has the LOWEST score instead of the highest, then fix the sort direction."
          prompt="this should return the 3 HIGHEST-scoring chunks first. run it — is it? stuck? there's a hint button."
          layers={{
            hints: {
              starter:
                "def top_k_chunks(scores, k=3):\n    sorted_scores = sorted(scores, key=lambda x: x[1])\n    return sorted_scores[:k]\n\nscores = [(0, 0.2), (1, 0.9), (2, 0.5), (3, 0.1), (4, 0.7)]\nprint(top_k_chunks(scores))",
              hints: [
                "sorted() sorts ascending (lowest first) by default. for TOP scores, you want descending — check the reverse argument.",
                "sorted_scores = sorted(scores, key=lambda x: x[1], reverse=___)",
                "def top_k_chunks(scores, k=3):\n    sorted_scores = sorted(scores, key=lambda x: x[1], reverse=True)\n    return sorted_scores[:k]\n\nscores = [(0, 0.2), (1, 0.9), (2, 0.5), (3, 0.1), (4, 0.7)]\nprint(top_k_chunks(scores))  # -> [(1, 0.9), (4, 0.7), (2, 0.5)]"
              ]
            }
          }}
          check="(1, 0.9)"
        />
      </div>
    </div>
  );
}
