"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Magnetic } from "./Magnetic";

const LINKS = [
  { href: "#treatment", label: "Treatment" },
  { href: "#process", label: "Process" },
  { href: "#sectors", label: "Sectors" },
  { href: "#checkup", label: "Check-up" },
];

export function AxmNavbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-[90] transition-colors duration-500 ${
        scrolled
          ? "border-b border-[var(--axm-line)] bg-[rgba(4,7,9,0.75)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5" aria-label="AxisMedia — back to top">
          <span className="axm-live-dot" aria-hidden="true" />
          <span className="axm-display text-lg tracking-[0.06em] text-[var(--axm-text)]">
            AXIS<span className="text-[var(--axm-green)]">MEDIA</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="axm-mono !text-[0.62rem] transition-colors hover:!text-[var(--axm-green)]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <Magnetic strength={12}>
          <a href="#contact" className="axm-btn axm-btn-solid !px-5 !py-2.5 !text-[0.6rem]">
            Start a project
          </a>
        </Magnetic>
      </nav>
    </motion.header>
  );
}
