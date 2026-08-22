"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { EcgCanvas } from "./EcgCanvas";
import { Magnetic } from "./Magnetic";

const EASE = [0.22, 1, 0.36, 1] as const;

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        initial={{ y: "112%" }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 0.9, ease: EASE }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const ecgScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);

  // the preloader holds the screen for ~3s on first visit; these delays land just after
  const D = 0.15;

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* ambient glow + grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 axm-grid-bg"
        style={{
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 45%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 45%, black 30%, transparent 75%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[80vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(179,166,236,0.07), transparent)" }}
      />

      {/* live ECG running behind the headline — beats faster as you scroll */}
      <motion.div
        style={{ scale: ecgScale }}
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[34vh] -translate-y-1/2"
      >
        <EcgCanvas className="h-full w-full opacity-70" interactive beatsPerSweep={7} amplitude={0.32} lineWidth={2} />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-[1500px] px-5 pt-20 sm:px-8"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: D, duration: 0.7, ease: EASE }}
          className="axm-mono mb-5 flex items-center gap-3"
        >
          <span className="axm-live-dot shrink-0" aria-hidden="true" />
          Healthcare creative studio — Dubai · United Arab Emirates
        </motion.p>

        <h1 className="axm-display text-[clamp(2.8rem,8vw,7.6rem)] uppercase">
          <Line delay={D + 0.1}>We give</Line>
          <Line delay={D + 0.22}>
            <span className="axm-outline-text">medical brands</span>
          </Line>
          <Line delay={D + 0.34}>
            a{" "}
            <motion.span
              className="inline-block text-[var(--axm-accent)]"
              style={{ textShadow: "0 0 60px rgba(179,166,236,0.45)" }}
              animate={{ scale: [1, 1.04, 1, 1.025, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.4, ease: "easeInOut" }}
            >
              pulse
            </motion.span>
          </Line>
        </h1>

        <div className="mt-7 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: D + 0.55, duration: 0.7, ease: EASE }}
            className="max-w-md text-[1.02rem] leading-relaxed text-[var(--axm-muted)]"
          >
            Branding, websites, applications and marketing — engineered exclusively for the
            medical industry. We turn clinics, hospitals and health-tech into brands patients
            trust and remember.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: D + 0.68, duration: 0.7, ease: EASE }}
            className="flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <a href="#contact" className="axm-btn axm-btn-solid">
                Start a project <span aria-hidden="true">→</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#engine" className="axm-btn axm-btn-ghost">
                ⚡ Build your brand live
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: D + 1.1, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
        aria-hidden="true"
      >
        <span className="axm-mono !text-[0.55rem]">scroll to raise the pulse</span>
        <motion.span
          animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="block h-8 w-px bg-[var(--axm-accent)]"
        />
      </motion.div>

      {/* viewfinder corner brackets */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-4 z-10 hidden lg:block">
        {(["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"] as const).map(
          (pos) => (
            <span key={pos} className={`absolute h-5 w-5 border-[var(--axm-line-2)] ${pos}`} />
          )
        )}
      </div>
    </section>
  );
}
