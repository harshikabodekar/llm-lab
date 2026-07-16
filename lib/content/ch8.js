export const CH8_CONTENT = {
  concept: [
    "Gradient descent has exactly one dial: the learning rate. It controls how big a step you take downhill after each gradient check. Below, you'll turn that dial yourself and watch what happens.",
    "The gradient (the slope at your current position) always points in the direction of steepest INCREASE. To go downhill — to reduce loss — you step in the OPPOSITE direction. That's the entire 'descent' in gradient descent.",
    "Learning rate too small: each step barely moves you. You'll eventually get there, but painfully slowly — imagine tip-toeing down a hill in the dark.",
    "Learning rate too large: you leap right over the valley and land higher up on the other side than where you started. Do this enough times and the ball doesn't descend — it launches."
  ],
  simple: [
    "Imagine you're blindfolded on a hill, trying to reach the bottom. You can't see the whole hill — you can only feel the slope under your feet right now, and take a step in the downhill direction. That's gradient descent: no map, just 'which way is down from HERE, and how big a step do I take.'",
    "The size of your step is the learning rate. Tiny steps: safe, but you're still on the hill next Tuesday. Giant steps: you might step clean over the valley and end up higher up on the OTHER side — then do it again, and again, bouncing around, never landing.",
    "There's a sweet-spot step size where you actually get to the bottom quickly without overshooting. Finding that sweet spot is most of what 'tuning' a model even means.",
    "Try it below: drop the ball, pick a step size, and watch it either creep, glide down nicely, or launch off the hill entirely."
  ],
  intro: {
    what: "pick a learning rate, then watch a ball perform real gradient descent down a loss curve.",
    why: "learning rate is the single most important dial in all of machine learning — too big or too small and training simply doesn't work.",
    how: "set the learning rate slider, hit 'run', and watch where the ball ends up."
  },
  challenge:
    "Find 3 learning rates: one that creeps so slowly it barely moves in 50 steps, one that glides smoothly to the bottom, and one that sends the ball flying off the landscape entirely. Same hill, same starting point — only the dial changed.",
  checkpoint: [
    {
      q: "Which direction does the gradient point, and which direction do you actually step?",
      options: [
        "Gradient points downhill, you step downhill too",
        "Gradient points toward steepest INCREASE, you step in the opposite direction to decrease loss",
        "The gradient points randomly, direction doesn't matter",
        "Gradient points toward the nearest local minimum directly"
      ],
      answer: 1,
      why: "the gradient is defined as the direction of steepest increase — 'descent' means walking the opposite way, hence the minus sign in every gradient descent update."
    },
    {
      q: "What tends to happen with a learning rate that's too large?",
      options: [
        "Training becomes perfectly accurate immediately",
        "Nothing changes, large learning rates are always safe",
        "Steps overshoot the minimum, sometimes bouncing to higher and higher loss instead of settling",
        "The model automatically shrinks the rate on its own"
      ],
      answer: 2,
      why: "an oversized step can jump clean past the valley floor and land higher up the opposite slope — repeat that a few times and the loss explodes instead of shrinking."
    }
  ]
};
