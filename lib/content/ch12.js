export const CH12_CONTENT = {
  concept: [
    "A model doesn't output ONE word — it outputs a probability for every word in its vocabulary, every single time. Sampling is the process of turning that giant list of probabilities into one actual choice.",
    "Temperature controls how adventurous that choice is. Low temperature (near 0): always grab the highest-probability word — safe, repetitive, predictable. High temperature: probabilities flatten out, rare words get a real shot — creative, occasionally unhinged.",
    "Greedy decoding (temperature → 0) always produces the exact same output for the exact same input. Sampling with temperature > 0 introduces real randomness — ask the same question twice, get two different answers.",
    "One more thing you've definitely noticed: chat replies appear word by word instead of all at once. That's streaming — the model generates one token at a time regardless, streaming just ships each one the moment it's ready instead of making you wait for the whole reply.",
    "Below: 8 candidate next-words, real probabilities, a temperature dial you control. Watch the bars morph as you turn it, then hit sample and watch it actually pick one."
  ],
  simple: [
    "Imagine a spinner wheel where each next-word gets a slice sized by how likely it is. Temperature controls how lopsided the wheel is.",
    "Low temperature = one giant slice hogging almost the whole wheel — you'll basically always land on it, spin after spin. That's 'boring but safe.'",
    "High temperature = the wheel gets evened out into similar-sized slices — even the weird, unlikely words get a real shot at winning. That's 'creative but occasionally weird.'",
    "Here's a separate thing you already know from experience: when a chatbot 'types' its answer instead of dumping it all at once, that's streaming. The kitchen (the model) makes food one dish at a time anyway — streaming just means each dish comes to your table the second it's plated, instead of the waiter making you wait for the whole meal before bringing any of it out.",
    "Spin the wheel below. Watch how often the same word wins at low temperature vs how wild it gets at high temperature."
  ],
  intro: {
    what: "turn a temperature dial and watch 8 word probabilities morph, then sample real words into a growing sentence.",
    why: "temperature is the one setting that separates a boring corporate chatbot reply from unhinged creative writing — same model, same weights, different dial.",
    how: "drag the temperature slider, predict, then hit sample and watch the sentence build — compare it to the greedy (always-safe) version running alongside."
  },
  challenge:
    "Set temperature to 0.1 and sample 5 times — notice you get the exact same sentence, every time. Now set it to 2.0 and sample 5 times — watch it go somewhere different every single time. That's the entire creativity dial of every chatbot you've used.",
  checkpoint: [
    {
      q: "What does temperature actually control?",
      options: [
        "How fast the model generates text",
        "How flat or peaked the probability distribution is before sampling — low = peaked (safe), high = flat (random)",
        "How many words the model is allowed to output",
        "Whether the model uses greedy decoding at all"
      ],
      answer: 1,
      why: "temperature reshapes the SAME probabilities — squeezing them toward one peak (low temp) or spreading them out evenly (high temp) — before a word gets picked."
    },
    {
      q: "Why can a model start streaming text back to you almost immediately, even though the full response isn't finished?",
      options: [
        "It secretly pre-writes the whole answer instantly, then fakes the typing effect",
        "It generates one token at a time regardless, and can send each one the moment it's ready instead of waiting for the rest",
        "Streaming uses a completely different, faster model",
        "It doesn't actually stream — that's just a loading animation"
      ],
      answer: 1,
      why: "generation is always one-token-at-a-time under the hood — streaming just means the server forwards each token to you immediately instead of batching them until the end."
    }
  ]
};
