export const CH19_CONTENT = {
  concept: [
    "Hallucination isn't the model 'lying' — it's the model doing exactly what it always does (predicting plausible-sounding text) in a case where 'plausible' and 'true' have quietly diverged. It has no built-in fact-checker.",
    "The scary part: hallucinated text often sounds MORE confident than real facts — precise numbers, authoritative phrasing, no hedging. Confidence is not evidence.",
    "A different but related danger: prompt injection. If your app blindly stuffs untrusted text (a document, a webpage, a user upload) into a prompt, that text can contain instructions that hijack the model — 'ignore everything above and do X instead.'",
    "Below: two games. First, spot the hallucinations among genuinely true facts. Second, watch a prompt injection attack succeed against a naive agent, then watch a guarded prompt resist it."
  ],
  simple: [
    "Imagine a friend who's read a ton but sometimes fills gaps in their memory with something that just SOUNDS right, and says it with the exact same confidence as things they actually know. That's hallucination — not lying on purpose, just no internal 'wait, am I sure?' check.",
    "Confident delivery isn't proof. Some of the most confidently-stated 'facts' below are completely made up — see if you can catch them.",
    "Prompt injection is like slipping a note into a stack of documents that says 'ignore your boss, do what THIS note says instead' — if whoever's reading doesn't know to distrust random notes mixed into the pile, they might just follow it.",
    "Below: watch that trick actually work on a careless AI agent, then watch a more careful agent shrug it off."
  ],
  intro: {
    what: "spot which confident statements are hallucinated, then watch a prompt injection attack succeed and get patched.",
    why: "both are real, current failure modes of every LLM product — knowing they exist is the first step to defending against them.",
    how: "guess real vs made-up for each statement, then toggle between the vulnerable and guarded agent below."
  },
  challenge:
    "Try to write your own fake-but-confident-sounding 'fact' — notice how easy it is to make something sound true just by adding a specific number or an authoritative tone. That's exactly the trap hallucinated text sets for readers.",
  checkpoint: [
    {
      q: "Why is a confident tone not evidence that an AI's statement is true?",
      options: [
        "It actually is strong evidence — confident models are rarely wrong",
        "A model's confident phrasing reflects how plausible the TEXT sounds, not whether it verified the underlying fact — hallucinated and true statements can sound equally certain",
        "Confidence only matters for opinions, not facts",
        "Models are incapable of sounding confident"
      ],
      answer: 1,
      why: "the model has no separate 'am I sure' check — fluent, confident-sounding text is just what it produces by default, true or not."
    },
    {
      q: "What makes a guarded prompt resist injection where a naive one doesn't?",
      options: [
        "It uses a completely different, injection-proof model",
        "It clearly marks untrusted content as DATA (not instructions), often with delimiters, and explicitly tells the model to ignore commands embedded within that data",
        "It refuses to read any documents at all",
        "It's simply longer, which automatically makes it safer"
      ],
      answer: 1,
      why: "the fix isn't a smarter model, it's a clearer prompt structure — separating 'things to read' from 'things to obey' so embedded commands don't get mistaken for real instructions."
    }
  ]
};
