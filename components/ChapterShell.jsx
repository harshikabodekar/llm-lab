"use client";

import Link from "next/link";
import Ch1Playground from "./playgrounds/Ch1Playground";
import Checkpoint from "./Checkpoint";
import { CH1_CONTENT } from "../lib/content/ch1";

// registry: each chapter plugs its playground + content in here.
// on days 2-5 we add one entry per chapter — the shell never changes.
const REGISTRY = {
  ch1: { Playground: Ch1Playground, content: CH1_CONTENT }
};

function SectionLabel({ children }) {
  return (
    <p className="margin-note mb-3 uppercase tracking-wide">{children}</p>
  );
}

export default function ChapterShell({ chapter }) {
  const entry = REGISTRY[chapter.id];

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <Link href="/" className="font-mono text-sm text-inkblue hover:underline">
        ← back to the map
      </Link>

      <p className="margin-note mt-8">
        chapter {String(chapter.num).padStart(2, "0")} · part {chapter.part}
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold leading-tight">
        {chapter.title}
      </h1>

      {/* 1 · hook */}
      <section className="mt-10">
        <SectionLabel>the hook</SectionLabel>
        <p className="font-display text-xl leading-relaxed">
          <span className="hl">{chapter.hook}</span>
        </p>
      </section>

      {entry ? (
        <>
          {/* 2 · concept */}
          <section className="mt-12">
            <SectionLabel>the idea</SectionLabel>
            <div className="space-y-4 text-[1.02rem] leading-relaxed text-ink/90">
              {entry.content.concept.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          {/* 3 · playground */}
          <section className="mt-12">
            <SectionLabel>playground — your hands now</SectionLabel>
            <entry.Playground />
          </section>

          {/* 4 · challenge */}
          <section className="mt-12">
            <SectionLabel>try this</SectionLabel>
            <div className="sheet p-5">
              <p className="leading-relaxed">{entry.content.challenge}</p>
            </div>
          </section>

          {/* 5 · checkpoint */}
          <section className="mt-12">
            <SectionLabel>checkpoint</SectionLabel>
            <Checkpoint questions={entry.content.checkpoint} />
          </section>
        </>
      ) : (
        <section className="mt-12">
          <div className="sheet p-6">
            <p className="font-mono text-sm">
              this chapter's playground is being built during the 5-day sprint.
              the shell, engines and syllabus are ready — content lands here next.
            </p>
          </div>
        </section>
      )}

      {/* 6 · recap card */}
      <section className="mt-12">
        <SectionLabel>recap card — keep this</SectionLabel>
        <div className="sheet bg-marker/30 p-5">
          <p className="font-mono text-sm leading-relaxed">{chapter.recap}</p>
        </div>
      </section>
    </main>
  );
}
