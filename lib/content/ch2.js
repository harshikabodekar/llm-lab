export const CH2_CONTENT = {
  concept: [
    "Tokenization is the very first thing that happens to your text — before attention, before any layer of the network, before anything. Get this step wrong and everything downstream inherits the mistake.",
    "The dumbest tokenizer just splits on spaces: `\"hi there\".split()` → `[\"hi\", \"there\"]`. Works fine until punctuation shows up, or a word the tokenizer has never seen before does.",
    "Real tokenizers keep a fixed vocabulary of known chunks and greedily match the longest one they can find at each position — exactly what ch1's playground did in JavaScript. Now you'll write that same logic yourself, in real Python.",
    "The interesting part isn't matching known words. It's what happens when a word ISN'T in the vocabulary — that's where 'strawberry' gets shredded into pieces."
  ],
  simple: [
    "Imagine trying to swallow a whole roti in one bite. You can't — so you tear it into smaller pieces first, then eat piece by piece. Text has the same problem: a computer can't 'swallow' a whole sentence at once, so it tears it into small pieces first. That tearing is called tokenization, and each piece is a token (one chunk of text).",
    "The easy way to tear it: rip along the spaces, one word per piece. Fine for plain words — but a word like 'strawberry', or a name the model's never seen, might be too big or oddly shaped, so it needs tearing into even smaller bits, sometimes down to single letters.",
    "A real tokenizer keeps a list of 'pieces it already knows how to tear' (its vocabulary) and always tears off the biggest known piece it can, working left to right — like tearing off the biggest bite-size chunk of roti you can manage each time, instead of shredding the whole thing into confetti.",
    "Below, you'll write that tearing logic yourself — in real code this time, not just watching it happen."
  ],
  intro: {
    what: "build a tokenizer from scratch, in two steps.",
    why: "you'll never look at 'AI is just autocomplete' the same way once you've written the chopping logic yourself.",
    how: "run the warm-up cell, then write the real tokenizer below it."
  },
  challenge:
    "Run the tokenizer below on a word that's fully in the vocab, then on one that isn't. Watch the unknown word get chopped into single characters — that fallback is exactly why models sometimes 'miscount' letters. They're not looking at letters, they're looking at whatever chunks survived matching.",
  checkpoint: [
    {
      q: "A greedy tokenizer scans a word and matches the longest known chunk it can find first. Why longest, not shortest?",
      options: [
        "Longest chunks are always more common in training data",
        "It keeps the token count low and preserves whole known words instead of shredding them early",
        "Python's string functions only support longest-match",
        "It doesn't matter, the order is arbitrary"
      ],
      answer: 1,
      why: "grabbing the longest match first means a known word like 'the' stays whole instead of being split into 't' + 'he' by accident."
    },
    {
      q: "What happens when a tokenizer hits a chunk of text that matches nothing in its vocabulary?",
      options: [
        "The program crashes",
        "It skips that part of the text entirely",
        "It falls back to single characters, one token each",
        "It rounds to the nearest known word"
      ],
      answer: 2,
      why: "single characters are the fallback of last resort — every tokenizer vocabulary includes the individual letters, so nothing is ever truly un-tokenizable."
    }
  ]
};
