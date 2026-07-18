import Link from "next/link";
import { PARTS, CHAPTERS } from "../lib/chapters";
import RecapDeck from "../components/RecapDeck";
import ClickBook from "../components/ClickBook";
import PartProgress from "../components/PartProgress";
import RecallCard from "../components/RecallCard";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-14">
      {/* hero */}
      <p className="margin-note mb-4">lab notebook · entry 001 · property of: you</p>
      <h1
        className="font-display font-bold leading-[1.02] text-ink"
        style={{ fontSize: "clamp(2.4rem, 7vw, 4.2rem)" }}
      >
        Build your own AI.
        <br />
        <span className="hl">By hand.</span>
      </h1>
      <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-ink/80">
        No videos. No slides. You will tokenize text, tune neurons with your own
        cursor, train a real (tiny) GPT on your own writing, and build a RAG
        pipeline line by line — all in your browser, all free.
      </p>
      <p className="margin-note mt-4">
        24 chapters · real code · real models · ₹0
      </p>

      <div className="mt-10">
        <RecallCard />
        <RecapDeck />
        <ClickBook />
      </div>

      {/* journey map */}
      <div className="mt-14 space-y-12">
        {PARTS.map((part) => (
          <section key={part.id}>
            <div className="mb-4 flex flex-wrap items-baseline gap-3">
              <span className="font-mono text-sm text-inkblue">
                part {part.id}/4
              </span>
              <h2 className="font-display text-2xl font-semibold">
                {part.title}
              </h2>
              <span className="text-sm text-faded">— {part.subtitle}</span>
              <PartProgress
                partId={part.id}
                total={CHAPTERS.filter((c) => c.part === part.id && c.status === "live").length}
              />
            </div>

            <ol className="space-y-3">
              {CHAPTERS.filter((c) => c.part === part.id).map((c) => {
                const live = c.status === "live";
                const inner = (
                  <div
                    className={`sheet-flat flex items-start gap-4 p-4 ${
                      live ? "sheet hover:-translate-y-0.5 transition-transform" : "opacity-55"
                    } ${c.isBoss && live ? "bg-marker/20" : ""}`}
                  >
                    <span className="mt-0.5 font-mono text-sm text-inkblue">
                      {c.isBoss ? "👾" : String(c.num).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-semibold leading-snug">
                        {c.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink/70">
                        {c.hook}
                      </p>
                      <p className="mt-2 font-mono text-xs text-faded">
                        playground: {c.playground}
                        {!live && " · coming up in the build"}
                      </p>
                    </div>
                    {live && (
                      <span className="ml-auto shrink-0 bg-marker px-2 py-0.5 font-mono text-xs font-semibold">
                        open →
                      </span>
                    )}
                  </div>
                );
                return (
                  <li key={c.id}>
                    {live ? <Link href={`/chapter/${c.id}`}>{inner}</Link> : inner}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>

      <footer className="mt-16 border-t-2 border-ink/10 pt-6">
        <p className="font-mono text-xs text-faded">
          built by harshii · powered by pyodide, transformers.js & stubbornness
        </p>
      </footer>
    </main>
  );
}
