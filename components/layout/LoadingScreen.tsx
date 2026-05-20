"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ y: "-100%", transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[100] bg-bg-base flex flex-col items-center justify-center"
        >
          {/* Ambient layers */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.12, 0.22, 0.12] }}
              transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/25 rounded-full blur-[120px]"
            />
            <div className="absolute inset-0 bg-grid opacity-20" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Spinning trefoil knot */}
            <div className="relative w-28 h-28">
              {/* Outer glow ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-8px] rounded-full border border-purple-500/20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-16px] rounded-full border border-purple-500/10"
              />
              {/* The logo spinning */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-full h-full relative"
              >
                <Image
                  src="/logo-symbol.png"
                  alt="AxisMed"
                  fill
                  className="object-contain [filter:hue-rotate(-13deg)_saturate(0.45)_brightness(1.15)_drop-shadow(0_0_20px_rgba(164,158,207,0.6))]"
                  priority
                />
              </motion.div>
            </div>

            {/* Progress bar */}
            <motion.div className="w-36 h-px bg-white/8 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.0, delay: 0.15, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-purple-700 via-purple-400 to-purple-300 rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
