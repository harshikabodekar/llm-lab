/* tinynn — the glass-box neural net engine.
   real weights, real forward pass, real backprop. no libraries.
   this powers ch4 (drag the weights), ch8 (gradient descent) and ch9 (training loop).
   every function here maps 1:1 to what you'll later write in pytorch. */

export function randn() {
  // gaussian random via box-muller — how real nets initialize weights
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export class Layer {
  constructor(inSize, outSize) {
    this.w = Array.from({ length: outSize }, () =>
      Array.from({ length: inSize }, () => randn() * 0.5)
    );
    this.b = Array.from({ length: outSize }, () => 0);
    // gradients live alongside weights — you'll watch them in the UI
    this.gw = this.w.map((row) => row.map(() => 0));
    this.gb = this.b.map(() => 0);
  }

  forward(x) {
    this.x = x; // remember input for backprop
    this.z = this.w.map((row, i) =>
      row.reduce((sum, wij, j) => sum + wij * x[j], this.b[i])
    );
    this.a = this.z.map(tanh);
    return this.a;
  }

  backward(gradOut) {
    // gradOut: dLoss/dActivation for this layer
    const gz = gradOut.map((g, i) => g * dtanh(this.z[i]));
    for (let i = 0; i < this.w.length; i++) {
      for (let j = 0; j < this.w[i].length; j++) {
        this.gw[i][j] += gz[i] * this.x[j];
      }
      this.gb[i] += gz[i];
    }
    // gradient wrt input, passed to the previous layer
    const gx = this.x.map((_, j) =>
      this.w.reduce((sum, row, i) => sum + row[j] * gz[i], 0)
    );
    return gx;
  }

  step(lr) {
    for (let i = 0; i < this.w.length; i++) {
      for (let j = 0; j < this.w[i].length; j++) {
        this.w[i][j] -= lr * this.gw[i][j];
        this.gw[i][j] = 0;
      }
      this.b[i] -= lr * this.gb[i];
      this.gb[i] = 0;
    }
  }
}

export class Net {
  constructor(sizes) {
    // sizes like [2, 4, 1] = 2 inputs, 4 hidden, 1 output
    this.layers = [];
    for (let i = 0; i < sizes.length - 1; i++) {
      this.layers.push(new Layer(sizes[i], sizes[i + 1]));
    }
  }
  forward(x) {
    return this.layers.reduce((a, layer) => layer.forward(a), x);
  }
  backward(grad) {
    for (let i = this.layers.length - 1; i >= 0; i--) {
      grad = this.layers[i].backward(grad);
    }
  }
  step(lr) {
    this.layers.forEach((l) => l.step(lr));
  }
  // one full training step on a batch. returns mean loss.
  trainStep(batch, lr) {
    let loss = 0;
    for (const [x, y] of batch) {
      const out = this.forward(x);
      loss += mseLoss(out, y);
      this.backward(mseGrad(out, y));
    }
    this.step(lr / batch.length);
    return loss / batch.length;
  }
}

export const tanh = (x) => Math.tanh(x);
export const dtanh = (x) => 1 - Math.tanh(x) ** 2;

export function mseLoss(pred, target) {
  return pred.reduce((s, p, i) => s + (p - target[i]) ** 2, 0) / pred.length;
}
export function mseGrad(pred, target) {
  return pred.map((p, i) => (2 * (p - target[i])) / pred.length);
}

export function softmax(logits, temperature = 1) {
  const t = Math.max(temperature, 1e-6);
  const m = Math.max(...logits);
  const exps = logits.map((l) => Math.exp((l - m) / t));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}
