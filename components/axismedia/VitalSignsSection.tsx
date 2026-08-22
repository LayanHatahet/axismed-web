"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { EcgCanvas } from "./EcgCanvas";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {val}
      {suffix}
    </span>
  );
}

const VITALS = [
  { label: "Brands treated", value: <CountUp to={40} suffix="+" />, note: "clinics → med-tech" },
  { label: "Specialties covered", value: <CountUp to={18} />, note: "derma to neurosurgery" },
  { label: "Avg. booking growth", value: <CountUp to={3} suffix="×" />, note: "within 6 months" },
  { label: "Care line", value: <>24/7</>, note: "we never flatline" },
];

export function VitalSignsSection() {
  return (
    <section className="axm-frame relative py-20 lg:py-28">
      <span className="axm-tick axm-tick-tl" aria-hidden="true" />
      <span className="axm-tick axm-tick-tr" aria-hidden="true" />

      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="axm-mono mb-4">/ 03 — vital signs</p>
            <h2 className="axm-display text-[clamp(2rem,4.5vw,3.8rem)] uppercase">
              Healthy numbers
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--axm-muted)]">
            The readouts our clients care about. Measured on real bookings, real launches and
            real market share — not vanity metrics.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--axm-line-2)] bg-[var(--axm-line)] sm:grid-cols-2 lg:grid-cols-4">
          {VITALS.map((v) => (
            <div key={v.label} className="group relative bg-[var(--axm-surface)] p-7 transition-colors duration-500 hover:bg-[var(--axm-elevated)]">
              <p className="axm-mono !text-[0.58rem]">{v.label}</p>
              <p className="mt-5 font-[family-name:var(--axm-mono)] text-5xl text-[var(--axm-green)] lg:text-6xl">
                {v.value}
              </p>
              <p className="mt-3 text-xs text-[var(--axm-faint)]">{v.note}</p>
              <div className="mt-6 h-6 opacity-40 transition-opacity duration-500 group-hover:opacity-90">
                <EcgCanvas className="h-full w-full" beatsPerSweep={3} lineWidth={1.2} amplitude={0.32} glow={false} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
