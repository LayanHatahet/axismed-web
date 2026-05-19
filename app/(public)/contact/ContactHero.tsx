"use client";

import { motion } from "framer-motion";

export function ContactHero() {
  return (
    <section className="relative pt-40 pb-16 bg-bg-base overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-purple-400 text-xs font-semibold tracking-[0.18em] uppercase mb-5">
          Get In Touch
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
          Let&apos;s Start a{" "}<span className="text-gradient">Conversation</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
          className="text-text-secondary text-lg leading-relaxed">
          Whether you&apos;re looking to register for a course, organize a program, collaborate
          on media, or simply learn more about AxisMed — we&apos;d love to hear from you.
        </motion.p>
      </div>
    </section>
  );
}
