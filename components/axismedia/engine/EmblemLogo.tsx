"use client";

import { motion } from "framer-motion";
import type { BrandKit } from "@/lib/axismedia/generator";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The generated logomark. Not a picker, not initials-in-a-box: each sector
 * has its own construction language, and the visitor's name seeds rotation,
 * counts and proportions — so every brand gets its own emblem, drawn in its
 * own gradient.
 *
 * clinic     → pulse blossom (rotational petals around a heartbeat dot)
 * hospital   → beacon cross (soft cross + orbiting arc)
 * dental     → smile crest (crescent + crown dot in a soft shield)
 * aesthetics → silk flower (layered translucent petals)
 * pharma     → molecule (hexagon lattice with bonded nodes)
 * digital    → signal grid (network nodes, one alive)
 */
export function EmblemLogo({
  kit,
  size = 120,
  onPaper = true,
}: {
  kit: BrandKit;
  size?: number;
  /** true: draws its own paper tile behind the mark */
  onPaper?: boolean;
}) {
  const seed = kit.monogramVariant + kit.initials.charCodeAt(0);
  const gid = `axg-${kit.sector}-${kit.accent.slice(1)}-${size}`;
  const rot = (seed % 8) * 4 - 14; // subtle seeded tilt, −14°..14°

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={`Generated emblem for ${kit.name}`}
      style={onPaper ? { background: kit.paper, borderRadius: size / 6 } : undefined}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={kit.accent} />
          <stop offset="100%" stopColor={kit.accentSoft} />
        </linearGradient>
        <linearGradient id={`${gid}-r`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={kit.accentSoft} />
          <stop offset="100%" stopColor={kit.accent} />
        </linearGradient>
      </defs>

      <motion.g
        initial={{ scale: 0.6, opacity: 0, rotate: rot - 40 }}
        animate={{ scale: 1, opacity: 1, rotate: rot }}
        transition={{ duration: 1.1, ease: EASE }}
        style={{ transformOrigin: "60px 60px" }}
      >
        {kit.sector === "clinic" && <PulseBlossom gid={gid} seed={seed} dark={kit.darkPreview} />}
        {kit.sector === "hospital" && <BeaconCross gid={gid} accent={kit.accent} />}
        {kit.sector === "dental" && <SmileCrest gid={gid} accent={kit.accent} />}
        {kit.sector === "aesthetics" && <SilkFlower gid={gid} seed={seed} accent={kit.accent} dark={kit.darkPreview} />}
        {kit.sector === "pharma" && <Molecule gid={gid} accent={kit.accent} />}
        {kit.sector === "digital" && <SignalGrid gid={gid} accent={kit.accent} />}
      </motion.g>
    </svg>
  );
}

function PulseBlossom({ gid, seed, dark }: { gid: string; seed: number; dark: boolean }) {
  const petals = 6 + (seed % 3); // 6..8
  return (
    <>
      {Array.from({ length: petals }, (_, i) => {
        const a = (i / petals) * 360;
        return (
          <motion.ellipse
            key={i}
            cx="60"
            cy="34"
            rx="13"
            ry="26"
            fill={`url(#${gid})`}
            opacity={0.7}
            style={{ transformOrigin: "60px 60px", mixBlendMode: dark ? "screen" : "multiply" }}
            initial={{ rotate: a, scale: 0 }}
            animate={{ rotate: a, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.06, duration: 0.7, ease: EASE }}
          />
        );
      })}
      <circle cx="60" cy="60" r="7" fill={`url(#${gid}-r)`} />
      <motion.path
        d="M46 60 L53 60 L57 51 L61 68 L64 60 L74 60"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.95}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
      />
    </>
  );
}

function BeaconCross({ gid, accent }: { gid: string; accent: string }) {
  return (
    <>
      <rect x="46" y="24" width="28" height="72" rx="14" fill={`url(#${gid})`} />
      <rect x="24" y="46" width="72" height="28" rx="14" fill={`url(#${gid}-r)`} opacity={0.85} />
      <motion.circle
        cx="60"
        cy="60"
        r="46"
        fill="none"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="150 140"
        initial={{ pathLength: 0, rotate: -90 }}
        animate={{ pathLength: 1, rotate: 270 }}
        transition={{
          pathLength: { delay: 0.3, duration: 1, ease: EASE },
          rotate: { duration: 26, repeat: Infinity, ease: "linear" },
        }}
        style={{ transformOrigin: "60px 60px" }}
        opacity={0.6}
      />
      <circle cx="60" cy="60" r="6" fill="#fff" opacity={0.9} />
    </>
  );
}

function SmileCrest({ gid, accent }: { gid: string; accent: string }) {
  return (
    <>
      <path
        d="M60 16 C88 16 100 30 100 54 C100 84 84 104 60 104 C36 104 20 84 20 54 C20 30 32 16 60 16 Z"
        fill={`url(#${gid})`}
        opacity={0.24}
      />
      <motion.path
        d="M36 52 C42 74 78 74 84 52"
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="11"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
      />
      <motion.circle
        cx="60"
        cy="36"
        r="7"
        fill={accent}
        initial={{ scale: 0, y: -8 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 320, damping: 14 }}
      />
    </>
  );
}

function SilkFlower({ gid, seed, accent, dark }: { gid: string; seed: number; accent: string; dark: boolean }) {
  const petals = 5 + (seed % 2); // 5..6
  return (
    <>
      {Array.from({ length: petals }, (_, i) => {
        const a = (i / petals) * 360 + 12;
        return (
          <motion.path
            key={i}
            d="M60 60 C46 46 46 26 60 16 C74 26 74 46 60 60 Z"
            fill={`url(#${gid})`}
            opacity={0.55}
            style={{ transformOrigin: "60px 60px", mixBlendMode: dark ? "screen" : "multiply" }}
            initial={{ rotate: a - 60, scale: 0.4, opacity: 0 }}
            animate={{ rotate: a, scale: 1, opacity: 0.55 }}
            transition={{ delay: 0.15 + i * 0.09, duration: 0.9, ease: EASE }}
          />
        );
      })}
      <circle cx="60" cy="60" r="4.5" fill={accent} />
      <motion.circle
        cx="60"
        cy="60"
        r="24"
        fill="none"
        stroke={accent}
        strokeWidth="0.8"
        opacity={0.5}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.9, duration: 0.7, ease: EASE }}
        style={{ transformOrigin: "60px 60px" }}
      />
    </>
  );
}

function Molecule({ gid, accent }: { gid: string; accent: string }) {
  const pts: [number, number][] = [
    [60, 22],
    [93, 41],
    [93, 79],
    [60, 98],
    [27, 79],
    [27, 41],
  ];
  return (
    <>
      <motion.polygon
        points={pts.map((p) => p.join(",")).join(" ")}
        fill={`url(#${gid})`}
        opacity={0.16}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{ transformOrigin: "60px 60px" }}
      />
      <motion.polygon
        points={pts.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="3"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.2, duration: 1, ease: EASE }}
      />
      {[0, 2, 4].map((i) => (
        <line key={i} x1={pts[i][0]} y1={pts[i][1]} x2="60" y2="60" stroke={accent} strokeWidth="1.6" opacity={0.5} />
      ))}
      {pts.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={i % 2 === 0 ? 6 : 4}
          fill={i % 2 === 0 ? `url(#${gid}-r)` : accent}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 + i * 0.07, type: "spring", stiffness: 300, damping: 16 }}
        />
      ))}
      <circle cx="60" cy="60" r="7" fill={`url(#${gid})`} />
    </>
  );
}

function SignalGrid({ gid, accent }: { gid: string; accent: string }) {
  const nodes: [number, number][] = [
    [36, 36],
    [84, 36],
    [36, 84],
    [84, 84],
    [60, 60],
  ];
  const links: [number, number][] = [
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
    [0, 1],
    [2, 3],
  ];
  return (
    <>
      {links.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          stroke={`url(#${gid})`}
          strokeWidth="2.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: EASE }}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <motion.rect
          key={i}
          x={x - (i === 4 ? 11 : 8)}
          y={y - (i === 4 ? 11 : 8)}
          width={i === 4 ? 22 : 16}
          height={i === 4 ? 22 : 16}
          rx={i === 4 ? 8 : 6}
          fill={i === 4 ? `url(#${gid})` : "none"}
          stroke={i === 4 ? "none" : accent}
          strokeWidth="2.4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 + i * 0.08, type: "spring", stiffness: 300, damping: 15 }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
      ))}
      <motion.circle
        cx="60"
        cy="60"
        r="4"
        fill="#fff"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
    </>
  );
}
