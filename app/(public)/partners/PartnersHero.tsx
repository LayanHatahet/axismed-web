"use client";

import { motion } from "framer-motion";

export function PartnersHero() {
  return (
    <section className="relative pt-40 pb-20 bg-bg-base overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-25" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-purple-400 text-xs font-semibold tracking-[0.18em] uppercase mb-5"
        >
          Our Network
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
        >
          Partners &{" "}
          <span className="text-gradient">Collaborators</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="text-text-secondary text-lg leading-relaxed"
        >
          AxisMed works with healthcare institutions, universities, professional societies,
          clinical faculty, and industry organisations to develop and deliver high-quality
          medical education programmes across the region.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="text-text-secondary text-lg leading-relaxed mt-4"
        >
          Our collaborations are built around practical learning, scientific relevance,
          operational excellence, and meaningful professional engagement.
        </motion.p>
      </div>
    </section>
  );
}
