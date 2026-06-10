"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
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

const NAV_LINKS = [
  { label: "Courses", href: "/courses" },
  { label: "Media",   href: "/media"   },
  { label: "Events",  href: "/events"  },
] as const;

export function Hero() {
  const [phase,       setPhase]       = useState<Phase>("text");
  const [active,      setActive]      = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [textVisible, setTextVisible] = useState(false);
  const [mounted,     setMounted]     = useState(false);

  const introTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => { setMounted(true); }, []);

  // On mobile there is no 3D knot — auto-complete shortly after the animation would start
  useEffect(() => {
    if (!active || !mounted) return;
    if (window.innerWidth >= 768) return;
    const t = setTimeout(() => setPhase("complete"), 700);
    return () => clearTimeout(t);
  }, [active, mounted]);

  /* ── Cinematic text intro ── */
  useEffect(() => {
    const t: ReturnType<typeof setTimeout>[] = [];
    TEXT_CUES.forEach(({ text, showAt, hideAt }) => {
      t.push(setTimeout(() => { setCurrentText(text); setTextVisible(true);  }, showAt));
      t.push(setTimeout(() => setTextVisible(false), hideAt));
    });
    t.push(setTimeout(() => { setPhase("forming"); setActive(true); }, ACTIVATE_MS));
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
      {/* ── 3D canvas — desktop only ── */}
      {!isMobile && (
        <div className="absolute inset-x-0 bottom-0 z-0" style={{ top: "72px" }}>
          {mounted && <HeroScene onKnotComplete={onKnotComplete} active={active} />}
        </div>
      )}

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
                fontSize:      "clamp(1.4rem, 5vw, 2.9rem)",
                fontWeight:    300,
                letterSpacing: "0.06em",
                color:         "#F5F0FF",
                lineHeight:    1.25,
                textShadow:    "0 0 80px rgba(167,139,250,0.45), 0 2px 40px rgba(136,128,184,0.25)",
              }}
            >
              {currentText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile complete UI — CSS orb + nav buttons ── */}
      <AnimatePresence>
        {isMobile && isComplete && (
          <motion.div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center"
            style={{ paddingTop: "60px", gap: "48px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {/* AxisMed knot logo — replaces the plain orb on mobile */}
            <motion.div
              style={{ position: "relative", width: "180px", height: "180px" }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
            >
              {/* Glow halo behind the logo */}
              <motion.div
                style={{
                  position:     "absolute",
                  inset:        "-24px",
                  borderRadius: "50%",
                  background:   "radial-gradient(circle, rgba(164,158,207,0.45) 0%, transparent 70%)",
                }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
              />
              <Image
                src="/logo-symbol-purple.png"
                alt="AxisMed"
                fill
                className="object-contain drop-shadow-[0_0_32px_rgba(136,128,184,0.7)]"
                priority
              />
            </motion.div>

            {/* Nav buttons */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", padding: "0 24px" }}>
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0  }}
                  transition={{ delay: 0.25 + i * 0.1, duration: 0.5, ease: EASE }}
                  style={{
                    display:              "flex",
                    alignItems:           "center",
                    gap:                  "7px",
                    padding:              "11px 20px",
                    background:           "rgba(255,255,255,0.88)",
                    border:               "1px solid rgba(164,158,207,0.28)",
                    borderRadius:         "12px",
                    backdropFilter:       "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    color:                "#8880b8",
                    fontSize:             "12px",
                    fontWeight:           700,
                    letterSpacing:        "0.1em",
                    textTransform:        "uppercase",
                    textDecoration:       "none",
                    boxShadow:            "0 4px 20px rgba(136,128,184,0.15)",
                    whiteSpace:           "nowrap",
                  } as React.CSSProperties}
                >
                  <span style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: "linear-gradient(135deg,#cac6e6,#8880b8)",
                    flexShrink: 0,
                    boxShadow: "0 0 6px rgba(164,158,207,0.5)",
                  }} />
                  {label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
