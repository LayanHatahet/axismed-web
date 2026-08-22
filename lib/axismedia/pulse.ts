"use client";

import { motionValue, MotionValue } from "framer-motion";

/**
 * Shared vitals for the AxisMedia experience.
 *
 * The whole site behaves like a living patient: `bpm` is its heart rate.
 * It idles at ~64 and climbs toward ~178 with scroll velocity, then decays
 * back to resting. Every ECG trace and HUD readout on the page reads from
 * these module singletons so all of them beat in sync.
 */
export const bpm: MotionValue<number> = motionValue(64);
export const pageProgress: MotionValue<number> = motionValue(0);

export const RESTING_BPM = 64;
export const MAX_BPM = 178;

/** One canonical ECG beat, phase t ∈ [0,1) → normalized displacement (−1..1). */
export function ecgWave(t: number): number {
  const gauss = (c: number, w: number) => Math.exp(-((t - c) ** 2) / (2 * w * w));
  let v = 0;
  v += 0.14 * gauss(0.18, 0.035); // P wave
  v -= 0.16 * gauss(0.355, 0.012); // Q dip
  v += 1.0 * gauss(0.4, 0.014); // R spike
  v -= 0.28 * gauss(0.445, 0.014); // S dip
  v += 0.3 * gauss(0.62, 0.055); // T wave
  return v;
}
