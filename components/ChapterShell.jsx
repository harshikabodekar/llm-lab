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
import Ch8Playground from "./playgrounds/Ch8Playground";
import Ch9Playground from "./playgrounds/Ch9Playground";
import Ch10Playground from "./playgrounds/Ch10Playground";
import Ch11Playground from "./playgrounds/Ch11Playground";
import Boss1Playground from "./playgrounds/Boss1Playground";
import Ch12Playground from "./playgrounds/Ch12Playground";
import Ch13Playground from "./playgrounds/Ch13Playground";
import Ch14Playground from "./playgrounds/Ch14Playground";
import Ch15Playground from "./playgrounds/Ch15Playground";
import Ch16Playground from "./playgrounds/Ch16Playground";
import Ch17Playground from "./playgrounds/Ch17Playground";
import Ch18Playground from "./playgrounds/Ch18Playground";
import Ch19Playground from "./playgrounds/Ch19Playground";
import Ch20Playground from "./playgrounds/Ch20Playground";
import Ch21Playground from "./playgrounds/Ch21Playground";
import Ch22Playground from "./playgrounds/Ch22Playground";
import Ch23Playground from "./playgrounds/Ch23Playground";
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
import { CH8_CONTENT } from "../lib/content/ch8";
import { CH9_CONTENT } from "../lib/content/ch9";
import { CH10_CONTENT } from "../lib/content/ch10";
import { CH11_CONTENT } from "../lib/content/ch11";
import { BOSS1_CONTENT } from "../lib/content/boss1";
import { CH12_CONTENT } from "../lib/content/ch12";
import { CH13_CONTENT } from "../lib/content/ch13";
import { CH14_CONTENT } from "../lib/content/ch14";
import { CH15_CONTENT } from "../lib/content/ch15";
import { CH16_CONTENT } from "../lib/content/ch16";
import { CH17_CONTENT } from "../lib/content/ch17";
import { CH18_CONTENT } from "../lib/content/ch18";
import { CH19_CONTENT } from "../lib/content/ch19";
import { CH20_CONTENT } from "../lib/content/ch20";
import { CH21_CONTENT } from "../lib/content/ch21";
import { CH22_CONTENT } from "../lib/content/ch22";
import { CH23_CONTENT } from "../lib/content/ch23";
import { addCollected } from "../lib/recapDeck";

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
  ch7: { Playground: Ch7Playground, content: CH7_CONTENT },
  ch8: { Playground: Ch8Playground, content: CH8_CONTENT },
  ch9: { Playground: Ch9Playground, content: CH9_CONTENT },
  ch10: { Playground: Ch10Playground, content: CH10_CONTENT },
  ch11: { Playground: Ch11Playground, content: CH11_CONTENT },
  boss1: { Playground: Boss1Playground, content: BOSS1_CONTENT },
  ch12: { Playground: Ch12Playground, content: CH12_CONTENT },
  ch13: { Playground: Ch13Playground, content: CH13_CONTENT },
  ch14: { Playground: Ch14Playground, content: CH14_CONTENT },
  ch15: { Playground: Ch15Playground, content: CH15_CONTENT },
  ch16: { Playground: Ch16Playground, content: CH16_CONTENT },
  ch17: { Playground: Ch17Playground, content: CH17_CONTENT },
  ch18: { Playground: Ch18Playground, content: CH18_CONTENT },
  ch19: { Playground: Ch19Playground, content: CH19_CONTENT },
  ch20: { Playground: Ch20Playground, content: CH20_CONTENT },
  ch21: { Playground: Ch21Playground, content: CH21_CONTENT },
  ch22: { Playground: Ch22Playground, content: CH22_CONTENT },
  ch23: { Playground: Ch23Playground, content: CH23_CONTENT }
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
        {chapter.isBoss ? `part ${chapter.part} boss 👾` : `chapter ${String(chapter.num).padStart(2, "0")} · part ${chapter.part}`}
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
            <Checkpoint questions={entry.content.checkpoint} onComplete={() => addCollected(chapter.id)} />
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
