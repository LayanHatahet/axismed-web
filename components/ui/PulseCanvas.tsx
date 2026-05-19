"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; alpha: number;
  phase: number; speed: number;
}

interface Pt { x: number; y: number }

function rand(a: number, b: number) { return a + Math.random() * (b - a); }

function lissajousPt(
  cx: number, cy: number,
  A: number, B: number,
  a: number, b: number,
  delta: number, t: number
): Pt {
  return { x: cx + A * Math.sin(a * t + delta), y: cy + B * Math.sin(b * t) };
}

interface Props { className?: string }

export function PulseCanvas({ className = "" }: Props) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const reduced     = useReducedMotion();
  const rafRef      = useRef<number>(0);
  const mouse       = useRef({ x: 0.5, y: 0.5 });
  const particles   = useRef<Particle[]>([]);
  const tracer1     = useRef<Pt[]>([]);
  const tracer2     = useRef<Pt[]>([]);
  const clock       = useRef(0);
  const tracerT1    = useRef(0);
  const tracerT2    = useRef(Math.PI * 0.7);

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
      particles.current = Array.from({ length: 58 }, () => ({
        x: rand(0, canvas.width), y: rand(0, canvas.height),
        vx: rand(-0.07, 0.07),   vy: rand(-0.07, 0.07),
        size: rand(0.6, 2.0),    alpha: rand(0.06, 0.4),
        phase: rand(0, Math.PI * 2), speed: rand(0.004, 0.011),
      }));
      tracer1.current = [];
      tracer2.current = [];
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function onMove(e: MouseEvent) {
      mouse.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    }
    window.addEventListener("mousemove", onMove, { passive: true });

    // Multi-layer glow: draw same curve at widths/alphas for soft bloom
    function drawCurve(
      cx: number, cy: number,
      A: number, B: number,
      a: number, b: number,
      delta: number, N: number,
      r: number, g: number, bl: number,
      widths: number[], alphas: number[]
    ) {
      const pts: Pt[] = [];
      for (let i = 0; i <= N; i++) {
        pts.push(lissajousPt(cx, cy, A, B, a, b, delta, (i / N) * Math.PI * 2));
      }
      ctx!.lineJoin = "round";
      ctx!.lineCap  = "round";
      for (let layer = 0; layer < widths.length; layer++) {
        ctx!.beginPath();
        ctx!.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx!.lineTo(pts[i].x, pts[i].y);
        ctx!.closePath();
        ctx!.strokeStyle = `rgb(${r},${g},${bl})`;
        ctx!.lineWidth   = widths[layer];
        ctx!.globalAlpha = alphas[layer];
        ctx!.stroke();
      }
      ctx!.globalAlpha = 1;
    }

    function frame() {
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;

      clock.current  += 0.0048;
      tracerT1.current += 0.026;
      tracerT2.current += 0.019;
      const T = clock.current;
      const mx = mouse.current.x;
      const my = mouse.current.y;

      ctx.clearRect(0, 0, W, H);

      // ── Atmospheric gradients ──────────────────────
      const gA = ctx.createRadialGradient(W*0.32, H*0.42, 0, W*0.32, H*0.42, W*0.55);
      gA.addColorStop(0, "rgba(75,29,255,0.1)");
      gA.addColorStop(1, "rgba(75,29,255,0)");
      ctx.fillStyle = gA; ctx.fillRect(0, 0, W, H);

      const gB = ctx.createRadialGradient(W*0.70, H*0.58, 0, W*0.70, H*0.58, W*0.44);
      gB.addColorStop(0, "rgba(139,92,246,0.065)");
      gB.addColorStop(1, "rgba(139,92,246,0)");
      ctx.fillStyle = gB; ctx.fillRect(0, 0, W, H);

      const gC = ctx.createRadialGradient(W*0.50, H*0.20, 0, W*0.50, H*0.20, W*0.35);
      gC.addColorStop(0, "rgba(75,29,255,0.04)");
      gC.addColorStop(1, "rgba(75,29,255,0)");
      ctx.fillStyle = gC; ctx.fillRect(0, 0, W, H);

      // Mouse reactive glow
      const gM = ctx.createRadialGradient(mx*W, my*H, 0, mx*W, my*H, 200);
      gM.addColorStop(0, "rgba(139,92,246,0.06)");
      gM.addColorStop(1, "rgba(139,92,246,0)");
      ctx.fillStyle = gM; ctx.fillRect(0, 0, W, H);

      // ── Particles ─────────────────────────────────
      for (const p of particles.current) {
        p.phase += p.speed;
        p.x += p.vx; p.y += p.vy;

        const dx = mx*W - p.x; const dy = my*H - p.y;
        const d2 = dx*dx + dy*dy;
        if (d2 < 50000) {
          const d = Math.sqrt(d2);
          p.vx += (dx/d)*0.0014;
          p.vy += (dy/d)*0.0014;
        }
        const spd = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
        if (spd > 0.22) { p.vx *= 0.95; p.vy *= 0.95; }
        if (p.x < -5) p.x = W+5; if (p.x > W+5) p.x = -5;
        if (p.y < -5) p.y = H+5; if (p.y > H+5) p.y = -5;

        const a = ((Math.sin(p.phase) + 1) * 0.5) * p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fillStyle = `rgba(196,181,253,${a})`;
        ctx.fill();
      }

      // ── Lissajous orbital paths ───────────────────
      const cx = W / 2;
      const cy = H / 2;
      const S  = Math.min(W, H);

      // Outer orbit — large, slowly morphing frequency
      const A1 = S * 0.335; const B1 = S * 0.225;
      const f1  = 2 + Math.sin(T * 0.11) * 0.48;   // morphs between 1.52 → 2.48
      const f2  = 3;
      const d1  = T * 0.32 + (mx - 0.5) * 1.0;     // mouse X distorts phase

      drawCurve(cx, cy, A1*1.10, B1*1.10, f1, f2, d1-0.14, 360,
        75, 29, 255,    [10, 5, 2],    [0.014, 0.032, 0.055]
      );
      drawCurve(cx, cy, A1,      B1,      f1, f2, d1,       420,
        139, 92, 246,   [7, 3.5, 1.5], [0.025, 0.07, 0.18]
      );
      drawCurve(cx, cy, A1*0.93, B1*0.93, f1, f2, d1+0.07,  500,
        196, 181, 253,  [4.5, 2, 0.75],[0.04, 0.16, 0.68]
      );

      // Middle orbit — counter-direction
      const A2 = S * 0.185; const B2 = S * 0.125;
      const f3  = 3 + Math.sin(T * 0.08) * 0.38;
      const f4  = 2;
      const d2  = -T * 0.52 + (my - 0.5) * 0.75;

      drawCurve(cx, cy, A2,      B2,      f3, f4, d2,       360,
        139, 92, 246,   [5, 2.5, 1],   [0.02, 0.065, 0.16]
      );
      drawCurve(cx, cy, A2*0.93, B2*0.93, f3, f4, d2+0.09,  360,
        216, 200, 255,  [2.5, 1],       [0.08, 0.48]
      );

      // Inner orbit — rapid, tight
      const A3 = S * 0.085; const B3 = S * 0.085;
      drawCurve(cx, cy, A3, B3, 3, 5, T*1.05, 280,
        196, 181, 253,  [2, 0.7],       [0.06, 0.32]
      );

      // ── Tracer 1: bright dot tracing outer orbit ──
      const tr1 = 90;
      const pt1 = lissajousPt(cx, cy, A1*0.93, B1*0.93, f1, f2, d1+0.07, tracerT1.current);
      tracer1.current.push(pt1);
      if (tracer1.current.length > tr1) tracer1.current.shift();
      for (let i = 1; i < tracer1.current.length; i++) {
        const frac = i / tr1;
        ctx.beginPath();
        ctx.arc(tracer1.current[i].x, tracer1.current[i].y, frac * 3.2, 0, Math.PI*2);
        ctx.fillStyle = `rgba(245,240,255,${frac * 0.72})`;
        ctx.fill();
      }

      // ── Tracer 2: middle orbit ────────────────────
      const tr2 = 65;
      const pt2 = lissajousPt(cx, cy, A2*0.93, B2*0.93, f3, f4, d2+0.09, tracerT2.current);
      tracer2.current.push(pt2);
      if (tracer2.current.length > tr2) tracer2.current.shift();
      for (let i = 1; i < tracer2.current.length; i++) {
        const frac = i / tr2;
        ctx.beginPath();
        ctx.arc(tracer2.current[i].x, tracer2.current[i].y, frac * 2.2, 0, Math.PI*2);
        ctx.fillStyle = `rgba(196,181,253,${frac * 0.52})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
