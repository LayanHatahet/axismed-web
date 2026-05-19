"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils/cn";

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  once?: boolean;
}

export function SectionReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
}: SectionRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-80px 0px" });

  const vectors = {
    up:    { y: 32 },
    down:  { y: -32 },
    left:  { x: 32 },
    right: { x: -32 },
    none:  {},
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...vectors[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

interface StaggerRevealProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  stagger?: number;
  delay?: number;
  direction?: "up" | "left" | "none";
  once?: boolean;
}

export function StaggerReveal({
  children,
  className,
  itemClassName,
  stagger = 0.1,
  delay = 0,
  direction = "up",
  once = true,
}: StaggerRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-60px 0px" });

  const vectors = {
    up:   { y: 28 },
    left: { x: 28 },
    none: {},
  };

  return (
    <div ref={ref} className={cn(className)}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, ...vectors[direction] }}
          animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{
            duration: 0.65,
            delay: delay + i * stagger,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className={cn(itemClassName)}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
