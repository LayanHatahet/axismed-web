"use client";

import { motion } from "framer-motion";

export function AboutHero() {
  return (
    <section className="relative pt-40 pb-24 bg-bg-base overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-purple-400 text-xs font-semibold tracking-[0.18em] uppercase mb-5"
        >
          Our Story
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
        >
          The Platform Behind{" "}
          <span className="text-gradient">Medical Excellence</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="text-text-secondary text-xl leading-relaxed max-w-2xl mx-auto"
        >
          A regional initiative built to elevate surgical education, advance healthcare
          communication, and connect the professionals shaping the future of medicine
          in the Middle East.
        </motion.p>
      </div>
    </section>
  );
}
