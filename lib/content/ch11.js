export const CH11_CONTENT = {
  concept: [
    "A finetuned chat model still isn't done — it needs to learn WHICH of its own possible responses humans actually prefer. RLHF (Reinforcement Learning from Human Feedback) is how that preference gets baked in.",
    "Step one: show human raters 2 possible responses to the same prompt, ask 'which is better?' Do this thousands of times. Step two: train a small 'reward model' to predict those preferences automatically. Step three: use that reward model to nudge the actual LLM toward responses it would score highly.",
    "The raters aren't grading facts, they're grading preference — tone, length, confidence, structure. That's a big part of why RLHF shapes a model's personality and style far more than it shapes its knowledge.",
    "Below, you ARE the human rater. Pick your preferred response across 6 rounds, and watch your own reward model get revealed at the end."
  ],
  simple: [
    "Imagine being a judge on a talent show where there's no objectively 'correct' answer — you just pick whichever performance you personally liked more. Do that enough times across enough judges, and a PATTERN emerges in what people generally prefer.",
    "RLHF is that judging process, done at massive scale, then taught to a smaller 'judge model' (the reward model) so it can auto-judge new performances without needing a human every single time.",
    "Below, you're the judge. 6 rounds, pick your favorite each time. At the end, we reveal what your personal 'taste' pattern looked like — that's your own tiny reward model."
  ],
  intro: {
    what: "rank 6 pairs of AI responses by preference — your picks train a tiny visible reward score.",
    why: "this exact ranking process, at massive scale, is literally how models like Claude and ChatGPT got their personalities — not from facts, from millions of preference votes like yours.",
    how: "read each pair, click whichever you prefer, and see your revealed 'reward model' at the end."
  },
  challenge:
    "Go back and deliberately pick the OPPOSITE of your natural preference in a couple of rounds, then check your revealed reward model again. Notice it changes to match. That's the exact mechanism by which inconsistent or biased raters can bake bias into a real model's personality.",
  checkpoint: [
    {
      q: "What does a reward model actually learn to predict?",
      options: [
        "Whether a response is factually correct",
        "Which of two responses a human rater would prefer",
        "How many tokens a response should have",
        "The exact next word a model will generate"
      ],
      answer: 1,
      why: "a reward model is trained purely on pairwise human preference data — it learns 'what humans tend to like', not 'what is true.'"
    },
    {
      q: "Why does RLHF shape a model's personality/style more than its factual knowledge?",
      options: [
        "It doesn't — RLHF is where all the facts come from",
        "Because raters are judging preference (tone, length, structure), not fact-checking, so the training signal mostly teaches HOW to respond, not WHAT is true",
        "RLHF only happens on models with no prior training",
        "Reward models are incapable of learning style"
      ],
      answer: 1,
      why: "the human feedback signal is 'which did you like better', which mostly reflects style and tone preferences — knowledge came earlier, from pretraining."
    }
  ]
};
