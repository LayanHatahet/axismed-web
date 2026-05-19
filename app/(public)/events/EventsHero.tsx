"use client";

import { motion } from "framer-motion";

export function EventsHero() {
  return (
    <section className="relative pt-40 pb-20 bg-bg-base overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-25" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-blue-600/8 rounded-full blur-[80px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-purple-400 text-xs font-semibold tracking-[0.18em] uppercase mb-5"
        >
          AxisMed Events
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
        >
          Where Medicine{" "}
          <span className="text-gradient">Meets Innovation</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="text-text-secondary text-xl leading-relaxed max-w-2xl mx-auto"
        >
          Conferences, workshops, webinars, and symposiums curated for healthcare
          professionals at every stage of their career.
        </motion.p>
      </div>
    </section>
  );
}
