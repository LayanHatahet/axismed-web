"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

interface Props {
  variant?: "hero" | "purple" | "deep" | "subtle";
  particles?: boolean;
  scanLine?: boolean;
  grid?: boolean;
  grain?: boolean;
  shafts?: boolean;
  waveform?: boolean;
  className?: string;
}

// ECG-style waveform SVG path
const ECG_PATH =
  "M0,50 L60,50 L70,50 L80,20 L90,80 L100,35 L110,65 L120,50 L160,50 L170,50 L180,15 L190,85 L200,40 L210,60 L220,50 L260,50 L270,50 L280,22 L290,78 L300,38 L310,62 L320,50 L400,50";

export function MotionBackground({
  variant = "purple",
  particles = true,
  scanLine = false,
  grid = true,
  grain = true,
  shafts = false,
  waveform = false,
  className = "",
}: Props) {
  const reduced = useReducedMotion();

  // ── Morphing blobs config ────────────────────────────────────────────────
  const blobs = useMemo(() => {
    if (variant === "subtle") return [
      { left: "10%",  top: "15%",  w: 480, h: 380, blur: 130, color: "rgba(164,158,207,0.07)",  dur: 22, delay: 0,  br: ["60% 40% 30% 70%/60% 30% 70% 40%", "30% 60% 70% 40%/50% 60% 30% 60%", "60% 40% 30% 70%/60% 30% 70% 40%"] },
      { left: "65%",  top: "55%",  w: 380, h: 320, blur: 110, color: "rgba(76,29,149,0.06)",   dur: 28, delay: 5,  br: ["40% 60% 70% 30%/40% 50% 60% 50%", "60% 40% 30% 70%/60% 30% 70% 40%", "40% 60% 70% 30%/40% 50% 60% 50%"] },
    ];
    if (variant === "deep") return [
      { left: "-5%",  top: "5%",   w: 700, h: 560, blur: 140, color: "rgba(164,158,207,0.14)",  dur: 19, delay: 0,  br: ["60% 40% 30% 70%/60% 30% 70% 40%", "30% 60% 70% 40%/50% 60% 30% 60%", "50% 50% 50% 50%/50% 50% 50% 50%", "60% 40% 30% 70%/60% 30% 70% 40%"] },
      { left: "60%",  top: "40%",  w: 560, h: 460, blur: 120, color: "rgba(76,29,149,0.12)",   dur: 25, delay: 4,  br: ["40% 60% 70% 30%/40% 50% 60% 50%", "70% 30% 40% 60%/55% 45% 55% 45%", "40% 60% 70% 30%/40% 50% 60% 50%"] },
      { left: "25%",  top: "70%",  w: 440, h: 380, blur: 100, color: "rgba(55,48,163,0.10)",   dur: 32, delay: 8,  br: ["50% 50% 60% 40%/45% 55% 45% 55%", "60% 40% 50% 50%/55% 45% 55% 45%", "50% 50% 60% 40%/45% 55% 45% 55%"] },
    ];
    if (variant === "hero") return [
      { left: "-10%", top: "-8%",  w: 800, h: 640, blur: 150, color: "rgba(164,158,207,0.13)",  dur: 16, delay: 0,  br: ["60% 40% 30% 70%/60% 30% 70% 40%", "30% 60% 70% 40%/50% 60% 30% 60%", "50% 50% 50% 50%/50% 50% 50% 50%", "60% 40% 30% 70%/60% 30% 70% 40%"] },
      { left: "55%",  top: "35%",  w: 640, h: 520, blur: 130, color: "rgba(168,85,247,0.09)",  dur: 22, delay: 6,  br: ["40% 60% 70% 30%/40% 50% 60% 50%", "60% 40% 30% 70%/60% 30% 70% 40%", "30% 70% 60% 40%/60% 40% 30% 70%", "40% 60% 70% 30%/40% 50% 60% 50%"] },
      { left: "72%",  top: "5%",   w: 500, h: 420, blur: 110, color: "rgba(76,29,149,0.10)",   dur: 28, delay: 10, br: ["50% 50% 40% 60%/55% 45% 55% 45%", "60% 40% 50% 50%/40% 60% 50% 50%", "50% 50% 40% 60%/55% 45% 55% 45%"] },
      { left: "18%",  top: "65%",  w: 460, h: 400, blur: 100, color: "rgba(136,128,184,0.11)",  dur: 20, delay: 3,  br: ["30% 70% 50% 50%/50% 30% 70% 50%", "60% 40% 60% 40%/40% 60% 40% 60%", "30% 70% 50% 50%/50% 30% 70% 50%"] },
    ];
    // purple (default)
    return [
      { left: "-8%",  top: "-5%",  w: 700, h: 560, blur: 140, color: "rgba(164,158,207,0.11)",  dur: 18, delay: 0,  br: ["60% 40% 30% 70%/60% 30% 70% 40%", "30% 60% 70% 40%/50% 60% 30% 60%", "50% 40% 60% 40%/40% 50% 60% 50%", "60% 40% 30% 70%/60% 30% 70% 40%"] },
      { left: "52%",  top: "42%",  w: 560, h: 460, blur: 120, color: "rgba(168,85,247,0.09)",  dur: 24, delay: 5,  br: ["40% 60% 70% 30%/40% 50% 60% 50%", "60% 40% 30% 70%/60% 30% 70% 40%", "30% 70% 60% 40%/60% 40% 30% 70%", "40% 60% 70% 30%/40% 50% 60% 50%"] },
      { left: "74%",  top: "3%",   w: 460, h: 400, blur: 110, color: "rgba(76,29,149,0.10)",   dur: 30, delay: 10, br: ["50% 50% 40% 60%/55% 45% 55% 45%", "60% 40% 50% 50%/40% 60% 50% 50%", "50% 50% 40% 60%/55% 45% 55% 45%"] },
      { left: "20%",  top: "68%",  w: 420, h: 360, blur: 100, color: "rgba(136,128,184,0.10)",  dur: 22, delay: 2,  br: ["30% 70% 50% 50%/50% 30% 70% 50%", "60% 40% 60% 40%/40% 60% 40% 60%", "30% 70% 50% 50%/50% 30% 70% 50%"] },
    ];
  }, [variant]);

  // ── Light shafts ─────────────────────────────────────────────────────────
  const shaftList = useMemo(() => [
    { left: "20%",  dur: "18s", delay: "0s",   opacity: 0.06 },
    { left: "55%",  dur: "24s", delay: "7s",   opacity: 0.04 },
    { left: "80%",  dur: "20s", delay: "13s",  opacity: 0.05 },
  ], []);

  // ── Particles ────────────────────────────────────────────────────────────
  const dots = useMemo(() => [
    { x: "7%",  y: "18%", s: 2,   dur: 9,  dl: 0   },
    { x: "84%", y: "11%", s: 1.5, dur: 13, dl: 1.5 },
    { x: "91%", y: "53%", s: 2.5, dur: 11, dl: 3   },
    { x: "23%", y: "77%", s: 1.5, dur: 8,  dl: 2   },
    { x: "59%", y: "87%", s: 2,   dur: 14, dl: 0.5 },
    { x: "44%", y: "33%", s: 1,   dur: 10, dl: 4   },
    { x: "6%",  y: "57%", s: 2,   dur: 12, dl: 2.5 },
    { x: "76%", y: "79%", s: 1.5, dur: 16, dl: 1   },
    { x: "38%", y: "22%", s: 1,   dur: 11, dl: 3.5 },
    { x: "67%", y: "44%", s: 1.5, dur: 9,  dl: 0.8 },
  ], []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>

      {/* ── Mesh gradient base ──────────────────────────────────────── */}
      <div className="absolute inset-0 mesh-gradient opacity-80" />

      {/* ── Perspective depth grid (bottom) ─────────────────────────── */}
      {(variant === "hero" || variant === "deep") && (
        <div className="absolute bottom-0 left-0 right-0 h-[45%] overflow-hidden opacity-30">
          <div className="absolute inset-0 perspective-grid" />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-bg-dark/60" />
        </div>
      )}

      {/* ── Flat grid overlay ───────────────────────────────────────── */}
      {grid && <div className="absolute inset-0 bg-grid opacity-20" />}

      {/* ── Holographic scanlines ───────────────────────────────────── */}
      {(variant === "hero" || variant === "purple") && (
        <div className="absolute inset-0 holo-lines opacity-100" />
      )}

      {/* ── Morphing aurora blobs ───────────────────────────────────── */}
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: b.left,
            top: b.top,
            width: b.w,
            height: b.h,
            background: b.color,
            filter: `blur(${b.blur}px)`,
          }}
          animate={reduced ? {} : {
            borderRadius: b.br,
            x: [0, 40, -25, 15, 0],
            y: [0, -30, 20, -10, 0],
            scale: [1, 1.06, 0.96, 1.03, 1],
          }}
          transition={{
            duration: b.dur,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ── Light shafts ────────────────────────────────────────────── */}
      {shafts && !reduced && shaftList.map((s, i) => (
        <div
          key={i}
          className="light-shaft"
          style={{
            left: s.left,
            opacity: s.opacity,
            "--dur": s.dur,
            "--delay": s.delay,
          } as React.CSSProperties}
        />
      ))}

      {/* ── Floating geometric rings ─────────────────────────────────── */}
      {(variant === "hero" || variant === "purple") && !reduced && (
        <>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-[6%] w-36 h-36 rounded-full border border-purple-500/10 hidden xl:block"
          />
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/3 right-[9%] w-24 h-24 rounded-full border border-purple-400/8 hidden xl:block"
          />
          <motion.div
            animate={{ rotate: [0, 360], scale: [1, 1.06, 1] }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full border border-purple-500/6 hidden xl:block"
          />
          {/* Cross-hair targeting circles — surgical motif */}
          <motion.div
            animate={{ rotate: [0, -360], opacity: [0.04, 0.09, 0.04] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute top-[15%] right-[18%] w-16 h-16 rounded-full border-2 border-purple-400/10 hidden lg:block"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.08, 0.03] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] right-[18%] w-4 h-4 rounded-full bg-purple-400/10 hidden lg:block"
            style={{ margin: "calc(50% - 8px)" }}
          />
        </>
      )}

      {/* ── Floating particles ───────────────────────────────────────── */}
      {particles && dots.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-purple-400/50"
          style={{ left: p.x, top: p.y, width: p.s, height: p.s }}
          animate={reduced ? {} : {
            y: [0, -26, 0],
            opacity: [0.15, 0.8, 0.15],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.dur,
            delay: p.dl,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ── ECG / waveform line ─────────────────────────────────────── */}
      {waveform && !reduced && (
        <svg
          className="absolute bottom-[8%] left-0 right-0 w-full opacity-30"
          height="60"
          viewBox="0 0 400 60"
          preserveAspectRatio="none"
        >
          <path
            d={ECG_PATH}
            fill="none"
            stroke="rgba(168,85,247,0.6)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="2000"
            strokeDashoffset="2000"
            style={{ animation: "ecg-draw 4s linear infinite" }}
          />
          {/* Ghost second line */}
          <path
            d={ECG_PATH}
            fill="none"
            stroke="rgba(168,85,247,0.2)"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeDasharray="2000"
            strokeDashoffset="2000"
            style={{ animation: "ecg-draw 4s 1s linear infinite" }}
          />
        </svg>
      )}

      {/* ── Diagonal accent beams ────────────────────────────────────── */}
      {variant === "hero" && !reduced && (
        <>
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0.03, 0.07, 0.03] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: "linear-gradient(125deg, transparent 30%, rgba(168,85,247,0.06) 50%, transparent 70%)",
            }}
          />
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0.02, 0.05, 0.02] }}
            transition={{ duration: 12, delay: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: "linear-gradient(245deg, transparent 35%, rgba(164,158,207,0.05) 55%, transparent 75%)",
            }}
          />
        </>
      )}

      {/* ── Horizontal sweep scan lines (multiple) ───────────────────── */}
      {scanLine && !reduced && (
        <>
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
            animate={{ y: ["-5vh", "105vh"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
          />
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/15 to-transparent"
            animate={{ y: ["10vh", "110vh"] }}
            transition={{ duration: 11, delay: 3, repeat: Infinity, ease: "linear", repeatDelay: 6 }}
          />
        </>
      )}

      {/* ── Film grain overlay ───────────────────────────────────────── */}
      {grain && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="film-grain absolute" />
        </div>
      )}

    </div>
  );
}
