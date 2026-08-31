"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useTransform } from "framer-motion";
import { bpm, pageProgress } from "@/lib/axismedia/pulse";
import { EcgCanvas } from "./EcgCanvas";

/**
 * Fixed patient-monitor readout: live heart rate (driven by scroll speed),
 * page progress as an O₂-style percentage, and a mini ECG trace.
 * Appears once the visitor leaves the hero. Desktop only.
 */
export function VitalsHUD() {
  const [rate, setRate] = useState(64);
  const [pct, setPct] = useState(0);

  useMotionValueEvent(bpm, "change", (v) => setRate(Math.round(v)));
  useMotionValueEvent(pageProgress, "change", (v) => setPct(Math.round(v * 100)));

  const opacity = useTransform(pageProgress, [0, 0.04, 0.96, 1], [0, 1, 1, 0]);

  const status = rate < 80 ? "RESTING" : rate < 120 ? "ELEVATED" : "RACING";
  const statusColor =
    rate < 80 ? "var(--axm-accent)" : rate < 120 ? "var(--axm-cyan)" : "var(--axm-coral)";

  return (
    <motion.aside
      style={{ opacity }}
      aria-label="Live site vitals"
      className="fixed bottom-5 left-5 z-[85] hidden select-none items-center gap-4 rounded-xl border border-[var(--axm-line-2)] bg-[rgba(10,6,24,0.72)] px-4 py-3 backdrop-blur-md lg:flex"
    >
      <div className="h-8 w-24">
        <EcgCanvas className="h-full w-full" beatsPerSweep={2.5} lineWidth={1.5} amplitude={0.34} />
      </div>

      <div className="flex items-end gap-1.5">
        <span
          className="axm-heartbeat text-sm leading-none"
          style={{ color: statusColor }}
        >
          ♥
        </span>
        <span
          className="font-[family-name:var(--axm-mono)] text-xl leading-none tabular-nums"
          style={{ color: statusColor }}
        >
          {rate}
        </span>
        <span className="axm-mono pb-[1px] !text-[0.55rem]">bpm</span>
      </div>

      <div className="h-7 w-px bg-[var(--axm-line-2)]" />

      <div className="flex flex-col gap-0.5">
        <span className="axm-mono !text-[0.55rem]">{status}</span>
        <span className="font-[family-name:var(--axm-mono)] text-xs tabular-nums text-[var(--axm-text)]">
          {pct}% <span className="text-[var(--axm-faint)]">explored</span>
        </span>
      </div>
    </motion.aside>
  );
}
