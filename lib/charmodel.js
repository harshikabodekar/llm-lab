import { Net, softmax } from "../engine/tinynn";

/* a real (tiny) character-level model: predicts the next character from
   the last CONTEXT_LEN characters, trained with genuine cross-entropy
   backprop via engine/tinynn's Net. small enough to train live in the
   browser without freezing the tab — see trainBatch's fixed batch size. */

export const CONTEXT_LEN = 3;
export const HIDDEN = 24;
export const MAX_VOCAB = 60;
export const MAX_TEXT_LEN = 3000;

export function buildVocab(text, maxSize = MAX_VOCAB) {
  const freq = new Map();
  for (const ch of text) freq.set(ch, (freq.get(ch) || 0) + 1);
  const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, maxSize);
  const chars = sorted.map(([c]) => c).sort();
  const charToIdx = new Map(chars.map((c, i) => [c, i]));
  return { chars, charToIdx };
}

export function buildNet(vocabSize) {
  return new Net([vocabSize * CONTEXT_LEN, HIDDEN, vocabSize]);
}

function oneHot(idx, size) {
  const v = new Array(size).fill(0);
  if (idx >= 0 && idx < size) v[idx] = 1;
  return v;
}

function vectorFromChars(chars, charToIdx, vocabSize) {
  const vec = [];
  for (const ch of chars) {
    const idx = charToIdx.has(ch) ? charToIdx.get(ch) : -1;
    vec.push(...oneHot(idx, vocabSize));
  }
  return vec;
}

function contextVector(text, pos, charToIdx, vocabSize) {
  let slice = text.slice(Math.max(0, pos - CONTEXT_LEN), pos);
  while (slice.length < CONTEXT_LEN) slice = " " + slice;
  return vectorFromChars(slice.split(""), charToIdx, vocabSize);
}

function sampleIndex(probs) {
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < probs.length; i++) {
    acc += probs[i];
    if (r <= acc) return i;
  }
  return probs.length - 1;
}

// runs a fixed-size batch of real SGD steps (forward, cross-entropy loss,
// backward, step) on random positions from `text`. bounded cost regardless
// of how long `text` is — that's what keeps this safe to run every tick.
export function trainBatch(net, text, charToIdx, vocabSize, lr, batchSize) {
  let lossSum = 0;
  let count = 0;
  for (let b = 0; b < batchSize; b++) {
    const pos = CONTEXT_LEN + Math.floor(Math.random() * (text.length - CONTEXT_LEN));
    const targetChar = text[pos];
    if (!charToIdx.has(targetChar)) continue;
    const targetIdx = charToIdx.get(targetChar);
    const x = contextVector(text, pos, charToIdx, vocabSize);
    const out = net.forward(x);
    const probs = softmax(out, 1);
    lossSum += -Math.log(Math.max(probs[targetIdx], 1e-9));
    count++;
    const grad = probs.map((p, i) => p - (i === targetIdx ? 1 : 0));
    net.backward(grad);
    net.step(lr);
  }
  return count > 0 ? lossSum / count : 0;
}

export function generateSample(net, seed, charToIdx, chars, length, temperature) {
  let ctx = seed.slice(-CONTEXT_LEN).padStart(CONTEXT_LEN, " ");
  let out = "";
  for (let i = 0; i < length; i++) {
    const x = vectorFromChars(ctx.split(""), charToIdx, chars.length);
    const logits = net.forward(x);
    const probs = softmax(logits, temperature);
    const idx = sampleIndex(probs);
    const ch = chars[idx] ?? "";
    out += ch;
    ctx = (ctx + ch).slice(-CONTEXT_LEN);
  }
  return out;
}
