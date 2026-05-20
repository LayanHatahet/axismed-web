"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GraduationCap, FlaskConical, Clapperboard, Network, Lightbulb } from "lucide-react";

const pillars = [
  {
    icon: GraduationCap,
    title: "Medical Education",
    description:
      "Delivering cadaveric training, digital surgery programs, and hands-on workshops that meet the highest international clinical standards for practicing healthcare professionals.",
    gradient: "from-purple-600/20 to-purple-900/10",
    accent: "#bcb8df",
    tags: ["Cadaveric Labs", "Digital Workshops", "Hands-on Training"],
  },
  {
    icon: FlaskConical,
    title: "Scientific Events",
    description:
      "Organizing and managing world-class surgical conferences, professional symposiums, and industry educational events that connect experts and drive knowledge exchange.",
    gradient: "from-violet-600/20 to-violet-900/10",
    accent: "#a49ecf",
    tags: ["Conferences", "Symposiums", "Industry Events"],
  },
  {
    icon: Clapperboard,
    title: "Healthcare Media",
    description:
      "Producing high-quality educational videos, surgical documentation, surgeon profiles, and healthcare-focused content that communicates the science with precision and professionalism.",
    gradient: "from-indigo-600/20 to-indigo-900/10",
    accent: "#6366F1",
    tags: ["Video Production", "Surgeon Profiling", "Podcast"],
  },
];

const supporting = [
  { icon: Network, label: "Professional Connection" },
  { icon: Lightbulb, label: "Healthcare Innovation" },
];

export function CorePillars() {
  return (
    <section className="section-lift relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-mesh" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Our Core Pillars"
          title="Built Around"
          titleHighlight="Healthcare Excellence"
          subtitle="Three interconnected pillars that together form the AxisMed ecosystem — advancing the science, business, and communication of modern medicine."
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: i * 0.12, ease: [0.25, 0.4, 0.25, 1] }}
                whileHover={{ y: -6 }}
                className="group relative"
              >
                <div
                  className={`relative rounded-2xl glass glow-border p-8 h-full
                    bg-gradient-to-br ${pillar.gradient}
                    hover:border-purple-500/30 transition-all duration-300
                    hover:shadow-[0_12px_48px_rgba(164,158,207,0.18)]`}
                >
                  {/* Number */}
                  <div className="absolute top-6 right-6 text-5xl font-display font-bold text-white/[0.04] select-none">
                    0{i + 1}
                  </div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6"
                    style={{ boxShadow: `0 0 20px ${pillar.accent}30` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: pillar.accent }} />
                  </motion.div>

                  <h3 className="font-display text-2xl font-bold text-white mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed mb-6 text-sm">
                    {pillar.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {pillar.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full bg-white/5 text-text-muted border border-white/8"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Supporting pillars */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {supporting.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3 px-6 py-4 glass glow-border rounded-xl"
              >
                <Icon className="w-5 h-5 text-purple-400" />
                <span className="text-text-secondary text-sm font-medium">{item.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
