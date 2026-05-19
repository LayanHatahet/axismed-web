"use client";

import { useRef, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Props {
  children: ReactNode;
  className?: string;
  strength?: number; // px range, default 20
  as?: "button" | "a";
  href?: string;
  onClick?: () => void;
  [key: string]: unknown;
}

export function MagneticButton({
  children,
  className = "",
  strength = 20,
  as: Tag = "button",
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 350, damping: 25 });
  const y = useSpring(rawY, { stiffness: 350, damping: 25 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawX.set(((e.clientX - cx) / (rect.width / 2)) * strength);
    rawY.set(((e.clientY - cy) / (rect.height / 2)) * strength);
  }

  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="inline-block"
    >
      <motion.div style={{ x, y }}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Tag className={className} {...(rest as any)}>
          {children}
        </Tag>
      </motion.div>
    </div>
  );
}
