"use client";

import { motion } from "framer-motion";
import { Mic, Play, ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { formatDateShort } from "@/lib/utils/formatDate";
import type { MediaItem } from "@/lib/types";
import Link from "next/link";

interface Props { podcasts: MediaItem[] }

export function PodcastSection({ podcasts }: Props) {

  return (
    <section className="relative py-28 section-white" id="podcast">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <SectionReveal>
              <p className="text-purple-400 text-xs font-semibold tracking-[0.18em] uppercase mb-4">Podcast</p>
            </SectionReveal>
            <SectionReveal delay={0.07}>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
                The AxisMed{" "}
                <span className="text-gradient">Healthcare Podcast</span>
              </h2>
            </SectionReveal>
            <SectionReveal delay={0.13}>
              <p className="text-text-secondary leading-relaxed mb-6">
                In-depth conversations with leading surgeons, innovators, and healthcare
                professionals from across the region and beyond. Topics span surgical technique,
                digital innovation, medical education, and the business of healthcare.
              </p>
            </SectionReveal>
            <SectionReveal delay={0.19}>
              <div className="flex flex-wrap gap-3">
                {["Spotify", "Apple Podcasts", "YouTube"].map((platform) => (
                  <span
                    key={platform}
                    className="text-sm px-4 py-2 glass glow-border rounded-full text-text-secondary hover:text-white cursor-pointer transition-colors"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </SectionReveal>
          </div>

          {/* Right - Episodes */}
          <div className="space-y-4">
            {podcasts.map((ep, i) => (
              <motion.div
                key={ep.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ x: 4 }}
                className="group flex items-start gap-5 glass glow-border rounded-2xl p-5 hover:border-purple-500/30 transition-all"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-purple-500/15 group-hover:bg-purple-500/25 flex items-center justify-center transition-colors">
                  <Play className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-text-dim text-xs mb-1">{formatDateShort(ep.date)} Â· {ep.duration}</div>
                  <h4 className="font-display font-bold text-white text-sm leading-snug line-clamp-2 mb-1">
                    {ep.title}
                  </h4>
                  <p className="text-text-muted text-xs line-clamp-2">{ep.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-dim group-hover:text-purple-400 transition-colors shrink-0 mt-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
