"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const HeroScene = dynamic(
  () => import("./HeroScene").then((m) => ({ default: m.HeroScene })),
  { ssr: false }
);

type Phase = "text" | "forming" | "complete";

const TEXT_CUES = [
  { text: "Three pillars.",                showAt:  400, hideAt: 1700 },
  { text: "One ecosystem.",                showAt: 2000, hideAt: 3100 },
  { text: "Courses.",                      showAt: 3300, hideAt: 4300 },
  { text: "Media.",                        showAt: 4500, hideAt: 5450 },
  { text: "Events.",                       showAt: 5650, hideAt: 6600 },
  { text: "Connected through innovation.", showAt: 6800, hideAt: 7800 },
] as const;

const ACTIVATE_MS = 8200;
const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const [phase,       setPhase]       = useState<Phase>("text");
  const [active,      setActive]      = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [textVisible, setTextVisible] = useState(false);

  const introTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  /* ── Cinematic text intro sequence ─────────────────────────── */
  useEffect(() => {
    const t: ReturnType<typeof setTimeout>[] = [];

    TEXT_CUES.forEach(({ text, showAt, hideAt }) => {
      t.push(setTimeout(() => { setCurrentText(text); setTextVisible(true); }, showAt));
      t.push(setTimeout(() => setTextVisible(false), hideAt));
    });

    t.push(setTimeout(() => { setPhase("forming"); setActive(true); }, ACTIVATE_MS));

    introTimers.current = t;
    return () => t.forEach(clearTimeout);
  }, []);

  /* ── Skip intro ─────────────────────────────────────────────── */
  const skip = useCallback(() => {
    introTimers.current.forEach(clearTimeout);
    setTextVisible(false);
    setPhase("forming");
    setActive(true);
  }, []);

  /* ── Knot complete ───────────────────────────────────────────── */
  const onKnotComplete = useCallback(() => setPhase("complete"), []);

  const isComplete = phase === "complete";
  const isText     = phase === "text";

  const bgGradient = isComplete
    ? "radial-gradient(ellipse 150% 110% at 50% 5%, #EEE7FF 0%, #F5F1FF 30%, #FAF8FF 60%, #FFFFFF 100%)"
    : "linear-gradient(160deg, #2D0A5E 0%, #3B1070 40%, #4A1287 70%, #2A0854 100%)";

  return (
    <div
      className="relative h-screen overflow-hidden"
      style={{ background: bgGradient, transition: "background 1.8s cubic-bezier(0.4,0,0.2,1)" }}
    >
      <div className="absolute inset-x-0 bottom-0 z-0" style={{ top: "72px" }}>
        <HeroScene onKnotComplete={onKnotComplete} active={active} />
      </div>

      {/* Edge vignette */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: isComplete
            ? "radial-gradient(ellipse 85% 80% at 50% 50%, transparent 50%, rgba(238,231,255,0.55) 100%)"
            : "radial-gradient(ellipse 82% 78% at 50% 50%, transparent 35%, rgba(10,2,30,0.55) 100%)",
          transition: "background 1.8s ease",
        }}
      />

      {/* Top fade */}
      <div
        className="absolute top-0 inset-x-0 h-28 z-10 pointer-events-none"
        style={{
          background: isComplete
            ? "linear-gradient(to bottom, rgba(238,231,255,0.5) 0%, transparent 100%)"
            : "linear-gradient(to bottom, rgba(30,8,71,0.5) 0%, transparent 100%)",
          transition: "background 1.8s ease",
        }}
      />

      {/* Cinematic text */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none select-none">
        <AnimatePresence mode="wait">
          {textVisible && !isComplete && (
            <motion.p
              key={currentText}
              initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0,  filter: "blur(0px)"  }}
              exit={{    opacity: 0, y: -10, filter: "blur(6px)"  }}
              transition={{ duration: 0.70, ease: EASE }}
              className="text-center px-6"
              style={{
                fontFamily:    "var(--font-display, Georgia, serif)",
                fontSize:      "clamp(1.5rem, 4vw, 2.9rem)",
                fontWeight:    300,
                letterSpacing: "0.06em",
                color:         "#F5F0FF",
                lineHeight:    1.25,
                textShadow:    "0 0 80px rgba(167,139,250,0.45), 0 2px 40px rgba(109,40,217,0.25)",
              }}
            >
              {currentText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Skip intro */}
      <AnimatePresence>
        {isText && (
          <motion.button
            key="skip"
            onClick={skip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            transition={{ delay: 2.5, duration: 0.5 }}
            className="absolute bottom-6 right-6 z-30 flex items-center gap-1.5 rounded-xl px-3 py-2 transition-all duration-200 hover:opacity-80"
            style={{
              background:           "rgba(255,255,255,0.08)",
              border:               "1px solid rgba(167,139,250,0.25)",
              backdropFilter:       "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              color:                "rgba(240,230,255,0.70)",
              fontSize:             "0.65rem",
              fontWeight:           600,
              letterSpacing:        "0.10em",
              textTransform:        "uppercase",
            }}
          >
            <span>Skip intro</span>
            <ArrowRight className="w-3 h-3" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
