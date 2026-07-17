export const BOSS1_CONTENT = {
  concept: [
    "No new theory this time. You've built a tokenizer (ch2) and cosine similarity is the exact math behind ch3's embedding map — both real skills you already have. Below are two functions that LOOK right, compile fine, and are completely broken.",
    "That's the most common way real code fails — not a crash, just a quietly wrong answer. Your job: run each cell, notice the output is off, and figure out why before you touch the fix.",
    "One clue is built into the math itself: cosine similarity can never be greater than 1. If you ever see a number bigger than that come out of a similarity function, the function is lying to you — that's not a style nitpick, it's a hard mathematical fact you can use as a debugging tool.",
    "Hint buttons are there if you get stuck, same as every code cell. Fix both and you clear the boss."
  ],
  simple: [
    "Imagine someone hands you a recipe that LOOKS complete — every step is there, nothing's crossed out — but the dish comes out wrong every time. That's a bug: not a missing step, just one step that quietly does the wrong thing.",
    "Your job isn't to rewrite the recipe from scratch. It's to taste the result, notice something's off, and trace it back to the one wrong instruction.",
    "Here's a trick that works for the second recipe: some kitchen facts are just always true — a percentage can never be over 100%. If your 'percentage' comes out as 140%, you don't need to taste anything to know a step is broken.",
    "Two recipes, one broken step each. Fix both to clear the boss."
  ],
  intro: {
    what: "find and fix 2 planted bugs in a broken tokenizer and a broken cosine similarity function.",
    why: "reading code critically — spotting what SHOULD happen vs what a bug makes actually happen — is half of real engineering, and you already have every skill needed to do it.",
    how: "run each cell, notice the wrong output, use the hints if you're stuck, fix the bug, run again."
  },
  challenge:
    "Once both are fixed, go back and describe out loud (or to yourself) WHY each bug was wrong — not just what the fix was. 'range() started at the wrong number' is a better takeaway than just pattern-matching the fix.",
  checkpoint: [
    {
      q: "A function claims to return a cosine similarity, but prints 2.0. What does that tell you immediately?",
      options: [
        "Nothing unusual, similarity scores can be any size",
        "The function is definitely broken — cosine similarity is mathematically bounded to at most 1",
        "The two vectors are extremely similar",
        "You need more decimal places"
      ],
      answer: 1,
      why: "cosine similarity is bounded in [-1, 1] by definition — any output outside that range proves a bug exists, before you even read the code."
    },
    {
      q: "What's usually the more valuable skill: writing new code, or reading someone else's broken code?",
      options: [
        "Writing new code — reading code isn't a real skill",
        "Both matter, but professionally you'll read far more code than you write from scratch",
        "Reading code is only useful for beginners",
        "They're unrelated skills"
      ],
      answer: 1,
      why: "most real engineering work is reading, understanding, and fixing existing code — the debugging instinct you just used is the one you'll use constantly."
    }
  ]
};
