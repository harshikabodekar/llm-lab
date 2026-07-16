export const CH7_CONTENT = {
  concept: [
    "Training needs a single number that says 'you were THIS wrong' — that number is called the loss. Get a good number, training works. Get a bad number, training optimizes the wrong thing entirely.",
    "For predicting the next token, the model outputs a probability for every word in its vocabulary. Cross-entropy loss looks at ONE thing: what probability did the model assign to the actual correct word? Then it takes -log of that probability.",
    "Why -log? Because it punishes confidence in the wrong answer HARD, and rewards confidence in the right answer gently. Predict the right word with 99% confidence — tiny loss. Predict it with 1% confidence — loss shoots up fast.",
    "Below, tune 4 raw prediction scores and watch cross-entropy do exactly this: reward correct confidence, punish wrong confidence, brutally."
  ],
  simple: [
    "Imagine a strict teacher grading how confident you sounded, not just whether you got it right. Loss is your penalty score — low penalty for confidently correct, and a HUGE penalty for confidently wrong.",
    "The model doesn't just guess one word — it gives every possible word a percentage of confidence. Cross-entropy loss checks: how much confidence did you put on the ACTUALLY correct word? Then punishes you based on -log of that number.",
    "-log is a strict but fair rule: correct guess with high confidence = you're barely punished. Correct guess with low confidence ('I dunno, maybe?') = a small penalty, for being wishy-washy about the right answer. Wrong guess with high confidence = you get PUNISHED HARD, for being confidently, arrogantly, wrong.",
    "Studying (training) is just repeatedly trying to make this one penalty number smaller. Try it below — tune your confidence and watch your own penalty score."
  ],
  intro: {
    what: "tune 4 prediction scores and watch cross-entropy loss punish (or reward) your confidence.",
    why: "this single number — how surprised the model was by the right answer — is what every training step tries to shrink.",
    how: "drag the sliders, or hit a preset button, and watch the loss number react."
  },
  challenge:
    "Push the true class's slider all the way down and another class all the way up. Watch how fast the loss explodes compared to just being 'a little wrong'. That's -log doing its job — cross-entropy hates confident wrongness way more than it hates plain uncertainty.",
  checkpoint: [
    {
      q: "What does cross-entropy loss actually look at?",
      options: [
        "Every probability the model output, averaged together",
        "Only the probability the model assigned to the correct answer",
        "How long the model took to respond",
        "The number of classes in the problem"
      ],
      answer: 1,
      why: "cross-entropy loss = -log(probability assigned to the correct class) — the other classes' probabilities don't directly enter the formula at all."
    },
    {
      q: "Why does a confidently WRONG prediction get punished so much harder than an uncertain one?",
      options: [
        "It doesn't — all wrong predictions are punished equally",
        "Because -log grows huge as its input approaches 0, and confident-wrong means the correct class's probability is near 0",
        "Because the model gets extra penalty points for using more compute",
        "Uncertain predictions are actually punished harder"
      ],
      answer: 1,
      why: "-log(0.9) is tiny, but -log(0.01) is huge — the closer the correct class's assigned probability gets to zero, the more the loss explodes."
    }
  ]
};
