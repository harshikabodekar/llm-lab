export const CH6_CONTENT = {
  concept: [
    "Before any of that though, there's a problem: attention treats tokens as a bag, not a sequence — it has no built-in sense of 'first' or 'third'. Feed it 'dog bites man' and 'man bites dog' and, without help, it sees the same 3 tokens either way. The fix: add a small 'position vector' to every token's embedding before anything else happens — literally encoding 'you are token #0', 'you are token #2', right into the numbers.",
    "GPT, Claude, Gemini, Llama — strip away the branding and they're all the same 4 steps, copy-pasted dozens of times: attention, add the result back in, a small feedforward network, add that back in too. That's a transformer block.",
    "'Add the result back in' is called a residual connection — instead of replacing the input, you add the new computation ON TOP of it. This one trick is a big part of why you can stack dozens of these blocks without training collapsing. Without it, every block would completely REPLACE its input with something new — stack enough replacements and the original signal gets diluted into mush a few layers in. Residual connections keep a direct path back to the original input at every block, which is a big part of why you can stack 96 of these and still train the thing successfully.",
    "Because every block outputs the exact same shape it received (same number of tokens, same number of dimensions per token), blocks stack like lego — the output of block 1 slots directly into block 2, no adapter needed.",
    "First, add positional encoding, then put the 4 steps in the right order below. Then stack a few blocks and watch a real (tiny) set of token vectors flow through — shape identical at every stage, values transformed every time."
  ],
  simple: [
    "Imagine an assembly line where every part looks identical once it's on the belt — the station can't tell if a part is first, second, or tenth in line. So before anything else, each part gets a little tag stapled on saying 'I'm part #1', 'I'm part #2'. That tag is positional encoding — without it, 'dog bites man' and 'man bites dog' would arrive at the station looking like the exact same pile of parts.",
    "Think of a transformer block like one station on an assembly line. A part comes in, gets worked on a bit, and comes back out — same size and shape as when it went in, just improved.",
    "Each station does 2 jobs: first it lets the part 'talk' to the other parts nearby (attention), then it runs the part through a small tool that reshapes it a little (feedforward). After each job, the station keeps the ORIGINAL part and just adds the improvement on top — nothing gets thrown away. That keeping-the-original bit is the residual connection. Imagine instead if a station was allowed to just throw away the part it received and hand you something totally new — do that station after station and by the end nobody has any idea what the original part looked like. Residual connections are a rule: 'you're only allowed to ADD your improvement, never replace the original outright' — so a trace of the very first part survives all the way to the last station.",
    "Because every station spits out the exact same shape and size it took in, you can chain as many stations as you want, one after another — 12 stations, 96 stations, doesn't matter, they all bolt together the same way.",
    "Tag the parts with position first, order the 4 jobs correctly, then watch a tiny part travel through a few stations and see: same shape in, same shape out, different values every time."
  ],
  intro: {
    what: "put the 4 steps of a transformer block in order, then watch real token vectors flow through a stack of them.",
    why: "this exact 4-step block, repeated dozens of times, is the entire architecture behind every major LLM.",
    how: "drag the 4 steps into order, then use the step buttons to watch values flow through the stack."
  },
  challenge:
    "Stack 4 blocks and step through one at a time. Watch the shape label — does it ever change? Now imagine doing this 96 times, the way GPT-3 does. Same trick, just more of it.",
  checkpoint: [
    {
      q: "What's a residual connection, in one line?",
      options: [
        "A backup copy of the model saved to disk",
        "Adding a block's output on top of its input, instead of replacing the input",
        "A connection between two different neural networks",
        "The leftover error after training finishes"
      ],
      answer: 1,
      why: "residual = input + (whatever the block computed) — the original signal always survives, the block just adds a correction on top."
    },
    {
      q: "Why does it matter that every transformer block outputs the exact same shape it received?",
      options: [
        "It doesn't matter, shape is irrelevant",
        "It makes the model file smaller",
        "It lets you stack an arbitrary number of blocks back-to-back with no extra adapters in between",
        "It's required by JavaScript, not by the math"
      ],
      answer: 2,
      why: "same shape in, same shape out means block 2 can eat block 1's output directly — that's what lets you go from 1 block to 96 by just copy-pasting."
    }
  ]
};
