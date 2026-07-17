"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StartHere from "../StartHere";
import { getChecked, toggleChecked } from "../../lib/progress";

const PROJECTS = [
  {
    id: "rag",
    title: "RAG chatbot over your own docs",
    desc: "point a real retrieval pipeline at something you actually care about — a resume, class notes, a manual.",
    steps: [
      { text: "pick a real document you care about", ch: "ch15" },
      { text: "chunk it with overlap — write your chunking function", ch: "ch15" },
      { text: "embed the chunks", ch: "ch15" },
      { text: "build the similarity search", ch: "ch16" },
      { text: "assemble the retrieval-augmented prompt", ch: "ch15" },
      { text: "wire up a real Gemini call for the final answer", ch: "ch13" },
      { text: "test with 5 real questions, note when retrieval fails", ch: "ch19" }
    ]
  },
  {
    id: "agent",
    title: "An agent with custom tools",
    desc: "design and build an agent loop with tools beyond the calculator/search/notepad you already saw.",
    steps: [
      { text: "design 2-3 tools your agent needs", ch: "ch17" },
      { text: "write the tool-picker logic", ch: "ch17" },
      { text: "write the structured JSON contract for each tool", ch: "ch17" },
      { text: "build the think → tool → observe loop", ch: "ch17" },
      { text: "add guardrails against prompt injection in tool outputs", ch: "ch19" },
      { text: "test with a request that needs 2+ tools in sequence", ch: "ch17" }
    ]
  },
  {
    id: "decision",
    title: "Finetune-vs-RAG decision writeup",
    desc: "pick a real (or hypothetical) use case and make — and justify — the call.",
    steps: [
      { text: "pick a real or hypothetical use case", ch: "ch18" },
      { text: "run it through the decision tree — facts vs behavior?", ch: "ch18" },
      { text: "estimate the parameter/cost tradeoff for a LoRA route", ch: "ch21" },
      { text: "write up which approach you'd recommend and why", ch: "ch18" },
      { text: "note what an eval suite would need to verify before shipping", ch: "ch20" }
    ]
  }
];

export default function Ch22Playground() {
  const [selected, setSelected] = useState("rag");
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    setChecked(getChecked(`capstone-${selected}`));
  }, [selected]);

  function toggle(i) {
    setChecked(toggleChecked(`capstone-${selected}`, i));
  }

  const project = PROJECTS.find((p) => p.id === selected);
  const doneCount = checked.length;

  return (
    <div className="sheet p-5">
      <StartHere>pick a project card, then check off steps as you complete or plan them.</StartHere>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PROJECTS.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            className={`sheet-flat p-3 text-left ${selected === p.id ? "border-inkblue bg-inkblue/5" : "bg-white"}`}
          >
            <p className="mb-1 font-mono text-xs font-bold">{p.title}</p>
            <p className="font-mono text-[0.65rem] text-faded">{p.desc}</p>
          </button>
        ))}
      </div>

      <p className="margin-note mb-3">
        {project.title} — {doneCount} / {project.steps.length} steps checked
      </p>

      <div className="flex flex-col gap-2">
        {project.steps.map((s, i) => {
          const isChecked = checked.includes(i);
          return (
            <label key={i} className="sheet-flat flex items-center gap-3 bg-white px-3 py-2">
              <input type="checkbox" checked={isChecked} onChange={() => toggle(i)} className="h-4 w-4" />
              <span className={`flex-1 font-mono text-sm ${isChecked ? "text-faded line-through" : ""}`}>{s.text}</span>
              <Link href={`/chapter/${s.ch}`} className="shrink-0 font-mono text-xs text-inkblue underline">
                {s.ch} →
              </Link>
            </label>
          );
        })}
      </div>
    </div>
  );
}
