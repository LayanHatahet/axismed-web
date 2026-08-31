"use client";

import { useRef } from "react";
import { useAnimationFrame, useReducedMotion, useScroll, useVelocity } from "framer-motion";
import { bpm, pageProgress, MAX_BPM, RESTING_BPM } from "@/lib/axismedia/pulse";

/**
 * Drives the site's heart rate from scroll velocity: fast attack when the
 * visitor scrolls hard, slow decay back to resting rate when they stop.
 * Mounted once in the AxisMedia layout; renders nothing.
 */
export function PulseEngine() {
  const { scrollY, scrollYProgress } = useScroll();
  const velocity = useVelocity(scrollY);
  const reduced = useReducedMotion();
  const last = useRef(0);

  useAnimationFrame((time) => {
    const dt = Math.min((time - last.current) / 1000, 0.05);
    last.current = time;

    pageProgress.set(scrollYProgress.get());
    if (reduced) {
      bpm.set(RESTING_BPM);
      return;
    }

    const v = Math.abs(velocity.get()); // px/s
    const target = Math.min(RESTING_BPM + v / 26, MAX_BPM);
    const current = bpm.get();
    // attack fast (heart races instantly), decay slow (calms gradually)
    const rate = target > current ? 7 : 0.55;
    bpm.set(current + (target - current) * Math.min(rate * dt, 1));
  });

  return null;
}
