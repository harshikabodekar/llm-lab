"use client";

import CodeCell from "../CodeCell";
import StartHere from "../StartHere";

export default function Boss1Playground() {
  return (
    <div className="flex flex-col gap-8">
      <StartHere>run each cell first — the wrong output is your first clue.</StartHere>

      <div>
        <p className="margin-note mb-3 uppercase tracking-wide">bug 1 · the tokenizer</p>
        <CodeCell
          what="find and fix the bug in this word tokenizer."
          why="a silently-wrong tokenizer feeds silently-wrong tokens into everything downstream — this is exactly the kind of bug that's easy to miss."
          how="run it, compare the output to the input word count, then dig into the loop."
          prompt="this should split the sentence into 6 words. run it — count what you actually get. stuck? there's a hint button."
          layers={{
            hints: {
              starter:
                'def tokenize(text):\n    words = text.split(" ")\n    tokens = []\n    for i in range(1, len(words)):\n        tokens.append(words[i])\n    return tokens\n\nresult = tokenize("the cat sat on the mat")\nprint(result)',
              hints: [
                "run it first — count the words in the output vs the input. one is missing. look at where the loop starts counting from.",
                "range(1, len(words)) skips index 0 — and index 0 is the very first word. what should the range start at instead?",
                'def tokenize(text):\n    words = text.split(" ")\n    tokens = []\n    for i in range(0, len(words)):\n        tokens.append(words[i])\n    return tokens\n\nresult = tokenize("the cat sat on the mat")\nprint(result)  # -> [\'the\', \'cat\', \'sat\', \'on\', \'the\', \'mat\'] — the bug was range(1,...) instead of range(0,...), silently dropping the first token every time.'
              ]
            }
          }}
          check="'the', 'cat', 'sat'"
        />
      </div>

      <div>
        <p className="margin-note mb-3 uppercase tracking-wide">bug 2 · cosine similarity</p>
        <CodeCell
          what="find and fix the bug in this cosine similarity function."
          why="this exact function is what ch3's embedding map and ch15's RAG pipeline both run on — a broken version breaks everything built on top of it."
          how="run it, and remember: cosine similarity can NEVER be greater than 1. use that fact."
          prompt="this should print a number between -1 and 1. run it — is it? stuck? there's a hint button."
          layers={{
            hints: {
              starter:
                "def dot(a, b):\n    return sum(a[i] + b[i] for i in range(len(a)))\n\ndef magnitude(v):\n    return sum(x**2 for x in v) ** 0.5\n\ndef cosine_similarity(a, b):\n    return dot(a, b) / (magnitude(a) * magnitude(b))\n\nvec1 = [1, 0, 1]\nvec2 = [1, 1, 0]\nprint(round(cosine_similarity(vec1, vec2), 3))",
              hints: [
                "cosine similarity can NEVER be greater than 1 — run this first and see what number comes out. that's your clue something's structurally wrong, not just off by a little.",
                "look at dot() — a dot product multiplies matching positions together and sums them. does `a[i] + b[i]` do that, or something else?",
                "def dot(a, b):\n    return sum(a[i] * b[i] for i in range(len(a)))\n\ndef magnitude(v):\n    return sum(x**2 for x in v) ** 0.5\n\ndef cosine_similarity(a, b):\n    return dot(a, b) / (magnitude(a) * magnitude(b))\n\nvec1 = [1, 0, 1]\nvec2 = [1, 1, 0]\nprint(round(cosine_similarity(vec1, vec2), 3))  # -> 0.5 — the bug was `+` instead of `*` in dot(), which isn't a dot product at all."
              ]
            }
          }}
          check="0.5"
        />
      </div>
    </div>
  );
}
