export const CH20_CONTENT = {
  concept: [
    "'It seems good' is not engineering. An eval is a test suite for AI behavior — a fixed set of inputs with known-good expected outputs, run automatically, every time something changes.",
    "Without evals, you find out your model got worse when a user complains. With evals, you find out the moment you make the change — before anyone else sees it.",
    "Below: a tiny fake 'model', a suite of test cases checking its behavior, and a regression — watch what happens when the model changes and the eval suite catches exactly what broke.",
    "This is the same pattern behind every serious AI product's CI pipeline: define expected behavior, test automatically, block bad changes before they ship."
  ],
  simple: [
    "Imagine a chef who, every time they tweak a recipe, re-serves it to the same 3 trusted tasters who know exactly what it's supposed to taste like. If taster #2 suddenly says 'too salty', the chef knows immediately — before it ever reaches the menu.",
    "That's an eval: the same test 'tasters' (test cases), run every time the recipe (the model) changes, catching problems before customers (users) ever see them.",
    "Below, taste-test a tiny fake model yourself. Then watch what happens when the recipe changes for the worse."
  ],
  intro: {
    what: "write test cases for a tiny fake model, run them, then watch a regression get caught when the model changes.",
    why: "evals are the entire difference between 'I think it's better' and 'I can prove it didn't break anything.'",
    how: "run the eval suite, add your own test case, then switch the model version and run again."
  },
  challenge:
    "Add a test case designed to specifically catch the regression you're about to see (hint: the bug drops from 3 words to 2) — then watch your own test be the one that fails.",
  checkpoint: [
    {
      q: "What's the main purpose of running the SAME eval suite before and after a model/code change?",
      options: [
        "To make the code run faster",
        "To catch regressions immediately — behavior that used to be correct but broke — rather than discovering it later from user complaints",
        "It's only useful the very first time you write it",
        "To automatically fix any bugs it finds"
      ],
      answer: 1,
      why: "the whole value of an eval suite is re-running it — a one-time check tells you nothing about whether tomorrow's change broke something today's check would have caught."
    },
    {
      q: "Why is an assert-based test more useful than eyeballing a single output?",
      options: [
        "It isn't — eyeballing is just as reliable",
        "Asserts run automatically and consistently against defined expected values, giving an objective, unambiguous pass/fail instead of a subjective, easy-to-miss judgment call",
        "Asserts are required by Python syntax",
        "Eyeballing is faster and therefore always better"
      ],
      answer: 1,
      why: "a human skimming output can miss a subtle regression; an assert either matches the expected value or it doesn't — no room for 'eh, looks fine.'"
    }
  ]
};
