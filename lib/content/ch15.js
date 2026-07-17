export const CH15_CONTENT = {
  concept: [
    "This is the big one — a real RAG (Retrieval-Augmented Generation) pipeline, built stage by stage, by you. Same idea that fixes hallucination in every real product: don't trust the model's memory, hand it the actual source material right before it answers.",
    "Step one: chop your document into overlapping chunks — small enough to be specific, overlapping enough that an idea split across a chunk boundary doesn't get orphaned.",
    "Step two: turn every chunk into a point in space (an embedding) — exactly like ch3, except now it's real chunks of YOUR document, not hand-placed toy words.",
    "Step three: when a question comes in, embed IT too, then find whichever chunks are closest by cosine similarity — that's retrieval. Stuff those chunks into the prompt, then ask the model to answer using ONLY that context — that's augmented generation.",
    "Quick clarifier, because this trips people up: the embedding model that just built your map (MiniLM, or the local fallback) is a COMPLETELY SEPARATE model from the LLM answering your question at the end. One turns text into searchable points in space. The other predicts next tokens. RAG is just the plumbing connecting the two — they are not the same model wearing two hats."
  ],
  simple: [
    "Imagine an open-book exam. Instead of trying to remember the whole textbook, you highlight the 3 most relevant paragraphs and put them right in front of you before answering. That's RAG.",
    "First you cut the textbook into index cards (chunking) — small enough to flip through fast, overlapping enough that you don't slice a sentence in half and lose the point.",
    "Then you give every index card a shelf location based on its topic (embedding) — cards about similar topics end up on nearby shelves.",
    "When the question comes in, you find the shelf location of the QUESTION itself, walk to the nearest cards, grab the top 3, and hand them to yourself before answering. That's retrieval, and 'answering using only what's on those 3 cards' is generation.",
    "One more thing: the librarian who organizes the shelves (the embedding model) and the person answering the exam question (the LLM) are two completely different people with two completely different jobs. Don't mix them up — RAG is just introducing them to each other."
  ],
  intro: {
    what: "build a full RAG pipeline in 5 stages: paste a document, chunk it, embed it, compute similarity, then ask a real question and get a real, context-grounded answer.",
    why: "this exact pipeline — chunk, embed, retrieve, stuff into prompt — is how every production RAG system works, from customer support bots to your college's chatbot.",
    how: "work top to bottom through the 5 stages. drag the chunk-size slider to see retrieval literally break."
  },
  challenge:
    "Set the chunk size absurdly small (like 20 characters) and ask your question again. Watch retrieval get worse — tiny chunks lose context. Then set it absurdly large (the whole document as 1 chunk) and watch a different failure: now EVERY question 'matches' because there's only one thing to match against. The sweet spot is real, and you just found both edges of it.",
  checkpoint: [
    {
      q: "What are the two separate things that happen in retrieval-augmented generation?",
      options: [
        "Tokenization and embedding",
        "Retrieval (find the most relevant chunks by embedding similarity) and generation (ask the LLM to answer using only those chunks as context)",
        "Training and fine-tuning",
        "Chunking and summarizing"
      ],
      answer: 1,
      why: "RAG is literally two steps glued together: find the relevant text (retrieval), then answer grounded in it (generation)."
    },
    {
      q: "Is the embedding model that powers search/RAG the same model that generates the final answer?",
      options: [
        "Yes, always the same model doing double duty",
        "No — they're two separate models with two separate jobs: one turns text into searchable points in space, the other predicts the answer text",
        "Only in small RAG systems",
        "There's no embedding model involved, only the LLM"
      ],
      answer: 1,
      why: "conflating these two is one of the most common RAG misunderstandings — the embedding model (like MiniLM) never writes a word of the final answer, it only organizes the search space."
    }
  ]
};
