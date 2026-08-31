"use client";

import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Wraps children so they lean toward the cursor — classic magnetic hover. */
export function Magnetic({
  children,
  strength = 18,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 320, damping: 24 });
  const y = useSpring(rawY, { stiffness: 320, damping: 24 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set(((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * strength);
    rawY.set(((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * strength);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
      className={`inline-block ${className}`}
    >
      <motion.div style={{ x, y }}>{children}</motion.div>
    </div>
  );
}
