"use client";

import { useState } from "react";
import Link from "next/link";
import Ch0Playground from "./playgrounds/Ch0Playground";
import Ch1Playground from "./playgrounds/Ch1Playground";
import Ch2Playground from "./playgrounds/Ch2Playground";
import Ch3Playground from "./playgrounds/Ch3Playground";
import Ch4Playground from "./playgrounds/Ch4Playground";
import Ch5Playground from "./playgrounds/Ch5Playground";
import Ch6Playground from "./playgrounds/Ch6Playground";
import Ch7Playground from "./playgrounds/Ch7Playground";
import Checkpoint from "./Checkpoint";
import WhatWhyHow from "./WhatWhyHow";
import { CH0_CONTENT } from "../lib/content/ch0";
import { CH1_CONTENT } from "../lib/content/ch1";
import { CH2_CONTENT } from "../lib/content/ch2";
import { CH3_CONTENT } from "../lib/content/ch3";
import { CH4_CONTENT } from "../lib/content/ch4";
import { CH5_CONTENT } from "../lib/content/ch5";
import { CH6_CONTENT } from "../lib/content/ch6";
import { CH7_CONTENT } from "../lib/content/ch7";

// registry: each chapter plugs its playground + content in here.
// on days 2-5 we add one entry per chapter — the shell never changes.
const REGISTRY = {
  ch0: { Playground: Ch0Playground, content: CH0_CONTENT },
  ch1: { Playground: Ch1Playground, content: CH1_CONTENT },
  ch2: { Playground: Ch2Playground, content: CH2_CONTENT },
  ch3: { Playground: Ch3Playground, content: CH3_CONTENT },
  ch4: { Playground: Ch4Playground, content: CH4_CONTENT },
  ch5: { Playground: Ch5Playground, content: CH5_CONTENT },
  ch6: { Playground: Ch6Playground, content: CH6_CONTENT },
  ch7: { Playground: Ch7Playground, content: CH7_CONTENT }
};

function SectionLabel({ children }) {
  return (
    <p className="margin-note mb-3 uppercase tracking-wide">{children}</p>
  );
}

// the idea section, with an optional "explain with example" toggle.
// every chapter gets this for free by just adding a `simple` array
// (same shape as `concept`) to its content file — nothing else to wire up.
function ConceptSection({ concept, simple }) {
  const [showSimple, setShowSimple] = useState(false);
  const active = showSimple && simple;
  const paragraphs = active ? simple : concept;

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <SectionLabel>the idea</SectionLabel>
        {simple && (
          <button
            onClick={() => setShowSimple((v) => !v)}
            className={`px-3 py-1.5 font-mono text-xs ${
              active ? "border-[1.5px] border-ink bg-marker" : "btn-paper"
            }`}
          >
            explain with example 🌱
          </button>
        )}
      </div>
      <div
        className={`space-y-4 text-[1.02rem] leading-relaxed text-ink/90 ${
          active ? "sheet bg-marker/20 p-5" : ""
        }`}
      >
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </>
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
            <ConceptSection concept={entry.content.concept} simple={entry.content.simple} />
          </section>

          {/* 3 · playground */}
          <section className="mt-12">
            <SectionLabel>playground — your hands now</SectionLabel>
            {entry.content.intro && <WhatWhyHow {...entry.content.intro} />}
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
