"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const STEPS = [
  {
    phase: "Consultation",
    tag: "we listen before we prescribe",
    copy: "A deep intake session: your goals, your patients, your competitors, your constraints. No pitch decks — just the right questions.",
  },
  {
    phase: "Diagnosis",
    tag: "research & strategy",
    copy: "Market scans, patient-journey mapping and brand audits reveal exactly where the pain is — and where the opportunity hides.",
  },
  {
    phase: "Prescription",
    tag: "concept & direction",
    copy: "Creative territories, naming routes and design directions — prototyped, pressure-tested and prescribed with a clear rationale.",
  },
  {
    phase: "Operation",
    tag: "design & build",
    copy: "Identity, website, app, campaign — crafted by senior specialists under one roof, reviewed weekly with your team.",
  },
  {
    phase: "Recovery",
    tag: "launch & handover",
    copy: "QA on every device, compliance sign-off, staff training and a launch choreographed to make noise in the market.",
  },
  {
    phase: "Follow-up",
    tag: "growth & care plan",
    copy: "Monthly vitals reviews: analytics, campaign optimization and continuous care. We stay on call long after launch.",
  },
];

/** A tiny ECG blip that draws itself when its step becomes active. */
function Blip() {
  return (
    <svg viewBox="0 0 48 24" className="h-6 w-12" fill="none" aria-hidden="true">
      <motion.path
        d="M0 12 H14 L18 12 L21 4 L25 20 L28 9 L31 12 H48"
        stroke="var(--axm-accent)"
        strokeWidth="2"
        className="axm-glow-accent"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
}

/**
 * "From first symptom to full recovery" — a vertical rhythm strip that fills
 * as the visitor scrolls; each phase lights up as the line reaches it.
 */
export function ProcessSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.75"] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <section ref={ref} id="process" className="axm-frame relative py-20 lg:py-28">
      <span className="axm-tick axm-tick-tl" aria-hidden="true" />
      <span className="axm-tick axm-tick-tr" aria-hidden="true" />

      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <p className="axm-mono mb-4">/ 05 — standard operating procedure</p>
        <h2 className="axm-display max-w-3xl text-[clamp(2.2rem,5.5vw,4.6rem)] uppercase">
          From first symptom <span className="axm-outline-text">to full recovery</span>
        </h2>

        <div className="relative mt-16 lg:mt-24">
          {/* the drawn line */}
          <div className="absolute bottom-0 left-[11px] top-0 w-px bg-[var(--axm-line)] lg:left-1/2" aria-hidden="true">
            <motion.div
              style={{ scaleY: fill }}
              className="h-full w-full origin-top bg-[var(--axm-accent)] shadow-[0_0_14px_rgba(179,166,236,0.7)]"
            />
          </div>

          <ol className="space-y-16 lg:space-y-24">
            {STEPS.map((s, i) => {
              const left = i % 2 === 0;
              return (
                <li key={s.phase} className="relative lg:grid lg:grid-cols-2 lg:gap-20">
                  {/* node */}
                  <motion.span
                    aria-hidden="true"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 1 }}
                    transition={{ type: "spring", stiffness: 320, damping: 18 }}
                    className="absolute left-[5px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--axm-accent)] bg-[var(--axm-bg)] shadow-[0_0_16px_rgba(179,166,236,0.8)] lg:left-1/2 lg:-translate-x-1/2"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className={`pl-10 lg:pl-0 ${
                      left ? "lg:col-start-1 lg:pr-4 lg:text-right" : "lg:col-start-2 lg:pl-4"
                    }`}
                  >
                    <div className={`flex items-center gap-4 ${left ? "lg:justify-end" : ""}`}>
                      <span className="axm-mono !text-[0.58rem]">phase 0{i + 1}</span>
                      <Blip />
                    </div>
                    <h3 className="axm-display mt-3 text-3xl uppercase lg:text-4xl">{s.phase}</h3>
                    <p className="mt-1 text-sm font-medium text-[var(--axm-accent)]">{s.tag}</p>
                    <p className={`mt-4 max-w-md leading-relaxed text-[var(--axm-muted)] ${left ? "lg:ml-auto" : ""}`}>
                      {s.copy}
                    </p>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
