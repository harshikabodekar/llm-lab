export const CH3_CONTENT = {
  concept: [
    "Tokens get ID numbers, sure — but IDs alone don't carry meaning. Token 50257 isn't 'more related' to 50258 just because they're neighbors in a list. Embeddings are the fix.",
    "An embedding turns a token's ID into a point in space — usually hundreds of dimensions, but the idea is identical in 2: similar meaning, nearby points. 'Dog' and 'wolf' end up close together. 'Dog' and 'orange' don't.",
    "This is where the famous trick comes from: king − man + woman ≈ queen. Not because a computer 'understands' royalty — because the direction from 'man' to 'woman' and the direction from 'king' to 'queen' point roughly the same way in the space. Subtract, add, land near the answer.",
    "Drag the points below and watch what 'wrong' looks like. Then hit the arithmetic demo and watch the math find queen anyway — unless you've dragged things too far."
  ],
  simple: [
    "Imagine every word has a home address on a giant map. Words that mean similar things live in the same neighborhood. 'King' and 'queen' are next-door neighbors. 'King' and 'samosa' live in completely different cities — nothing in common, nothing nearby.",
    "This address is called an embedding (a word turned into a position, made of numbers) — real ones use hundreds of directions to walk in, not just 2 like our map below, but the idea is identical: close together means similar meaning.",
    "Here's the fun part. Walking from 'man's house' to 'woman's house' takes you, say, 2 blocks east and 1 block north. Walk that exact same path starting from 'king's house' — 2 blocks east, 1 block north — and you land right next to 'queen's house'. That's not magic, that's just: king minus man plus woman equals queen, in walking directions instead of words.",
    "Drag the houses around below and mess up the neighborhoods on purpose. Then try the walking-directions trick again — move things too far and it won't find queen's house anymore. Meaning is just position, so wrong positions mean wrong meaning."
  ],
  challenge:
    "Drag 'apple' out of the fruit cluster and into the royalty cluster. Run the king − man + woman demo again — does it still land near queen, or does it now land near your misplaced apple? Meaning lives entirely in position. Wreck the positions, and you wreck the meaning — that's the whole reason training an embedding space carefully matters.",
  checkpoint: [
    {
      q: "What does the DISTANCE between two embedding points represent?",
      options: [
        "How often the two words appear in the same sentence",
        "How different the words' meanings are — close = similar, far = unrelated",
        "The order the words were added to the vocabulary",
        "Nothing — position is random"
      ],
      answer: 1,
      why: "embeddings are built so that meaning maps to geometry: similar meaning pulls points close together, unrelated meaning pushes them apart."
    },
    {
      q: "In king − man + woman ≈ queen, what is actually being computed?",
      options: [
        "A lookup in a dictionary of royal titles",
        "A random guess constrained to nearby words",
        "Vector arithmetic — subtracting and adding coordinate positions",
        "A vote among all words in the vocabulary"
      ],
      answer: 2,
      why: "it's literal subtraction and addition on the coordinates, then a search for whichever real word ends up closest to the result."
    }
  ]
};
