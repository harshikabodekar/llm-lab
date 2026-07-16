"use client";

import { useEffect, useRef, useState } from "react";
import CodeCell from "../CodeCell";
import StartHere from "../StartHere";
import { buildVocab, buildNet, trainBatch, generateSample, MAX_TEXT_LEN, CONTEXT_LEN } from "../../lib/charmodel";

const DEFAULT_TEXT =
  "claude is a language model. claude predicts the next token, one token at a time. claude learns patterns from text during training. training means predict, measure loss, backprop, nudge weights, repeat. the more claude trains, the better claude predicts. tokens become numbers, numbers become predictions, predictions become text.";

const LR = 0.5;
const BATCH_SIZE = 25;
const TICK_MS = 120;
const MAX_STEPS = 4000;
const SAMPLE_EVERY_N_TICKS = 4;
const SAMPLE_LEN = 70;

function LossSparkline({ history }) {
  if (history.length < 2) {
    return (
      <div className="flex h-24 items-center justify-center border-[1.5px] border-ink bg-paper font-mono text-xs text-faded">
        loss curve appears once training starts
      </div>
    );
  }
  const w = 400;
  const h = 100;
  const pad = 8;
  const minL = Math.min(...history);
  const maxL = Math.max(...history);
  const range = maxL - minL || 1;
  const points = history
    .map((v, i) => {
      const px = pad + (i / (history.length - 1)) * (w - pad * 2);
      const py = h - pad - ((v - minL) / range) * (h - pad * 2);
      return `${px.toFixed(1)},${py.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full border-[1.5px] border-ink bg-paper">
      <polyline points={points} fill="none" stroke="#2B4FD8" strokeWidth="1.5" />
    </svg>
  );
}

function LiveTrainer() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [running, setRunning] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [lossHistory, setLossHistory] = useState([]);
  const [sample, setSample] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [status, setStatus] = useState(null);

  const netRef = useRef(null);
  const vocabRef = useRef(null);
  const intervalRef = useRef(null);
  const stepRef = useRef(0);
  const tickRef = useRef(0);
  const temperatureRef = useRef(temperature);

  useEffect(() => {
    temperatureRef.current = temperature;
  }, [temperature]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const cappedText = text.slice(0, MAX_TEXT_LEN);
  const tooShort = cappedText.trim().length < 20;

  function stop() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
  }

  function reset() {
    stop();
    netRef.current = null;
    vocabRef.current = null;
    stepRef.current = 0;
    tickRef.current = 0;
    setStepCount(0);
    setLossHistory([]);
    setSample("");
    setStatus(null);
  }

  function train() {
    if (running || tooShort) return;
    if (!netRef.current) {
      const vocab = buildVocab(cappedText);
      vocabRef.current = vocab;
      netRef.current = buildNet(vocab.chars.length);
    }
    setStatus(null);
    setRunning(true);
    intervalRef.current = setInterval(() => {
      const { chars, charToIdx } = vocabRef.current;
      const loss = trainBatch(netRef.current, cappedText, charToIdx, chars.length, LR, BATCH_SIZE);
      stepRef.current += BATCH_SIZE;
      tickRef.current += 1;
      setStepCount(stepRef.current);
      setLossHistory((h) => [...h.slice(-149), loss]);

      if (tickRef.current % SAMPLE_EVERY_N_TICKS === 0) {
        const startPos = Math.floor(Math.random() * Math.max(1, cappedText.length - CONTEXT_LEN));
        const seed = cappedText.slice(startPos, startPos + CONTEXT_LEN) || " ";
        setSample(generateSample(netRef.current, seed, charToIdx, chars, SAMPLE_LEN, temperatureRef.current));
      }

      if (stepRef.current >= MAX_STEPS) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setRunning(false);
        setStatus("maxsteps");
      }
    }, TICK_MS);
  }

  return (
    <div className="sheet p-5">
      <StartHere>paste your own text (or keep the default), hit train, and watch the loss curve move.</StartHere>

      <label className="font-mono text-xs text-faded">
        training text {text.length > MAX_TEXT_LEN && `(first ${MAX_TEXT_LEN} characters used)`}
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={running}
        rows={4}
        spellCheck={false}
        className="mt-2 w-full border-[1.5px] border-ink bg-paper p-3 font-mono text-sm focus:outline-none disabled:opacity-60"
      />
      {tooShort && <p className="mt-1 font-mono text-xs text-alarm">paste at least a short paragraph to train on.</p>}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={running ? stop : train}
          disabled={tooShort}
          className="btn-ink px-4 py-2 font-mono text-xs disabled:opacity-50"
        >
          {running ? "■ stop" : "▶ train"}
        </button>
        <button onClick={reset} className="btn-paper px-4 py-2 font-mono text-xs">
          reset
        </button>
        <span className="font-mono text-xs text-faded">
          step: <strong className="text-ink">{stepCount}</strong>
          {lossHistory.length > 0 && (
            <>
              {" "}
              · loss: <strong className="text-ink">{lossHistory[lossHistory.length - 1].toFixed(3)}</strong>
            </>
          )}
        </span>
      </div>

      <div className="mt-5">
        <p className="margin-note mb-2">loss curve</p>
        <LossSparkline history={lossHistory} />
      </div>

      <div className="mt-5">
        <label className="block font-mono text-xs text-faded">
          temperature: <strong className="text-ink">{temperature.toFixed(2)}</strong> (higher = more random sampling)
        </label>
        <input
          type="range"
          min={0.2}
          max={1.5}
          step={0.05}
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="mt-1 block w-full"
        />
      </div>

      <div className="mt-4">
        <p className="margin-note mb-2">sample text (generated by the model, live)</p>
        <div className="sheet-flat min-h-[3rem] bg-white p-3 font-mono text-sm leading-relaxed">
          {sample || "…"}
        </div>
      </div>

      {status === "maxsteps" && (
        <p className="mt-4 font-mono text-sm text-signal">
          ✓ hit the {MAX_STEPS}-step cap for this demo. hit reset to train again, or paste different text.
        </p>
      )}
    </div>
  );
}

export default function Ch9Playground() {
  const [unlockedA, setUnlockedA] = useState(false);
  const [unlockedB, setUnlockedB] = useState(false);
  const unlocked = unlockedA && unlockedB;

  return (
    <div className="flex flex-col gap-8">
      <CodeCell
        what="one-hot encode a character index."
        why="this is literally how the trainer below turns each character of your text into numbers the network can multiply."
        how="build a list of zeros the size of the vocab, with a 1 at char_index, press run."
        prompt="given char_index and vocab_size, build the one-hot list. stuck? there's a hint button."
        onPass={() => setUnlockedA(true)}
        layers={{
          hints: {
            starter:
              "vocab_size = 5\nchar_index = 2\n\n# your code here — build a list of `vocab_size` zeros with a 1 at char_index\none_hot = None\nprint(one_hot)",
            hints: [
              "start with a list of `vocab_size` zeros — [0] * vocab_size — then set the item at position char_index to 1.",
              "vocab_size = 5\nchar_index = 2\n\none_hot = [0] * vocab_size\none_hot[___] = ___\nprint(one_hot)",
              "vocab_size = 5\nchar_index = 2\n\none_hot = [0] * vocab_size\none_hot[char_index] = 1\nprint(one_hot)  # -> [0, 0, 1, 0, 0]"
            ]
          }
        }}
        check="[0, 0, 1, 0, 0]"
      />

      <CodeCell
        what="compute cross-entropy loss for a prediction, one more time."
        why="this is the exact loss the trainer below computes, every single step, thousands of times."
        how="use math.log() to compute -log(probs[true_index]), press run."
        prompt="given probs and true_index, compute the loss. same formula as ch7 — you'll need it constantly from here on."
        onPass={() => setUnlockedB(true)}
        layers={{
          hints: {
            starter: "import math\n\nprobs = [0.05, 0.85, 0.1]\ntrue_index = 1\n\nloss = None\nprint(loss)",
            hints: [
              "loss = -math.log(probs[true_index]).",
              "import math\n\nprobs = [0.05, 0.85, 0.1]\ntrue_index = 1\n\nloss = -math.___(probs[___])\nprint(loss)",
              "import math\n\nprobs = [0.05, 0.85, 0.1]\ntrue_index = 1\n\nloss = -math.log(probs[true_index])\nprint(loss)  # -> about 0.163 — small loss, 0.85 was a confident correct guess"
            ]
          }
        }}
        check="0.16"
      />

      {unlocked ? (
        <LiveTrainer />
      ) : (
        <div className="sheet-flat bg-white p-5 text-center">
          <p className="font-mono text-sm text-faded">
            🔒 pass both cells above to unlock the live trainer.
          </p>
        </div>
      )}
    </div>
  );
}
