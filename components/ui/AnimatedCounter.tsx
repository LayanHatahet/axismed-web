"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, {
      duration,
      ease: "easeOut",
    });
    return controls.stop;
  }, [inView, value, duration, count]);

  useEffect(() => {
    return rounded.on("change", (v) => {
      if (displayRef.current) {
        displayRef.current.textContent = `${prefix}${v.toLocaleString()}${suffix}`;
      }
    });
  }, [rounded, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      <span ref={displayRef}>{prefix}0{suffix}</span>
    </span>
  );
}

interface StatCardProps {
  value: number;
  suffix?: string;
  label: string;
  description?: string;
}

export function StatCard({ value, suffix = "", label, description }: StatCardProps) {
  return (
    <div className="text-center p-6">
      <div className="font-display text-5xl font-bold text-gradient mb-2">
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
      <div className="text-white font-semibold text-lg mb-1">{label}</div>
      {description && (
        <div className="text-text-muted text-sm">{description}</div>
      )}
    </div>
  );
}
