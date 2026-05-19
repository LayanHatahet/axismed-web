"use client";

import { motion } from "framer-motion";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  /** "chars" (default) | "words" */
  mode?: "chars" | "words";
  once?: boolean;
  /** scroll-triggered if true */
  inView?: boolean;
}

export function SplitText({
  text,
  className = "",
  delay = 0,
  mode = "chars",
  once = true,
}: SplitTextProps) {
  if (mode === "words") {
    const words = text.split(" ");
    return (
      <span className={`inline-block overflow-hidden ${className}`} aria-label={text}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: "110%", skewY: 4 }}
            animate={{ opacity: 1, y: "0%", skewY: 0 }}
            transition={{
              duration: 0.65,
              delay: delay + i * 0.07,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block mr-[0.25em]"
          >
            {word}
          </motion.span>
        ))}
      </span>
    );
  }

  // char mode — 3D flip per character
  return (
    <span className={className} aria-label={text} style={{ perspective: "800px" }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, rotateX: -90, y: "40%" }}
          animate={{ opacity: 1, rotateX: 0, y: "0%" }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.025,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
          className="inline-block"
          style={{ transformOrigin: "50% 100%" }}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
}
