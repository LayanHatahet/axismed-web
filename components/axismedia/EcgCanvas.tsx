"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { bpm, ecgWave } from "@/lib/axismedia/pulse";

interface Props {
  className?: string;
  /** trace amplitude as a fraction of canvas height (default 0.3) */
  amplitude?: number;
  lineWidth?: number;
  /** how many heartbeats fit in one full sweep of the canvas */
  beatsPerSweep?: number;
  /** amplify the wave where the visitor's cursor hovers */
  interactive?: boolean;
  color?: string;
  glow?: boolean;
}

/**
 * A live patient-monitor ECG trace. The sweep speed is driven by the shared
 * `bpm` motion value, so every trace on the page races and calms together
 * with the visitor's scrolling.
 */
export function EcgCanvas({
  className = "",
  amplitude = 0.3,
  lineWidth = 2,
  beatsPerSweep = 5,
  interactive = false,
  color = "#2cffc0",
  glow = true,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let values: Float32Array = new Float32Array(0);
    let headX = 0;
    let phase = 0; // in beats
    let lastT = 0;
    const mouse = { x: -9999, active: false };

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      const next = new Float32Array(W);
      next.fill(H / 2);
      values = next;
      headX = 0;
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function onMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.active = e.clientY >= rect.top - 80 && e.clientY <= rect.bottom + 80;
    }
    function onLeave() {
      mouse.active = false;
    }
    if (interactive) {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseout", onLeave, { passive: true });
    }

    function sample(x: number, p: number): number {
      const mid = H / 2;
      let amp = H * amplitude;
      if (interactive && mouse.active) {
        const d = x - mouse.x;
        amp *= 1 + 1.15 * Math.exp(-(d * d) / (2 * 130 * 130));
      }
      const noise = (Math.random() - 0.5) * H * 0.006;
      return mid - ecgWave(p % 1) * amp + noise;
    }

    function drawSegment(from: number, to: number, alphaFrom: number, alphaTo: number) {
      if (!ctx || to - from < 2) return;
      const grad = ctx.createLinearGradient(from, 0, to, 0);
      grad.addColorStop(0, colorWithAlpha(alphaFrom));
      grad.addColorStop(1, colorWithAlpha(alphaTo));
      ctx.strokeStyle = grad;
      ctx.beginPath();
      for (let x = Math.floor(from); x <= Math.floor(to); x++) {
        const y = values[x] ?? H / 2;
        if (x === Math.floor(from)) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    function colorWithAlpha(a: number): string {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`;
    }

    function staticFrame() {
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = colorWithAlpha(0.85);
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      const beatW = W / beatsPerSweep;
      for (let x = 0; x < W; x++) {
        const y = H / 2 - ecgWave((x / beatW) % 1) * H * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    if (reduced) {
      staticFrame();
      // keep it correct on resize
      const roStatic = new ResizeObserver(() => staticFrame());
      roStatic.observe(canvas);
      return () => {
        ro.disconnect();
        roStatic.disconnect();
      };
    }

    function frame(t: number) {
      raf = requestAnimationFrame(frame);
      if (!ctx || W === 0) return;
      const dt = Math.min((t - lastT) / 1000, 0.05);
      lastT = t;

      const beatsPerSec = bpm.get() / 60;
      const beatW = W / beatsPerSweep;
      const advance = beatsPerSec * dt * beatW;

      // fill every pixel between old and new head with interpolated samples
      const steps = Math.max(1, Math.ceil(advance));
      for (let i = 1; i <= steps; i++) {
        const frac = i / steps;
        const x = Math.floor((headX + advance * frac) % W);
        const p = phase + beatsPerSec * dt * frac;
        values[x] = sample(x, p);
      }
      headX = (headX + advance) % W;
      phase += beatsPerSec * dt;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = "round";
      if (glow) {
        ctx.shadowColor = colorWithAlpha(0.8);
        ctx.shadowBlur = 12;
      }

      // erase-gap ahead of the head, fading tail behind it (monitor sweep)
      const gap = W * 0.1;
      const head = Math.floor(headX);
      // newest → oldest: [0..head] then [head+gap..W]
      const tailLen = W - gap;
      drawSegment(0, head, 1 - head / tailLen, 1);
      drawSegment(head + gap, W, 0.06, 1 - head / tailLen);

      // head dot
      ctx.shadowBlur = glow ? 18 : 0;
      ctx.fillStyle = colorWithAlpha(1);
      ctx.beginPath();
      ctx.arc(head, values[head] ?? H / 2, lineWidth + 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (interactive) {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseout", onLeave);
      }
    };
  }, [amplitude, beatsPerSweep, color, glow, interactive, lineWidth, reduced]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
