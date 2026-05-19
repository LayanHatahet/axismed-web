"use client";

import { motion } from "framer-motion";
import { SectionReveal } from "@/components/ui/SectionReveal";
import type { Partner } from "@/lib/types";
import Link from "next/link";

interface Props { partners: Partner[] }

export function PartnersStrip({ partners }: Props) {
  if (partners.length === 0) return null;

  const doubled = [...partners, ...partners];

  return (
    <section className="section-tonal py-20 border-y border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <SectionReveal>
          <p className="text-purple-400 text-xs font-semibold tracking-[0.18em] uppercase mb-2">
            Trusted By
          </p>
        </SectionReveal>
        <SectionReveal delay={0.06}>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-white">
            Industry Partners & Collaborators
          </h3>
        </SectionReveal>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden">
        <div className="tonal-fade-l absolute left-0 top-0 bottom-0 w-24 z-10" />
        <div className="tonal-fade-r absolute right-0 top-0 bottom-0 w-24 z-10" />

        <div className="flex gap-8 marquee-track" style={{ width: `${doubled.length * 220}px` }}>
          {doubled.map((partner, i) => (
            <motion.div
              key={`${partner.id}-${i}`}
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 w-48 h-20 glass glow-border rounded-xl flex items-center justify-center px-6 cursor-default"
            >
              {partner.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-10 max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              ) : (
                <span className="text-text-muted text-sm font-medium text-center leading-tight">
                  {partner.name}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-center mt-10">
        <SectionReveal delay={0.1}>
          <Link
            href="/partners"
            className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors underline-offset-4 hover:underline"
          >
            View all partners & collaboration opportunities →
          </Link>
        </SectionReveal>
      </div>
    </section>
  );
}
