"use client";

import { useState } from "react";
import { cosineSim } from "../../lib/embedder";
import StartHere from "../StartHere";
import PredictBlock from "../Predict";

const DIM = 16;
const CLUSTERS = 30;

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

// a real (simplified) IVF-style index: vectors get assigned to their nearest
// centroid at build time, and a query only ever searches its own bucket.
function generateDataset(n) {
  const rnd = seeded(42);
  const centroids = Array.from({ length: CLUSTERS }, () => Array.from({ length: DIM }, () => rnd() * 2 - 1));
  const vectors = [];
  const buckets = Array.from({ length: CLUSTERS }, () => []);
  for (let i = 0; i < n; i++) {
    const c = Math.floor(rnd() * CLUSTERS);
    const vec = centroids[c].map((v) => v + (rnd() * 2 - 1) * 0.3);
    vectors.push(vec);
    buckets[c].push(i);
  }
  return { vectors, centroids, buckets };
}

function bruteForceSearch(vectors, query, k = 5) {
  const t0 = performance.now();
  const scored = vectors.map((v, i) => ({ i, score: cosineSim(v, query) }));
  scored.sort((a, b) => b.score - a.score);
  const ms = performance.now() - t0;
  return { top: scored.slice(0, k), ms };
}

function bucketedSearch(dataset, query, k = 5) {
  const t0 = performance.now();
  let bestC = 0;
  let bestSim = -Infinity;
  dataset.centroids.forEach((c, i) => {
    const s = cosineSim(c, query);
    if (s > bestSim) {
      bestSim = s;
      bestC = i;
    }
  });
  const candidates = dataset.buckets[bestC];
  const scored = candidates.map((i) => ({ i, score: cosineSim(dataset.vectors[i], query) }));
  scored.sort((a, b) => b.score - a.score);
  const ms = performance.now() - t0;
  return { top: scored.slice(0, k), ms, bucketSize: candidates.length };
}

export default function Ch16Playground() {
  const [n, setN] = useState(20000);
  const [predicted, setPredicted] = useState(null);
  const [racing, setRacing] = useState(false);
  const [result, setResult] = useState(null);

  async function race() {
    if (predicted === null) return;
    setRacing(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 30));
    const dataset = generateDataset(n);
    const query = dataset.vectors[0].map((v) => v + 0.05);
    const brute = bruteForceSearch(dataset.vectors, query);
    const bucketed = bucketedSearch(dataset, query);
    setResult({ brute, bucketed, n });
    setRacing(false);
  }

  const speedup = result ? (result.brute.ms / Math.max(result.bucketed.ms, 0.001)).toFixed(1) : null;

  return (
    <div className="sheet p-5">
      <StartHere>drag N up to 100,000, predict, then hit race and read the real timings.</StartHere>

      <label className="block font-mono text-xs text-faded">
        N (number of stored vectors): <strong className="text-ink">{n.toLocaleString("en-US")}</strong>
      </label>
      <input
        type="range"
        min={100}
        max={100000}
        step={100}
        value={n}
        onChange={(e) => setN(parseInt(e.target.value, 10))}
        className="mt-1 block w-full"
      />

      <div className="mt-4">
        <PredictBlock
          predict={{
            question: "at this N, will brute force or the bucketed index be faster?",
            options: ["bucketed index", "brute force", "about the same"],
            answerIndex: 0
          }}
          picked={predicted}
          onPick={setPredicted}
          revealed={!!result}
        />
      </div>

      <button onClick={race} disabled={racing || predicted === null} className="btn-ink mt-2 px-4 py-2 font-mono text-xs disabled:opacity-50">
        {racing ? "racing…" : "▶ race"}
      </button>

      {result && (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sheet-flat bg-white p-3">
            <p className="mb-1 font-mono text-xs text-alarm">brute force</p>
            <p className="font-mono text-lg font-bold">{result.brute.ms.toFixed(2)} ms</p>
            <p className="mt-1 font-mono text-[0.65rem] text-faded">checked all {result.n.toLocaleString("en-US")} vectors</p>
          </div>
          <div className="sheet-flat bg-white p-3">
            <p className="mb-1 font-mono text-xs text-signal">bucketed index</p>
            <p className="font-mono text-lg font-bold">{result.bucketed.ms.toFixed(2)} ms</p>
            <p className="mt-1 font-mono text-[0.65rem] text-faded">
              checked {CLUSTERS} centroids + {result.bucketed.bucketSize.toLocaleString("en-US")} vectors in the matching bucket
            </p>
          </div>
        </div>
      )}

      {result && (
        <p className="margin-note mt-4">
          bucketed index was ~{speedup}× faster at N={result.n.toLocaleString("en-US")}. try a small N (like 200) — the gap
          nearly vanishes, because indexing overhead only pays off at scale.
        </p>
      )}
    </div>
  );
}
