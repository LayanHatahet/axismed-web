"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GraduationCap, CalendarDays, Clapperboard, Handshake } from "lucide-react";

const pillars = [
  {
    icon: GraduationCap,
    title: "Medical Education",
    description:
      "Designing and delivering accredited CME programs, cadaveric training workshops, simulation-based courses, and hands-on surgical training for healthcare professionals at every career stage.",
    gradient: "from-purple-600/20 to-purple-900/10",
    accent: "#bcb8df",
    tags: ["Cadaveric Labs", "CME Programs", "Simulation Training", "Surgical Workshops"],
  },
  {
    icon: CalendarDays,
    title: "Scientific Events",
    description:
      "Managing end-to-end scientific conferences, professional symposiums, product launch events, scientific advisory meetings, and industry educational gatherings that drive meaningful knowledge exchange.",
    gradient: "from-violet-600/20 to-violet-900/10",
    accent: "#a49ecf",
    tags: ["Conferences", "Symposiums", "Product Launches", "Advisory Meetings"],
  },
  {
    icon: Clapperboard,
    title: "Medical Media",
    description:
      "Producing high-quality educational videos, surgical documentation, surgeon profiling content, podcasts, and healthcare-focused campaigns that communicate clinical science with precision.",
    gradient: "from-indigo-600/20 to-indigo-900/10",
    accent: "#6366F1",
    tags: ["Video Production", "Surgeon Profiling", "Podcast", "HCP Campaigns"],
  },
  {
    icon: Handshake,
    title: "Strategic Partnerships",
    description:
      "Connecting medical technology companies, pharmaceutical organizations, scientific societies, and healthcare institutions through co-developed programs and long-term strategic collaboration.",
    gradient: "from-fuchsia-600/20 to-fuchsia-900/10",
    accent: "#c084fc",
    tags: ["MedTech", "Pharma", "Scientific Societies", "Institutions"],
  },
];

export function CorePillars() {
  return (
    <section className="section-lift relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-mesh" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="What We Do"
          title="Four Areas of"
          titleHighlight="Expertise"
          subtitle="Medical Education · Scientific Events · Medical Media · Strategic Partnerships — four interconnected capabilities delivered as a single integrated partner."
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: i * 0.10, ease: [0.25, 0.4, 0.25, 1] }}
                whileHover={{ y: -6 }}
                className="group relative"
              >
                <div
                  className={`relative rounded-2xl glass glow-border p-7 h-full
                    bg-gradient-to-br ${pillar.gradient}
                    hover:border-purple-500/30 transition-all duration-300
                    hover:shadow-[0_12px_48px_rgba(164,158,207,0.18)]`}
                >
                  {/* Number */}
                  <div className="absolute top-5 right-5 text-4xl font-display font-bold text-white/[0.04] select-none">
                    0{i + 1}
                  </div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-5"
                    style={{ boxShadow: `0 0 18px ${pillar.accent}30` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: pillar.accent }} />
                  </motion.div>

                  <h3 className="font-display text-xl font-bold text-white mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed mb-5 text-sm">
                    {pillar.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {pillar.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-text-muted border border-white/8"
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
      </div>
    </section>
  );
}
