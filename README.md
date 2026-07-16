# LLM Lab — build your own AI, by hand

an interactive lab notebook that teaches how LLMs actually work by making you
build every piece yourself. no videos. all hands.

## run it

```bash
npm install
npm run dev
```

open http://localhost:3000

## whats inside (day 1 state)

- `lib/chapters.js` — the full 24-chapter syllabus (the backbone)
- `app/page.jsx` — journey map landing
- `components/ChapterShell.jsx` — the reusable chapter rhythm:
  hook → concept → playground → challenge → checkpoint → recap
- `components/playgrounds/Ch1Playground.jsx` — LIVE: real mini subword
  tokenizer, 3 modes, token IDs
- `components/CodeCell.jsx` — LIVE: the python code cell, 4 difficulty
  layers (fill-the-blanks, arrange-the-blocks, hints, freehand)
- `components/playgrounds/Ch0Playground.jsx` — LIVE: python in 20 minutes,
  4 guided code cells
- `components/playgrounds/Ch2Playground.jsx` — LIVE: write-your-own
  greedy tokenizer, in real python this time
- `components/playgrounds/Ch3Playground.jsx` — LIVE: draggable 2D
  embedding map, king − man + woman demo
- `engine/tinynn.js` — real neural net engine (forward + backprop + softmax),
  powers ch4/8/9
- `lib/pyodide.js` — python-in-browser loader + beginner error translator,
  powers all the code cells

## the 5-day sprint

- day 1 ✅ skeleton, design system, journey map, engines, ch1 live
- day 2 ✅ code cell component (4 difficulty layers, hints) + ch0, ch2, ch3 live
- day 3 → ch4-9: draggable net, attention heatmap, gradient terrain, LIVE training loop
- day 4 → ch12-18: sampling, prompting lab (gemini free tier), RAG builder, agents
- day 5 → ch19-23, glossary, eli5 toggle, recap collection, deploy to vercel

## adding a chapter (the pattern)

1. write content in `lib/content/chX.js` (concept, challenge, checkpoint)
2. build playground in `components/playgrounds/ChXPlayground.jsx`
3. register both in the REGISTRY inside `ChapterShell.jsx`
4. flip status to "live" in `lib/chapters.js`

thats it. the shell handles everything else.
