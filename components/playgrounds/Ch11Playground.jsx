"use client";

import { useState } from "react";
import StartHere from "../StartHere";

const ROUNDS = [
  {
    prompt: "explain what a for loop does",
    A: { text: "A for loop is a fundamental programming construct used across nearly all languages to repeat a block of code a specific number of times, typically iterating over a range, list, or collection, executing the enclosed statements once per item until the sequence is exhausted.", trait: "verbose" },
    B: { text: "A for loop repeats a block of code a set number of times.", trait: "concise" }
  },
  {
    prompt: "will it rain tomorrow?",
    A: { text: "It's hard to say for certain — weather can be unpredictable, and there's possibly some chance depending on various factors, though I really can't be fully sure without more specific data.", trait: "hedging" },
    B: { text: "Based on the forecast, yes — expect rain in the afternoon.", trait: "confident" }
  },
  {
    prompt: "can you review my code?",
    A: { text: "I would be pleased to conduct a thorough review of your source code at your earliest convenience.", trait: "formal" },
    B: { text: "Yep, send it over, I'll take a look.", trait: "casual" }
  },
  {
    prompt: "what should I pack for a hiking trip?",
    A: { text: "You should think about bringing water, some snacks, a first aid kit, proper shoes, and maybe a map depending on where you're going and how long the trip will be.", trait: "prose" },
    B: { text: "- Water\n- Snacks\n- First aid kit\n- Proper shoes\n- Map", trait: "structured" }
  },
  {
    prompt: "help me write an email",
    A: { text: "Sure — who's it to, and what's the goal of the email?", trait: "clarifying" },
    B: { text: "Here's a draft: 'Dear [Name], I hope this email finds you well...'", trait: "assumes-and-answers" }
  },
  {
    prompt: "I don't understand recursion",
    A: { text: "I'm so sorry this is confusing! Recursion can definitely be a tricky topic and lots of people struggle with it at first, don't worry too much.", trait: "apologetic" },
    B: { text: "Recursion is a function calling itself until it hits a base case. Example: factorial(n) = n * factorial(n-1), down to factorial(0) = 1.", trait: "matter-of-fact" }
  }
];

export default function Ch11Playground() {
  const [round, setRound] = useState(0);
  const [picks, setPicks] = useState([]);

  const done = round >= ROUNDS.length;

  function choose(side) {
    const chosen = ROUNDS[round][side];
    setPicks((p) => [...p, { prompt: ROUNDS[round].prompt, trait: chosen.trait }]);
    setRound((r) => r + 1);
  }

  function restart() {
    setRound(0);
    setPicks([]);
  }

  return (
    <div className="sheet p-5">
      <StartHere>read each pair, click whichever response you prefer — 6 rounds total.</StartHere>

      {!done ? (
        <>
          <p className="margin-note mb-4">
            round {round + 1} / {ROUNDS.length} — "{ROUNDS[round].prompt}"
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button onClick={() => choose("A")} className="sheet-flat bg-white p-3 text-left transition-transform hover:-translate-y-0.5">
              <p className="mb-1 font-mono text-xs text-inkblue">response A</p>
              <p className="whitespace-pre-wrap font-mono text-xs">{ROUNDS[round].A.text}</p>
            </button>
            <button onClick={() => choose("B")} className="sheet-flat bg-white p-3 text-left transition-transform hover:-translate-y-0.5">
              <p className="mb-1 font-mono text-xs text-inkblue">response B</p>
              <p className="whitespace-pre-wrap font-mono text-xs">{ROUNDS[round].B.text}</p>
            </button>
          </div>
        </>
      ) : (
        <div>
          <p className="mb-3 font-mono text-sm font-bold text-signal">✓ your reward model, revealed:</p>
          <div className="flex flex-col gap-2">
            {picks.map((p, i) => (
              <div key={i} className="sheet-flat flex items-center justify-between bg-white px-3 py-2">
                <span className="font-mono text-xs text-faded">"{p.prompt}"</span>
                <span className="border-[1.5px] border-ink bg-marker px-2 py-0.5 font-mono text-xs">{p.trait}</span>
              </div>
            ))}
          </div>
          <p className="margin-note mt-4">
            if a real reward model were trained on thousands of raters who picked the way you just did, it would
            learn to nudge the underlying LLM toward exactly these traits — that's RLHF, at scale.
          </p>
          <button onClick={restart} className="btn-paper mt-3 px-4 py-2 font-mono text-xs">
            restart
          </button>
        </div>
      )}
    </div>
  );
}
