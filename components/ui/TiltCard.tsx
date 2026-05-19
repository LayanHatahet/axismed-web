"use client";

import { useRef, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number; // degrees, default 8
  glare?: boolean;
}

export function TiltCard({
  children,
  className = "",
  intensity = 8,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const rotX = useSpring(rawX, { stiffness: 350, damping: 35 });
  const rotY = useSpring(rawY, { stiffness: 350, damping: 35 });
  const scale = useSpring(1, { stiffness: 300, damping: 25 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const glareOpacity = useTransform(
    [rotX, rotY] as any,
    ([rx, ry]: number[]) => Math.sqrt(rx * rx + ry * ry) / (intensity * 1.5) * 0.25
  );

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / (rect.height / 2)) * -intensity;
    const ry = ((e.clientX - cx) / (rect.width / 2)) * intensity;
    rawX.set(rx);
    rawY.set(ry);
    glareX.set(((e.clientX - rect.left) / rect.width) * 100);
    glareY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  function onMouseEnter() { scale.set(1.02); }
  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
    scale.set(1);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        scale,
        transformStyle: "preserve-3d",
        transformPerspective: "1000px",
      }}
      className={`relative ${className}`}
    >
      {children}
      {/* Glare overlay */}
      {glare && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden"
          style={{ opacity: glareOpacity }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([x, y]: number[]) =>
                  `radial-gradient(circle at ${x}% ${y}%, rgba(168,85,247,0.4) 0%, transparent 60%)`
              ),
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
