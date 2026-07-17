export const BOSS2_CONTENT = {
  concept: [
    "You've read loss curves before (ch8) — now use that skill to diagnose a broken training run without anyone telling you what's wrong first.",
    "Below are two training runs, each with ONE planted bug. Look at the SHAPE of the loss curve before you touch any code — the shape itself is the clue.",
    "Then fix each bug for real, in Python, and watch the curve behave the way it should."
  ],
  simple: [
    "Imagine looking at a fever chart before diagnosing a patient — a temperature that keeps climbing steadily tells a different story than one that spikes wildly up and down, over and over. Loss curves work the same way: their SHAPE is diagnostic information, before you even read the code."
  ],
  intro: {
    what: "diagnose 2 broken training runs from their loss curve shape, then fix each bug in code.",
    why: "reading a loss curve's shape to guess what's wrong is a real, everyday debugging skill for anyone who trains models.",
    how: "look at each curve, guess the bug, then fix it in the matching code cell."
  },
  challenge:
    "Before running either fixed cell, predict what the FIXED curve should look like — smoothly decreasing, converging toward the minimum. Then verify your fix actually produces that shape.",
  checkpoint: [
    {
      q: "A loss curve that grows steadily upward, run after run, most likely indicates:",
      options: [
        "The learning rate is too high",
        "The gradient is being added instead of subtracted — ascending the loss surface instead of descending it",
        "The model has too many parameters",
        "Nothing is wrong, this is normal"
      ],
      answer: 1,
      why: "a flipped sign turns gradient DEScent into gradient AScent — the loss climbs deliberately, in exactly the wrong direction, every single step."
    },
    {
      q: "A loss curve that wildly oscillates with growing magnitude most likely indicates:",
      options: [
        "The gradient sign is flipped",
        "The learning rate is too high, causing each step to overshoot the minimum by more and more",
        "The loss function itself is broken",
        "The data is shuffled incorrectly"
      ],
      answer: 1,
      why: "an oversized step overshoots the minimum and lands higher up the opposite slope — repeat that and the bounces get bigger, not smaller."
    }
  ]
};
