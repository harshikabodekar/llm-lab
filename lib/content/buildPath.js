// the build path — a standalone, practical project-shipping checklist.
// not a lesson: no concept/checkpoint/recap shape. lives at /build-path,
// linked from its own card on the landing page. does not touch
// lib/chapters.js or any existing chapter content.

export const TRACKS = [
  {
    id: "rag",
    label: "RAG assistant",
    emoji: "📚",
    tagline: "answer questions over your own documents",
    goodFor:
      "docs, notes, internal wikis, support content — anything where the model needs to know YOUR stuff, not just what it was trained on.",
    effort: "a weekend. the hard parts — chunking, embedding, retrieval — you already built by hand in ch15.",
    needs: "a folder of documents, a free Gemini key (or a local embedding model), ~30 minutes of setup."
  },
  {
    id: "agent",
    label: "agent with custom tools",
    emoji: "🛠️",
    tagline: "a model that can actually DO things, not just talk",
    goodFor: "automating multi-step tasks — lookups, calculations, calling your own APIs, chaining actions together.",
    effort: "a few evenings. the loop itself is simple (ch17) — most of the work is writing good tools.",
    needs: "a Gemini key with function-calling, and 2-3 well-defined tools (plain functions) to start with."
  },
  {
    id: "finetune",
    label: "finetune a small open model",
    emoji: "🎛️",
    tagline: "change how a model BEHAVES, permanently, on your own examples",
    goodFor: "consistent tone/format/persona, a narrow task done the same way every time, offline or private inference.",
    effort: "the steepest of the three — a few days, plus GPU time, rented or local.",
    needs: "50-500 example input/output pairs, a rented GPU (Colab/Lambda/RunPod) or a decent local one, and patience."
  }
];

export const MODEL_DECISION = {
  how: [
    "two axes decide this: API models (Gemini, GPT, Claude — call over the network, someone else hosts the weights) vs open weights (Llama, Gemma, Mistral, Qwen — you download and run them yourself, locally or on rented hardware).",
    "go local when cost matters at real scale (self-hosting is cheaper per-token once volume is high), privacy matters (data never leaves your machine), or you need offline/low-latency inference. go API when you want the smartest available model without owning hardware, you're prototyping fast, or your volume is low enough that per-call pricing barely registers.",
    "where to get open weights: huggingface.co is the model warehouse — search, download, read model cards before trusting one. ollama (ollama.com) is the easiest way to actually RUN one locally — \"ollama run llama3.2\" and you're talking to it in under a minute, no python required."
  ],
  links: ["ch18"],
  trackHints: {
    finetune:
      "you're finetuning, so you need open weights either way — pick something small enough to train on what you've got (llama 3.2 3B or gemma 2 2B are reasonable starting sizes)."
  }
};

export const WORKSPACE = {
  rag: {
    commands: [
      "python -m venv .venv",
      "source .venv/bin/activate   # windows: .venv\\Scripts\\activate",
      "pip install sentence-transformers chromadb google-generativeai python-dotenv"
    ],
    keySetup: 'echo "GEMINI_API_KEY=your-key-here" > .env   # free key: aistudio.google.com/apikey',
    localAlt: 'going local instead? skip the key: "ollama pull nomic-embed-text" for embeddings, "ollama pull llama3.2" for generation.'
  },
  agent: {
    commands: [
      "python -m venv .venv",
      "source .venv/bin/activate   # windows: .venv\\Scripts\\activate",
      "pip install google-generativeai python-dotenv requests"
    ],
    keySetup: 'echo "GEMINI_API_KEY=your-key-here" > .env   # free key: aistudio.google.com/apikey',
    localAlt: 'going local instead? "ollama pull llama3.2" — recent llama/qwen builds support tool-calling too, check the model card.'
  },
  finetune: {
    commands: [
      "python -m venv .venv",
      "source .venv/bin/activate   # windows: .venv\\Scripts\\activate",
      "pip install transformers peft accelerate bitsandbytes datasets"
    ],
    keySetup:
      "no API key needed here — but you DO need a GPU. rent one: Colab (free tier handles small LoRA runs), lambda.ai, or runpod.io (~$0.20-0.50/hr for something decent).",
    localAlt: null
  }
};

export const CORE_STEPS = {
  rag: [
    {
      step: "chunk your documents",
      how: "fixed-size slices with a little overlap, so you don't cut a sentence in half between chunks.",
      links: ["ch15"],
      production: "you wrote chunking by hand with string slicing; in production, use LangChain's or LlamaIndex's text splitters — same idea, more edge cases handled for you."
    },
    {
      step: "embed each chunk",
      how: "turn text into a vector, so \"similar meaning\" becomes \"nearby points\" you can actually search.",
      links: ["ch3", "ch15"],
      production: "you used a toy hash-embedder or MiniLM in-browser; in production, use a real embedding API (Gemini, OpenAI) or a local sentence-transformers model."
    },
    {
      step: "retrieve the closest chunks",
      how: "cosine similarity between your question's embedding and every chunk's embedding — keep the top few.",
      links: ["ch15", "ch16"],
      production: "you wrote cosine similarity by hand over a loop; in production, use a vector database — ChromaDB or FAISS for local, Pinecone or Weaviate if you want it hosted."
    },
    {
      step: "stuff the prompt and ask",
      how: "paste the retrieved chunks into the prompt alongside the question, then call the model.",
      links: ["ch13"],
      production: "you hand-assembled the prompt string; in production, LangChain and LlamaIndex give you RAG chains that handle this — plus citation tracking — for you."
    }
  ],
  agent: [
    {
      step: "define your tools",
      how: "each tool is a function plus a schema describing its name, purpose, and arguments — the schema is what the model actually reads to decide when to call it.",
      links: ["ch17"],
      production: "you hardcoded 3 tools; in production keep schemas small and specific — models pick correctly from 3 clear tools far more reliably than from 12 vague ones."
    },
    {
      step: "write the tool-picking logic",
      how: "given the model's output, detect \"this is a tool call\" vs \"this is a final answer,\" and route accordingly.",
      links: ["ch17"],
      production: "you wrote an if/else tool-picker in python; in production, use the provider's native function-calling / structured-output mode — it returns a typed tool call instead of text you have to parse yourself."
    },
    {
      step: "run the think → act → observe loop",
      how: "call the model, execute whatever tool it picked, feed the result back in, repeat until it gives a final answer.",
      links: ["ch17"],
      production: "you looped this by hand with a fixed step limit; in production, add real guardrails — a hard max-steps cap, a timeout per tool call, and logging every step (agents fail silently otherwise)."
    },
    {
      step: "prompt the reasoning well",
      how: "the system prompt is what makes the loop actually reason instead of guessing — tell it what tools exist and when each one applies.",
      links: ["ch13"],
      production: "frameworks like LangChain agents or LangGraph give you this loop pre-built, with retries and structured tracing — worth adopting once your hand-rolled version works."
    }
  ],
  finetune: [
    {
      step: "decide: LoRA vs full finetune",
      how: "LoRA freezes the base model and trains small adapter matrices — cheaper, faster, and almost always the right call unless you have serious compute to spare.",
      links: ["ch18"],
      production: "this decision doesn't really change in production either — LoRA, via the peft library, is the standard almost everyone reaches for now."
    },
    {
      step: "prepare your example dataset",
      how: "50-500 input/output pairs showing the BEHAVIOR you want, not facts you want it to know — finetuning teaches style and format, not knowledge (that's RAG's job).",
      links: ["ch10"],
      production: "clean, consistent formatting matters more than raw volume — 100 great examples reliably beat 1,000 messy ones."
    },
    {
      step: "train the adapter",
      how: "load the base model, wrap it with a LoRA config (rank, target layers), and train for a few epochs.",
      links: ["ch18"],
      production: "you saw the concept as an animated matrix multiply; in real code, HuggingFace's peft + transformers.Trainer runs the actual training loop for you."
    },
    {
      step: "compare base vs finetuned",
      how: "run the same prompts through both and actually read the difference — it's the only real way to know it worked.",
      links: ["ch10", "ch20"],
      production: "same idea as the base-vs-chat comparison from ch10, just with your own model standing in on both sides."
    }
  ]
};

export const EVAL = {
  how: [
    "write 5 test cases before you let yourself believe it works. a test case here is just: a realistic input, and what a good output must contain (or must avoid).",
    "run them every time you change a prompt, swap a model, or tweak retrieval — it's the only way you'll actually notice a regression instead of just vibing that it \"feels fine.\""
  ],
  links: ["ch20"],
  template: `test_cases = [
    {"input": "...", "must_include": ["..."], "must_avoid": ["..."]},
    # 4 more — cover the normal case, an edge case, and a case it should refuse
]

def run_eval(model_fn, test_cases):
    passed = 0
    for i, tc in enumerate(test_cases):
        output = model_fn(tc["input"])
        ok = all(s in output for s in tc.get("must_include", [])) and \\
             not any(s in output for s in tc.get("must_avoid", []))
        print(f"test {i+1}: {'PASS' if ok else 'FAIL'}")
        passed += ok
    print(f"\\n{passed}/{len(test_cases)} passed")`
};

export const UI_SNIPPETS = {
  how: "streamlit if you want it running in an afternoon — one python file, no frontend code. next.js if you want something polished enough to put on a resume, with full control over every pixel.",
  streamlit: `import streamlit as st

st.title("my project")
query = st.text_input("ask something")
if query:
    with st.spinner("thinking..."):
        answer = run_pipeline(query)   # your rag/agent/model function
    st.write(answer)`,
  nextjs: `// app/api/ask/route.js
export async function POST(req) {
  const { query } = await req.json();
  const answer = await runPipeline(query); // your rag/agent/model function
  return Response.json({ answer });
}`
};

export const DEPLOY_OPTIONS = [
  {
    name: "Streamlit Community Cloud",
    cost: "free",
    good: "the fastest path for a streamlit app — connect a github repo, click deploy.",
    catch: "public repo required on the free tier; app sleeps after inactivity and takes a few seconds to wake up."
  },
  {
    name: "Vercel",
    cost: "free tier",
    good: "the natural home for a next.js app — push to git, it deploys itself, instant preview URLs.",
    catch: "serverless functions have execution time limits — fine for API calls, watch out for slow local model inference."
  },
  {
    name: "Hugging Face Spaces",
    cost: "free (CPU)",
    good: "built for exactly this — supports streamlit, gradio, or a raw docker container. natural fit if your project already lives around HF models.",
    catch: "free tier is CPU-only; anything GPU-hungry needs a paid space."
  },
  {
    name: "a small VPS",
    cost: "~$4-6/mo",
    good: "full control — long-running processes, local model inference, no platform limits.",
    catch: "you're the ops team now: updates, uptime, and a firewall are on you."
  }
];

export const PORTFOLIO = {
  how: [
    "write it up like a case study, not a changelog: the problem you were solving, your approach, the decisions you made and why (chunk size? model choice? RAG vs finetune?), and what you'd do differently now that you've shipped it once.",
    "recruiters skim. lead with what it does and a live link or a 30-second gif — not a wall of setup instructions. the deep write-up is for the 10% who click through.",
    "demo it live if you possibly can. a working link beats a screenshot beats a paragraph, every single time."
  ],
  outline: ["Problem", "Approach", "Key decisions", "What I'd change next time", "Try it → [live link]"]
};

export const STAGES = [
  { id: "pick-project", n: 1, title: "pick your project" },
  { id: "pick-model", n: 2, title: "pick your model" },
  { id: "workspace", n: 3, title: "set up your workspace" },
  { id: "core", n: 4, title: "build the core" },
  { id: "evaluate", n: 5, title: "evaluate" },
  { id: "ui", n: 6, title: "wrap it in a UI" },
  { id: "ship", n: 7, title: "ship it" },
  { id: "show", n: 8, title: "show it" }
];
