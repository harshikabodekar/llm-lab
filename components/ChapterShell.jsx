"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TutorPanel from "./TutorPanel";
import { CHAPTERS } from "../lib/chapters";
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
import Boss2Playground from "./playgrounds/Boss2Playground";
import Boss3Playground from "./playgrounds/Boss3Playground";
import Boss4Playground from "./playgrounds/Boss4Playground";
import Checkpoint from "./Checkpoint";
import WhatWhyHow from "./WhatWhyHow";
import Pip from "./Pip";
import ClickButton from "./ClickButton";
import { CONTENT } from "../lib/contentRegistry";
import { addCollected } from "../lib/recapDeck";
import { hasZeroClicks, wasNudged, markNudged } from "../lib/clickbook";
import { firePipStuck, firePipCelebrate } from "../lib/pipCooldown";

// registry: each chapter plugs its playground in here, content comes from
// lib/contentRegistry.js. on days 2-5 we add one entry per chapter — the
// shell never changes.
const PLAYGROUNDS = {
  ch0: Ch0Playground,
  ch1: Ch1Playground,
  ch2: Ch2Playground,
  ch3: Ch3Playground,
  ch4: Ch4Playground,
  ch5: Ch5Playground,
  ch6: Ch6Playground,
  ch7: Ch7Playground,
  ch8: Ch8Playground,
  ch9: Ch9Playground,
  ch10: Ch10Playground,
  ch11: Ch11Playground,
  boss1: Boss1Playground,
  ch12: Ch12Playground,
  ch13: Ch13Playground,
  ch14: Ch14Playground,
  ch15: Ch15Playground,
  ch16: Ch16Playground,
  ch17: Ch17Playground,
  ch18: Ch18Playground,
  ch19: Ch19Playground,
  ch20: Ch20Playground,
  ch21: Ch21Playground,
  ch22: Ch22Playground,
  ch23: Ch23Playground,
  boss2: Boss2Playground,
  boss3: Boss3Playground,
  boss4: Boss4Playground
};

function SectionLabel({ children }) {
  return (
    <p className="margin-note mb-3 uppercase tracking-wide">{children}</p>
  );
}

// the idea section, with an optional "explain with example" toggle.
// every chapter gets this for free by just adding a `simple` array
// (same shape as `concept`) to its content file — nothing else to wire up.
//
// also watches its own dwell time: if this section stays the dominant
// thing on screen for 45s with no interaction, pip offers a different
// explanation. one shot per mount (i.e. per chapter visit).
function ConceptSection({ concept, simple }) {
  const [showSimple, setShowSimple] = useState(false);
  const sectionRef = useRef(null);
  const idleFiredRef = useRef(false);
  const active = showSimple && simple;
  const paragraphs = active ? simple : concept;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let timer = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (idleFiredRef.current) return;
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          timer = setTimeout(() => {
            idleFiredRef.current = true;
            firePipStuck({
              message: "this one's dense. want it explained differently?",
              question: "Can you explain this chapter's idea a different way? I've been stuck reading it for a while."
            });
          }, 45_000);
        } else if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      },
      { threshold: [0, 0.5, 1] }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={sectionRef}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <SectionLabel>the idea</SectionLabel>
        <div className="flex flex-wrap gap-2">
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
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("ask-tutor", {
                  detail: { question: "Can you explain this chapter's idea a completely different way?" }
                })
              )
            }
            className="btn-paper px-3 py-1.5 font-mono text-xs"
          >
            explain this differently 🎓
          </button>
          <ClickButton section="the idea" />
        </div>
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
    </div>
  );
}

function nextLiveChapter(chapter) {
  const i = CHAPTERS.findIndex((c) => c.id === chapter.id);
  for (let j = i + 1; j < CHAPTERS.length; j++) {
    if (CHAPTERS[j].status === "live") return CHAPTERS[j];
  }
  return null;
}

export default function ChapterShell({ chapter }) {
  const Playground = PLAYGROUNDS[chapter.id];
  const content = CONTENT[chapter.id];
  const entry = Playground && content ? { Playground, content } : null;
  const next = nextLiveChapter(chapter);
  const checkpointWrongCount = useRef(0);

  function handleCheckpointWrong() {
    checkpointWrongCount.current += 1;
    if (checkpointWrongCount.current === 2) {
      firePipStuck({
        message: "want me to re-explain the idea behind this one?",
        question: `Can you re-explain the core idea behind "${chapter.title}"? I got the checkpoint question wrong twice.`
      });
    }
  }

  function handleCheckpointComplete() {
    addCollected(chapter.id);
    if (chapter.isBoss) firePipCelebrate();
    if (hasZeroClicks(chapter.id) && !wasNudged(chapter.id)) {
      markNudged(chapter.id);
      firePipStuck({
        message: "nothing clicked? tell me what's foggy",
        question: `Nothing in "${chapter.title}" clicked for me yet — can you help me figure out what's confusing?`
      });
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <TutorPanel chapter={chapter} content={entry?.content} />
      <Pip />
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
            <Checkpoint
              questions={entry.content.checkpoint}
              onComplete={handleCheckpointComplete}
              onWrong={handleCheckpointWrong}
            />
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

      {/* 7 · next chapter */}
      <section className="mt-12 text-center">
        {next ? (
          <Link href={`/chapter/${next.id}`} className="btn-ink inline-block px-6 py-3 font-mono text-sm">
            {next.isBoss ? `next: ${next.title} 👾` : `next chapter → ${next.title}`}
          </Link>
        ) : (
          <div className="sheet bg-marker/30 p-5">
            <p className="font-mono text-sm">
              🎉 that's every chapter live so far — you've reached the end of what's built. more landing soon.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
