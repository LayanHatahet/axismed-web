"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EcgCanvas } from "./EcgCanvas";
import { Magnetic } from "./Magnetic";

const QUESTIONS = [
  {
    q: "A patient sees your logo next to three competitors. Do they remember yours?",
    options: [
      { label: "Every time", score: 2 },
      { label: "Maybe", score: 1 },
      { label: "Honestly, no", score: 0 },
    ],
  },
  {
    q: "Does your website book patients while you sleep?",
    options: [
      { label: "Like clockwork", score: 2 },
      { label: "Sometimes", score: 1 },
      { label: "We still rely on phone calls", score: 0 },
    ],
  },
  {
    q: "When people search their symptoms in your city, do they find you?",
    options: [
      { label: "First page, every term", score: 2 },
      { label: "Page two-ish", score: 1 },
      { label: "We're invisible", score: 0 },
    ],
  },
  {
    q: "Does your digital experience match the quality of your care?",
    options: [
      { label: "Perfectly", score: 2 },
      { label: "Not quite", score: 1 },
      { label: "Not even close", score: 0 },
    ],
  },
];

function verdictFor(score: number) {
  if (score >= 7)
    return {
      code: "STABLE",
      color: "var(--axm-green)",
      line: "Impressive vitals. Now imagine them with a creative partner who only does healthcare — stable is the floor, iconic is the ceiling.",
      rx: ["Brand elevation", "Conversion tuning", "Category leadership"],
    };
  if (score >= 4)
    return {
      code: "ELEVATED RISK",
      color: "var(--axm-cyan)",
      line: "Symptoms of brand fatigue detected. Patients are choosing on price because nothing else differentiates you. Treatable — if treated early.",
      rx: ["Identity refresh", "Website rebuild", "Growth marketing"],
    };
  return {
    code: "CRITICAL",
    color: "var(--axm-coral)",
    line: "Your brand needs resuscitation. The good news: critical patients make the most dramatic recoveries — and we love a dramatic recovery.",
    rx: ["Full rebrand", "New website", "App strategy", "Launch campaign"],
  };
}

/**
 * "Free brand check-up" — a 60-second interactive triage that ends in a
 * prognosis and a prescription. The whole thing runs client-side.
 */
export function DiagnosisSection() {
  const [step, setStep] = useState(0); // 0..3 questions, 4 analyzing, 5 result
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (step !== QUESTIONS.length) return;
    const t = setTimeout(() => setStep(QUESTIONS.length + 1), 1600);
    return () => clearTimeout(t);
  }, [step]);

  const answering = step < QUESTIONS.length;
  const analyzing = step === QUESTIONS.length;
  const done = step > QUESTIONS.length;
  const verdict = verdictFor(score);

  return (
    <section id="checkup" className="axm-frame relative py-20 lg:py-28">
      <span className="axm-tick axm-tick-tl" aria-hidden="true" />
      <span className="axm-tick axm-tick-tr" aria-hidden="true" />

      <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
        <p className="axm-mono mb-4 text-center">/ 07 — free triage</p>
        <h2 className="axm-display text-center text-[clamp(2.2rem,5vw,4.2rem)] uppercase">
          Is your brand <span className="text-[var(--axm-green)]">healthy?</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-[var(--axm-muted)]">
          Four questions. Sixty seconds. An honest prognosis — no email required.
        </p>

        <div className="relative mx-auto mt-12 min-h-[380px] overflow-hidden rounded-2xl border border-[var(--axm-line-2)] bg-[var(--axm-surface)]">
          {/* monitor header */}
          <div className="flex items-center justify-between border-b border-[var(--axm-line)] px-5 py-3">
            <span className="axm-mono flex items-center gap-2 !text-[0.55rem]">
              <span className="axm-live-dot !h-1.5 !w-1.5" aria-hidden="true" />
              brand triage unit
            </span>
            <span className="axm-mono !text-[0.55rem] tabular-nums">
              {answering ? `Q${step + 1} / ${QUESTIONS.length}` : done ? "REPORT" : "…"}
            </span>
          </div>

          <div className="p-6 sm:p-10">
            <AnimatePresence mode="wait">
              {answering && (
                <motion.div
                  key={`q-${step}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="axm-display text-xl leading-snug sm:text-2xl">
                    {QUESTIONS[step].q}
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {QUESTIONS[step].options.map((o) => (
                      <button
                        key={o.label}
                        onClick={() => {
                          setScore((s) => s + o.score);
                          setStep((s) => s + 1);
                        }}
                        className="rounded-xl border border-[var(--axm-line-2)] bg-[var(--axm-bg-2)] px-5 py-4 text-left text-sm transition-all duration-300 hover:border-[var(--axm-green)] hover:bg-[rgba(44,255,192,0.06)] hover:shadow-[0_0_24px_rgba(44,255,192,0.15)]"
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                  {/* progress */}
                  <div className="mt-8 flex gap-1.5" aria-hidden="true">
                    {QUESTIONS.map((_, i) => (
                      <span
                        key={i}
                        className="h-1 flex-1 rounded-full transition-colors duration-300"
                        style={{
                          background: i <= step ? "var(--axm-green)" : "var(--axm-elevated)",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {analyzing && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-8"
                >
                  <div className="h-20 w-full max-w-sm">
                    <EcgCanvas className="h-full w-full" beatsPerSweep={3} amplitude={0.36} />
                  </div>
                  <p className="axm-mono mt-6 axm-blink">running diagnostics…</p>
                </motion.div>
              )}

              {done && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center"
                >
                  <p className="axm-mono !text-[0.58rem]">prognosis</p>
                  <p
                    className="axm-display mt-3 text-4xl uppercase sm:text-5xl"
                    style={{ color: verdict.color, textShadow: `0 0 40px ${verdict.color}` }}
                  >
                    {verdict.code}
                  </p>
                  <p className="mx-auto mt-5 max-w-lg leading-relaxed text-[var(--axm-muted)]">
                    {verdict.line}
                  </p>

                  <p className="axm-mono mt-8 !text-[0.58rem]">prescription</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {verdict.rx.map((r) => (
                      <span
                        key={r}
                        className="rounded-full border border-[var(--axm-line-2)] bg-[var(--axm-bg-2)] px-4 py-1.5 text-xs"
                      >
                        ✚ {r}
                      </span>
                    ))}
                  </div>

                  <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                    <Magnetic>
                      <a href="#contact" className="axm-btn axm-btn-solid">
                        Book the consultation
                      </a>
                    </Magnetic>
                    <button
                      onClick={() => {
                        setScore(0);
                        setStep(0);
                      }}
                      className="axm-mono !text-[0.6rem] underline decoration-[var(--axm-line-2)] underline-offset-4 transition-colors hover:!text-[var(--axm-green)]"
                    >
                      retake check-up
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
