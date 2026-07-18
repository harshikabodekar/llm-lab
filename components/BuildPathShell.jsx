"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CHAPTERS } from "../lib/chapters";
import { getChecked, toggleChecked } from "../lib/progress";
import Pip from "./Pip";
import TutorPanel from "./TutorPanel";
import ProgressRing from "./ProgressRing";
import {
  TRACKS,
  MODEL_DECISION,
  WORKSPACE,
  CORE_STEPS,
  EVAL,
  UI_SNIPPETS,
  DEPLOY_OPTIONS,
  PORTFOLIO,
  STAGES
} from "../lib/content/buildPath";

const NAME_KEY = "llm-lab-build-path-name";
const TRACK_KEY = "llm-lab-build-path-track";
const LIST_ID = "build-path-stages";

const SHIP_HOW = [
  "pick based on what you're actually deploying — a pure API-calling app fits almost anywhere; a locally-run model needs a VPS or a GPU-backed Space."
];

function ChapterLinks({ ids }) {
  if (!ids || ids.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((id) => {
        const ch = CHAPTERS.find((c) => c.id === id);
        return (
          <Link
            key={id}
            href={`/chapter/${id}`}
            className="token-chip bg-inkblue/5 text-inkblue hover:bg-inkblue/10"
          >
            {id} — {ch?.title || id}
          </Link>
        );
      })}
    </div>
  );
}

function CopyBlock({ code, label }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — the code is still visible and selectable
    }
  }

  return (
    <div>
      {label && <p className="mb-1 font-mono text-[0.65rem] text-faded">{label}</p>}
      <div className="relative">
        <pre className="whitespace-pre-wrap border-[1.5px] border-ink/20 bg-paper p-3 pr-16 font-mono text-xs leading-relaxed">
          {code}
        </pre>
        <button onClick={copy} className="btn-paper absolute right-2 top-2 px-2 py-1 font-mono text-[0.65rem]">
          {copied ? "✓ copied" : "copy"}
        </button>
      </div>
    </div>
  );
}

function TrackPlaceholder() {
  return (
    <p className="border-[1.5px] border-dashed border-ink/30 p-3 font-mono text-xs text-faded">
      pick a track in stage 1 to see this filled in ↑
    </p>
  );
}

function StageCard({ stage, isChecked, onToggle, how, links, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sheet p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={isChecked} onChange={onToggle} className="mt-1 h-4 w-4 shrink-0" />
          <span>
            <span className="margin-note mb-1 block">stage {stage.n} / 8</span>
            <span className="font-display text-xl font-semibold">{stage.title}</span>
          </span>
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <ChapterLinks ids={links} />
          {how && (
            <button onClick={() => setOpen((v) => !v)} className="btn-paper px-3 py-1.5 font-mono text-xs">
              {open ? "hide how ▲" : "how ▼"}
            </button>
          )}
        </div>
      </div>

      {open && how && (
        <div className="mt-4 space-y-2 border-t-2 border-ink/10 pt-4 text-sm leading-relaxed text-ink/80">
          {how.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default function BuildPathShell() {
  const [projectName, setProjectName] = useState("");
  const [track, setTrack] = useState(null);
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    setProjectName(window.localStorage.getItem(NAME_KEY) || "");
    setTrack(window.localStorage.getItem(TRACK_KEY) || null);
    setChecked(getChecked(LIST_ID));
  }, []);

  useEffect(() => {
    if (track && !checked.includes("pick-project")) {
      setChecked(toggleChecked(LIST_ID, "pick-project"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track]);

  function updateName(v) {
    setProjectName(v);
    window.localStorage.setItem(NAME_KEY, v);
  }

  function pickTrack(id) {
    setTrack(id);
    window.localStorage.setItem(TRACK_KEY, id);
  }

  function toggleStage(stageId) {
    setChecked(toggleChecked(LIST_ID, stageId));
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <TutorPanel
        chapter={{ id: "build-path", title: "The Build Path" }}
        content={{ concept: ["a practical, step-by-step guide for turning a finished lesson plan into a real shipped project."] }}
      />
      <Pip />

      <Link href="/" className="font-mono text-sm text-inkblue hover:underline">
        ← back to the map
      </Link>

      <p className="margin-note mt-8">from learning to shipping</p>
      <h1 className="mt-2 font-display text-4xl font-bold leading-tight">The Build Path 🛠️</h1>
      <p className="mt-4 max-w-xl text-[1.05rem] leading-relaxed text-ink/80">
        you finished the chapters. this isn't another lesson — it's a practical checklist for turning what you
        learned into something real: picked, built, evaluated, deployed, and on your portfolio.
      </p>

      <div className="sheet mt-8 flex flex-wrap items-center gap-5 p-5">
        <ProgressRing completed={checked.length} total={STAGES.length} />
        <div className="min-w-[200px] flex-1">
          <label className="margin-note mb-1 block">your project</label>
          <input
            value={projectName}
            onChange={(e) => updateName(e.target.value)}
            placeholder="name it something — even a bad name"
            spellCheck={false}
            className="w-full border-[1.5px] border-ink bg-paper px-3 py-2 font-mono text-sm focus:outline-none"
          />
        </div>
      </div>

      <p className="mt-8 mb-5 w-fit border-[1.5px] border-ink bg-marker px-3 py-1.5 font-mono text-xs">
        start here → pick a track, then work top to bottom, checking off each stage as you finish it.
      </p>

      <div className="flex flex-col gap-6">
        {/* stage 1 — pick your project */}
        <StageCard
          stage={STAGES[0]}
          isChecked={checked.includes("pick-project")}
          onToggle={() => toggleStage("pick-project")}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {TRACKS.map((t) => {
              const selected = track === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => pickTrack(t.id)}
                  className={`sheet-flat flex flex-col gap-2 bg-white p-4 text-left transition-transform hover:-translate-y-0.5 ${
                    selected ? "border-[2.5px] border-inkblue bg-inkblue/5" : ""
                  }`}
                >
                  <p className="font-display text-lg font-semibold">
                    {t.emoji} {t.label}
                  </p>
                  <p className="text-sm text-ink/70">{t.tagline}</p>
                  <p className="font-mono text-[0.65rem] text-faded">good for: {t.goodFor}</p>
                  <p className="font-mono text-[0.65rem] text-faded">effort: {t.effort}</p>
                  <p className="font-mono text-[0.65rem] text-faded">you'll need: {t.needs}</p>
                  {selected && <span className="mt-1 font-mono text-xs text-inkblue">✓ selected</span>}
                </button>
              );
            })}
          </div>
        </StageCard>

        {/* stage 2 — pick your model */}
        <StageCard
          stage={STAGES[1]}
          isChecked={checked.includes("pick-model")}
          onToggle={() => toggleStage("pick-model")}
          how={MODEL_DECISION.how}
          links={MODEL_DECISION.links}
        >
          {track && MODEL_DECISION.trackHints[track] && (
            <p className="sheet-flat bg-marker/20 p-3 font-mono text-xs leading-relaxed">
              {MODEL_DECISION.trackHints[track]}
            </p>
          )}
        </StageCard>

        {/* stage 3 — set up your workspace */}
        <StageCard
          stage={STAGES[2]}
          isChecked={checked.includes("workspace")}
          onToggle={() => toggleStage("workspace")}
        >
          {!track ? (
            <TrackPlaceholder />
          ) : (
            <div className="flex flex-col gap-3">
              <CopyBlock label="commands" code={WORKSPACE[track].commands.join("\n")} />
              <CopyBlock label="key / model setup" code={WORKSPACE[track].keySetup} />
              {WORKSPACE[track].localAlt && (
                <p className="font-mono text-xs text-faded">{WORKSPACE[track].localAlt}</p>
              )}
            </div>
          )}
        </StageCard>

        {/* stage 4 — build the core */}
        <StageCard
          stage={STAGES[3]}
          isChecked={checked.includes("core")}
          onToggle={() => toggleStage("core")}
        >
          {!track ? (
            <TrackPlaceholder />
          ) : (
            <ol className="flex flex-col gap-3">
              {CORE_STEPS[track].map((s, i) => (
                <li key={i} className="sheet-flat bg-white p-3">
                  <p className="font-mono text-sm font-semibold">
                    {i + 1}. {s.step}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink/70">{s.how}</p>
                  <div className="mt-2">
                    <ChapterLinks ids={s.links} />
                  </div>
                  <p className="mt-2 border-l-2 border-inkblue pl-2 font-mono text-xs leading-relaxed text-inkblue/90">
                    {s.production}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </StageCard>

        {/* stage 5 — evaluate */}
        <StageCard
          stage={STAGES[4]}
          isChecked={checked.includes("evaluate")}
          onToggle={() => toggleStage("evaluate")}
          how={EVAL.how}
          links={EVAL.links}
        >
          <CopyBlock label="eval template" code={EVAL.template} />
        </StageCard>

        {/* stage 6 — wrap it in a UI */}
        <StageCard
          stage={STAGES[5]}
          isChecked={checked.includes("ui")}
          onToggle={() => toggleStage("ui")}
          how={[UI_SNIPPETS.how]}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <CopyBlock label="streamlit" code={UI_SNIPPETS.streamlit} />
            <CopyBlock label="next.js api route" code={UI_SNIPPETS.nextjs} />
          </div>
        </StageCard>

        {/* stage 7 — ship it */}
        <StageCard
          stage={STAGES[6]}
          isChecked={checked.includes("ship")}
          onToggle={() => toggleStage("ship")}
          how={SHIP_HOW}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DEPLOY_OPTIONS.map((d) => (
              <div key={d.name} className="sheet-flat bg-white p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-mono text-sm font-semibold">{d.name}</p>
                  <span className="font-mono text-xs text-signal">{d.cost}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-ink/70">{d.good}</p>
                <p className="mt-1 font-mono text-[0.65rem] leading-relaxed text-faded">watch out: {d.catch}</p>
              </div>
            ))}
          </div>
        </StageCard>

        {/* stage 8 — show it */}
        <StageCard
          stage={STAGES[7]}
          isChecked={checked.includes("show")}
          onToggle={() => toggleStage("show")}
          how={PORTFOLIO.how}
        >
          <div className="flex flex-wrap gap-2">
            {PORTFOLIO.outline.map((o, i) => (
              <span key={i} className="token-chip bg-marker/20">
                {o}
              </span>
            ))}
          </div>
        </StageCard>
      </div>

      <section className="mt-12 text-center">
        {checked.length === STAGES.length ? (
          <div className="sheet bg-marker/30 p-5">
            <p className="font-mono text-sm">
              🎉 all 8 stages checked off — {projectName ? `"${projectName}" is` : "your project is"} shipped. that's
              not a course completion, that's a real thing that exists now.
            </p>
          </div>
        ) : (
          <p className="font-mono text-xs text-faded">
            {checked.length}/{STAGES.length} stages checked off — keep going.
          </p>
        )}
      </section>
    </main>
  );
}
