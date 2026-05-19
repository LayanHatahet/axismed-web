"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Globe2, Users, BookOpen, Zap } from "lucide-react";

/* ──────────────────────────────────────────────────────────
   DATA
────────────────────────────────────────────────────────── */

interface Hub {
  id: string; city: string; country: string;
  lat: number; lng: number;
  type: "hq" | "education" | "event" | "partner";
  desc: string; specialty: string;
}

const NODES: Hub[] = [
  { id: "dubai",     city: "Dubai",      country: "UAE",            lat: 25.2,  lng: 55.3,   type: "hq",        desc: "AxisMed Global Headquarters & Primary Education Hub", specialty: "All Specialties"     },
  { id: "riyadh",   city: "Riyadh",     country: "Saudi Arabia",   lat: 24.7,  lng: 46.7,   type: "education", desc: "Advanced Surgical Training Partnership",              specialty: "Surgical Education"  },
  { id: "cairo",    city: "Cairo",      country: "Egypt",          lat: 30.0,  lng: 31.2,   type: "event",     desc: "Annual Middle East Medical Summit",                   specialty: "Medical Education"   },
  { id: "amman",    city: "Amman",      country: "Jordan",         lat: 31.9,  lng: 35.9,   type: "education", desc: "Levant Surgical Education Center",                    specialty: "Surgical Training"   },
  { id: "istanbul", city: "Istanbul",   country: "Turkey",         lat: 41.0,  lng: 28.9,   type: "event",     desc: "Eurasian Healthcare Conference",                      specialty: "Advanced Surgery"    },
  { id: "london",   city: "London",     country: "United Kingdom", lat: 51.5,  lng: -0.1,   type: "partner",   desc: "Royal College of Surgeons Partnership",               specialty: "Surgical Excellence" },
  { id: "paris",    city: "Paris",      country: "France",         lat: 48.9,  lng: 2.4,    type: "education", desc: "European Medical Education Alliance",                 specialty: "CMF Surgery"         },
  { id: "berlin",   city: "Berlin",     country: "Germany",        lat: 52.5,  lng: 13.4,   type: "partner",   desc: "European Surgical Technology Alliance",               specialty: "Digital Surgery"     },
  { id: "newyork",  city: "New York",   country: "USA",            lat: 40.7,  lng: -74.0,  type: "partner",   desc: "Global Healthcare Innovation Hub",                    specialty: "Digital Medicine"    },
  { id: "toronto",  city: "Toronto",    country: "Canada",         lat: 43.7,  lng: -79.4,  type: "education", desc: "North American Clinical Training Center",             specialty: "Endoscopic Surgery"  },
  { id: "mumbai",   city: "Mumbai",     country: "India",          lat: 19.1,  lng: 72.9,   type: "education", desc: "South Asian Medical Education Network",               specialty: "General Surgery"     },
  { id: "singapore",city: "Singapore",  country: "Singapore",      lat: 1.3,   lng: 103.8,  type: "event",     desc: "Asia-Pacific Surgical Conference",                    specialty: "Robotic Surgery"     },
  { id: "tokyo",    city: "Tokyo",      country: "Japan",          lat: 35.7,  lng: 139.7,  type: "partner",   desc: "Robotic Surgical Technology Partnership",             specialty: "Robotic Surgery"     },
  { id: "nairobi",  city: "Nairobi",    country: "Kenya",          lat: -1.3,  lng: 36.8,   type: "event",     desc: "African Healthcare Innovation Forum",                 specialty: "Global Health"       },
  { id: "sydney",   city: "Sydney",     country: "Australia",      lat: -33.9, lng: 151.2,  type: "partner",   desc: "Oceanic Surgical Education Partnership",              specialty: "Minimally Invasive"  },
];

const EDGES: [string, string][] = [
  ["dubai", "riyadh"], ["dubai", "cairo"],   ["dubai", "amman"],
  ["dubai", "istanbul"],["dubai", "london"],  ["dubai", "mumbai"],
  ["dubai", "singapore"],["dubai","nairobi"],
  ["istanbul","london"], ["london","paris"],  ["london","berlin"],
  ["london","newyork"],  ["newyork","toronto"],
  ["singapore","tokyo"], ["singapore","sydney"],["mumbai","singapore"],
  ["cairo","nairobi"],   ["paris","berlin"],
];

const TYPE_COLOR: Record<string, string> = {
  hq: "#C4B5FD", education: "#93C5FD", event: "#86EFAC", partner: "#FCA5A5",
};
const TYPE_LABEL: Record<string, string> = {
  hq: "Headquarters", education: "Education Hub", event: "Event Host", partner: "Partner",
};

/* ──────────────────────────────────────────────────────────
   PROJECTION + BEZIER
────────────────────────────────────────────────────────── */

const CENTER_LNG = 22;

function project(lat: number, lng: number, W: number, H: number) {
  let adj = lng - CENTER_LNG;
  if (adj >  180) adj -= 360;
  if (adj < -180) adj += 360;
  const x    = ((adj + 180) / 360) * W;
  const rLat = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + rLat / 2));
  const y    = H * 0.5 - (Math.max(-2.8, Math.min(2.8, mercN)) * H) / (Math.PI * 1.9);
  return { x, y };
}

function bezierPt(t: number, x0: number, y0: number, cx: number, cy: number, x1: number, y1: number) {
  const mt = 1 - t;
  return { x: mt*mt*x0 + 2*mt*t*cx + t*t*x1, y: mt*mt*y0 + 2*mt*t*cy + t*t*y1 };
}

/* ──────────────────────────────────────────────────────────
   TOOLTIP
────────────────────────────────────────────────────────── */

function Tooltip({ node, pos }: { node: Hub; pos: { x: number; y: number } }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.97 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed pointer-events-none z-[200]"
      style={{ left: pos.x + 18, top: pos.y - 100 }}
    >
      <div
        className="px-4 py-3.5 rounded-2xl"
        style={{
          maxWidth: 230,
          background: "rgba(6,4,16,0.97)",
          border: "1px solid rgba(139,92,246,0.24)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          boxShadow: "0 12px 48px rgba(0,0,0,0.65), 0 0 30px rgba(75,29,255,0.1)",
        }}
      >
        <span
          className="inline-block text-[0.58rem] font-semibold tracking-[0.2em] uppercase px-2 py-0.5 rounded-full mb-2"
          style={{ background: "rgba(75,29,255,0.15)", color: TYPE_COLOR[node.type] }}
        >
          {TYPE_LABEL[node.type]}
        </span>
        <div className="text-[0.82rem] font-semibold leading-tight mb-0.5" style={{ color: "rgba(220,210,255,0.97)" }}>
          {node.city}
          <span className="font-normal text-[0.72rem] ml-2" style={{ color: "rgba(139,92,246,0.6)" }}>
            {node.country}
          </span>
        </div>
        <p className="text-[0.70rem] leading-snug mb-1.5" style={{ color: "rgba(196,181,253,0.6)" }}>
          {node.desc}
        </p>
        <div className="text-[0.62rem] tracking-wide font-medium" style={{ color: "rgba(139,92,246,0.5)" }}>
          {node.specialty}
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────────────────────── */

export function GlobalMap() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const reduced     = useReducedMotion();
  const hoveredRef  = useRef<string | null>(null);
  const nodePosRef  = useRef(new Map<string, { x: number; y: number }>());
  const [hovered,   setHovered]   = useState<Hub | null>(null);
  const [tipPos,    setTipPos]    = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let clock = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas) return;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function frame() {
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      clock += 0.0035;

      ctx.clearRect(0, 0, W, H);

      // Background
      const bg = ctx.createRadialGradient(W/2, H*0.42, 0, W/2, H*0.42, W*0.65);
      bg.addColorStop(0, "rgba(22,10,52,1)");
      bg.addColorStop(0.6, "rgba(8,4,20,1)");
      bg.addColorStop(1, "rgba(3,2,8,1)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.lineWidth = 0.5;
      for (let lng = -180; lng <= 180; lng += 30) {
        const { x } = project(0, lng + CENTER_LNG, W, H);
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H);
        ctx.strokeStyle = "rgba(75,29,255,0.055)"; ctx.stroke();
      }
      for (let lat = -60; lat <= 75; lat += 30) {
        const { y } = project(lat, CENTER_LNG, W, H);
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y);
        ctx.strokeStyle = "rgba(75,29,255,0.055)"; ctx.stroke();
      }

      // Compute node positions
      const pos = new Map<string, { x: number; y: number }>();
      for (const n of NODES) pos.set(n.id, project(n.lat, n.lng, W, H));
      nodePosRef.current = pos;

      // Edges
      EDGES.forEach(([a, b], ei) => {
        const p1 = pos.get(a);
        const p2 = pos.get(b);
        if (!p1 || !p2) return;
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;
        const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        const cx = mx;
        const cy = my - dist * 0.24;

        // Static arc
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(cx, cy, p2.x, p2.y);
        ctx.strokeStyle = "rgba(75,29,255,0.10)";
        ctx.lineWidth = 0.7 * dpr;
        ctx.stroke();

        // Two particles per edge at offset phases
        [0, 0.5].forEach((offset) => {
          const t = (clock * 0.32 + ei * 0.41 + offset) % 1;
          for (let tr = 0; tr < 9; tr++) {
            const tp = Math.max(0, t - tr * 0.012);
            const pt = bezierPt(tp, p1.x, p1.y, cx, cy, p2.x, p2.y);
            const a  = (1 - tr / 9) * 0.55;
            const r  = (1.8 - tr * 0.14) * dpr;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(196,181,253,${a})`;
            ctx.fill();
          }
        });
      });

      // Nodes
      for (const n of NODES) {
        const p  = pos.get(n.id)!;
        const isHQ  = n.type === "hq";
        const isHov = hoveredRef.current === n.id;
        const pulse = Math.sin(clock * 2.1 + NODES.indexOf(n) * 0.9) * 0.5 + 0.5;
        const base  = (isHQ ? 5.5 : 3.8) * dpr;
        const hov1  = (isHQ ? 16 : 12) * dpr + pulse * 5 * dpr + (isHov ? 4 * dpr : 0);
        const hov2  = (isHQ ? 26 : 18) * dpr + pulse * 8 * dpr;

        // Glow 2
        const g2 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, hov2);
        g2.addColorStop(0, `rgba(75,29,255,${isHQ ? 0.055 : 0.035})`);
        g2.addColorStop(1, "rgba(75,29,255,0)");
        ctx.fillStyle = g2;
        ctx.beginPath(); ctx.arc(p.x, p.y, hov2, 0, Math.PI*2); ctx.fill();

        // Glow 1
        const g1 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, hov1);
        g1.addColorStop(0, `rgba(139,92,246,${(isHQ ? 0.22 : 0.14) + pulse * 0.06 + (isHov ? 0.1 : 0)})`);
        g1.addColorStop(1, "rgba(139,92,246,0)");
        ctx.fillStyle = g1;
        ctx.beginPath(); ctx.arc(p.x, p.y, hov1, 0, Math.PI*2); ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, base, 0, Math.PI*2);
        ctx.fillStyle = isHQ
          ? `rgba(210,192,255,${0.88 + pulse * 0.12})`
          : `rgba(139,92,246,${0.72 + pulse * 0.22})`;
        ctx.fill();

        // HQ ring
        if (isHQ) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, base + (3.5 + pulse * 2) * dpr, 0, Math.PI*2);
          ctx.strokeStyle = `rgba(196,181,253,${0.22 + pulse * 0.1})`;
          ctx.lineWidth = 1 * dpr;
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [reduced]);

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect   = canvas.getBoundingClientRect();
    const dpr    = Math.min(window.devicePixelRatio || 1, 2);
    const mx     = (e.clientX - rect.left)  * (canvas.width  / rect.width);
    const my     = (e.clientY - rect.top)   * (canvas.height / rect.height);
    let closest: Hub | null = null;
    let minD = 26 * dpr;
    for (const n of NODES) {
      const p = nodePosRef.current.get(n.id);
      if (!p) continue;
      const d = Math.hypot(p.x - mx, p.y - my);
      if (d < minD) { minD = d; closest = n; }
    }
    hoveredRef.current = closest?.id ?? null;
    setHovered(closest);
    setTipPos({ x: e.clientX, y: e.clientY });
  }

  const STATS = [
    { Icon: Globe2,    val: "15+",   label: "Countries"    },
    { Icon: Users,     val: "400+",  label: "Surgeons"     },
    { Icon: BookOpen,  val: "60+",   label: "Programs"     },
    { Icon: Zap,       val: "30+",   label: "Events / Year"},
  ];

  return (
    <section className="relative py-24 overflow-hidden" style={{ backgroundColor: "#EDE8FF" }}>
      <div className="absolute top-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(237,232,255,0.8), transparent)" }} />

      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.25,0.4,0.25,1] }}
          className="text-center mb-12"
        >
          <div className="inline-block text-[0.62rem] font-semibold tracking-[0.28em] uppercase mb-5 px-4 py-1.5 rounded-full"
            style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", color: "#6B3FC0" }}>
            Global Reach
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "#12082C", letterSpacing: "-0.02em" }}>
            The AxisMed Network
          </h2>
          <p className="max-w-lg mx-auto text-[0.88rem] leading-relaxed"
            style={{ color: "#6B58A2" }}>
            A living ecosystem of surgical education, healthcare innovation, and global medical collaboration spanning 15 countries.
          </p>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.0, delay: 0.2 }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            height: "clamp(260px, 42vw, 460px)",
            border: "1px solid rgba(139,92,246,0.11)",
            boxShadow: "0 0 100px rgba(75,29,255,0.07), inset 0 1px 0 rgba(255,255,255,0.02)",
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
            onMouseMove={reduced ? undefined : onMouseMove}
            onMouseLeave={() => { hoveredRef.current = null; setHovered(null); }}
            style={{ cursor: hovered ? "pointer" : "default" }}
          />
          <div className="absolute top-4 left-5 text-[0.56rem] tracking-[0.32em] uppercase select-none"
            style={{ color: "rgba(139,92,246,0.28)" }}>
            Healthcare Intelligence Network
          </div>
          <div className="absolute top-4 right-5 flex items-center gap-1.5">
            <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: "#34d399" }}
              animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
            <span className="text-[0.56rem] tracking-[0.3em] uppercase select-none"
              style={{ color: "rgba(52,211,153,0.45)" }}>Live</span>
          </div>
          {/* Legend */}
          <div className="absolute bottom-4 left-5 flex items-center gap-4">
            {Object.entries(TYPE_LABEL).map(([type, label]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: TYPE_COLOR[type] }} />
                <span className="text-[0.55rem] tracking-wide" style={{ color: "rgba(196,181,253,0.35)" }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          {STATS.map(({ Icon, val, label }) => (
            <div key={label} className="flex flex-col items-center py-5 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(124,58,237,0.12)" }}>
              <Icon size={15} color="rgba(124,58,237,0.6)" className="mb-2" />
              <div className="text-[1.65rem] font-bold tracking-tight" style={{ color: "#12082C" }}>{val}</div>
              <div className="text-[0.63rem] tracking-widest uppercase mt-0.5" style={{ color: "#6B58A2" }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && <Tooltip node={hovered} pos={tipPos} />}
      </AnimatePresence>
    </section>
  );
}
