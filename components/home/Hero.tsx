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

// One intro scene: all lines shown together, then the logo draws.
const INTRO_LINES = [
  "Three pillars. One ecosystem.",
  "Courses · Media · Events.",
  "Connected through innovation.",
] as const;

const TEXT_IN_MS  = 250;   // fade the whole block in
const ACTIVATE_MS = 6250;  // ~6s of text on screen, then start the logo draw
const EASE = [0.22, 1, 0.36, 1] as const;

const NAV_LINKS = [
  { label: "Courses", href: "/courses" },
  { label: "Media",   href: "/media"   },
  { label: "Events",  href: "/events"  },
] as const;

export function Hero() {
  const [phase,       setPhase]       = useState<Phase>("text");
  const [active,      setActive]      = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [mounted,     setMounted]     = useState(false);

  const introTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => { setMounted(true); }, []);

  // 3D knot runs on all screen sizes — no mobile shortcut needed

  /* ── Single-scene intro: all text together for ~3s, then the logo draws ── */
  useEffect(() => {
    const t: ReturnType<typeof setTimeout>[] = [];
    t.push(setTimeout(() => setTextVisible(true), TEXT_IN_MS));
    t.push(setTimeout(() => { setTextVisible(false); setPhase("forming"); setActive(true); }, ACTIVATE_MS));
    introTimers.current = t;
    return () => t.forEach(clearTimeout);
  }, []);

  const skip = useCallback(() => {
    introTimers.current.forEach(clearTimeout);
    setTextVisible(false);
    setPhase("forming");
    setActive(true);
  }, []);

  const onKnotComplete = useCallback(() => setPhase("complete"), []);

  const isComplete = phase === "complete";
  const isText     = phase === "text";
  const isMobile   = mounted && window.innerWidth < 768;

  const bgGradient = isComplete
    ? "radial-gradient(ellipse 150% 110% at 50% 5%, #eeedf6 0%, #efeef7 30%, #f8f7fa 60%, #FFFFFF 100%)"
    : "linear-gradient(160deg, #a49ecf 0%, #b0accf 40%, #bcb8df 70%, #8880b8 100%)";

  return (
    <div
      className="relative h-screen overflow-hidden"
      style={{ background: bgGradient, transition: "background 1.8s cubic-bezier(0.4,0,0.2,1)" }}
    >
      {/* ── 3D canvas — all screen sizes ── */}
      <div className="absolute inset-x-0 bottom-0 z-0" style={{ top: "72px" }}>
        {mounted && <HeroScene onKnotComplete={onKnotComplete} active={active} isMobile={isMobile} />}
      </div>

      {/* Edge vignette */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: isComplete
            ? "radial-gradient(ellipse 85% 80% at 50% 50%, transparent 50%, rgba(232,230,238,0.55) 100%)"
            : "radial-gradient(ellipse 82% 78% at 50% 50%, transparent 35%, rgba(10,9,20,0.55) 100%)",
          transition: "background 1.8s ease",
        }}
      />

      {/* Top fade */}
      <div
        className="absolute top-0 inset-x-0 h-28 z-10 pointer-events-none"
        style={{
          background: isComplete
            ? "linear-gradient(to bottom, rgba(232,230,238,0.5) 0%, transparent 100%)"
            : "linear-gradient(to bottom, rgba(20,18,35,0.5) 0%, transparent 100%)",
          transition: "background 1.8s ease",
        }}
      />

      {/* Cinematic text — one scene, all lines together */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none select-none">
        <AnimatePresence>
          {textVisible && !isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0,  filter: "blur(0px)"  }}
              exit={{    opacity: 0, y: -10, filter: "blur(6px)"  }}
              transition={{ duration: 0.7, ease: EASE }}
              className="text-center px-6 space-y-2"
              style={{
                fontFamily:    "var(--font-display, Georgia, serif)",
                fontSize:      "clamp(1.4rem, 5vw, 2.9rem)",
                fontWeight:    300,
                letterSpacing: "0.06em",
                color:         "#F5F0FF",
                lineHeight:    1.3,
                textShadow:    "0 0 80px rgba(167,139,250,0.45), 0 2px 40px rgba(136,128,184,0.25)",
              }}
            >
              {INTRO_LINES.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile complete UI removed — HeroScene handles labels on all screen sizes */}

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
