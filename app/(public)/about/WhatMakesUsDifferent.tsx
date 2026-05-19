"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  Target, Users, Globe2, Zap, Building2, Monitor,
} from "lucide-react";

const differentiators = [
  {
    icon: Target,
    title: "Medical-Focused Team",
    description:
      "Every member of the AxisMed team brings deep understanding of the healthcare industry — from clinical practice to medical event management and healthcare media production.",
  },
  {
    icon: Globe2,
    title: "Deep Regional Network",
    description:
      "Over years of work within the Middle East healthcare ecosystem, we've built genuine relationships with surgeons, institutions, societies, and industry leaders across the region.",
  },
  {
    icon: Building2,
    title: "Industry Understanding",
    description:
      "We understand the needs of both the clinical community and the medical device industry — creating a bridge that ensures programs are practically relevant and commercially aligned.",
  },
  {
    icon: Zap,
    title: "Educational Orientation",
    description:
      "We don't just organize events. We design learning journeys — with curated faculty, structured curricula, evidence-based content, and measurable clinical outcomes.",
  },
  {
    icon: Users,
    title: "Access to Premier Facilities",
    description:
      "AxisMed has established partnerships with leading cadaveric laboratories, simulation centers, and clinical training facilities in the UAE, KSA, and across the GCC.",
  },
  {
    icon: Monitor,
    title: "Modern Digital Communication",
    description:
      "We extend the reach and impact of every program through professional documentation, educational video production, and a growing digital media presence.",
  },
];

export function WhatMakesUsDifferent() {
  return (
    <section className="section-white relative py-28 overflow-hidden">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="What Makes Us Different"
          title="The AxisMed"
          titleHighlight="Advantage"
          subtitle="Six defining characteristics that set AxisMed apart from conventional medical education providers and healthcare event organizers."
          className="mb-16"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {differentiators.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="group glass glow-border rounded-2xl p-7 hover:border-purple-500/30 hover:shadow-[0_8px_32px_rgba(124,58,237,0.15)] transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-purple-500/12 group-hover:bg-purple-500/20 flex items-center justify-center mb-5 transition-colors">
                  <Icon className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-purple-400 text-xs font-semibold tracking-wider uppercase mb-2">
                  0{i + 1}
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
