"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroScene = dynamic(
  () => import("./HeroScene").then((m) => ({ default: m.HeroScene })),
  { ssr: false }
);

const BG = "#020104";
const FADE_TOP = "linear-gradient(to bottom, #020104, transparent)";
const FADE_BOT = "linear-gradient(to bottom, transparent, #020104)";

export function Hero() {
  const openChat = () =>
    window.dispatchEvent(
      new CustomEvent("open-concierge", {
        detail: { message: "I'd like to learn about the surgical education programs." },
      })
    );

  return (
    <div style={{ backgroundColor: BG }}>
      {/* Full-viewport 3D canvas */}
      <section className="relative h-screen overflow-hidden" style={{ backgroundColor: BG }}>
        <div className="absolute top-0 left-0 right-0 h-44 z-[1] pointer-events-none" style={{ background: FADE_TOP }} />
        <div className="absolute bottom-0 left-0 right-0 z-[1] pointer-events-none" style={{ height: "22%", background: FADE_BOT }} />
        <div className="absolute inset-0 z-0">
          <HeroScene />
        </div>

        {/* CTA — inside the viewport, bottom-center */}
        <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center gap-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 3.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex flex-col items-center gap-3"
          >
            {/* Primary — opens AI concierge */}
            <motion.button
              onClick={openChat}
              whileHover={{ scale: 1.045, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 340, damping: 22 }}
              className="group relative inline-flex items-center gap-3 rounded-[14px] px-9 py-[13px] overflow-hidden"
              style={{
                background: "rgba(75,29,255,0.18)",
                border: "1px solid rgba(139,92,246,0.36)",
                backdropFilter: "blur(22px)",
                WebkitBackdropFilter: "blur(22px)",
                color: "rgba(220,210,255,0.92)",
                fontSize: "0.76rem",
                fontWeight: 600,
                letterSpacing: "0.11em",
                textTransform: "uppercase",
                boxShadow: "0 0 32px rgba(75,29,255,0.22), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <span
                className="absolute inset-0 rounded-[14px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "rgba(75,29,255,0.14)", boxShadow: "0 0 48px rgba(75,29,255,0.22)" }}
              />
              <Sparkles className="relative z-10 w-3.5 h-3.5 text-purple-300" />
              <span className="relative z-10">Ask Our Concierge</span>
              <ArrowRight className="relative z-10 w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </motion.button>

            {/* Hint label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 3.8 }}
              className="text-[10px] tracking-[0.16em] uppercase"
              style={{ color: "rgba(139,92,246,0.4)" }}
            >
              Live Chat · Instant Answers
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
