export const CH17_CONTENT = {
  concept: [
    "An agent is a model wrapped in a loop: think, pick a tool, observe what happened, repeat — until it decides it's done. No new model, no new magic. Same next-token prediction, just given permission to act between guesses.",
    "The 'tools' are just functions — a calculator, a search function, a notepad. The model doesn't run them itself; it asks for one by name (and arguments), your code actually runs it, and the result gets fed back in as new context.",
    "Real APIs (OpenAI, Gemini, Claude) formalize this with a strict JSON contract: you describe each tool's name, description, and expected arguments up front, and the model's 'I want to call a tool' response comes back in a matching structured format — never free text, always parseable JSON.",
    "Below: 3 real local tools (calculator, search, notepad) and an agent loop that actually calls them. With a Gemini key, the model itself drives the loop. Without one, a scripted replay shows you the exact same loop shape."
  ],
  simple: [
    "Imagine a very capable assistant who can't act on their own — they can only THINK OUT LOUD and ask you to hand them a tool. You hand them the calculator, they use it, hand you back a number, and they think about what to do next. Repeat until they're done.",
    "The assistant never touches the tools directly — they just describe what they want ('use the calculator with this expression'), you actually run it, and you report back what happened. That reporting-back is the 'observe' step.",
    "Real companies write this down as a strict form: 'here are the 3 tools you're allowed to ask for, and here's EXACTLY how to ask' — so the assistant's requests are always parseable, never a guessing game.",
    "Below, watch this loop happen for real — either the model driving it live (with a free key), or a scripted walkthrough of the exact same shape (without one)."
  ],
  intro: {
    what: "watch an agent loop through think → tool → observe using 3 real local tools, either live (Gemini) or scripted.",
    why: "'agent' sounds mystical until you see the loop — it's just a model, 3 functions, and a while loop feeding results back in.",
    how: "with a Gemini key: type a request and watch it drive the loop live. without one: step through a scripted example."
  },
  challenge:
    "Ask (or read, in scripted mode) for something that needs 2 different tools in sequence — a calculation AND a lookup. Notice the model has to decide the ORDER itself, and has to correctly read the observation from tool #1 before deciding what tool #2 needs.",
  checkpoint: [
    {
      q: "In an agent loop, who actually executes the tool the model asks for?",
      options: [
        "The model executes it internally, invisibly",
        "Your code executes it — the model only asks for a tool by name and arguments, then reads back whatever your code returns",
        "The tool executes itself automatically without anyone calling it",
        "Tools aren't real functions, they're just text the model imagines"
      ],
      answer: 1,
      why: "the model has zero ability to run code or hit an API on its own — it can only ask, in a structured format, and your application code does the actual work."
    },
    {
      q: "Why do real tool-calling APIs demand strict JSON instead of letting the model just describe what it wants in plain English?",
      options: [
        "JSON is required by law for AI APIs",
        "Plain English is ambiguous and hard to parse reliably; a fixed JSON shape can be parsed the same way every single time",
        "JSON makes the model smarter",
        "It's purely a stylistic preference with no functional reason"
      ],
      answer: 1,
      why: "your code has to parse the model's tool request programmatically, every time, without guessing — a strict schema is what makes that reliable instead of fragile string-matching."
    }
  ]
};
