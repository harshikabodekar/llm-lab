export const CH4_CONTENT = {
  concept: [
    "A neuron does three things: multiply, add, squash. Take some numbers, multiply each by a weight (a tunable number), add them up plus one more tunable number (a bias), then squash the result into a small range so it doesn't explode.",
    "Stack a few neurons side by side — that's a layer. Stack a few layers — that's a network. Every 'neural net' you've ever heard of, from a 3-neuron toy to GPT-4, is this pattern, repeated.",
    "The squashing function here is tanh — it takes any number and squeezes it into [-1, 1]. Below, positive output means 'inside', negative means 'outside'.",
    "Training means tuning the weights and biases so the squashed outputs land on the right side for as many points as possible. You're about to try doing that by hand. Good luck — you'll need it."
  ],
  simple: [
    "Imagine 3 judges scoring whether a point belongs to the 'inside' team or the 'outside' team. Each judge looks at the point's 2 coordinates, decides how much to trust each one (that's a weight), adds their own gut feeling (a bias), then shouts a number between -1 (definitely outside) and 1 (definitely inside).",
    "A neuron IS one of these judges. Its weights are just 'how much do I trust clue #1 vs clue #2', and its bias is 'am I generally an optimist or pessimist about this'.",
    "Right now, all 3 judges have random, badly-tuned opinions — like judges who've never seen the sport before. Your job: manually adjust their dials until their combined vote gets the calls right.",
    "Spoiler: there's a smarter way to tune judges than guessing — it's called gradient descent, and it's about to embarrass you."
  ],
  intro: {
    what: "hand-tune 9 numbers to classify points, then race gradient descent on the same task.",
    why: "this is the entire 'training' problem in miniature — before trusting GD to tune millions of numbers, tune 9 yourself.",
    how: "drag the 9 sliders, watch the left canvas change, then press 'run gradient descent' to compare."
  },
  challenge:
    "Get your hand-tuned accuracy above 80% before hitting 'run gradient descent'. Then look at how few steps GD needed to beat your best score, and how little effort it took compared to your dragging and squinting.",
  checkpoint: [
    {
      q: "What does a single neuron actually compute?",
      options: [
        "A weighted sum of its inputs plus a bias, then squashed",
        "A lookup in a table of known answers",
        "A random guess that gets luckier over time",
        "A hardcoded if-else chain written by engineers"
      ],
      answer: 0,
      why: "multiply each input by a weight, add a bias, squash the result — that's the entire computation, every time."
    },
    {
      q: "Why squash (tanh) the output instead of leaving it as a raw number?",
      options: [
        "It makes training illegal without it",
        "It keeps outputs in a bounded, comparable range so layers can stack without exploding",
        "Squashing has no real purpose, it's just tradition",
        "To save computer memory"
      ],
      answer: 1,
      why: "without squashing, numbers would grow unboundedly as they pass through layers — tanh keeps every neuron's output in a predictable [-1, 1] range."
    }
  ]
};
