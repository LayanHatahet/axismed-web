"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { MotionBackground } from "@/components/ui/MotionBackground";

const stats = [
  { value: 120, suffix: "+", label: "Courses & Events", description: "Delivered across the Middle East" },
  { value: 8500, suffix: "+", label: "Professionals Trained", description: "Surgeons, physicians & specialists" },
  { value: 300, suffix: "+", label: "Expert Speakers", description: "Internationally recognized faculty" },
  { value: 18,  suffix: "+", label: "Countries Reached", description: "Regional & global participants" },
];

export function HomeStats() {
  return (
    <section className="relative py-24 overflow-hidden bg-bg-base">
      <MotionBackground variant="purple" particles={false} scanLine={false} grid />

      {/* Subtle center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(136,128,184,0.10) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-purple-400 text-xs font-semibold tracking-[0.18em] uppercase mb-4">
            AxisMed in Numbers
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
            Measured in{" "}
            <span className="text-gradient">Impact</span>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              className="group relative flex flex-col items-center justify-center text-center px-8 py-12 bg-bg-base hover:bg-purple-500/5 transition-colors duration-300"
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(164,158,207,0.06) 0%, transparent 70%)" }}
              />

              <div className="font-display text-5xl md:text-6xl font-black mb-3 text-gradient relative z-10">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2.2} />
              </div>
              <div className="text-white font-semibold text-base mb-1 relative z-10">
                {stat.label}
              </div>
              <div className="text-text-muted text-sm relative z-10">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
