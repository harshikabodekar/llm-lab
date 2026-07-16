🔬 LLM Lab — build your own AI, by hand

An interactive lab that teaches how LLMs actually work — by making you build every piece yourself, in the browser, for free.

No videos. No slides. You tokenize text, hand-tune neurons (and lose to gradient descent), watch attention decide what "it" refers to, train a real tiny GPT on your own writing, and build a RAG pipeline line by line — writing real Python the whole way.


The idea: every AI course shows you a black box. LLM Lab hands you a glass box and a screwdriver.




✨ What makes it different

Typical courseLLM LabWatch videos about attentionType a sentence, watch a real attention head compute a heatmap on it"Training minimizes loss"Paste your Instagram captions, train a char-level model live, watch gibberish become your writing styleRAG explained in a diagramYou write the chunking function and cosine similarity yourself — then watch your code retrieve real chunksQuiz at the endPredict-before-run on every experiment, breakage challenges, boss levels with planted bugs to find

Zero cost. ~90% of the app runs entirely in your browser — real Python via Pyodide, real models via Transformers.js, a hand-written neural net engine with visible weights and gradients. The two chapters that need a big model use the Gemini free tier with your own key (stored locally, never sent anywhere else).

Zero coding experience needed. Every exercise has 4 difficulty layers — fill-in-the-blank → arrange-the-blocks → write-with-hints → freehand — plus plain-English error translation and an optional "explain with example 🌱" toggle that re-explains any concept through day-to-day analogies (tokenization = tearing a roti into bite-size pieces).


📚 The journey — 4 parts, 24 chapters

Part 1 · Foundations — what a language model is, tokenization, embeddings, neural nets, attention, the transformer block
Part 2 · Training — loss, backprop & gradient descent, the live training loop ★, pretraining vs finetuning, RLHF
Part 3 · Using models — sampling & temperature, prompting, context windows, RAG built by hand ★, vector databases, agents & tool use, LoRA
Part 4 · Reality check — hallucination, prompt injection, evals, scaling & quantization, a guided capstone, and a 12-week PyTorch bridge roadmap for life after the app

Every chapter follows the same rhythm: hook → concept → playground → break-it challenge → checkpoint → recap card. Finish everything and your recap deck doubles as an interview-prep flashcard set.

Each part ends with a boss level 👾 — a broken pipeline with planted bugs you have to diagnose using everything you've learned. Debugging is the deepest form of understanding.


🚀 Run it locally

bashgit clone https://github.com/harshikabodekar/llm-lab.git
cd llm-lab
npm install
npm run dev

Open http://localhost:3000 — start at chapter 0 if you've never written Python, chapter 1 otherwise.

Optional: add a free Gemini API key (settings ⚙️ → get one here) to unlock the prompting lab and live agent chapters. Everything else works fully offline after first load.


🛠️ How it's built


Next.js 14 (App Router) + Tailwind — static-generated, deployable anywhere
Pyodide — real Python + NumPy running in the browser for every code exercise
Transformers.js — real embedding/language models locally, no server
engine/tinynn.js — a hand-written neural net library (forward pass, backprop, softmax) with every weight and gradient exposed, so the UI can show you inside the model. Every function maps 1:1 to its PyTorch equivalent — which the final chapter uses to teach you PyTorch by comparison
Design — a graph-paper lab notebook: blue-ink margin notes, highlighter accents, taped-in paper cards. You're not watching a course, you're working through a notebook



🎓 What you'll walk away with


The ability to explain every layer of an LLM — tokens → embeddings → attention → transformers → training → RLHF — from genuine understanding, not memorized definitions
A RAG system and an agent loop you built yourself, piece by piece
Real intuition for the dials that matter: temperature, learning rate, chunk size, context limits
The judgment to debug AI products: why it hallucinated, why retrieval failed
A concrete 12-week roadmap from here to training real models in PyTorch on real GPUs


And an honest list of what this can't teach you — because a course that promises you'll rebuild GPT-4 solo is lying to you.


🗺️ Status

Actively being built in a 5-day sprint. Foundations + training chapters live; RAG, agents and polish landing daily. Watch the repo 👀


Built by Harshika Bodekar — frontend developer turned AI engineer, building the resource she wished existed.

Powered by Pyodide, Transformers.js & stubbornness.