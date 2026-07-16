export const CH5_CONTENT = {
  concept: [
    "Read this: 'the trophy didn't fit in the suitcase because it was too big.' You instantly know 'it' means the trophy, not the suitcase. How? You quietly checked which nearby word 'it' relates to. That checking process, done by every token for every other token, is attention.",
    "Concretely: each token asks a question ('what am I looking for?') and offers an answer ('here's what I contain') — called a Query and a Key. Multiply a token's Query against every other token's Key, and you get a relevance score per pair.",
    "Turn those scores into percentages (softmax) and you get attention weights — how much each token should 'listen to' every other token. High weight = highly relevant, near zero = ignore.",
    "Below is a real attention weight matrix — computed with actual dot products, not decoration. Click a row to see exactly which words 'it' (or 'she', or 'cat') is paying attention to."
  ],
  simple: [
    "Imagine reading a sentence with a highlighter, and every time you hit a confusing word like 'it', you go back and highlight whichever earlier word explains it. That highlighting — deciding 'this word matters to that word' — is exactly what attention does, just done with math instead of your hand.",
    "Every word gets to ask one question: 'which other words in this sentence matter to me?' Then it highlights them — brighter highlight means more relevant, no highlight means ignore completely.",
    "In 'the trophy didn't fit in the suitcase because it was too big', the word 'it' highlights 'trophy' the brightest. Not because the computer 'understands' trophies — because trophy's and it's number-codes (embeddings) happen to point in a similar direction, and similar direction means 'probably related'.",
    "Click through the sentences below and watch which word each pronoun highlights. That's the entire trick behind how models track 'who is talking about what', sentence after sentence."
  ],
  intro: {
    what: "click a word and see exactly which other words it's paying attention to.",
    why: "this single trick — every token scoring every other token — is what lets models track meaning across a whole sentence.",
    how: "pick a sentence, click a word in the grid, read the highlighted weights below it."
  },
  challenge:
    "Switch sentences. Find which word the pronoun ('it' or 'she') attends to most in each one — then check: does it match what YOU think the pronoun refers to? Real attention, in real trained models, gets this right for the same underlying reason our hand-placed numbers do: related words end up with similar vectors, pointing in similar directions.",
  checkpoint: [
    {
      q: "In plain terms, what are a token's Query and Key?",
      options: [
        "Query = a password, Key = the answer to unlock it",
        "Query = 'what am I looking for', Key = 'here's what I contain' — multiplied to score relevance",
        "Two random numbers with no real meaning",
        "Query is used for training, Key is used only when generating text"
      ],
      answer: 1,
      why: "every token asks a question (query) and every token advertises what it offers (key) — matching the two gives a relevance score for that pair."
    },
    {
      q: "Why turn raw attention scores into a softmax distribution?",
      options: [
        "It makes the numbers bigger so they're easier to see",
        "It's required by every programming language",
        "It converts arbitrary scores into weights between 0 and 1 that sum to 1 — a clean, comparable 'how much attention' per token",
        "It removes the need for a Key vector entirely"
      ],
      answer: 2,
      why: "softmax turns any list of numbers into a proper probability-like distribution, so 'attention weight' actually means something comparable across tokens."
    }
  ]
};
