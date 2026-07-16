export const CH9_CONTENT = {
  concept: [
    "Everything in this app has been building to this one loop: predict the next character, measure how wrong you were, nudge the weights a little, repeat. Thousands of times. That's training. That's all training ever is.",
    "This is a real neural net, training in your browser, on YOUR text, right now — not a video, not a simulation. Small (a context window of a few characters, one hidden layer), but the loop is identical to what trains GPT-4.",
    "Two things to watch: the loss curve (should trend down — the model is getting less surprised by your text) and the sample text (should slowly stop being random noise and start echoing your text's patterns — common words, common letter combinations, your rhythm).",
    "Before you get the live trainer, two quick unlocks — the exact two pieces this training loop is built from."
  ],
  simple: [
    "Imagine a kid who's never heard your language, sitting in the room while you talk. At first they babble random sounds. But every time they guess your next word wrong, you gently correct them, and they adjust a tiny bit. Do this thousands of times and eventually they start finishing your sentences the way you would.",
    "That's exactly what's about to happen below — except the 'kid' is a tiny real neural net, running in your browser, and 'thousands of times' takes about a minute instead of a childhood.",
    "Watch two things: the loss number (how surprised the kid still is by what you say next — should go down) and the sample text (the kid's own attempt at talking like you — should go from gibberish to something recognizable).",
    "First, two quick warm-ups — the two building blocks this whole loop is made of. Pass both, and the live trainer unlocks."
  ],
  intro: {
    what: "unlock and run a real tiny neural net that trains on YOUR pasted text, live, in your browser.",
    why: "the loop below — predict, measure loss, backprop, nudge weights, repeat — is exactly the loop that trains GPT-4. only the size differs, not the process.",
    how: "pass both unlock cells, paste your own text (or keep the default), hit train, and watch the loss curve and sample text evolve."
  },
  challenge:
    "Replace the default text with something of yours — lyrics, notes, a chat export. Train for at least 1500 steps. Then compare the sample text at step 50 against step 1500 — that transformation, gibberish to pattern, is the entire miracle of training, compressed into about a minute.",
  checkpoint: [
    {
      q: "What does the loss curve trending DOWN actually mean?",
      options: [
        "The model is running faster",
        "The model is assigning higher probability to the actual next character over time — it's less 'surprised' by your text",
        "The browser is using less memory",
        "The text is getting shorter"
      ],
      answer: 1,
      why: "loss is literally -log(probability assigned to the correct next character) — a falling loss means that probability is climbing, step after step."
    },
    {
      q: "Why does the sample text get more coherent as training continues?",
      options: [
        "It doesn't — sample text is unrelated to training",
        "The weights are being nudged (via backprop) toward whatever reduces loss on your text, so generated text increasingly reflects those same patterns",
        "The temperature slider secretly fixes the grammar",
        "The model memorizes your exact sentences word for word after a few steps"
      ],
      answer: 1,
      why: "every training step pulls the weights slightly toward 'patterns that predict this text well' — sample generation uses those same weights, so it drifts toward those same patterns."
    }
  ]
};
