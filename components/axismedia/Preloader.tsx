"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LETTERS = "AXISMEDIA".split("");

/**
 * First-visit intro: a flatline that catches a heartbeat, then the wordmark
 * comes alive and the veil lifts. Runs once per browser session, never for
 * reduced-motion visitors.
 */
export function Preloader() {
  const [show, setShow] = useState(false);

  // one-shot on mount: reading reduced-motion via matchMedia keeps this
  // deterministic (framer's useReducedMotion resolves async and would re-run
  // the effect after the seen-flag is already written)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (sessionStorage.getItem("axm-intro-seen")) return;
    } catch {
      /* private mode — still play once */
    }
    const start = setTimeout(() => {
      setShow(true);
      document.documentElement.style.overflow = "hidden";
    }, 0);
    // the seen-flag is written when the intro completes, so a remount mid-play
    // restarts it instead of killing it
    const end = setTimeout(() => {
      setShow(false);
      document.documentElement.style.overflow = "";
      try {
        sessionStorage.setItem("axm-intro-seen", "1");
      } catch {}
    }, 3050);
    return () => {
      clearTimeout(start);
      clearTimeout(end);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="axm-preloader"
          exit={{ y: "-100%", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-[var(--axm-bg)]"
          aria-hidden="true"
        >
          {/* flatline → heartbeat */}
          <svg viewBox="0 0 600 120" className="w-[min(80vw,600px)]" fill="none">
            <motion.path
              d="M0 60 H210 L232 60 L244 22 L254 96 L264 48 L276 60 H388 L400 60 L410 34 L420 78 L430 55 L442 60 H600"
              stroke="var(--axm-accent)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              className="axm-glow-accent"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>

          {/* wordmark */}
          <div className="mt-8 flex overflow-hidden">
            {LETTERS.map((l, i) => (
              <motion.span
                key={i}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 1.25 + i * 0.055,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="axm-display text-4xl tracking-[0.08em] text-[var(--axm-text)] sm:text-6xl"
              >
                {l}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.5 }}
            className="axm-mono mt-5"
          >
            vitals detected — patient is creative
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
