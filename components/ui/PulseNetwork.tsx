"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export function PulseNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced   = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    function frame() {
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      t += 0.0022;

      ctx.clearRect(0, 0, W, H);

      // Three flowing sine-wave layers at different depths
      const layers = [
        { amp: 28, freq: 0.0055, yFrac: 0.32, speed: 1.0, opacity: 0.022 },
        { amp: 18, freq: 0.0075, yFrac: 0.55, speed: 0.7, opacity: 0.016 },
        { amp: 12, freq: 0.011,  yFrac: 0.74, speed: 1.3, opacity: 0.012 },
      ];

      for (const l of layers) {
        ctx.beginPath();
        const yBase = H * l.yFrac;
        for (let x = 0; x <= W; x += 3) {
          const y = yBase + l.amp * Math.sin(x * l.freq + t * l.speed * 6.28);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(164,158,207,${l.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Secondary harmonic on the same layer (slightly offset)
        ctx.beginPath();
        for (let x = 0; x <= W; x += 3) {
          const y = yBase + l.amp * 0.5 * Math.sin(x * l.freq * 1.6 + t * l.speed * 4.5 + 1.2);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(164,158,207,${l.opacity * 0.7})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: 0.85 }}
    />
  );
}
