"use client";

import { motion } from "framer-motion";
import type { BrandKit } from "@/lib/axismedia/generator";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Marketing, shown not told: campaign designs + channel mix + 12-week plan. */
export function StrategyCard({ kit }: { kit: BrandKit }) {
  const totalWeeks = kit.phases.reduce((a, p) => a + p.weeks, 0);
  const phaseColors = ["var(--axm-accent-dim)", "var(--axm-cyan)", "var(--axm-accent)", "var(--axm-coral)"];
  const handle = "@" + kit.name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const onAccent = kit.darkPreview ? "#0d0a1c" : "#fff";

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--axm-line-2)] bg-[var(--axm-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--axm-line)] px-5 py-3">
        <span className="axm-mono !text-[0.55rem]">marketing — design & plan</span>
        <span className="text-[var(--axm-accent)]">✚</span>
      </div>

      <div className="space-y-6 p-5">
        {/* campaign designs: IG post + story */}
        <div className="flex gap-3">
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
                className="flex h-4 w-4 items-center justify-center rounded-full text-[0.4rem] font-bold"
                style={{ background: kit.accent, color: onAccent }}
              >
                {kit.initials}
              </span>
              <span className="truncate text-[0.5rem] font-bold">{handle}</span>
            </div>
            <div
              className="flex aspect-square flex-col items-center justify-center gap-1.5 px-3 text-center"
              style={{ background: `linear-gradient(140deg, ${kit.accent}, ${kit.accentSoft})` }}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-xl text-[0.6rem] font-extrabold"
                style={{ background: "rgba(255,255,255,0.9)", color: kit.accent }}
              >
                {kit.initials}
              </span>
              <p
                className="text-[0.72rem] font-extrabold leading-tight"
                style={{ color: onAccent === "#fff" ? "#fff" : "#0d0a1c", fontFamily: kit.displayFamily }}
              >
                {kit.tagline}
              </p>
              <span
                className="rounded-full px-2.5 py-0.5 text-[0.42rem] font-bold uppercase tracking-widest"
                style={{ background: "rgba(255,255,255,0.9)", color: kit.accent }}
              >
                Book today
              </span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 text-[0.55rem]" style={{ color: kit.ink }}>
              <span>♥ 2,418</span>
              <span style={{ color: kit.inkSoft }}>💬 96</span>
              <span className="ml-auto" style={{ color: kit.inkSoft }}>
                ↗
              </span>
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
              <p className="text-[0.5rem] font-bold uppercase tracking-[0.2em] text-white/70">{kit.sectorLabel}</p>
              <p className="text-[0.62rem] font-extrabold leading-tight text-white" style={{ fontFamily: kit.displayFamily }}>
                {kit.name}
              </p>
            </div>
            <p className="absolute inset-x-0 bottom-2 text-center text-[0.45rem] font-bold uppercase tracking-widest text-white/80">
              ↑ book now
            </p>
          </motion.div>
        </div>

        {/* channel mix */}
        <div>
          <p className="axm-mono mb-3 !text-[0.52rem]">channel mix</p>
          <div className="space-y-2.5">
            {kit.channels.map((c, i) => (
              <div key={c.label} className="flex items-center gap-3">
                <span className="w-36 shrink-0 truncate text-xs text-[var(--axm-text)]">{c.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--axm-elevated)]">
                  <motion.div
                    className="h-full rounded-full bg-[var(--axm-accent)]"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${c.pct}%` }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ delay: 0.15 + i * 0.12, duration: 0.8, ease: EASE }}
                    style={{ opacity: 1 - i * 0.16 }}
                  />
                </div>
                <span className="w-8 text-right font-[family-name:var(--axm-mono)] text-[0.6rem] text-[var(--axm-muted)]">
                  {c.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 12-week plan */}
        <div>
          <p className="axm-mono mb-3 !text-[0.52rem]">the 12-week operation</p>
          <div className="flex h-7 w-full gap-1 overflow-hidden rounded-lg">
            {kit.phases.map((p, i) => (
              <motion.div
                key={p.label}
                className="flex items-center justify-center overflow-hidden rounded-md"
                style={{ background: phaseColors[i], flexBasis: 0 }}
                initial={{ flexGrow: 0.0001, opacity: 0 }}
                whileInView={{ flexGrow: p.weeks / totalWeeks, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 0.2 + i * 0.14, duration: 0.7, ease: EASE }}
              >
                <span className="truncate px-1 text-[0.52rem] font-bold uppercase tracking-wider text-[#0d0a1c]">
                  {p.label}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="mt-1.5 flex justify-between">
            <span className="axm-mono !text-[0.5rem]">week 01</span>
            <span className="axm-mono !text-[0.5rem]">week 12 — launch 🚀</span>
          </div>
        </div>
      </div>
    </div>
  );
}
