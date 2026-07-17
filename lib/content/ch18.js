export const CH18_CONTENT = {
  concept: [
    "Full finetuning means updating every single one of a model's weights — for a model with billions of parameters, that's an enormous amount of numbers to store, move, and retrain, even for a small behavior change.",
    "LoRA's trick: freeze the ENTIRE original model, and instead train two tiny matrices whose product approximates the update you actually wanted. The original weights never move — only the small add-on does.",
    "Why does this work? Most useful weight updates turn out to be 'low rank' — they don't need the full richness of a giant matrix to capture the change. A skinny approximation captures almost all of the value at a tiny fraction of the parameter count.",
    "Below: watch a frozen weight matrix stay frozen while two small trainable matrices do all the work, and drag the rank slider to see the real parameter-count math for yourself."
  ],
  simple: [
    "Full finetuning is gutting and rebuilding an entire house to change how one room feels. Technically works, wildly expensive, and you risk breaking something in a room you didn't even mean to touch.",
    "LoRA is building a small addition next to the house instead — the original house stays completely untouched (frozen), and the small addition (2 tiny matrices) does the actual work of changing how things feel.",
    "The addition is small because most changes people actually want don't need a whole new house's worth of material — a well-placed small addition captures almost all of the value.",
    "Watch the frozen house below, and the small trainable addition next to it. Drag the rank slider and watch how few extra bricks (parameters) LoRA actually needs."
  ],
  intro: {
    what: "watch a frozen weight matrix stay frozen while two small trainable matrices do the actual work, then compare real parameter counts.",
    why: "LoRA is why you can finetune a giant model on a laptop instead of a data center — this is the actual mechanism, not marketing.",
    how: "drag the matrix size and rank sliders and watch the real parameter math update below."
  },
  challenge:
    "Set the matrix size to something realistic (like 4096×4096, roughly one attention weight matrix in a mid-size model) and the rank to 8. Look at the percentage of parameters LoRA actually trains. Then imagine that ratio repeated across hundreds of weight matrices in a real model — that's the whole story of why LoRA is cheap.",
  checkpoint: [
    {
      q: "What does LoRA actually freeze, and what does it train?",
      options: [
        "It freezes nothing — it's just full finetuning with a different name",
        "It freezes the entire original model's weights and trains only two small new matrices whose product approximates the weight update",
        "It freezes the training data and trains the weights normally",
        "It trains the full model but at a lower learning rate"
      ],
      answer: 1,
      why: "the whole point is the original weights never move — only two small add-on matrices get trained, then their product is added on top at inference time."
    },
    {
      q: "What's the main practical tradeoff between open and closed models?",
      options: [
        "Open models are always more accurate",
        "Open models can be downloaded, finetuned, and hosted anywhere with no per-token API cost, but you own the hosting burden; closed models are easier to start with and need no hosting, but cost per token and can't be finetuned as freely",
        "Closed models are always cheaper long-term",
        "There's no real difference, just branding"
      ],
      answer: 1,
      why: "it's a genuine tradeoff — control and cost-at-scale (open) versus convenience and zero infrastructure (closed) — not a strictly-better-or-worse situation."
    }
  ]
};
