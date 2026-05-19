"use client";

import { motion } from "framer-motion";
import { Eye, Target } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";

export function VisionMission() {
  return (
    <section className="section-lift relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-mesh" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal className="text-center mb-14">
          <p className="text-purple-400 text-xs font-semibold tracking-[0.18em] uppercase mb-3">
            Our Direction
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
            Vision & Mission
          </h2>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="relative glass glow-border rounded-2xl p-10 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/15 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-purple-400" />
              </div>
              <div className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-3">
                Our Vision
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-4">
                The Leading Independent Platform
              </h3>
              <p className="text-text-secondary leading-relaxed">
                To become the leading independent platform for medical education, healthcare
                media, and professional engagement in the Middle East — recognized internationally
                for the quality of programs we deliver and the impact we make on clinical practice.
              </p>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-text-muted text-sm italic">
                  &ldquo;A future where every healthcare professional in the region has
                  access to world-class education and knowledge.&rdquo;
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="relative glass glow-border rounded-2xl p-10 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/15 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-violet-400" />
              </div>
              <div className="text-violet-400 text-xs font-semibold tracking-widest uppercase mb-3">
                Our Mission
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-4">
                Impact Through Education
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Delivering impactful educational experiences, scientific collaboration,
                and professional healthcare communication that support continuous medical
                advancement — through programs that are premium in quality, relevant in content,
                and transformative in their clinical outcomes.
              </p>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-text-muted text-sm italic">
                  &ldquo;Every program we run should leave participants better equipped
                  to care for their patients.&rdquo;
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
