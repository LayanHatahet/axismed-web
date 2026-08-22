"use client";

import { motion } from "framer-motion";
import type { BrandKit } from "@/lib/axismedia/generator";

/**
 * Generative monogram: the client's initials inside one of four geometric
 * frames, picked by the kit's seed and drawn in its palette.
 */
export function MonogramLogo({ kit, size = 120 }: { kit: BrandKit; size?: number }) {
  const { initials, monogramVariant: v, accent, ink, paper, darkPreview } = kit;
  const fg = darkPreview ? kit.ink : ink;
  const c = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={`Generated monogram for ${kit.name}`}
      style={{ background: paper, borderRadius: 16 }}
    >
      {v === 0 && (
        <motion.g
          initial={{ rotate: -30, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "60px 60px" }}
        >
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const r1 = 46;
            const r2 = i % 6 === 0 ? 38 : 42;
            return (
              <line
                key={i}
                x1={60 + Math.cos(a) * r1}
                y1={60 + Math.sin(a) * r1}
                x2={60 + Math.cos(a) * r2}
                y2={60 + Math.sin(a) * r2}
                stroke={accent}
                strokeWidth={i % 6 === 0 ? 2.5 : 1.2}
              />
            );
          })}
        </motion.g>
      )}
      {v === 1 && (
        <>
          {[46, 38, 30].map((r, i) => (
            <motion.circle
              key={r}
              cx={60}
              cy={60}
              r={r}
              fill="none"
              stroke={accent}
              strokeWidth={1.6}
              strokeDasharray={`${r * 3.5} ${r * 3}`}
              initial={{ pathLength: 0, rotate: i * 40 }}
              animate={{ pathLength: 1, rotate: i * 40 + 360 }}
              transition={{
                pathLength: { duration: 1.2, ease: "easeOut" },
                rotate: { duration: 40 + i * 14, repeat: Infinity, ease: "linear" },
              }}
              style={{ transformOrigin: "60px 60px" }}
              opacity={0.9 - i * 0.25}
            />
          ))}
        </>
      )}
      {v === 2 && (
        <>
          <motion.rect
            x={16}
            y={16}
            width={88}
            height={88}
            rx={22}
            fill="none"
            stroke={accent}
            strokeWidth={2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
          {[
            [30, 30],
            [90, 30],
            [30, 90],
            [90, 90],
          ].map(([x, y], i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={2.4}
              fill={accent}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1, type: "spring", stiffness: 300 }}
            />
          ))}
        </>
      )}
      {v === 3 && (
        <>
          <motion.polygon
            points="60,10 105,35 105,85 60,110 15,85 15,35"
            fill="none"
            stroke={accent}
            strokeWidth={2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <motion.path
            d="M34 92 H50 L54 84 L58 98 L62 88 L66 92 H86"
            fill="none"
            stroke={accent}
            strokeWidth={1.6}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
          />
        </>
      )}

      <motion.text
        x={c}
        y={v === 3 ? 62 : 60}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--axm-display)"
        fontWeight={800}
        fontSize={initials.length > 1 ? 30 : 38}
        fill={fg}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {initials}
      </motion.text>
    </svg>
  );
}
