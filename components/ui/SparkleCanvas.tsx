"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Sparkle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  phase: number;       // current angle in the twinkle cycle
  speed: number;       // twinkle speed
  vx: number;          // drift velocity x
  vy: number;          // drift velocity y
  color: [number, number, number]; // rgb
  type: "dot" | "star" | "cross";
}

const COLORS: [number, number, number][] = [
  [255, 255, 255],   // white
  [196, 181, 253],   // purple-200
  [167, 139, 250],   // purple-400
  [139, 92,  246],   // purple-500
  [216, 180, 254],   // purple-300
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makeSparkle(w: number, h: number): Sparkle {
  const r = Math.random();
  return {
    x:       rand(0, w),
    y:       rand(0, h),
    size:    r < 0.55 ? rand(1, 2.2) : r < 0.85 ? rand(2.2, 4.5) : rand(4.5, 8),
    opacity: rand(0.1, 0.9),
    phase:   rand(0, Math.PI * 2),
    speed:   rand(0.004, 0.022),
    vx:      rand(-0.06, 0.06),
    vy:      rand(-0.12, -0.02),  // mostly drift upward, slowly
    color:   COLORS[Math.floor(Math.random() * COLORS.length)],
    type:    r < 0.6 ? "dot" : r < 0.85 ? "star" : "cross",
  };
}

// Draw a 4-point star
function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const inner = r * 0.38;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4 - Math.PI / 2;
    const radius = i % 2 === 0 ? r : inner;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

// Draw a cross / plus sparkle
function drawCross(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const arm = r * 1.6;
  const thick = r * 0.22;
  ctx.fillRect(x - thick, y - arm, thick * 2, arm * 2);
  ctx.fillRect(x - arm, y - thick, arm * 2, thick * 2);
  // diagonal arms (smaller)
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-thick * 0.7, -arm * 0.55, thick * 1.4, arm * 1.1);
  ctx.fillRect(-arm * 0.55, -thick * 0.7, arm * 1.1, thick * 1.4);
  ctx.restore();
}

interface Props {
  count?: number;
  className?: string;
}

export function SparkleCanvas({ count = 160, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const rafRef  = useRef<number>(0);
  const sparklesRef = useRef<Sparkle[]>([]);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      sparklesRef.current = Array.from({ length: count }, () =>
        makeSparkle(canvas.width, canvas.height)
      );
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of sparklesRef.current) {
        // Twinkle
        s.phase += s.speed;
        const alpha = ((Math.sin(s.phase) + 1) / 2) * s.opacity;

        // Drift
        s.x += s.vx;
        s.y += s.vy;

        // Wrap / respawn
        if (s.y < -20 || s.x < -20 || s.x > canvas.width + 20) {
          Object.assign(s, makeSparkle(canvas.width, canvas.height));
          s.y = canvas.height + 10; // respawn from bottom
        }

        const [r, g, b] = s.color;
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;

        // Glow for larger sparkles
        if (s.size > 3) {
          ctx.shadowColor = `rgba(${r},${g},${b},${alpha * 0.7})`;
          ctx.shadowBlur  = s.size * 3.5;
        } else {
          ctx.shadowBlur = 0;
        }

        if (s.type === "dot") {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (s.type === "star") {
          drawStar(ctx, s.x, s.y, s.size);
        } else {
          drawCross(ctx, s.x, s.y, s.size * 0.6);
        }
      }

      ctx.shadowBlur = 0;
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [count, reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
