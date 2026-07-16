export const CH1_CONTENT = {
  concept: [
    "Here's the secret that sounds too simple to be true: a language model is a machine that looks at some text and guesses what comes next. One token at a time. That's the whole job.",
    "\"The capital of India is ___\" → the model has seen enough text to know \"New\" is very likely, then \"Delhi\". String enough good guesses together and you get essays, code, conversations — everything you've ever seen an AI do.",
    "But before the model can guess anything, text has to become something a machine can compute with. Machines don't read letters — they read numbers. So step zero of every LLM is chopping text into pieces called tokens, and giving each piece an ID number.",
    "Try it yourself below. This is the exact first step your message goes through every single time you talk to Claude or GPT."
  ],
  challenge:
    "Type 'strawberry' in the subword mode below and count the pieces it breaks into. Then type a Hinglish sentence — 'kya scene hai bro' — and notice which words survive whole and which get shredded. Rare words get shredded. That shredding is exactly why models miscount letters in words: they never saw the letters, only the chunks.",
  checkpoint: [
    {
      q: "What does a language model fundamentally do?",
      options: [
        "Understands language like a human brain",
        "Searches a database of correct answers",
        "Predicts the next token, over and over",
        "Follows grammar rules programmed by engineers"
      ],
      answer: 2,
      why: "everything — chat, code, essays — is next-token prediction repeated many times."
    },
    {
      q: "Why does a model struggle to count the r's in 'strawberry'?",
      options: [
        "It's bad at math",
        "It sees token chunks, never individual letters",
        "The word is too long",
        "It was trained before strawberries existed"
      ],
      answer: 1,
      why: "'strawberry' might reach the model as 2-3 chunks like ['str','aw','berry'] — the letters are invisible to it."
    }
  ]
};
