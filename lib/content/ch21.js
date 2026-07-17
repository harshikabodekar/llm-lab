export const CH21_CONTENT = {
  concept: [
    "Everything you've built in this app scales up, not sideways. Same architecture (transformer block × dozens), same training loop, same tokens — just more of everything: more parameters, more data, more compute.",
    "Bigger models don't just get 'a bit better' — certain abilities seem to switch on abruptly at certain scales (this is called emergent behavior). A 10M-param model can barely form a sentence. A 100B+ param model can reason through multi-step problems it's never seen phrased that way before.",
    "But bigger also means heavier. A model's raw memory footprint scales directly with its parameter count — which is exactly the problem quantization solves. It shrinks each number's precision (fp32 → fp16 → int8 → int4) instead of shrinking the model itself. Same parameter count, way less memory — that's why a 7B model can run on your laptop instead of needing a server rack.",
    "One more scaling trick, in one minute: images aren't fundamentally different from text to a transformer. Chop an image into small patches, turn each patch into a token-like vector, and feed it into the exact same architecture alongside text tokens. That's most of how 'multimodal' models work."
  ],
  simple: [
    "A home cook and an industrial food factory use the same basic steps — mix, heat, plate — just at wildly different scale. LLMs are the same: 10,000 parameters and 1 trillion parameters are running the SAME transformer recipe, just at wildly different scale.",
    "Weirdly, certain 'dishes' only become possible once the factory is big enough — small kitchens just can't produce them, no matter how good the recipe is. That's emergent behavior: some abilities only show up past a certain scale, almost like a switch, not a gradual dial.",
    "Bigger factories also need bigger trucks to move ingredients around — more parameters means more numbers to store and move. Quantization is like writing each ingredient amount with fewer decimal places: 'about 2 cups' instead of '2.00347 cups' — less precise, but way lighter to carry, and usually close enough.",
    "And a picture, to this kind of factory, is just another ingredient — chop it into small tiles, treat each tile like a word, and run it through the exact same machinery as text."
  ],
  intro: {
    what: "drag a parameter-count slider from 10K to 1T and watch memory, data needs, and abilities change in real numbers.",
    why: "this is why bigger models cost more, need more data, and can suddenly do things smaller ones simply can't.",
    how: "drag the slider, then check the quantization example below to see why smaller numbers (not fewer parameters) is what fits big models on small hardware."
  },
  challenge:
    "Find the slider position where 'multi-step reasoning' first appears in the abilities list. The exact threshold here is illustrative, but the real phenomenon is genuine and well-documented — some abilities really do seem to appear abruptly at scale, not gradually.",
  checkpoint: [
    {
      q: "What does quantization actually reduce?",
      options: [
        "The number of parameters in the model",
        "The number of bits used to store each parameter (precision) — same model, less precise numbers, way less memory",
        "The number of layers in the model",
        "The vocabulary size"
      ],
      answer: 1,
      why: "quantization keeps every parameter, it just stores each one with fewer bits — the model gets lighter, not smaller in the 'fewer weights' sense."
    },
    {
      q: "In the patch-based approach to multimodal models, how does an image become something a transformer can process?",
      options: [
        "It's converted to a text description first, then read normally",
        "It's chopped into small patches, and each patch is turned into a token-like vector, fed into the same transformer architecture alongside text tokens",
        "Images can't actually be processed by transformers",
        "Each pixel becomes one token"
      ],
      answer: 1,
      why: "patch embedding (from Vision Transformers) treats an image like a grid of 'words' — each patch becomes a vector the exact same attention machinery can attend over."
    }
  ]
};
