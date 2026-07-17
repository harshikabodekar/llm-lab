export const BOSS4_CONTENT = {
  concept: [
    "'Ready to ship' reports look authoritative — numbers, percentages, charts. That doesn't mean they're trustworthy. The report below has 3 real red flags hidden among statements that sound just as confident.",
    "This is the last mile of everything you've learned: hallucination awareness (ch19), evals (ch20), scaling/cost awareness (ch21) — all converging into one skill: can you tell if an AI system is actually ready, or just LOOKS ready?",
    "Find all 3. The rest of the report is genuinely fine — don't flag things just because they're numbers you don't immediately understand."
  ],
  simple: [
    "Imagine a contractor hands you a report saying a bridge is 'ready' — with official-looking numbers everywhere. A careful inspector doesn't just trust the confident tone; they check who tested it, how much was tested, and what wasn't tested at all. Same job, different bridge."
  ],
  intro: {
    what: "read a fictional ship-readiness report and find the 3 real red flags among several unrelated (fine) statements.",
    why: "this exact skill — reading past confident-sounding numbers to what's ACTUALLY being measured — is what separates a real ship/no-ship decision from rubber-stamping a report.",
    how: "flag whichever statements you think are red flags, then submit and see what you caught."
  },
  challenge:
    "For each flag you correctly caught, think through what SPECIFIC eval or process change would actually fix it — that turns 'this is a mistake' into an improvement plan.",
  checkpoint: [
    {
      q: "Why is a tiny, non-independent eval set (written by the same engineer who built the feature) a red flag, even at 98.7% accuracy?",
      options: [
        "It isn't — high accuracy is high accuracy regardless of sample size",
        "A small, biased sample can't represent real-world performance, and someone grading their own work has an incentive (even unconsciously) to pick examples that make it look good",
        "98.7% is actually too low to be trustworthy on its own",
        "The engineer's identity doesn't affect the eval's validity at all"
      ],
      answer: 1,
      why: "sample size AND independence both matter — 12 self-selected examples from the builder tells you almost nothing about how it'll perform on real, unpredictable user input."
    },
    {
      q: "Why does testing on the same data used for finetuning inflate an eval score meaninglessly?",
      options: [
        "It doesn't, this is standard best practice",
        "The model may have already 'seen' those exact examples during training, so performing well on them doesn't prove it generalizes to new, unseen inputs — the entire point of an eval",
        "Finetuning data is always lower quality than eval data",
        "It only matters for very large models"
      ],
      answer: 1,
      why: "an eval is supposed to simulate 'new, unseen input' — reusing training data defeats that purpose entirely, since good performance there might just be memorization."
    }
  ]
};
