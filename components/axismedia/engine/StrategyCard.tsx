"use client";

import { motion } from "framer-motion";
import { BrandKit, KPIS, PLATFORMS, WEEK_CONTENT } from "@/lib/axismedia/generator";

const EASE = [0.22, 1, 0.36, 1] as const;
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * The growth stage: a real social-media plan — platform playbook, a 7-day
 * content calendar, campaign creatives designed in the brand, and targets.
 */
export function StrategyCard({ kit }: { kit: BrandKit }) {
  const handle = "@" + kit.name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const onAccent = kit.darkPreview ? "#0d0a1c" : "#fff";
  const platforms = PLATFORMS[kit.sector];
  const week = WEEK_CONTENT[kit.sector];
  const grad = `linear-gradient(130deg, ${kit.accent}, ${kit.accentSoft})`;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* creatives — designed in their brand */}
      <div className="lg:col-span-4">
        <div className="h-full overflow-hidden rounded-xl border border-[var(--axm-line-2)] bg-[var(--axm-surface)]">
          <div className="flex items-center justify-between border-b border-[var(--axm-line)] px-5 py-3">
            <span className="axm-mono !text-[0.55rem]">campaign creatives</span>
            <span className="text-[var(--axm-accent)]">✚</span>
          </div>
          <div className="flex gap-3 p-5">
            {/* square post */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="min-w-0 flex-[1.4] overflow-hidden rounded-xl border border-[var(--axm-line)]"
              style={{ background: kit.paper }}
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1.5" style={{ color: kit.ink }}>
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-full text-[0.38rem] font-bold"
                  style={{ background: grad, color: onAccent }}
                >
                  {kit.initials}
                </span>
                <span className="truncate text-[0.5rem] font-bold">{handle}</span>
              </div>
              <div
                className="flex aspect-square flex-col items-center justify-center gap-1.5 px-3 text-center"
                style={{ background: grad }}
              >
                <p
                  className="text-[0.85rem] uppercase leading-[1.02]"
                  style={{ color: onAccent === "#fff" ? "#fff" : "#0d0a1c", fontFamily: kit.displayFamily }}
                >
                  {kit.tagline}
                </p>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[0.42rem] font-bold uppercase tracking-widest"
                  style={{ background: "rgba(255,255,255,0.92)", color: kit.accent }}
                >
                  Book today
                </span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 text-[0.55rem]" style={{ color: kit.ink }}>
                <span>♥ 2,418</span>
                <span style={{ color: kit.inkSoft }}>💬 96</span>
                <span className="ml-auto" style={{ color: kit.inkSoft }}>↗</span>
              </div>
            </motion.div>

            {/* story */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.12, duration: 0.6, ease: EASE }}
              className="relative min-w-0 flex-1 overflow-hidden rounded-xl border border-[var(--axm-line)]"
              style={{ background: `linear-gradient(200deg, ${kit.ink}, ${kit.accent})`, aspectRatio: "9/16" }}
            >
              <div className="absolute inset-x-2 top-1.5 h-0.5 overflow-hidden rounded-full bg-white/30">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "70%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.2, ease: "linear" }}
                />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 text-center">
                <p className="text-[0.45rem] font-bold uppercase tracking-[0.2em] text-white/70">{kit.sectorLabel}</p>
                <p className="text-[0.72rem] uppercase leading-tight text-white" style={{ fontFamily: kit.displayFamily }}>
                  {kit.name}
                </p>
              </div>
              <p className="absolute inset-x-0 bottom-2 text-center text-[0.42rem] font-bold uppercase tracking-widest text-white/80">
                ↑ book now
              </p>
            </motion.div>
          </div>

          {/* KPI targets */}
          <div className="grid grid-cols-3 gap-px border-t border-[var(--axm-line)] bg-[var(--axm-line)]">
            {KPIS.map((k) => (
              <div key={k.label} className="bg-[var(--axm-surface)] px-2 py-3 text-center">
                <p className="font-[family-name:var(--axm-display)] text-sm uppercase text-[var(--axm-accent)]">
                  {k.value}
                </p>
                <p className="axm-mono mt-1 !text-[0.46rem]">{k.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* platform playbook + calendar */}
      <div className="lg:col-span-8">
        <div className="h-full overflow-hidden rounded-xl border border-[var(--axm-line-2)] bg-[var(--axm-surface)]">
          <div className="flex items-center justify-between border-b border-[var(--axm-line)] px-5 py-3">
            <span className="axm-mono !text-[0.55rem]">social playbook — {kit.name}</span>
            <span className="axm-mono !text-[0.55rem] text-[var(--axm-accent)]">{kit.sectorLabel.toLowerCase()}</span>
          </div>

          <div className="space-y-6 p-5">
            {/* platform roles */}
            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {platforms.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: 0.08 + i * 0.09, duration: 0.5, ease: EASE }}
                  className="rounded-xl border border-[var(--axm-line)] bg-[var(--axm-bg-2)] p-3.5"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-[family-name:var(--axm-display)] text-sm uppercase tracking-wide text-[var(--axm-text)]">
                      {p.name}
                    </p>
                    <span className="axm-mono !text-[0.44rem] text-[var(--axm-accent)]">{p.cadence}</span>
                  </div>
                  <p className="mt-1.5 text-[0.66rem] leading-snug text-[var(--axm-muted)]">{p.role}</p>
                </motion.div>
              ))}
            </div>

            {/* 7-day content calendar */}
            <div>
              <p className="axm-mono mb-2.5 !text-[0.52rem]">a week on {handle}</p>
              <div className="grid grid-cols-7 gap-1.5">
                {DAYS.map((d, i) => (
                  <motion.div
                    key={d}
                    initial={{ opacity: 0, scaleY: 0.6 }}
                    whileInView={{ opacity: 1, scaleY: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.45, ease: EASE }}
                    className="flex min-h-[92px] flex-col rounded-lg border border-[var(--axm-line)] p-1.5"
                    style={{
                      background: i === 6 ? "rgba(179,166,236,0.1)" : "var(--axm-bg-2)",
                      borderColor: i === 6 ? "var(--axm-accent)" : undefined,
                    }}
                  >
                    <span className="axm-mono !text-[0.44rem]">{d}</span>
                    <span className="mt-auto text-[0.56rem] font-medium leading-tight text-[var(--axm-text)]">
                      {week[i]}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* campaign concepts */}
            <div>
              <p className="axm-mono mb-2.5 !text-[0.52rem]">launch campaigns</p>
              <ul className="grid gap-2 lg:grid-cols-3">
                {kit.hooks.map((h, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ delay: 0.15 + i * 0.12, duration: 0.5, ease: EASE }}
                    className="rounded-xl border border-[var(--axm-line)] bg-[var(--axm-bg-2)] p-3 text-[0.66rem] leading-relaxed text-[var(--axm-muted)]"
                  >
                    <span className="text-[var(--axm-accent)]">→ </span>
                    {h}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
