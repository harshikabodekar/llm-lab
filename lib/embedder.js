/* real transformers.js (MiniLM, runs client-side via WASM) when it loads in
   time, a local hashing-vectorizer toy embedder when it doesn't. either way,
   cosineSim below runs on genuine vectors — nothing about retrieval is faked,
   only WHICH embedding model produced the numbers changes. */

let cachedEmbedder = null;

function toyEmbed(text, dim = 64) {
  // a real (if crude) technique: hash each word into a bucket, count occurrences,
  // normalize. shared vocabulary between two texts pulls their vectors together —
  // genuine signal, not random noise.
  const vec = new Array(dim).fill(0);
  const words = text.toLowerCase().match(/[a-z0-9]+/g) || [];
  for (const word of words) {
    let h = 0;
    for (let i = 0; i < word.length; i++) h = (h * 31 + word.charCodeAt(i)) >>> 0;
    vec[h % dim] += 1;
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}

async function tryLoadReal() {
  const mod = await import(/* webpackIgnore: true */ "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2");
  const extractor = await mod.pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  return {
    isReal: true,
    label: "transformers.js (MiniLM, real embedding model)",
    embed: async (text) => {
      const out = await extractor(text, { pooling: "mean", normalize: true });
      return Array.from(out.data);
    }
  };
}

export async function loadEmbedder(timeoutMs = 15000) {
  if (cachedEmbedder) return cachedEmbedder;
  const real = tryLoadReal().catch(() => null);
  const timeout = new Promise((resolve) => setTimeout(() => resolve(null), timeoutMs));
  const winner = await Promise.race([real, timeout]);
  if (winner) {
    cachedEmbedder = winner;
    return winner;
  }
  cachedEmbedder = {
    isReal: false,
    label: "local hashing embedder (fallback — MiniLM didn't load in time)",
    embed: async (text) => toyEmbed(text)
  };
  return cachedEmbedder;
}

function seededWeight(i, salt) {
  let h = (i * 2654435761 + salt) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  h = (h * 2246822519) >>> 0;
  h = (h ^ (h >>> 13)) >>> 0;
  return (h % 2000) / 1000 - 1; // deterministic, range [-1, 1]
}

// fixed deterministic projection to 2D — works for any embedding dimension,
// same weight for a given index every time. good enough to visualize
// clustering, not meant to preserve exact distances (that's what cosineSim
// on the full vectors is for).
export function projectTo2D(vec) {
  let x = 0;
  let y = 0;
  for (let i = 0; i < vec.length; i++) {
    x += vec[i] * seededWeight(i, 111);
    y += vec[i] * seededWeight(i, 222);
  }
  return [x, y];
}

export function cosineSim(a, b) {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const na = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const nb = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return na && nb ? dot / (na * nb) : 0;
}

export function chunkText(text, chunkSize, overlap) {
  const chunks = [];
  let i = 0;
  const step = Math.max(1, chunkSize - overlap);
  while (i < text.length) {
    const chunk = text.slice(i, i + chunkSize).trim();
    if (chunk) chunks.push(chunk);
    if (i + chunkSize >= text.length) break;
    i += step;
  }
  return chunks;
}
