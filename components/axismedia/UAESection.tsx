"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/** Abstract Gulf skyline — Burj Al Arab sail, Burj Khalifa spike, Capital Gate lean. */
function Skyline() {
  return (
    <svg
      viewBox="0 0 1200 220"
      preserveAspectRatio="xMidYMax meet"
      className="w-full"
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M0 220 V190 H40 V160 H70 V190 H110 V145 H150 V190 H190 V120
           C215 120 225 80 230 60 C235 80 245 120 270 120 V190 H310 V150 H350 V190
           H400 V100 H420 V70 H440 V100 H460 V190
           H520 L560 40 L600 190
           H640 V130 H680 V190
           H710 L718 8 L726 190
           H770 V140 H810 V190
           H850 C850 130 890 110 900 105 C910 110 950 130 950 190
           H1000 V155 H1040 V190 H1080 V170 H1120 V190 H1160 V180 H1200 V220 Z"
        fill="var(--axm-bg)"
        stroke="var(--axm-line-2)"
        strokeWidth="1"
      />
      {/* pulse nodes on the towers */}
      {[
        { x: 230, y: 55 },
        { x: 560, y: 45 },
        { x: 718, y: 14 },
        { x: 900, y: 102 },
        { x: 430, y: 68 },
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="var(--axm-accent)" />
          <motion.circle
            cx={p.x}
            cy={p.y}
            r="3.5"
            stroke="var(--axm-accent)"
            strokeWidth="1"
            fill="none"
            animate={{ r: [4, 16], opacity: [0.9, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.45, ease: "easeOut" }}
          />
        </g>
      ))}
    </svg>
  );
}

export function UAESection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const ghostY = useTransform(scrollYProgress, [0, 1], [90, -90]);

  return (
    <section ref={ref} className="axm-frame relative overflow-hidden bg-[var(--axm-bg-2)]">
      <span className="axm-tick axm-tick-tl" aria-hidden="true" />
      <span className="axm-tick axm-tick-tr" aria-hidden="true" />

      {/* ghosted Arabic "nabd" — pulse */}
      <motion.span
        aria-hidden="true"
        style={{
          y: ghostY,
          fontFamily: "'Noto Sans Arabic', 'Geeza Pro', 'Segoe UI', system-ui, sans-serif",
        }}
        className="pointer-events-none absolute -right-4 top-8 select-none text-[clamp(10rem,26vw,22rem)] font-bold leading-none text-[rgba(179,166,236,0.05)]"
      >
        نبض
      </motion.span>

      <div className="relative mx-auto max-w-[1500px] px-5 pt-20 sm:px-8 lg:pt-28">
        <p className="axm-mono mb-4">/ 05 — home turf</p>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <h2 className="axm-display text-[clamp(2.2rem,5.5vw,4.6rem)] uppercase">
            Built for the giants of{" "}
            <span className="text-[var(--axm-accent)]">UAE healthcare</span>
          </h2>
          <div className="space-y-5 text-[var(--axm-muted)]">
            <p className="leading-relaxed">
              Bilingual by default. Culturally fluent. Regulation-ready.
            </p>
            <ul className="flex flex-wrap gap-2 pt-1">
              {["Arabic / English design", "DHA · DoH · MOHAP aware", "Medical tourism ready", "Gulf-wide delivery"].map(
                (t) => (
                  <li
                    key={t}
                    className="axm-mono rounded-full border border-[var(--axm-line-2)] px-3.5 py-1.5 !text-[0.55rem]"
                  >
                    {t}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-2">
          {["Dubai", "Abu Dhabi", "Sharjah", "Riyadh", "Doha", "Muscat"].map((c, i) => (
            <motion.span
              key={c}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="axm-display text-xl uppercase text-[var(--axm-faint)] [&:nth-child(1)]:text-[var(--axm-text)] [&:nth-child(2)]:text-[var(--axm-text)]"
            >
              {c}
              <span className="ml-8 text-[var(--axm-accent)]" aria-hidden="true">
                {i < 5 ? "·" : ""}
              </span>
            </motion.span>
          ))}
        </div>
      </div>

      <div className="relative mt-10">
        <Skyline />
        {/* baseline ECG under the skyline */}
        <div className="h-px w-full bg-[var(--axm-line-2)]" aria-hidden="true" />
      </div>
    </section>
  );
}
