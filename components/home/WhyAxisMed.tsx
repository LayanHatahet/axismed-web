"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MotionBackground } from "@/components/ui/MotionBackground";
import {
  Globe2,
  Users,
  Zap,
  Building2,
  BookOpen,
  Video,
} from "lucide-react";

const reasons = [
  {
    icon: Globe2,
    title: "Regional Healthcare Focus",
    description:
      "Deep expertise in the Middle East healthcare landscape with an international standard of education and practice.",
  },
  {
    icon: Users,
    title: "Premium Faculty Network",
    description:
      "Programs led by internationally recognized specialists and surgeons with proven clinical and academic expertise.",
  },
  {
    icon: Zap,
    title: "Hands-on Training",
    description:
      "Cadaveric labs, simulation facilities, and real case workshops that develop genuine operative competence.",
  },
  {
    icon: Building2,
    title: "Strategic Industry Collaboration",
    description:
      "Partnerships with leading medical device companies and healthcare institutions that enhance learning outcomes.",
  },
  {
    icon: BookOpen,
    title: "Modern Educational Approach",
    description:
      "Blending digital planning tools, evidence-based curricula, and interactive formats for a truly modern learning experience.",
  },
  {
    icon: Video,
    title: "High-Quality Media Production",
    description:
      "Every event, course, and insight is documented and produced to the highest professional media standards.",
  },
];

export function WhyAxisMed() {
  return (
    <section className="section-white relative py-28 overflow-hidden">
      <MotionBackground variant="deep" particles scanLine={false} grid />

      {/* Large decorative text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-display text-[20vw] font-black text-white/[0.015] leading-none tracking-tighter">
          AXISMED
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Why Choose AxisMed"
          title="A Platform Built for"
          titleHighlight="Healthcare Professionals"
          subtitle="We combine deep regional understanding, premium faculty networks, and modern educational infrastructure to deliver experiences that genuinely advance clinical practice."
          className="mb-16"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
                whileHover={{ y: -4 }}
                className="group glass glow-border rounded-2xl p-7 hover:border-purple-500/30 hover:shadow-[0_8px_32px_rgba(164,158,207,0.15)] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/12 group-hover:bg-purple-500/20 flex items-center justify-center mb-5 transition-colors">
                  <Icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-3">
                  {reason.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
