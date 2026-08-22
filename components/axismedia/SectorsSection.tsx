"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Pill,
  Cpu,
  FlaskConical,
  SmilePlus,
  Sparkles,
  MonitorSmartphone,
  Leaf,
} from "lucide-react";

const SECTORS = [
  {
    icon: Building2,
    name: "Hospitals & Clinics",
    detail: "Flagship brand systems, patient portals, wayfinding-grade clarity online.",
  },
  {
    icon: Pill,
    name: "Pharma",
    detail: "Product launches, HCP engagement platforms and compliant campaign engines.",
  },
  {
    icon: Cpu,
    name: "MedTech & Devices",
    detail: "Category-defining identities and demo experiences that sell to procurement.",
  },
  {
    icon: FlaskConical,
    name: "Labs & Diagnostics",
    detail: "Results portals, B2B pipelines and brands that read as precision.",
  },
  {
    icon: SmilePlus,
    name: "Dental",
    detail: "Smile-first brands, booking funnels and before/after storytelling done right.",
  },
  {
    icon: Sparkles,
    name: "Aesthetics & Derma",
    detail: "Premium positioning for clinics competing in the region's toughest market.",
  },
  {
    icon: MonitorSmartphone,
    name: "Digital Health",
    detail: "Telehealth products, health apps and investor-ready product narratives.",
  },
  {
    icon: Leaf,
    name: "Wellness & Longevity",
    detail: "Science-backed brand worlds for the Gulf's booming longevity economy.",
  },
];

export function SectorsSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="sectors" className="axm-frame relative py-20 lg:py-28">
      <span className="axm-tick axm-tick-tl" aria-hidden="true" />
      <span className="axm-tick axm-tick-tr" aria-hidden="true" />

      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="axm-mono mb-4">/ 05 — admissions</p>
            <h2 className="axm-display max-w-2xl text-[clamp(2.2rem,5vw,4.2rem)] uppercase">
              Every ward of the <span className="text-[var(--axm-green)]">med industry</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--axm-muted)]">
            We only work in healthcare. That focus is why our work passes compliance on the
            first round — and why it still stops the scroll.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--axm-line-2)] bg-[var(--axm-line)] sm:grid-cols-2 lg:grid-cols-4">
          {SECTORS.map((s, i) => {
            const Icon = s.icon;
            const isActive = active === i;
            return (
              <motion.li
                key={s.name}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="group relative min-h-[190px] bg-[var(--axm-surface)] p-6 transition-colors duration-500 hover:bg-[var(--axm-elevated)]"
                tabIndex={0}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(340px circle at 50% 0%, rgba(44,255,192,0.09), transparent)",
                  }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <Icon
                      className={`h-6 w-6 transition-colors duration-300 ${
                        isActive ? "text-[var(--axm-green)]" : "text-[var(--axm-muted)]"
                      }`}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span className="axm-mono !text-[0.5rem] text-[var(--axm-faint)]">
                      w-0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-[family-name:var(--axm-display)] text-lg font-bold">
                    {s.name}
                  </h3>
                  <p
                    className={`mt-2 text-xs leading-relaxed text-[var(--axm-muted)] transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-60"
                    }`}
                  >
                    {s.detail}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
