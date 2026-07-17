export const CH13_CONTENT = {
  concept: [
    "Same question, four different prompts, four wildly different answers. The model doesn't change — the way you ask it does all the work.",
    "A bare prompt gets you whatever the model defaults to — usually fine, sometimes rambling, always a bit generic.",
    "A system prompt sets the rules before the question even arrives — 'answer in 2 sentences, no fluff' changes everything downstream.",
    "Few-shot means showing examples of the style you want BEFORE asking your real question — the model pattern-matches your examples, not just your instructions.",
    "Structured output means demanding a specific format (like JSON) back — useful the second you want to feed the answer into more code instead of just reading it."
  ],
  simple: [
    "Imagine walking into a coffee shop and just saying 'coffee.' You'll get something, but it might not be what you wanted. That's a bare prompt.",
    "Now imagine you first tell the barista your exact rules: 'small, oat milk, extra hot, no sugar.' That's a system prompt — rules set BEFORE the order.",
    "Now imagine showing the barista 2 drinks your friends ordered, so they get the vibe of what your group likes, before you even order. That's few-shot — examples instead of instructions.",
    "Structured output is handing the barista a form to fill in instead of just talking to them — 'size: ___, milk: ___' — so you get back something a COMPUTER can read, not just something a human can read.",
    "Same coffee shop, same barista, four totally different orders. That's today's whole lesson."
  ],
  intro: {
    what: "run one question through 4 different prompt styles against a real Gemini model and compare the actual answers.",
    why: "the model doesn't change between these 4 calls — only the prompt does. that's proof prompting technique is real engineering, not vibes.",
    how: "add your free Gemini key via the ⚙ icon (30 seconds), type a question, hit run, read all 4 answers side by side."
  },
  challenge:
    "Ask something with a clear factual answer, then something opinion-based. Notice which prompt style helps most for each — structured output barely matters for opinions, but matters a LOT the moment you want to parse the answer in code.",
  checkpoint: [
    {
      q: "What's the main advantage of few-shot prompting over just writing an instruction?",
      options: [
        "It uses fewer tokens overall",
        "Showing examples lets the model pattern-match your desired style/format directly, which is often more reliable than an instruction alone",
        "It's required by the Gemini API",
        "It makes the model respond faster"
      ],
      answer: 1,
      why: "examples show the model exactly what 'good' looks like — often more reliable than describing it in words, especially for style and format."
    },
    {
      q: "Why would you specifically ask for structured (JSON) output?",
      options: [
        "JSON responses are always more accurate",
        "So the response can be reliably parsed and used by more code downstream, not just read by a human",
        "It's the only format the API supports",
        "To make the model think harder"
      ],
      answer: 1,
      why: "structured output turns a chat reply into a value your program can directly use — the moment you want to DO something with the answer, format matters."
    }
  ]
};
