"use client";

import { useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";

/**
 * Sticky diagnosis: the copy illuminates word by word as the visitor scrubs,
 * ending on a defibrillator flash for "adrenaline".
 */

type Tone = "normal" | "coral" | "green";

const TEXT: Array<{ w: string; tone?: Tone }> = [
  { w: "Diagnosis:" },
  { w: "most" },
  { w: "medical" },
  { w: "brands" },
  { w: "are" },
  { w: "flatlining.", tone: "coral" },
  { w: "Template" },
  { w: "logos." },
  { w: "Websites" },
  { w: "that" },
  { w: "feel" },
  { w: "like" },
  { w: "waiting" },
  { w: "rooms." },
  { w: "Apps" },
  { w: "nobody" },
  { w: "opens" },
  { w: "twice." },
  { w: "Your" },
  { w: "patients" },
  { w: "deserve" },
  { w: "better —" },
  { w: "so" },
  { w: "we" },
  { w: "became" },
  { w: "the" },
  { w: "adrenaline.", tone: "green" },
];

function Word({
  word,
  tone = "normal",
  index,
  total,
  progress,
}: {
  word: string;
  tone?: Tone;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = (index / total) * 0.82;
  const end = start + 0.82 / total;
  const opacity = useTransform(progress, [start, end], [0.1, 1]);
  const color =
    tone === "coral"
      ? "var(--axm-coral)"
      : tone === "green"
        ? "var(--axm-green)"
        : "var(--axm-text)";

  return (
    <motion.span
      style={{ opacity, color }}
      className={tone !== "normal" ? "axm-glow-green" : undefined}
    >
      {word}{" "}
    </motion.span>
  );
}

export function ManifestoSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const flash = useTransform(scrollYProgress, [0.84, 0.9, 1], [0, 0.4, 0]);

  return (
    <section ref={ref} className="axm-frame relative h-[280vh]">
      <span className="axm-tick axm-tick-tl" aria-hidden="true" />
      <span className="axm-tick axm-tick-tr" aria-hidden="true" />

      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* defib flash */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: flash }}
          className="pointer-events-none absolute inset-0 bg-[var(--axm-green)] mix-blend-screen"
        />

        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
          <p className="axm-mono mb-8">/ 01 — patient file</p>
          <p className="axm-display text-[clamp(1.9rem,5vw,4.3rem)] leading-[1.12]">
            {TEXT.map((t, i) => (
              <Word
                key={i}
                word={t.w}
                tone={t.tone}
                index={i}
                total={TEXT.length}
                progress={scrollYProgress}
              />
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
