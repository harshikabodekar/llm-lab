"use client";

import { useEffect, useState } from "react";
import CodeCell from "../CodeCell";
import StartHere from "../StartHere";
import { safeCalculate, searchFacts, makeNotepad, TOOLS_DESCRIPTION } from "../../lib/agentTools";
import { callGemini, hasApiKey } from "../../lib/gemini";

const MAX_STEPS = 6;

function runTool(tool, args, notepad) {
  if (tool === "calculator") {
    const r = safeCalculate(args?.expression ?? "");
    return r.error ? `error: ${r.error}` : String(r.result);
  }
  if (tool === "search") {
    return searchFacts(args?.query ?? "");
  }
  if (tool === "notepad") {
    return args?.action === "read" ? notepad.read() : notepad.write(args?.text ?? "");
  }
  return `unknown tool: ${tool}`;
}

function StepCard({ step }) {
  const ICON = { think: "🤔", tool: "🔧", observe: "👀", final: "✅", error: "✗" };
  const cls = step.type === "error" ? "border-alarm bg-alarm/10" : step.type === "final" ? "border-signal bg-signal/10" : "border-ink/20 bg-white";
  return (
    <div className={`sheet-flat border-[1.5px] p-3 ${cls}`}>
      <p className="mb-1 font-mono text-xs font-bold">
        {ICON[step.type]} {step.type}
      </p>
      {step.type === "tool" ? (
        <p className="font-mono text-xs">
          {step.tool}({JSON.stringify(step.args)})
        </p>
      ) : (
        <p className="whitespace-pre-wrap font-mono text-xs">{step.text}</p>
      )}
    </div>
  );
}

const SCRIPT_REQUEST = "what's 15% of 240, and what does RAG stand for? save both to my notes.";
const SCRIPT = [
  { type: "think", text: "the user wants a calculation, a lookup, and both saved to notes. I'll start with the calculation." },
  { type: "tool", tool: "calculator", args: { expression: "240 * 0.15" } },
  { type: "think", text: "got the number. now look up RAG." },
  { type: "tool", tool: "search", args: { query: "RAG" } },
  { type: "think", text: "I have both pieces — save them to the notepad." },
  { type: "tool", tool: "notepad", args: { action: "write", text: "__DYNAMIC__" } },
  { type: "final", text: "__DYNAMIC__" }
];

function ScriptedAgent() {
  const [notepad] = useState(() => makeNotepad());
  const [steps, setSteps] = useState([]);
  const [scriptIndex, setScriptIndex] = useState(0);
  const [results, setResults] = useState({});

  // scriptIndex tracks position in SCRIPT separately from steps.length, because
  // a single "tool" script entry renders as TWO cards (the call + its observation)
  function nextStep() {
    if (scriptIndex >= SCRIPT.length) return;
    const raw = SCRIPT[scriptIndex];
    setScriptIndex((i) => i + 1);

    if (raw.type === "tool") {
      const args =
        raw.tool === "notepad" && raw.args.text === "__DYNAMIC__"
          ? { ...raw.args, text: `15% of 240 = ${results.calc}. RAG = ${results.search}.` }
          : raw.args;
      const step = { ...raw, args };
      const observation = runTool(step.tool, step.args, notepad);
      if (step.tool === "calculator") setResults((r) => ({ ...r, calc: observation }));
      if (step.tool === "search") setResults((r) => ({ ...r, search: observation }));
      setSteps((s) => [...s, step, { type: "observe", text: observation }]);
      return;
    }

    if (raw.type === "final" && raw.text === "__DYNAMIC__") {
      setSteps((s) => [
        ...s,
        { ...raw, text: `15% of 240 is ${results.calc}. Also: ${results.search} Both saved to your notepad.` }
      ]);
      return;
    }

    setSteps((s) => [...s, raw]);
  }

  function reset() {
    setSteps([]);
    setScriptIndex(0);
    setResults({});
  }

  return (
    <div className="sheet-flat bg-white p-4">
      <p className="mb-2 font-mono text-xs text-inkblue">scripted replay (no Gemini key needed)</p>
      <p className="mb-3 font-mono text-sm">"{SCRIPT_REQUEST}"</p>
      <div className="flex flex-col gap-2">
        {steps.map((s, i) => (
          <StepCard key={i} step={s} />
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={nextStep} disabled={scriptIndex >= SCRIPT.length} className="btn-ink px-3 py-1.5 font-mono text-xs disabled:opacity-50">
          {scriptIndex >= SCRIPT.length ? "done" : "▶ next step"}
        </button>
        <button onClick={reset} className="btn-paper px-3 py-1.5 font-mono text-xs">
          restart
        </button>
      </div>
    </div>
  );
}

function LiveAgent() {
  const [request, setRequest] = useState(SCRIPT_REQUEST);
  const [steps, setSteps] = useState([]);
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    setSteps([]);
    const notepad = makeNotepad();
    let transcript = `User request: ${request}\n\n`;

    for (let i = 0; i < MAX_STEPS; i++) {
      const prompt = `${TOOLS_DESCRIPTION}\n\n${transcript}\nWhat do you do next? Respond with JSON only.`;
      const res = await callGemini(prompt);
      if (!res.ok) {
        setSteps((s) => [...s, { type: "error", text: res.message }]);
        break;
      }
      let parsed;
      try {
        const cleaned = res.text.trim().replace(/^```json\s*/i, "").replace(/```$/, "");
        parsed = JSON.parse(cleaned);
      } catch {
        setSteps((s) => [...s, { type: "error", text: `couldn't parse model response as JSON: ${res.text.slice(0, 200)}` }]);
        break;
      }
      setSteps((s) => [...s, { type: "think", text: parsed.thought }]);
      transcript += `Thought: ${parsed.thought}\n`;

      if (parsed.final_answer) {
        setSteps((s) => [...s, { type: "final", text: parsed.final_answer }]);
        break;
      }
      setSteps((s) => [...s, { type: "tool", tool: parsed.tool, args: parsed.args }]);
      const observation = runTool(parsed.tool, parsed.args, notepad);
      setSteps((s) => [...s, { type: "observe", text: observation }]);
      transcript += `Tool: ${parsed.tool}(${JSON.stringify(parsed.args)})\nObservation: ${observation}\n\n`;

      if (i === MAX_STEPS - 1) {
        setSteps((s) => [...s, { type: "error", text: "hit the step limit without a final answer." }]);
      }
    }
    setRunning(false);
  }

  return (
    <div className="sheet-flat bg-white p-4">
      <p className="mb-2 font-mono text-xs text-inkblue">live agent (Gemini drives the loop)</p>
      <input
        value={request}
        onChange={(e) => setRequest(e.target.value)}
        disabled={running}
        className="mb-2 w-full border-[1.5px] border-ink bg-paper px-3 py-2 font-mono text-xs focus:outline-none disabled:opacity-60"
      />
      <button onClick={run} disabled={running} className="btn-ink px-3 py-1.5 font-mono text-xs disabled:opacity-50">
        {running ? "thinking…" : "▶ run live"}
      </button>
      <div className="mt-3 flex flex-col gap-2">
        {steps.map((s, i) => (
          <StepCard key={i} step={s} />
        ))}
      </div>
    </div>
  );
}

export default function Ch17Playground() {
  const [keyPresent, setKeyPresent] = useState(false);

  useEffect(() => {
    setKeyPresent(hasApiKey());
    const refresh = () => setKeyPresent(hasApiKey());
    window.addEventListener("gemini-key-updated", refresh);
    return () => window.removeEventListener("gemini-key-updated", refresh);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="sheet p-5">
        <StartHere>
          {keyPresent ? "type a request and run the live agent." : "step through the scripted replay — or add a gemini key via ⚙ to drive it live."}
        </StartHere>

        {keyPresent ? <LiveAgent /> : <ScriptedAgent />}

        {!keyPresent && (
          <p className="margin-note mt-4">
            no Gemini key set, so this is a fixed script — but every step actually runs the real local tools
            (the calculator genuinely computes 240 × 0.15, the search genuinely looks up "RAG"). add a key via the
            ⚙ icon to let a real model drive the loop instead.
          </p>
        )}
      </div>

      <div>
        <p className="margin-note mb-3 uppercase tracking-wide">bonus · the structured tool-calling contract</p>
        <div className="sheet-flat bg-white p-4">
          <p className="mb-2 font-mono text-xs text-faded">how a real API describes a tool:</p>
          <pre className="mb-4 overflow-x-auto border-[1.5px] border-ink/20 bg-paper p-3 font-mono text-[0.65rem]">
{`{
  "name": "calculator",
  "description": "Evaluates a basic arithmetic expression.",
  "parameters": {
    "type": "object",
    "properties": {
      "expression": { "type": "string" }
    },
    "required": ["expression"]
  }
}`}
          </pre>
          <p className="mb-2 font-mono text-xs text-faded">how the model asks to call it:</p>
          <pre className="overflow-x-auto border-[1.5px] border-ink/20 bg-paper p-3 font-mono text-[0.65rem]">
{`{
  "tool_calls": [
    {
      "name": "calculator",
      "arguments": { "expression": "240 * 0.15" }
    }
  ]
}`}
          </pre>
        </div>
      </div>

      <CodeCell
        what="write the tool-picker if/else logic in python."
        why="this exact decision — which tool does this request need? — is what the JSON contract above formalizes for real APIs."
        how="check for math trigger words first, then lookup words, and fall back to notepad."
        prompt="finish pick_tool() so it returns 'calculator', 'search', or 'notepad' for each request. stuck? there's a hint button."
        predict={{
          question: "what should pick_tool(\"what's 12 times 8?\") return?",
          options: ["calculator", "search", "notepad"],
          answerIndex: 0
        }}
        layers={{
          hints: {
            starter:
              'def pick_tool(request):\n    request = request.lower()\n    # your code here — return "calculator", "search", or "notepad"\n    return None\n\nprint(pick_tool("what\'s 12 times 8?"))\nprint(pick_tool("look up what RAG means"))\nprint(pick_tool("save this note for later"))',
            hints: [
              "check for math trigger words first ('times', 'plus', 'calculate', digits/operators), then lookup words ('look up', 'what is', 'search'), and fall back to notepad for anything else.",
              'def pick_tool(request):\n    request = request.lower()\n    if any(w in request for w in [___]):\n        return "calculator"\n    elif any(w in request for w in [___]):\n        return "search"\n    else:\n        return "notepad"',
              'def pick_tool(request):\n    request = request.lower()\n    if any(w in request for w in ["times", "plus", "minus", "divided", "calculate"]):\n        return "calculator"\n    elif any(w in request for w in ["look up", "what is", "search", "find out"]):\n        return "search"\n    else:\n        return "notepad"\n\nprint(pick_tool("what\'s 12 times 8?"))\nprint(pick_tool("look up what RAG means"))\nprint(pick_tool("save this note for later"))  # -> calculator, search, notepad'
            ]
          }
        }}
        check={(output) => output.includes("calculator") && output.includes("search") && output.includes("notepad")}
      />
    </div>
  );
}
