"use client";

import { motion } from "framer-motion";
import { EcgCanvas } from "./EcgCanvas";
import { Magnetic } from "./Magnetic";

export function ContactSection() {
  return (
    <footer id="contact" className="axm-frame relative overflow-hidden">
      <span className="axm-tick axm-tick-tl" aria-hidden="true" />
      <span className="axm-tick axm-tick-tr" aria-hidden="true" />

      <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:py-32">
        <p className="axm-mono mb-5 text-center">/ 07 — begin treatment</p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="axm-display mx-auto max-w-4xl text-center text-[clamp(2.6rem,7vw,6.2rem)] uppercase"
        >
          Your brand has a pulse.
          <br />
          <span className="text-[var(--axm-accent)]" style={{ textShadow: "0 0 60px rgba(179,166,236,0.4)" }}>
            Let&apos;s make it race.
          </span>
        </motion.h2>

        <div className="mt-12 flex flex-col items-center gap-6">
          <Magnetic strength={26}>
            <a href="mailto:hello@axismedia.ae" className="axm-btn axm-btn-solid !px-10 !py-5 !text-[0.8rem]">
              hello@axismedia.ae
            </a>
          </Magnetic>
          <p className="axm-mono !text-[0.58rem]">
            Dubai · United Arab Emirates — replies within one business day
          </p>
        </div>

        {/* closing ECG: one last beat before the signature */}
        <div className="mt-20 h-16">
          <EcgCanvas className="h-full w-full opacity-60" beatsPerSweep={9} amplitude={0.3} lineWidth={1.5} />
        </div>
      </div>

      {/* giant wordmark */}
      <div className="select-none px-2" aria-hidden="true">
        <p className="axm-display axm-outline-text whitespace-nowrap text-center text-[10.4vw] uppercase leading-[0.85]">
          Axismedia
        </p>
      </div>

      <div className="mt-8 border-t border-[var(--axm-line)]">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-8">
          <p className="axm-mono !text-[0.55rem]">
            © 2026 AxisMedia — healthcare creative studio
          </p>
          <p className="axm-mono flex items-center gap-2 !text-[0.55rem]">
            <span className="axm-heartbeat inline-block text-[var(--axm-accent)]" aria-hidden="true">
              ♥
            </span>
            flatlines are for competitors
          </p>
          <a
            href="#top"
            className="axm-mono !text-[0.55rem] underline decoration-[var(--axm-line-2)] underline-offset-4 transition-colors hover:!text-[var(--axm-accent)]"
          >
            back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
