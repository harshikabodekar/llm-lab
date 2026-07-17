"use client";

import { useEffect, useState } from "react";
import StartHere from "../StartHere";
import { getChecked, toggleChecked } from "../../lib/progress";

const WEEKS = [
  "PyTorch tensors — shapes, operations, moving between CPU/GPU",
  "autograd — .backward() and understanding the computation graph",
  "rebuild ch4's neuron layer as nn.Linear",
  "rebuild ch9's char-model training loop in real PyTorch",
  "add real multi-head attention (by hand, then nn.MultiheadAttention)",
  "stack it into a real mini transformer block",
  "set up a rented GPU (Colab free tier, Lambda, or RunPod)",
  "train nanoGPT (Karpathy's repo) on a real dataset",
  "install transformers + peft, load an open model (Llama/Gemma/Mistral)",
  "LoRA-finetune it on a small custom dataset",
  "build a small app around your finetuned model, or a RAG pipeline using it",
  "write up what you built and what you'd do differently — ship it"
];

const COMPARISONS = [
  {
    title: "a neuron's forward pass",
    fromCh: "ch4 / engine/tinynn.js",
    yours: 'forward(x) {\n  this.z = this.w.map((row, i) =>\n    row.reduce((sum, wij, j) => sum + wij * x[j], this.b[i])\n  );\n  this.a = this.z.map(tanh);\n  return this.a;\n}',
    pytorch: "import torch.nn as nn\n\nlayer = nn.Linear(in_features, out_features)\na = torch.tanh(layer(x))"
  },
  {
    title: "a gradient descent step",
    fromCh: "ch8",
    yours: "const grad = fPrime(prevX);\nconst nextX = prevX - lr * grad;",
    pytorch: "optimizer = torch.optim.SGD([x], lr=0.1)\n\nloss = f(x)\noptimizer.zero_grad()\nloss.backward()\noptimizer.step()"
  },
  {
    title: "scaled dot-product attention",
    fromCh: "ch5 / ch6",
    yours: "function attention(x) {\n  const scale = Math.sqrt(DIM);\n  return x.map((qi) => {\n    const weights = softmax(x.map((kj) => dot(qi, kj) / scale));\n    return weightedSum(x, weights);\n  });\n}",
    pytorch: "import torch.nn.functional as F\n\nscores = Q @ K.transpose(-2, -1) / (d_k ** 0.5)\nweights = F.softmax(scores, dim=-1)\noutput = weights @ V"
  },
  {
    title: "one training step",
    fromCh: "ch9 / lib/charmodel.js",
    yours: "const out = net.forward(x);\nconst probs = softmax(out, 1);\nconst grad = probs.map((p, i) => p - onehot[i]);\nnet.backward(grad);\nnet.step(lr);",
    pytorch: "optimizer.zero_grad()\nlogits = model(x)\nloss = F.cross_entropy(logits, target)\nloss.backward()\noptimizer.step()"
  }
];

export default function Ch23Playground() {
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    setChecked(getChecked("pytorch-roadmap"));
  }, []);

  function toggle(i) {
    setChecked(toggleChecked("pytorch-roadmap", i));
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="sheet p-5">
        <StartHere>read the 4 comparisons, then check off roadmap weeks as you commit to them.</StartHere>
        <p className="margin-note mb-3 uppercase tracking-wide">your code vs pytorch</p>
        <div className="flex flex-col gap-4">
          {COMPARISONS.map((c) => (
            <div key={c.title}>
              <p className="mb-2 font-mono text-xs text-inkblue">
                {c.title} <span className="text-faded">— from {c.fromCh}</span>
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <p className="mb-1 font-mono text-[0.6rem] text-faded">your code</p>
                  <pre className="whitespace-pre-wrap border-[1.5px] border-ink/20 bg-paper p-2 font-mono text-[0.65rem]">{c.yours}</pre>
                </div>
                <div>
                  <p className="mb-1 font-mono text-[0.6rem] text-faded">pytorch</p>
                  <pre className="whitespace-pre-wrap border-[1.5px] border-inkblue/30 bg-inkblue/5 p-2 font-mono text-[0.65rem]">{c.pytorch}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sheet p-5">
        <p className="margin-note mb-3 uppercase tracking-wide">
          12-week roadmap ({checked.length} / {WEEKS.length} checked)
        </p>
        <div className="flex flex-col gap-2">
          {WEEKS.map((w, i) => {
            const isChecked = checked.includes(i);
            return (
              <label key={i} className="sheet-flat flex items-center gap-3 bg-white px-3 py-2">
                <input type="checkbox" checked={isChecked} onChange={() => toggle(i)} className="h-4 w-4" />
                <span className="w-16 shrink-0 font-mono text-xs text-inkblue">week {i + 1}</span>
                <span className={`flex-1 font-mono text-xs ${isChecked ? "text-faded line-through" : ""}`}>{w}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
