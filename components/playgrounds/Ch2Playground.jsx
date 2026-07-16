"use client";

import CodeCell from "../CodeCell";
import StartHere from "../StartHere";

function CellLabel({ children }) {
  return <p className="margin-note mb-3 uppercase tracking-wide">{children}</p>;
}

export default function Ch2Playground() {
  return (
    <div className="flex flex-col gap-8">
      <StartHere>run the warm-up cell first, then write the real tokenizer.</StartHere>

      <div>
        <CellLabel>warm up · the dumb way</CellLabel>
        <CodeCell
          goal="a one-line word splitter"
          prompt="fill in the method that splits a string on spaces, then run."
          layers={{
            blank: {
              template: 'text = "the strawberry model"\ntokens = text.___()\nprint(tokens)',
              defaults: [""]
            }
          }}
          check="strawberry"
        />
      </div>

      <div>
        <CellLabel>now write a real one</CellLabel>
        <CodeCell
          goal="a real greedy tokenizer function"
          prompt="finish tokenize() — greedily match the longest chunk in VOCAB that the remaining text starts with. no match? peel off one character as its own token. stuck? there's a hint button."
          layers={{
            hints: {
              starter:
                'VOCAB = ["the", "straw", "berry", "model", "is", "a", "st", "r", "aw"]\nVOCAB = sorted(VOCAB, key=len, reverse=True)  # longest first\n\ndef tokenize(word):\n    tokens = []\n    rest = word\n    while rest:\n        # your code here\n        pass\n    return tokens\n\nprint(tokenize("strawberry"))',
              hints: [
                "loop while rest still has text. for each chunk in VOCAB (already sorted longest-first), check if rest.startswith(chunk) — the first one that matches is your token. append it, then slice it off the front of rest.",
                'def tokenize(word):\n    tokens = []\n    rest = word\n    while rest:\n        match = None\n        for chunk in VOCAB:\n            if ___:\n                match = chunk\n                break\n        if not match:\n            match = rest[0]\n        tokens.append(match)\n        rest = ___\n    return tokens',
                'def tokenize(word):\n    tokens = []\n    rest = word\n    while rest:\n        match = None\n        for chunk in VOCAB:\n            if rest.startswith(chunk):\n                match = chunk\n                break\n        if not match:\n            match = rest[0]  # unknown char = its own token\n        tokens.append(match)\n        rest = rest[len(match):]\n    return tokens\n\nprint(tokenize("strawberry"))  # -> [\'straw\', \'berry\']'
              ]
            },
            freehand: {
              starter:
                'VOCAB = ["the", "straw", "berry", "model", "is", "a", "st", "r", "aw"]\nVOCAB = sorted(VOCAB, key=len, reverse=True)\n\ndef tokenize(word):\n    tokens = []\n    rest = word\n    while rest:\n        pass\n    return tokens\n\nprint(tokenize("strawberry"))'
            }
          }}
          check="straw"
        />
      </div>
    </div>
  );
}
