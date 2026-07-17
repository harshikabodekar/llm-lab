export const CH16_CONTENT = {
  concept: [
    "You already wrote cosine similarity by hand in ch15. A vector database is that same operation, industrialized — the same math, just engineered to handle millions of vectors without grinding to a halt.",
    "The dumbest approach (brute force) checks EVERY vector, every single query. Correct, but it doesn't scale — double the vectors, double the search time, forever.",
    "Real vector databases use an index — a pre-organized structure that lets you skip most of the comparisons entirely. Below uses the simplest real version: group vectors into buckets by rough location, then only search the bucket your query lands in.",
    "This is a genuine simplified version of what FAISS, Pinecone, and Chroma actually do (called an IVF index — 'inverted file' index) — same idea, way more engineering polish. Race it against brute force below and watch the gap widen as N grows."
  ],
  simple: [
    "Brute force search is checking every single book in a library, one at a time, until you find the one you want. Works fine for 10 books. Painful for 10 million.",
    "An index is what a library actually does: books get grouped by section (fiction, history, science...) so you only search ONE section instead of the whole building.",
    "The 'bucketed' search below does exactly that — vectors get pre-sorted into rough neighborhoods, and a search only checks the neighborhood closest to your query, not the whole library.",
    "Slide N up to 100,000 and race them. Brute force gets slower and slower. The bucketed version barely notices."
  ],
  intro: {
    what: "race brute-force cosine similarity against a simple bucketed index over up to 100,000 vectors, with real timings.",
    why: "this is the exact tradeoff every vector database (Pinecone, Chroma, FAISS) is built to solve — search speed at massive scale.",
    how: "drag N, hit race, watch the real millisecond timings and the speedup ratio."
  },
  challenge:
    "Push N to 100,000 and race. Note the speedup ratio. Now drop N to 200 and race again — the gap nearly disappears. Indexes earn their keep at scale, not on small data — that's why nobody bothers with a vector database for 50 documents.",
  checkpoint: [
    {
      q: "Why does brute-force search get slower as N grows, but a bucketed index barely does?",
      options: [
        "Brute force uses a slower programming language",
        "Brute force checks every vector every time (cost grows with N); a bucketed index only searches the relevant bucket (cost grows with bucket size, not the full dataset)",
        "They're actually the same speed, it's an illusion",
        "Bucketed search skips some vectors randomly to cheat"
      ],
      answer: 1,
      why: "an index's entire job is to shrink 'how many things do I have to compare against' — that's the whole speed win, no randomness or cheating involved."
    },
    {
      q: "What's the real-world name for the bucketing technique demonstrated here?",
      options: [
        "HTTP caching",
        "IVF (inverted file) index — group vectors by rough location, search only the nearest group",
        "Garbage collection",
        "Load balancing"
      ],
      answer: 1,
      why: "IVF indexing is a real, widely-used technique in FAISS and other vector search systems — group first, search within groups, exactly what you just raced."
    }
  ]
};
