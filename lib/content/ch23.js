export const CH23_CONTENT = {
  concept: [
    "Everything in this app was hand-rolled — no PyTorch, no TensorFlow, real math but built from scratch so you could see every gear turning. That was deliberate: understanding beats magic.",
    "But real ML work happens in a framework, and PyTorch is the one worth learning. The good news: you already know the concepts. `net.forward()`, `net.backward()`, `net.step()` from ch4-9 — that's literally the same shape as PyTorch's `model(x)`, `loss.backward()`, `optimizer.step()`.",
    "Below: 4 side-by-side comparisons, your actual code from earlier chapters next to the equivalent real PyTorch. Same ideas, different syntax, way less code to write yourself.",
    "And a 12-week roadmap — from PyTorch basics to finetuning an open model on a rented GPU. Check off weeks as you go; it's saved in your browser."
  ],
  simple: [
    "Think of this whole app as learning to cook by making everything from raw ingredients — grinding your own flour, so to speak. It's slower, but you understand exactly what's in the dish.",
    "PyTorch is a professional kitchen with pre-made ingredients and machines that do the grinding for you — same recipes, same understanding, just way less manual labor per dish.",
    "Below: your hand-ground version next to the professional-kitchen version, ingredient by ingredient. Then a 12-week plan for moving into that kitchen for real."
  ],
  intro: {
    what: "compare your own code from earlier chapters to the equivalent real PyTorch, then check off a 12-week roadmap.",
    why: "this is the bridge from 'I understand how it works' to 'I can build real models with real tools' — the whole point of days 1-4.",
    how: "read the 4 comparisons, then check off roadmap weeks as you commit to them."
  },
  challenge:
    "Pick ONE comparison below and actually run the PyTorch version — install torch, paste it into a script, run it. That's the fastest way to confirm the bridge is real, not just a diagram.",
  checkpoint: [
    {
      q: "Why did this app build everything from scratch instead of using PyTorch from day one?",
      options: [
        "PyTorch doesn't work in browsers, so it was purely a technical limitation",
        "Building it by hand forces you to actually understand every step — using a framework from the start would have let you skip past the parts that matter most for learning",
        "Hand-rolled code is always faster than PyTorch",
        "There was no particular reason"
      ],
      answer: 1,
      why: "frameworks are excellent for building things fast — but they're also excellent at letting you skip understanding what's happening inside the box. this course optimized for the latter first."
    },
    {
      q: "What's the real relationship between your `net.forward()` / `backward()` / `step()` from ch4-9 and PyTorch's equivalents?",
      options: [
        "They're unrelated — PyTorch works completely differently under the hood",
        "They're the same conceptual steps (predict, compute gradients, update weights) — PyTorch just handles the bookkeeping and math automatically instead of by hand",
        "PyTorch only handles forward passes, not backward passes",
        "Your version is actually more accurate than PyTorch's"
      ],
      answer: 1,
      why: "same loop, same 3 steps — PyTorch's autograd just computes the gradients for you instead of you writing backward() by hand like in engine/tinynn.js."
    }
  ]
};
