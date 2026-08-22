"use client";

import { motion } from "framer-motion";
import type { BrandKit } from "@/lib/axismedia/generator";

const EASE = [0.22, 1, 0.36, 1] as const;

/** The growth prescription: channel mix, campaign hooks, 12-week plan. */
export function StrategyCard({ kit }: { kit: BrandKit }) {
  const totalWeeks = kit.phases.reduce((a, p) => a + p.weeks, 0);
  const phaseColors = ["var(--axm-accent-dim)", "var(--axm-cyan)", "var(--axm-accent)", "var(--axm-coral)"];

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--axm-line-2)] bg-[var(--axm-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--axm-line)] px-5 py-3">
        <span className="axm-mono !text-[0.55rem]">growth prescription — {kit.name}</span>
        <span className="text-[var(--axm-accent)]">✚</span>
      </div>

      <div className="space-y-6 p-5">
        {/* channel mix */}
        <div>
          <p className="axm-mono mb-3 !text-[0.52rem]">channel mix</p>
          <div className="space-y-2.5">
            {kit.channels.map((c, i) => (
              <div key={c.label} className="flex items-center gap-3">
                <span className="w-40 shrink-0 truncate text-xs text-[var(--axm-text)]">{c.label}</span>
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

        {/* campaign hooks */}
        <div>
          <p className="axm-mono mb-3 !text-[0.52rem]">first campaigns</p>
          <ul className="space-y-2">
            {kit.hooks.map((h, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.5, ease: EASE }}
                className="flex gap-2.5 text-xs leading-relaxed text-[var(--axm-muted)]"
              >
                <span className="mt-0.5 text-[var(--axm-accent)]">→</span>
                {h}
              </motion.li>
            ))}
          </ul>
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
