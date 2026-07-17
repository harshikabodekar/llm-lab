"use client";

import { useMemo, useState } from "react";
import CodeCell from "../CodeCell";
import StartHere from "../StartHere";
import PredictBlock from "../Predict";
import { chunkText, loadEmbedder, projectTo2D, cosineSim } from "../../lib/embedder";
import { callGemini, hasApiKey } from "../../lib/gemini";

const DEFAULT_DOC =
  "Northgate College tuition and fees for the 2026-27 academic year: Undergraduate tuition is ₹185,000 per year for Indian residents and ₹410,000 per year for international students. A one-time admission fee of ₹15,000 applies to all new students. The hostel fee is ₹68,000 per year for a shared room and ₹95,000 per year for a single room, both include 3 meals a day. Students may pay in 2 installments: 60% due at admission, 40% due before the start of the second semester. A late payment fee of ₹2,000 per week applies after the due date. Merit scholarships covering up to 50% of tuition are available for students scoring above the 95th percentile in the entrance exam; applications open every March 1st and close April 15th. The library fee, sports fee, and technology fee are bundled into a mandatory ₹22,000 per year facilities charge, separate from tuition. Students withdrawing before the semester midpoint receive a 50% tuition refund; no refund is issued after the midpoint. International students additionally require a one-time visa processing fee of ₹8,000, payable directly to the international student office, not included in tuition.";

function normalizePositions(points) {
  if (points.length === 0) return [];
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  return points.map(([x, y]) => [
    10 + ((x - minX) / rangeX) * 80,
    10 + ((y - minY) / rangeY) * 80
  ]);
}

export default function Ch15Playground() {
  const [doc, setDoc] = useState(DEFAULT_DOC);
  const [chunkSize, setChunkSize] = useState(150);
  const [overlap, setOverlap] = useState(30);

  const [embedding, setEmbedding] = useState(false);
  const [embedder, setEmbedder] = useState(null); // { label, isReal }
  const [chunkVecs, setChunkVecs] = useState(null); // array parallel to chunks
  const [embeddedForChunks, setEmbeddedForChunks] = useState(null); // chunks array this embedding matches

  const [question, setQuestion] = useState("what's the hostel fee for a single room?");
  const [predicted, setPredicted] = useState(null);
  const [asking, setAsking] = useState(false);
  const [topMatches, setTopMatches] = useState(null); // [{idx, score}]
  const [geminiAnswer, setGeminiAnswer] = useState(null);

  const chunks = useMemo(() => chunkText(doc, chunkSize, overlap), [doc, chunkSize, overlap]);
  const stale = embeddedForChunks !== null && embeddedForChunks.join("|") !== chunks.join("|");

  async function embedChunks() {
    setEmbedding(true);
    setTopMatches(null);
    setGeminiAnswer(null);
    const emb = await loadEmbedder();
    setEmbedder(emb);
    const vecs = [];
    for (const c of chunks) vecs.push(await emb.embed(c));
    setChunkVecs(vecs);
    setEmbeddedForChunks(chunks);
    setEmbedding(false);
  }

  async function ask() {
    if (!chunkVecs || predicted === null) return;
    setAsking(true);
    setGeminiAnswer(null);
    const qVec = await embedder.embed(question);
    const scored = chunkVecs.map((v, i) => ({ idx: i, score: cosineSim(v, qVec) }));
    scored.sort((a, b) => b.score - a.score);
    const top3 = scored.slice(0, 3);
    setTopMatches(top3);

    if (hasApiKey()) {
      const context = top3.map((m) => chunks[m.idx]).join("\n\n---\n\n");
      const prompt = `Answer the question using ONLY the context below. If the context doesn't contain the answer, say so.\n\nContext:\n${context}\n\nQuestion: ${question}`;
      const res = await callGemini(prompt);
      setGeminiAnswer(res);
    }
    setAsking(false);
  }

  const positions2D = useMemo(() => {
    if (!chunkVecs) return [];
    const raw = chunkVecs.map(projectTo2D);
    return normalizePositions(raw);
  }, [chunkVecs]);

  const topIdxs = new Set((topMatches || []).map((m) => m.idx));

  return (
    <div className="flex flex-col gap-8">
      <div className="sheet p-5">
        <StartHere>work top to bottom — paste a document, chunk it, embed it, then ask a question.</StartHere>
        <p className="margin-note mb-2 uppercase tracking-wide">stage 1 · the document</p>
        <textarea
          value={doc}
          onChange={(e) => setDoc(e.target.value)}
          rows={5}
          spellCheck={false}
          className="w-full border-[1.5px] border-ink bg-paper p-3 font-mono text-xs focus:outline-none"
        />
        <p className="mt-1 font-mono text-xs text-faded">{doc.length} characters</p>
      </div>

      <div>
        <p className="margin-note mb-3 uppercase tracking-wide">stage 2 · write the chunker</p>
        <CodeCell
          what="write a fixed-size chunking function with overlap, using string slicing."
          why="this exact function — chop text into overlapping windows — is step one of every RAG pipeline, including the live one below."
          how="slice text[i:i+chunk_size], then advance i by (chunk_size - overlap) each loop."
          prompt="given text, chunk_size, and overlap, return a list of overlapping chunks. stuck? there's a hint button."
          predict={{
            question: "with overlap > 0, will consecutive chunks share any text?",
            options: ["yes — that's the whole point of overlap", "no, chunks are always fully separate"],
            answerIndex: 0
          }}
          layers={{
            hints: {
              starter:
                'text = "the quick brown fox jumps over the lazy dog and keeps running"\nchunk_size = 20\noverlap = 5\n\ndef chunk_text(text, chunk_size, overlap):\n    chunks = []\n    i = 0\n    # your loop here\n    return chunks\n\nprint(chunk_text(text, chunk_size, overlap))',
              hints: [
                "slice text[i : i+chunk_size] to get one chunk, append it, then move i forward by (chunk_size - overlap) so consecutive chunks overlap. stop once i reaches the end of text.",
                'def chunk_text(text, chunk_size, overlap):\n    chunks = []\n    i = 0\n    while i < len(text):\n        chunks.append(text[___:___])\n        if i + chunk_size >= len(text):\n            break\n        i += ___\n    return chunks',
                'def chunk_text(text, chunk_size, overlap):\n    chunks = []\n    i = 0\n    while i < len(text):\n        chunks.append(text[i:i + chunk_size])\n        if i + chunk_size >= len(text):\n            break\n        i += chunk_size - overlap\n    return chunks\n\nprint(chunk_text(text, 20, 5))  # -> [\'the quick brown fox \', ...] — overlapping windows'
              ]
            }
          }}
          check="the quick brown fox"
        />
      </div>

      <div className="sheet p-5">
        <p className="margin-note mb-2 uppercase tracking-wide">chunk-size slider (breaks retrieval on purpose)</p>
        <label className="block font-mono text-xs text-faded">
          chunk size: <strong className="text-ink">{chunkSize} chars</strong> · overlap: <strong className="text-ink">{overlap} chars</strong>
        </label>
        <input type="range" min={20} max={1200} step={10} value={chunkSize} onChange={(e) => setChunkSize(parseInt(e.target.value, 10))} className="mt-1 block w-full" />
        <input type="range" min={0} max={Math.min(100, chunkSize - 10)} step={5} value={overlap} onChange={(e) => setOverlap(parseInt(e.target.value, 10))} className="mt-2 block w-full" />
        <p className="mt-2 font-mono text-xs text-faded">{chunks.length} chunks at this size</p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {chunks.map((c, i) => (
            <div
              key={i}
              className={`sheet-flat bg-white p-2 font-mono text-[0.65rem] leading-relaxed ${
                topIdxs.has(i) ? "border-inkblue bg-inkblue/5" : ""
              }`}
            >
              <span className="text-faded">#{i}</span> {c}
            </div>
          ))}
        </div>
      </div>

      <div className="sheet p-5">
        <p className="margin-note mb-3 uppercase tracking-wide">stage 3 · embed</p>
        <button onClick={embedChunks} disabled={embedding} className="btn-ink px-4 py-2 font-mono text-xs disabled:opacity-50">
          {embedding ? "embedding… (trying transformers.js, ~15s max)" : chunkVecs ? "▶ re-embed chunks" : "▶ embed chunks"}
        </button>
        {embedder && (
          <p className="mt-2 font-mono text-xs text-faded">embedded with: {embedder.label}</p>
        )}
        {stale && <p className="mt-1 font-mono text-xs text-alarm">chunks changed since last embed — re-embed to update the map.</p>}

        {chunkVecs && (
          <div className="relative mt-4 aspect-square w-full max-w-md border-[1.5px] border-ink bg-paper">
            {positions2D.map(([x, y], i) => (
              <div
                key={i}
                title={chunks[i]}
                style={{ left: `${x}%`, top: `${y}%`, background: topIdxs.has(i) ? "#FFD644" : "#BFD7FF" }}
                className="token-chip absolute -translate-x-1/2 -translate-y-1/2 cursor-default"
              >
                #{i}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="margin-note mb-3 uppercase tracking-wide">stage 4 · write cosine similarity</p>
        <CodeCell
          what="write cosine similarity from scratch — dot product over the product of magnitudes."
          why="this is exactly how the pipeline above decides which chunks are 'closest' to your question."
          how="compute the dot product, divide by (magnitude(a) * magnitude(b))."
          prompt="given two vectors, compute their cosine similarity. stuck? there's a hint button."
          predict={{
            question: "if chunk_vec and query_vec point in a very similar direction, will cosine similarity be closer to 0 or closer to 1?",
            options: ["closer to 1", "closer to 0"],
            answerIndex: 0
          }}
          layers={{
            hints: {
              starter:
                "def dot(a, b):\n    return sum(a[i] * b[i] for i in range(len(a)))\n\ndef magnitude(v):\n    return sum(x**2 for x in v) ** 0.5\n\ndef cosine_similarity(a, b):\n    # your code here\n    return None\n\nchunk_vec = [0.8, 0.1, 0.3]\nquery_vec = [0.7, 0.2, 0.4]\nprint(round(cosine_similarity(chunk_vec, query_vec), 3))",
              hints: [
                "cosine similarity = dot(a, b) / (magnitude(a) * magnitude(b)).",
                "def cosine_similarity(a, b):\n    return dot(a, b) / (___(a) * ___(b))",
                "def cosine_similarity(a, b):\n    return dot(a, b) / (magnitude(a) * magnitude(b))\n\nchunk_vec = [0.8, 0.1, 0.3]\nquery_vec = [0.7, 0.2, 0.4]\nprint(round(cosine_similarity(chunk_vec, query_vec), 3))  # -> 0.98 — nearly identical direction"
              ]
            }
          }}
          check="0.98"
        />
      </div>

      <div className="sheet p-5">
        <p className="margin-note mb-3 uppercase tracking-wide">stage 5 · ask</p>
        <label className="block font-mono text-xs text-faded">your question</label>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="mt-1 w-full border-[1.5px] border-ink bg-paper px-3 py-2 font-mono text-sm focus:outline-none"
        />

        <div className="mt-4">
          <PredictBlock
            predict={{
              question: "will the top-3 retrieved chunks actually be about hostel fees, or something else?",
              options: ["about hostel fees", "something unrelated"],
              answerIndex: 0
            }}
            picked={predicted}
            onPick={setPredicted}
            revealed={!!topMatches}
          />
        </div>

        <button
          onClick={ask}
          disabled={!chunkVecs || asking || predicted === null}
          className="btn-ink mt-2 px-4 py-2 font-mono text-xs disabled:opacity-50"
        >
          {asking ? "retrieving…" : "▶ ask"}
        </button>
        {!chunkVecs && <p className="mt-1 font-mono text-xs text-alarm">embed the chunks first (stage 3).</p>}

        {topMatches && (
          <div className="mt-4">
            <p className="margin-note mb-2">top 3 chunks (highlighted above too)</p>
            {topMatches.map((m) => (
              <p key={m.idx} className="mb-1 font-mono text-xs">
                #{m.idx} · similarity {m.score.toFixed(3)} — {chunks[m.idx].slice(0, 60)}…
              </p>
            ))}

            <p className="margin-note mb-2 mt-4">assembled prompt sent to the LLM</p>
            <pre className="whitespace-pre-wrap border-[1.5px] border-ink/30 bg-paper p-3 font-mono text-[0.65rem]">
              {`Answer the question using ONLY the context below...\n\nContext:\n${topMatches.map((m) => chunks[m.idx]).join("\n\n---\n\n")}\n\nQuestion: ${question}`}
            </pre>

            {geminiAnswer && geminiAnswer.ok && (
              <div className="mt-3 border-[1.5px] border-signal bg-signal/10 p-3">
                <p className="mb-1 font-mono text-xs font-bold text-signal">real answer (Gemini)</p>
                <p className="whitespace-pre-wrap font-mono text-xs">{geminiAnswer.text}</p>
              </div>
            )}
            {geminiAnswer && !geminiAnswer.ok && (
              <div className="mt-3 border-[1.5px] border-alarm bg-alarm/10 p-3">
                <p className="whitespace-pre-wrap font-mono text-xs text-alarm">{geminiAnswer.message}</p>
              </div>
            )}
            {!hasApiKey() && (
              <p className="margin-note mt-3">
                no Gemini key set — showing retrieval only. add a key via the ⚙ icon to get a real generated answer too.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
