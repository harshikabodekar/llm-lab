export const BOSS3_CONTENT = {
  concept: [
    "Someone built a RAG pipeline. It's returning garbage answers. Your job: find out why, using the exact same debugging instinct from boss 1 — read the code, don't just stare at the output.",
    "Two bugs are hiding here: one in how the document gets chunked, one in how the 'best' chunks get picked. Neither crashes. Both quietly return the wrong thing — the most dangerous kind of bug.",
    "Fix both, and the pipeline you built in ch15 (chunk → embed → retrieve → generate) works exactly as designed again."
  ],
  simple: [
    "Imagine a librarian was asked to fetch your 3 most relevant books, but a mix-up means she hands you the 3 LEAST relevant ones instead. Nothing crashed. She confidently handed you books. They're just the wrong ones. That's this boss level."
  ],
  intro: {
    what: "find and fix 2 bugs in a broken RAG pipeline — a hardcoded chunk size and a backwards similarity sort.",
    why: "both bugs are 'silent' — no crash, no error, just confidently wrong retrieval. that's the hardest kind of bug to catch.",
    how: "run each cell, notice the wrong output, use hints if stuck, fix it, run again."
  },
  challenge:
    "After fixing both, think back to ch15's chunk-size slider challenge — notice how THIS bug (hardcoded 20) is a sneakier version of the same failure: tiny chunks lose context. But at least the slider version was honest about what it was doing. A hardcoded override lies about it.",
  checkpoint: [
    {
      q: "Why is a 'silent' bug (wrong output, no crash) often more dangerous than a bug that crashes?",
      options: [
        "It isn't, crashes are always worse",
        "A crash is immediately obvious and gets fixed fast; a silent wrong-output bug can ship, get used, and quietly produce bad results for a long time before anyone notices",
        "Silent bugs are actually easier to find",
        "Crashes never get fixed as quickly as silent bugs"
      ],
      answer: 1,
      why: "a crash screams for attention. a function that runs fine and returns the wrong answer can sit in production for months, undetected, quietly degrading everything built on top of it."
    },
    {
      q: "What does sorting by score ASCENDING instead of DESCENDING do to a top-k retrieval function?",
      options: [
        "Nothing, the order doesn't matter for retrieval",
        "It returns the k WORST-matching results instead of the k best-matching ones — technically valid code, completely wrong behavior",
        "It makes the function crash",
        "It only affects performance, not correctness"
      ],
      answer: 1,
      why: "the code runs perfectly and returns exactly k results — they're just sorted backwards, so 'top' k quietly becomes 'bottom' k."
    }
  ]
};
