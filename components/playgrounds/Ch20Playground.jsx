"use client";

import { useState } from "react";
import CodeCell from "../CodeCell";
import StartHere from "../StartHere";

function summarizeGood(text) {
  const words = text.split(" ");
  return words.slice(0, 3).join(" ") + "...";
}
function summarizeBroken(text) {
  // the regression: silently drops to 2 words instead of 3
  const words = text.split(" ");
  return words.slice(0, 2).join(" ") + "...";
}

const DEFAULT_TESTS = [
  { input: "the quick brown fox jumps", expected: "the quick brown..." },
  { input: "artificial intelligence is transforming the world", expected: "artificial intelligence is..." },
  { input: "python is a great programming language", expected: "python is a..." }
];

export default function Ch20Playground() {
  const [tests, setTests] = useState(DEFAULT_TESTS);
  const [modelVersion, setModelVersion] = useState("v1");
  const [results, setResults] = useState(null);
  const [newInput, setNewInput] = useState("");
  const [newExpected, setNewExpected] = useState("");

  const model = modelVersion === "v1" ? summarizeGood : summarizeBroken;

  function runSuite() {
    setResults(tests.map((t) => {
      const actual = model(t.input);
      return { ...t, actual, pass: actual === t.expected };
    }));
  }

  function addTest() {
    if (!newInput.trim() || !newExpected.trim()) return;
    setTests((t) => [...t, { input: newInput.trim(), expected: newExpected.trim() }]);
    setNewInput("");
    setNewExpected("");
    setResults(null);
  }

  const passCount = results ? results.filter((r) => r.pass).length : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="sheet p-5">
        <StartHere>run the eval suite, add a test case, then switch model versions and run again.</StartHere>

        <p className="margin-note mb-2">
          the "model": summarize(text) → first 3 words + "..."
        </p>

        <div className="flex flex-col gap-2">
          {tests.map((t, i) => {
            const result = results?.[i];
            return (
              <div key={i} className="sheet-flat bg-white p-3">
                <p className="font-mono text-xs">
                  input: <span className="text-faded">"{t.input}"</span>
                </p>
                <p className="font-mono text-xs">
                  expected: <span className="text-faded">"{t.expected}"</span>
                </p>
                {result && (
                  <p className={`mt-1 font-mono text-xs ${result.pass ? "text-signal" : "text-alarm"}`}>
                    {result.pass ? "✓ pass" : `✗ fail — got "${result.actual}"`}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <input
            value={newInput}
            onChange={(e) => setNewInput(e.target.value)}
            placeholder="new test input…"
            className="min-w-[160px] flex-1 border-[1.5px] border-ink bg-paper px-2 py-1.5 font-mono text-xs focus:outline-none"
          />
          <input
            value={newExpected}
            onChange={(e) => setNewExpected(e.target.value)}
            placeholder="expected output…"
            className="min-w-[160px] flex-1 border-[1.5px] border-ink bg-paper px-2 py-1.5 font-mono text-xs focus:outline-none"
          />
          <button onClick={addTest} className="btn-paper px-3 py-1.5 font-mono text-xs">
            + add test
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-faded">model version:</span>
          <button onClick={() => { setModelVersion("v1"); setResults(null); }} className={`px-3 py-1.5 font-mono text-xs ${modelVersion === "v1" ? "btn-ink" : "btn-paper"}`}>
            v1
          </button>
          <button onClick={() => { setModelVersion("v2"); setResults(null); }} className={`px-3 py-1.5 font-mono text-xs ${modelVersion === "v2" ? "btn-ink" : "btn-paper"}`}>
            v2 (someone changed something)
          </button>
        </div>

        <button onClick={runSuite} className="btn-ink mt-3 px-4 py-2 font-mono text-xs">
          ▶ run eval suite
        </button>

        {results && (
          <p className={`mt-4 font-mono text-sm ${passCount === tests.length ? "text-signal" : "text-alarm"}`}>
            {passCount} / {tests.length} passed
            {passCount < tests.length && modelVersion === "v2" && " — regression caught. someone shipped a bug and your eval suite found it."}
          </p>
        )}
      </div>

      <CodeCell
        what="write an assert-based eval in python."
        why="this exact pattern — assert actual == expected — is the core of every real eval suite, just with more test cases."
        how="call summarize(), compare it to the expected string with assert, print a message if it passes."
        prompt="finish the assert so it checks summarize() gives the right output. stuck? there's a hint button."
        predict={{
          question: "if summarize() has the 2-word regression, will this assert pass or fail?",
          options: ["fail — it'll raise an AssertionError", "pass — asserts always pass"],
          answerIndex: 0
        }}
        layers={{
          hints: {
            starter:
              'def summarize(text, n=3):\n    words = text.split(" ")\n    return " ".join(words[:n]) + "..."\n\n# your code here — assert the output matches what you expect\nassert summarize("the quick brown fox jumps") == "___", "test failed!"\nprint("test passed!")',
            hints: [
              "call summarize() with the same input, and write the EXACT string you expect it to return on the right side of ==.",
              'assert summarize("the quick brown fox jumps") == "___", "test failed!"',
              'def summarize(text, n=3):\n    words = text.split(" ")\n    return " ".join(words[:n]) + "..."\n\nassert summarize("the quick brown fox jumps") == "the quick brown...", "test failed!"\nprint("test passed!")'
            ]
          }
        }}
        check="test passed!"
      />
    </div>
  );
}
