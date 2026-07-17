export const CH14_CONTENT = {
  concept: [
    "Every model has a hard limit on how much text it can 'see' at once — the context window. Once your conversation crosses that limit, the oldest parts don't get summarized or compressed, they just vanish from what the model can see.",
    "This isn't the model 'forgetting' emotionally — it's a hard technical wall. Old messages get pushed out, and there's no traceback, no partial memory. Gone means gone.",
    "There's also a cost side to this: every token you keep in context has to be reprocessed (or at least re-referenced) on every new turn, which is why long conversations get slower and pricier as they grow — more on that in the KV cache section below.",
    "Fill the memory tank below and watch it happen — add messages, watch older ones get pushed out, then try asking about something that already fell out."
  ],
  simple: [
    "Imagine a whiteboard with a fixed size. Every new note you write, you have to erase something old to make room — you don't get to decide what, the OLDEST thing on the board just gets wiped.",
    "The model isn't choosing to forget — the whiteboard is just full. Whatever got erased is genuinely gone, no partial memory, no 'I sort of remember.'",
    "Every time you look at the whiteboard to write a new note, you also have to re-read everything currently on it — more stuff on the board, more re-reading, which is why long conversations get slower AND cost more.",
    "Fill the tank below, watch old messages get pushed out, then ask about something that already got erased."
  ],
  intro: {
    what: "add messages to a fake chat and watch the token tank fill up, then overflow and push out old messages.",
    why: "this is exactly why long chats 'forget' the start — it's not memory loss, it's a hard token budget with nowhere for old tokens to go.",
    how: "add a few filler messages until the tank overflows, then ask about the very first message and see if it still works."
  },
  challenge:
    "Raise the stakes: imagine putting an important fact in your SECOND message instead of the first, then filling the tank. Would it survive longer than the first message did? By how much? That's context budgeting — the same instinct behind why system prompts usually go first.",
  checkpoint: [
    {
      q: "When a conversation exceeds the context window, what actually happens to the oldest messages?",
      options: [
        "They get automatically summarized into a shorter version",
        "They're dropped entirely — not summarized, not compressed — the model literally cannot see them anymore",
        "They're saved to a database and retrieved later automatically",
        "Nothing — models have unlimited context"
      ],
      answer: 1,
      why: "unless an app explicitly builds summarization or retrieval on top, a plain context window just drops what doesn't fit — completely, with no residue."
    },
    {
      q: "Why do long conversations get slower and more expensive, even with KV caching turned on?",
      options: [
        "KV caching doesn't actually work",
        "The cache itself grows with every new token — caching avoids RE-computing old tokens, but storing and referencing a bigger cache still costs more",
        "Longer conversations always contain harder questions",
        "The model gets tired and needs to 'warm up' again"
      ],
      answer: 1,
      why: "KV caching saves you from re-processing old tokens from scratch, but the cache still has to live in memory and get referenced on every step — bigger cache, more cost, even with the optimization."
    }
  ]
};
