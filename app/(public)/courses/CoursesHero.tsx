"use client";

import { motion } from "framer-motion";

export function CoursesHero() {
  return (
    <section className="relative pt-40 pb-20 bg-bg-base overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-25" />
      <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-purple-400 text-xs font-semibold tracking-[0.18em] uppercase mb-5"
        >
          Courses & Events
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
        >
          Premium{" "}
          <span className="text-gradient">Medical Education</span>{" "}
          Programs
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="text-text-secondary text-xl leading-relaxed max-w-2xl mx-auto"
        >
          Designed for healthcare professionals seeking advanced practical and
          scientific learning experiences. Browse upcoming programs and register today.
        </motion.p>
      </div>
    </section>
  );
}
