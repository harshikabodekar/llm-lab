"use client";

import { useState } from "react";
import StartHere from "../StartHere";
import PredictBlock from "../Predict";

/* hand-authored side-by-side completions — there's no small local model to
   actually run base-vs-chat behavior live, so these are curated, honest
   examples of a real, well-documented phenomenon, clearly labeled as such. */

const PROMPTS = [
  {
    prompt: "The capital of France is",
    base: "The capital of France is Paris, which is also the capital of the Île-de-France region, located on the Seine river. Paris was founded around the 3rd century BC by a Celtic tribe called the Parisii, who gave the city its name. The metropolitan area is one of the largest in Europe, and the city is divided into 20 administrative districts called arrondissements, each with its own—",
    chat: "Paris."
  },
  {
    prompt: "Write me a short poem about the ocean",
    base: "Write me a short poem about the ocean and I'll write one about mountains next, and here are some other topics people often request: sunsets, forests, rain. If you're looking for professionally written poems, try these collections: 1. 'Sea Fever' by John Masefield 2. 'Dover Beach' by Matthew Arnold 3.—",
    chat: "Endless blue, a restless breath,\nwaves that argue with the shore —\nsalt and silence, life and death,\nthe sea keeps count forevermore."
  },
  {
    prompt: "How do I fix a flat tire?",
    base: "How do I fix a flat tire? is one of the most searched car maintenance questions online, along with how to jump start a car, how to check tire pressure, and how to change engine oil. Related searches: flat tire repair cost, tire plug kit reviews, run-flat tires vs regular tires, nearest tire shop—",
    chat: "1. Turn on hazard lights and park somewhere flat and safe.\n2. Loosen the lug nuts before jacking up the car.\n3. Jack up the car and remove the flat tire.\n4. Mount the spare and hand-tighten the lug nuts.\n5. Lower the car and fully tighten the lug nuts in a star pattern."
  },
  {
    prompt: "I'm feeling really stressed about my exam tomorrow",
    base: "I'm feeling really stressed about my exam tomorrow, wrote user_tired_22 on the forum. Reply #1 from studybuddy99: same here honestly. Reply #2 from anon: try coffee lol. Thread views: 1,204. Related threads: 'exam anxiety tips', 'how many hours should I study'—",
    chat: "That's really common the night before a big exam. Try this: do one focused review pass (not a full re-read), get real sleep, and remind yourself that cramming more tonight rarely beats being rested tomorrow. You've got this."
  }
];

export default function Ch10Playground() {
  const [idx, setIdx] = useState(0);
  const [predicted, setPredicted] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const current = PROMPTS[idx];

  function pick(i) {
    setIdx(i);
    setPredicted(null);
    setRevealed(false);
  }

  function reveal() {
    if (predicted === null) return;
    setRevealed(true);
  }

  return (
    <div className="sheet p-5">
      <StartHere>pick a prompt, predict, then read both completions.</StartHere>

      <div className="mb-4 flex flex-wrap gap-2">
        {PROMPTS.map((p, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            className={`px-3 py-1.5 font-mono text-xs ${idx === i ? "btn-ink" : "btn-paper"}`}
          >
            prompt {i + 1}
          </button>
        ))}
      </div>

      <p className="margin-note mb-4">"{current.prompt}"</p>

      <PredictBlock
        predict={{
          question: "will the BASE model actually answer the question, or continue the text in a weird direction?",
          options: ["actually answer it directly", "continue in a weird direction, ignoring the question"],
          answerIndex: 1
        }}
        picked={predicted}
        onPick={setPredicted}
        revealed={revealed}
      />

      <button onClick={reveal} disabled={predicted === null} className="btn-ink mt-2 px-4 py-2 font-mono text-xs disabled:opacity-50">
        ▶ reveal both completions
      </button>

      {revealed && (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sheet-flat border-alarm bg-alarm/5 p-3">
            <p className="mb-1 font-mono text-xs font-bold text-alarm">base model (pretrained only)</p>
            <p className="whitespace-pre-wrap font-mono text-xs">{current.base}</p>
          </div>
          <div className="sheet-flat border-signal bg-signal/5 p-3">
            <p className="mb-1 font-mono text-xs font-bold text-signal">chat model (finetuned)</p>
            <p className="whitespace-pre-wrap font-mono text-xs">{current.chat}</p>
          </div>
        </div>
      )}
    </div>
  );
}
