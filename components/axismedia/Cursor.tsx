"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useIsDesktop } from "@/lib/axismedia/useIsDesktop";

/**
 * Custom cursor: a solid dot with a trailing ring. The ring expands into a
 * "focus" reticle over anything interactive (links, buttons, [data-cursor]).
 * Only rendered for fine pointers.
 */
export function Cursor() {
  const enabled = useIsDesktop("(pointer: fine)");
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 420, damping: 36 });
  const ringY = useSpring(y, { stiffness: 420, damping: 36 });

  useEffect(() => {
    if (!enabled) return;

    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as Element | null;
      setHovering(
        Boolean(target?.closest?.("a, button, [data-cursor], input, textarea, select"))
      );
    }
    function onLeave() {
      setVisible(false);
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95]">
      {/* dot */}
      <motion.div
        style={{ x, y, opacity: visible ? 1 : 0 }}
        className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-[var(--axm-green)]"
      />
      {/* ring / reticle */}
      <motion.div
        style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
        className="absolute"
      >
        <motion.div
          animate={{
            width: hovering ? 52 : 30,
            height: hovering ? 52 : 30,
            borderRadius: hovering ? 10 : 999,
            rotate: hovering ? 45 : 0,
            borderColor: hovering ? "rgba(44,255,192,0.9)" : "rgba(44,255,192,0.4)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="-translate-x-1/2 -translate-y-1/2 border"
        />
      </motion.div>
    </div>
  );
}
