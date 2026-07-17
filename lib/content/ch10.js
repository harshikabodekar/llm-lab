export const CH10_CONTENT = {
  concept: [
    "Pretraining is dumping enormous amounts of text into a model and asking it to predict the next token, over and over, until it's absorbed grammar, facts, code, reasoning patterns — basically everything text can teach. The result is called a base model, and it's weird.",
    "A base model was never taught to be an assistant. Ask it a question and it might answer, ramble, continue as if it's a forum post, or drift into something totally unrelated — because 'predict the next token' doesn't inherently mean 'be helpful.'",
    "Finetuning takes that base model and trains it further on a much smaller, curated set of examples — conversations where a human plays 'helpful assistant.' This teaches BEHAVIOR: how to actually answer, how to stay on topic, how to stop when it's said enough.",
    "Below: the exact same prompt, sent to a base model and a finetuned chat model. Same underlying knowledge, wildly different behavior."
  ],
  simple: [
    "Imagine someone who has read literally every book, article, and forum post ever written, but has never had a single conversation or done a single job. Ask them something and they might recite a fact, ramble into a tangent, or just keep talking about something adjacent. That's a base model.",
    "Now imagine that SAME person goes through a few weeks of customer service training — how to actually answer a question, stay on topic, and know when to stop talking. They didn't learn any new facts. They learned how to BEHAVE. That's finetuning.",
    "Below: watch the well-read-but-untrained person and the trained person answer the exact same question."
  ],
  intro: {
    what: "compare the exact same prompt sent to a 'base' model vs a 'chat' model — same knowledge, different behavior.",
    why: "this is the single biggest misconception about how chatbots work — the helpfulness isn't free, it's TRAINED, separately from the knowledge.",
    how: "pick a prompt, predict, then read both completions side by side."
  },
  challenge:
    "Notice the base model completions never actually STOP appropriately — they keep going, drifting into unrelated territory. That's not a quirk of these examples, that's the literal behavior of next-token prediction with no 'be helpful, then stop' training on top of it.",
  checkpoint: [
    {
      q: "What does a 'base' model lack that a finetuned 'chat' model has?",
      options: [
        "More factual knowledge",
        "Training on curated helpful-assistant behavior — how to actually respond usefully and know when to stop",
        "A larger vocabulary",
        "Faster inference speed"
      ],
      answer: 1,
      why: "the base model already knows plenty — finetuning doesn't add knowledge, it adds the BEHAVIOR of being a helpful, on-topic assistant."
    },
    {
      q: "Why can a base model still 'know' the same facts as the chat version built from it?",
      options: [
        "It can't — base models know nothing",
        "Pretraining (where the knowledge comes from) happens BEFORE finetuning — finetuning only adjusts behavior on top, it doesn't erase what pretraining taught",
        "The facts are re-taught during finetuning",
        "Chat models and base models are trained on completely separate data"
      ],
      answer: 1,
      why: "finetuning is a second, much smaller training pass on top of an already-pretrained model — the knowledge underneath stays intact, only the behavior on top changes."
    }
  ]
};
