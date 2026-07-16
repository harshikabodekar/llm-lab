// the full syllabus. every chapter follows the rhythm:
// hook -> concept -> playground -> challenge -> checkpoint -> recap
// status: "live" = built, "soon" = coming in the 5-day plan

export const PARTS = [
  { id: 1, title: "Foundations", subtitle: "how models think" },
  { id: 2, title: "Training", subtitle: "how models learn" },
  { id: 3, title: "Using models", subtitle: "where the jobs are" },
  { id: 4, title: "Reality check", subtitle: "limits, evals & what's next" }
];

export const CHAPTERS = [
  // ---------- PART 1 ----------
  {
    id: "ch0", part: 1, num: 0, title: "Python in 20 minutes",
    hook: "You'll write real AI code in this app. Here's every piece of Python you need — nothing more.",
    status: "live", playground: "guided python cells",
    recap: "variables hold things, lists hold many things, functions are reusable recipes, loops repeat."
  },
  {
    id: "ch1", part: 1, num: 1, title: "What is a language model?",
    hook: "Every AI you've ever talked to does exactly one thing: guess the next word. That's it. Seriously.",
    status: "live", playground: "tokenizer playground",
    recap: "an LLM = a very good next-token guesser. everything else is built on that."
  },
  {
    id: "ch2", part: 1, num: 2, title: "Tokenization",
    hook: "Why does the model think 'strawberry' has two r's? Because it never sees letters.",
    status: "live", playground: "build-a-tokenizer code cells",
    recap: "text becomes tokens (chunks), tokens become numbers. models only ever see numbers."
  },
  {
    id: "ch3", part: 1, num: 3, title: "Embeddings",
    hook: "How can math know that 'king' minus 'man' plus 'woman' is 'queen'?",
    status: "live", playground: "draggable 2D embedding space",
    recap: "every token becomes a point in space. meaning = position. similar meaning = nearby points."
  },
  {
    id: "ch4", part: 1, num: 4, title: "Neural nets 101",
    hook: "You'll hand-tune 9 neurons to classify points. You will lose to gradient descent. That loss is the lesson.",
    status: "live", playground: "drag-the-weights net",
    recap: "a neural net = weights + multiply + add + squash, stacked. training = auto-tuning weights."
  },
  {
    id: "ch5", part: 1, num: 5, title: "Attention",
    hook: "In 'the trophy didn't fit in the suitcase because it was too big' — how does the model know what 'it' means?",
    status: "live", playground: "live attention heatmap",
    recap: "every token asks every other token: 'how relevant are you to me?' — that's attention."
  },
  {
    id: "ch6", part: 1, num: 6, title: "The transformer block",
    hook: "GPT, Claude, Gemini, Llama — all of them are this one block, copy-pasted.",
    status: "live", playground: "stack blocks, watch shapes flow",
    recap: "transformer block = attention + feedforward + residuals. LLMs = this block × dozens."
  },
  // ---------- PART 2 ----------
  {
    id: "ch7", part: 2, num: 7, title: "Loss — how wrong was the guess?",
    hook: "Training needs a single number that says 'you were THIS wrong.' You'll write that number.",
    status: "live", playground: "loss function code cell",
    recap: "loss = wrongness score. all of training = make this number go down."
  },
  {
    id: "ch8", part: 2, num: 8, title: "Backprop & gradient descent",
    hook: "Drop a ball on a hilly landscape. Control one dial. Too high — it flies forever. Too low — it never arrives.",
    status: "live", playground: "loss landscape terrain",
    recap: "gradients point uphill; we step downhill. learning rate = step size, the #1 dial in all of ML."
  },
  {
    id: "ch9", part: 2, num: 9, title: "The training loop ★",
    hook: "Paste YOUR text. Train a real tiny GPT on it, live. Watch gibberish become your writing style in 2 minutes.",
    status: "soon", playground: "live char-GPT training",
    recap: "loop: predict → measure loss → backprop → nudge weights → repeat. same loop as GPT-4, just tiny."
  },
  {
    id: "ch10", part: 2, num: 10, title: "Pretraining vs finetuning",
    hook: "Base models are feral. Chat models are trained to behave. Meet both.",
    status: "soon", playground: "base vs chat side-by-side",
    recap: "pretrain on the internet = knowledge. finetune on examples = behavior."
  },
  {
    id: "ch11", part: 2, num: 11, title: "RLHF",
    hook: "Why does Claude feel helpful instead of unhinged? Humans voted.",
    status: "soon", playground: "you-are-the-reward-model game",
    recap: "humans rank outputs → reward model learns taste → model optimizes for it."
  },
  // ---------- PART 3 ----------
  {
    id: "ch12", part: 3, num: 12, title: "Sampling & temperature",
    hook: "One slider separates 'boring corporate email' from 'unhinged poetry'. It's yours now.",
    status: "soon", playground: "probability bars + temperature slider",
    recap: "models output probabilities. sampling picks. temperature = how adventurous the pick is."
  },
  {
    id: "ch13", part: 3, num: 13, title: "Prompting that actually works",
    hook: "Same question, four prompts, four wildly different answers. See exactly why.",
    status: "soon", playground: "prompt comparison lab (gemini free tier)",
    recap: "system prompts set behavior, few-shot shows the pattern, structure beats politeness."
  },
  {
    id: "ch14", part: 3, num: 14, title: "Context windows",
    hook: "Why does the model 'forget' the start of a long chat? Watch its memory physically run out.",
    status: "soon", playground: "context overflow visualizer",
    recap: "context = the model's entire working memory, measured in tokens. outside it = doesn't exist."
  },
  {
    id: "ch15", part: 3, num: 15, title: "RAG — build it yourself ★",
    hook: "Ask a model about your college's fees. It hallucinates. You're about to fix that, permanently.",
    status: "soon", playground: "full RAG pipeline builder — you write chunking + cosine similarity",
    recap: "chunk docs → embed → store → retrieve nearest → stuff into prompt. that's RAG, and you built it."
  },
  {
    id: "ch16", part: 3, num: 16, title: "Vector databases",
    hook: "You wrote cosine similarity over a loop. Now see what ChromaDB does when there are 10 million chunks.",
    status: "soon", playground: "brute force vs index race",
    recap: "vector DBs = your cosine similarity + clever indexing + scale."
  },
  {
    id: "ch17", part: 3, num: 17, title: "Agents & tool use",
    hook: "Give a model a calculator, a search box and a notepad. Watch it think in loops and get things done.",
    status: "soon", playground: "build the agent loop",
    recap: "agent = LLM in a loop: think → pick tool → observe → repeat until done."
  },
  {
    id: "ch18", part: 3, num: 18, title: "Finetuning in practice (LoRA)",
    hook: "Full finetuning rewrites billions of weights. LoRA sneaks in tiny adapters instead. 100x cheaper.",
    status: "soon", playground: "adapter visualizer",
    recap: "LoRA = freeze the model, train small add-on matrices. finetune behavior, not knowledge. RAG for facts."
  },
  // ---------- PART 4 ----------
  {
    id: "ch19", part: 4, num: 19, title: "Hallucination & limits",
    hook: "The model doesn't lie. It just always answers — even when it shouldn't. Learn to catch it.",
    status: "soon", playground: "hallucination hunt",
    recap: "models predict plausible text, not true text. confidence ≠ correctness."
  },
  {
    id: "ch20", part: 4, num: 20, title: "Evals",
    hook: "'It seems good' is not engineering. How do you PROVE your AI works?",
    status: "soon", playground: "build a mini eval suite",
    recap: "evals = test cases for AI. define good, measure it, track it on every change."
  },
  {
    id: "ch21", part: 4, num: 21, title: "Scaling — from 10K to 1T params",
    hook: "Your ch9 model and Claude are the same species. One just ate more.",
    status: "soon", playground: "scale slider: params, data, cost",
    recap: "same architecture + more data + more compute = emergent abilities. that's the whole secret."
  },
  {
    id: "ch22", part: 4, num: 22, title: "Capstone — ship your own AI",
    hook: "Everything you've built, combined into one project that's actually yours.",
    status: "soon", playground: "guided capstone builder",
    recap: "you didn't finish a course. you shipped an AI product."
  },
  {
    id: "ch23", part: 4, num: 23, title: "The PyTorch bridge",
    hook: "Your next 2-3 months, mapped week by week — from this app to training real models on real GPUs.",
    status: "soon", playground: "roadmap with live checkboxes + your-code-vs-pytorch side-by-sides",
    recap: "weeks 1-2 pytorch basics · 3-4 rebuild our tiny GPT · 5-8 nanoGPT on a rented GPU · 9-12 LoRA-finetune an open model."
  }
];

export const getChapter = (id) => CHAPTERS.find((c) => c.id === id);
