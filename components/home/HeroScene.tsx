"use client";

import { useRef, useEffect, useMemo, useCallback, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════
   CONFIGURATION
═══════════════════════════════════════════════════════════════ */

const S        = 1.52;
const SEG      = 600;
const RIB_W    = 0.30;
const RIB_T    = 0.052;
const DRAW_SEC = 1.9;   // faster logo draw-in (9.2 → 5.0 → 3.5 → 2.6 → 1.9)
const BRANCH_S = 0.7;   // faster branch draw
const B_SEG    = 90;
const INTRO_SPEED = 4.2; // speeds up the camera / scale / glow choreography to match
// Shift whole scene down so knot doesn't overlap the navbar
const Y_OFFSET = -1.2;

const CAM = [
  { px:  0.6, py:  0.3, pz:  6.0, lx:  0.1, ly:  0.0, t0:  0.0, t1:  3.0 },
  { px:  2.0, py:  0.8, pz:  9.0, lx:  0.3, ly:  0.1, t0:  3.0, t1:  6.0 },
  { px: -1.6, py:  0.5, pz: 10.6, lx: -0.2, ly:  0.0, t0:  6.0, t1:  8.5 },
  { px:  0.0, py:  0.0, pz: 11.5, lx:  0.0, ly:  0.0, t0:  8.5, t1: 11.0 },
] as const;

const MOBILE_CAM = [
  { px:  0.2, py:  0.2, pz:  4.5, lx:  0.0, ly:  0.0, t0:  0.0, t1:  3.0 },
  { px:  0.8, py:  0.4, pz:  7.0, lx:  0.1, ly:  0.0, t0:  3.0, t1:  6.0 },
  { px: -0.6, py:  0.2, pz:  9.0, lx:  0.0, ly:  0.0, t0:  6.0, t1:  8.5 },
  { px:  0.0, py:  0.0, pz: 10.0, lx:  0.0, ly:  0.0, t0:  8.5, t1: 11.0 },
] as const;

const BRANCHES = [
  { color: "#bcb8df", paramT: 0.33, tx: -8.0, ty:  4.5, tz: 0 },
  { color: "#b0accf", paramT: 0.67, tx:  8.0, ty:  4.5, tz: 0 },
  { color: "#cccae3", paramT: 0.00, tx:  0.0, ty: -8.0, tz: 0 },
] as const;

const MOBILE_BRANCHES = [
  { color: "#bcb8df", paramT: 0.33, tx: -3.2, ty:  2.8, tz: 0 },
  { color: "#b0accf", paramT: 0.67, tx:  3.2, ty:  2.8, tz: 0 },
  { color: "#cccae3", paramT: 0.00, tx:  0.0, ty: -3.0, tz: 0 },
] as const;

/* Desktop label positions — FOV=50°, z=11.5: visible ≈ ±9.5 x */
const BRANCH_LABELS = [
  { label: "Courses", href: "/courses", pos: [-6.5,  3.8, 0] as [number,number,number] },
  { label: "Media",   href: "/media",   pos: [ 6.5,  3.8, 0] as [number,number,number] },
  { label: "Events",  href: "/events",  pos: [ 0.0, -4.5, 0] as [number,number,number] },
] as const;

/* Mobile label positions — pulled well inside the narrow portrait viewport */
const MOBILE_BRANCH_LABELS = [
  { label: "Courses", href: "/courses", pos: [-3.2,  2.8, 0] as [number,number,number] },
  { label: "Media",   href: "/media",   pos: [ 3.2,  2.8, 0] as [number,number,number] },
  { label: "Events",  href: "/events",  pos: [ 0.0, -3.0, 0] as [number,number,number] },
] as const;

/* ═══════════════════════════════════════════════════════════════
   TRIQUETRA CURVE
═══════════════════════════════════════════════════════════════ */

function makeTrefoilCurve(scale: number): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  const N = SEG + 1;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2;
    pts.push(new THREE.Vector3(
      (Math.sin(t) + 2 * Math.sin(2 * t)) * scale,
      (2 * Math.cos(2 * t) - Math.cos(t)) * scale,
      -Math.sin(3 * t) * scale * 0.50,
    ));
  }
  return new THREE.CatmullRomCurve3(pts, true);
}

/* ═══════════════════════════════════════════════════════════════
   FLAT RIBBON GEOMETRY
═══════════════════════════════════════════════════════════════ */

type Frames = ReturnType<THREE.CatmullRomCurve3["computeFrenetFrames"]>;

function buildFlatRibbon(
  curve: THREE.CatmullRomCurve3,
  frames: Frames,
  segments: number,
  width: number,
  thick: number,
): THREE.BufferGeometry {
  const pos: number[] = [], norm: number[] = [], uv: number[] = [], idx: number[] = [];
  const hw = width / 2, ht = thick / 2;

  for (let i = 0; i <= segments; i++) {
    const t  = i / segments;
    const pt = curve.getPoint(t);
    const N  = frames.normals[i];
    const B  = frames.binormals[i];

    const tl = new THREE.Vector3(pt.x - B.x*hw + N.x*ht, pt.y - B.y*hw + N.y*ht, pt.z - B.z*hw + N.z*ht);
    const tr = new THREE.Vector3(pt.x + B.x*hw + N.x*ht, pt.y + B.y*hw + N.y*ht, pt.z + B.z*hw + N.z*ht);
    const br = new THREE.Vector3(pt.x + B.x*hw - N.x*ht, pt.y + B.y*hw - N.y*ht, pt.z + B.z*hw - N.z*ht);
    const bl = new THREE.Vector3(pt.x - B.x*hw - N.x*ht, pt.y - B.y*hw - N.y*ht, pt.z - B.z*hw - N.z*ht);

    pos.push(tl.x,tl.y,tl.z, tr.x,tr.y,tr.z, br.x,br.y,br.z, bl.x,bl.y,bl.z);
    norm.push( N.x, N.y, N.z,  N.x, N.y, N.z, -N.x,-N.y,-N.z, -N.x,-N.y,-N.z);
    uv.push(0,t*6, 1,t*6, 1,t*6, 0,t*6);
  }

  for (let i = 0; i < segments; i++) {
    const a = i * 4, b = a + 4;
    idx.push(a,a+1,b, a+1,b+1,b);
    idx.push(a+3,a+2,b+3, a+2,b+2,b+3);
    idx.push(a,b,a+3, b,b+3,a+3);
    idx.push(a+1,a+2,b+1, a+2,b+2,b+1);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos,  3));
  geo.setAttribute("normal",   new THREE.Float32BufferAttribute(norm, 3));
  geo.setAttribute("uv",       new THREE.Float32BufferAttribute(uv,   2));
  geo.setIndex(idx);
  geo.setDrawRange(0, 0);
  return geo;
}

/* ═══════════════════════════════════════════════════════════════
   RIBBON KNOT
═══════════════════════════════════════════════════════════════ */

function RibbonKnot({
  mouse, onComplete, active, drawElapsed, isMobile,
}: {
  mouse:       React.MutableRefObject<{ x: number; y: number }>;
  onComplete:  () => void;
  active:      boolean;
  drawElapsed: React.MutableRefObject<number>;
  isMobile:    boolean;
}) {
  const groupRef    = useRef<THREE.Group>(null);
  const drawRef     = useRef(0);
  const doneRef     = useRef(false);
  const doneScaleT  = useRef(0); // 0→1 lerp when drawing finishes
  const autoRotY    = useRef(0);
  const tiltX       = useRef(0);
  const tiltY       = useRef(0);
  const floatT      = useRef(0);

  const curve    = useMemo(() => makeTrefoilCurve(S), []);
  const frames   = useMemo(() => curve.computeFrenetFrames(SEG, true), [curve]);
  const geo      = useMemo(() => buildFlatRibbon(curve, frames, SEG, RIB_W, RIB_T), [curve, frames]);
  const totalIdx = useMemo(() => geo.index?.count ?? SEG * 24, [geo]);

  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color:              new THREE.Color("#8880b8"),
    metalness:          0.04,
    roughness:          0.13,
    clearcoat:          0.90,
    clearcoatRoughness: 0.05,
    sheen:              0.55,
    sheenRoughness:     0.28,
    sheenColor:         new THREE.Color("#dddaee"),
    iridescence:        0.48,
    iridescenceIOR:     1.58,
    side:               THREE.DoubleSide,
    envMapIntensity:    2.8,
  }), []);

  const makeGlowMat = (c: string) => new THREE.MeshBasicMaterial({
    color: new THREE.Color(c), transparent: true, opacity: 0,
    side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const g1 = useMemo(() => makeGlowMat("#a49ecf"), []);
  const g2 = useMemo(() => makeGlowMat("#8880b8"), []);
  const g3 = useMemo(() => makeGlowMat("#5e5a88"), []);

  const onDone = useCallback(() => { doneRef.current = true; onComplete(); }, [onComplete]);

  useFrame((_, dt) => {
    if (!active) return;
    floatT.current += dt;
    const de = drawElapsed.current;

    if (!doneRef.current) {
      drawRef.current += (totalIdx / DRAW_SEC) * dt;
      const c = Math.min(Math.floor(drawRef.current), totalIdx);
      geo.setDrawRange(0, c);
      if (drawRef.current >= totalIdx) onDone();
    }

    const glowP = Math.min(de / 3.0, 1.0);
    const boost = doneRef.current ? 1.1 : 1.0;
    g1.opacity += (glowP * 0.07 * boost - g1.opacity) * 0.045;
    g2.opacity += (glowP * 0.035 * boost - g2.opacity) * 0.035;
    g3.opacity += (glowP * 0.016 * boost - g3.opacity) * 0.025;

    if (groupRef.current) {
      const sp  = Math.min(de / 7.0, 1.0);
      const ep  = sp < 0.5 ? 2*sp*sp : 1 - Math.pow(-2*sp+2, 2)/2;
      const maxScl = isMobile ? 2.8 : 4.0;
      const mobileMultiplier = isMobile ? 0.72 : 1.0;
      const scl = (doneRef.current ? 1.0 : maxScl - (maxScl - 1.0) * ep) * mobileMultiplier;
      groupRef.current.scale.setScalar(scl);
    }

    autoRotY.current += dt * (doneRef.current ? 0.09 : 0.038);
    tiltX.current += (mouse.current.y * 0.28 - tiltX.current) * 0.042;
    tiltY.current += (mouse.current.x * 0.40 - tiltY.current) * 0.042;

    if (groupRef.current) {
      groupRef.current.rotation.y = autoRotY.current + tiltY.current;
      groupRef.current.rotation.x = Math.sin(floatT.current * 0.052) * 0.026 + tiltX.current;
      groupRef.current.rotation.z = Math.cos(floatT.current * 0.040) * 0.013;
    }
  });

  return (
    <group ref={groupRef}>
      <group scale={6.5}><mesh geometry={geo} material={g3} /></group>
      <group scale={3.5}><mesh geometry={geo} material={g2} /></group>
      <group scale={1.9}><mesh geometry={geo} material={g1} /></group>
      <mesh geometry={geo} material={mat} />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BRANCH PATHS + LABELS AT ENDPOINTS
═══════════════════════════════════════════════════════════════ */

function BranchPath({ branchCurve, color, active }: {
  branchCurve: THREE.CatmullRomCurve3;
  color: string;
  active: boolean;
}) {
  const drawRef  = useRef(0);
  const totalRef = useRef(0);

  const geo = useMemo(() => {
    const g = new THREE.TubeGeometry(branchCurve, B_SEG, 0.014, 6, false);
    totalRef.current = g.index?.count ?? B_SEG * 6 * 6;
    g.setDrawRange(0, 0);
    return g;
  }, [branchCurve]);

  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(color), transparent: true, opacity: 0.6,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), [color]);

  useFrame((_, dt) => {
    if (!active) return;
    drawRef.current += (totalRef.current / BRANCH_S) * dt;
    geo.setDrawRange(0, Math.min(Math.floor(drawRef.current), totalRef.current));
  });

  return <mesh geometry={geo} material={mat} />;
}

function BranchPaths({
  knotCurve, active, showLabels, isMobile,
}: {
  knotCurve:  THREE.CatmullRomCurve3;
  active:     boolean;
  showLabels: boolean;
  isMobile:   boolean;
}) {
  const activeBranches = isMobile ? MOBILE_BRANCHES : BRANCHES;
  const activeLabels   = isMobile ? MOBILE_BRANCH_LABELS : BRANCH_LABELS;

  const curves = useMemo(() =>
    activeBranches.map(({ paramT, tx, ty, tz }) => {
      const start = knotCurve.getPoint(paramT);
      const tang  = knotCurve.getTangent(paramT);
      const ctrl  = new THREE.Vector3(
        start.x + (tx - start.x) * 0.38 + tang.x * 1.6,
        start.y + (ty - start.y) * 0.38 + tang.y * 1.6,
        start.z * 0.2,
      );
      return new THREE.CatmullRomCurve3([start.clone(), ctrl, new THREE.Vector3(tx, ty, tz)], false);
    }),
  [knotCurve, activeBranches]);

  // Inject keyframes into the document once
  useEffect(() => {
    const id = "axismed-branch-keyframes";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes orbPulse {
        0%,100% { transform: scale(1);   opacity: 0.9; box-shadow: 0 0 0 0 rgba(164,158,207,0.55); }
        50%      { transform: scale(1.3); opacity: 0.6; box-shadow: 0 0 0 7px rgba(164,158,207,0); }
      }
      @keyframes ringBurst {
        0%   { transform: scale(0.8); opacity: 0.8; }
        100% { transform: scale(2.8); opacity: 0; }
      }
      @keyframes labelBloom {
        0%   { opacity: 0; transform: scale(0.5)  translateY(6px);  filter: blur(6px); }
        55%  { opacity: 1;                                            filter: blur(0);   }
        75%  { transform: scale(1.07) translateY(-2px); }
        100% { opacity: 1; transform: scale(1)    translateY(0);    filter: blur(0);   }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <>
      {curves.map((c, i) => (
        <BranchPath key={i} branchCurve={c} color={activeBranches[i].color} active={active} />
      ))}

      {activeLabels.map(({ label, href, pos }, i) => {
        const delay = `${i * 0.14}s`;
        return (
          <Html key={label} position={pos} center zIndexRange={[100, 0]}>
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>

              {/* Pulsing orb — visible while branches are drawing, before label reveals */}
              <div style={{
                position:    "absolute",
                width:       "12px",
                height:      "12px",
                borderRadius: "50%",
                background:  "radial-gradient(circle at 35% 35%, #dddaee, #a49ecf)",
                boxShadow:   "0 0 14px rgba(164,158,207,0.7)",
                opacity:      active && !showLabels ? 1 : 0,
                animation:    active && !showLabels ? `orbPulse 1.7s ease-in-out ${delay} infinite` : "none",
                transition:  "opacity 0.4s ease",
                pointerEvents: "none",
              }} />

              {/* Burst ring — fires once as label blooms in */}
              <div style={{
                position:      "absolute",
                width:         "12px",
                height:        "12px",
                borderRadius:  "50%",
                border:        "2px solid rgba(164,158,207,0.7)",
                opacity:        showLabels ? 0 : 0,
                animation:      showLabels ? `ringBurst 0.7s cubic-bezier(0.22,1,0.36,1) ${delay} both` : "none",
                pointerEvents: "none",
              }} />

              {/* Label pill — blooms in after branches complete */}
              <a
                href={href}
                className="flex"
                style={{
                  alignItems:      "center",
                  gap:             isMobile ? "6px" : "9px",
                  padding:         isMobile ? "7px 14px" : "11px 22px",
                  background:      "rgba(255,255,255,0.86)",
                  border:          "1px solid rgba(164,158,207,0.22)",
                  borderRadius:    isMobile ? "8px" : "11px",
                  backdropFilter:  "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  color:           "#8880b8",
                  fontSize:        isMobile ? "11px" : "15px",
                  fontWeight:      700,
                  letterSpacing:   "0.09em",
                  textTransform:   "uppercase",
                  textDecoration:  "none",
                  whiteSpace:      "nowrap",
                  boxShadow:       "0 3px 22px rgba(136,128,184,0.14), inset 0 1px 0 rgba(255,255,255,0.9)",
                  animation:       showLabels ? `labelBloom 0.75s cubic-bezier(0.22,1,0.36,1) ${delay} both` : "none",
                  opacity:          showLabels ? undefined : 0,
                  pointerEvents:   showLabels ? "auto" : "none",
                  cursor:          "pointer",
                }}
              >
                <span style={{
                  width:      isMobile ? "6px" : "9px",
                  height:     isMobile ? "6px" : "9px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #cac6e6, #8880b8)",
                  flexShrink: 0,
                  boxShadow:  "0 0 6px rgba(164,158,207,0.5)",
                }} />
                {label}
              </a>
            </div>
          </Html>
        );
      })}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PARTICLES
═══════════════════════════════════════════════════════════════ */

function Particles() {
  const COUNT = 100;
  const { geo, vel } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const v   = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 30;
      pos[i*3+1] = (Math.random() - 0.5) * 22;
      pos[i*3+2] = (Math.random() - 0.5) * 16 - 4;
      v[i*3]     = (Math.random() - 0.5) * 0.0012;
      v[i*3+1]   = 0.0004 + Math.random() * 0.0009;
      v[i*3+2]   = (Math.random() - 0.5) * 0.0006;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos.slice(), 3));
    return { geo: g, vel: v };
  }, []);

  const mat = useMemo(() => new THREE.PointsMaterial({
    color: new THREE.Color("#bcb8df"), size: 0.018,
    transparent: true, opacity: 0.22, sizeAttenuation: true, depthWrite: false,
  }), []);

  useFrame(() => {
    const pos = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      pos[i*3]   += vel[i*3];
      pos[i*3+1] += vel[i*3+1];
      pos[i*3+2] += vel[i*3+2];
      if (pos[i*3+1] > 11) pos[i*3+1] = -11;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return <points geometry={geo} material={mat} />;
}

/* ═══════════════════════════════════════════════════════════════
   CINEMATIC CAMERA
═══════════════════════════════════════════════════════════════ */

function CinematicCamera({
  mouse, drawElapsed, active, isMobile,
}: {
  mouse:       React.MutableRefObject<{ x: number; y: number }>;
  drawElapsed: React.MutableRefObject<number>;
  active:      boolean;
  isMobile:    boolean;
}) {
  const { camera } = useThree();
  const camPos  = useRef(new THREE.Vector3(0, 0, 14));
  const curLook = useRef(new THREE.Vector3(0, 0, 0));
  const tLook   = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const activeCam = isMobile ? MOBILE_CAM : CAM;
    const de   = drawElapsed.current;
    const last = activeCam[activeCam.length - 1];
    let tx: number = last.px, ty: number = last.py, tz: number = last.pz;
    let lx: number = last.lx, ly: number = last.ly;

    if (!active) {
      tx = 0; ty = 0; tz = isMobile ? 13 : 14; lx = 0; ly = 0;
    } else {
      for (let i = 0; i < activeCam.length - 1; i++) {
        const a = activeCam[i], b = activeCam[i + 1];
        if (de >= a.t0 && de < a.t1) {
          const raw = (de - a.t0) / (a.t1 - a.t0);
          const p   = raw < 0.5 ? 4*raw*raw*raw : 1 - Math.pow(-2*raw+2, 3)/2;
          tx = a.px + (b.px - a.px) * p;
          ty = a.py + (b.py - a.py) * p;
          tz = a.pz + (b.pz - a.pz) * p;
          lx = a.lx + (b.lx - a.lx) * p;
          ly = a.ly + (b.ly - a.ly) * p;
          break;
        }
      }
      if (de >= last.t1) {
        tx += mouse.current.x * 1.4;
        ty += mouse.current.y * 0.9;
      }
    }

    camPos.current.set(tx, ty, tz);
    tLook.current.set(lx, ly + Y_OFFSET, 0);
    camera.position.lerp(camPos.current, 0.038);
    curLook.current.lerp(tLook.current, 0.046);
    camera.lookAt(curLook.current);
  });

  return null;
}

/* ═══════════════════════════════════════════════════════════════
   SCENE ROOT
═══════════════════════════════════════════════════════════════ */

function Scene({
  mouse, onKnotComplete, active, isMobile,
}: {
  mouse:          React.MutableRefObject<{ x: number; y: number }>;
  onKnotComplete: () => void;
  active:         boolean;
  isMobile:       boolean;
}) {
  const drawElapsed = useRef(0);
  const [branches,   setBranches]   = useState(false);
  const [showLabels, setShowLabels] = useState(false);

  useFrame((_, dt) => { if (active) drawElapsed.current += dt * INTRO_SPEED; });

  const handleKnotDone = useCallback(() => {
    onKnotComplete();
    setTimeout(() => {
      setBranches(true);
      // Labels appear after branches finish drawing
      setTimeout(() => setShowLabels(true), BRANCH_S * 1000 + 400);
    }, 700);
  }, [onKnotComplete]);

  const knotCurve = useMemo(() => makeTrefoilCurve(S), []);

  return (
    <>
      <CinematicCamera mouse={mouse} drawElapsed={drawElapsed} active={active} isMobile={isMobile} />

      <ambientLight intensity={1.6} color="#F0EAFF" />
      <directionalLight position={[0, 10, 8]}   intensity={10} color="#EDE8FF" />
      <directionalLight position={[-8, 2, -3]}  intensity={4}  color="#a49ecf" />
      <directionalLight position={[ 8, -1, -3]} intensity={2.5} color="#8880b8" />
      <pointLight position={[0,  8, 4]}  intensity={18} color="#bcb8df" distance={26} />
      <pointLight position={[0, -7, 3]}  intensity={8}  color="#9a95c4" distance={20} />
      <pointLight position={[-6, 1, 5]}  intensity={10} color="#b0accf" distance={18} />
      <pointLight position={[ 6, 1, 5]}  intensity={10} color="#a49ecf" distance={18} />
      <pointLight position={[0, 0, 7]}   intensity={6}  color="#F4EEFF" distance={14} />

      <group position={[0, Y_OFFSET, 0]}>
        <RibbonKnot
          mouse={mouse}
          onComplete={handleKnotDone}
          active={active}
          drawElapsed={drawElapsed}
          isMobile={isMobile}
        />
        <BranchPaths knotCurve={knotCurve} active={branches} showLabels={showLabels} isMobile={isMobile} />
      </group>
      <Particles />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CANVAS EXPORT
═══════════════════════════════════════════════════════════════ */

export function HeroScene({
  onKnotComplete,
  active,
  isMobile,
}: {
  onKnotComplete: () => void;
  active:         boolean;
  isMobile:       boolean;
}) {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = {
        x:  (e.clientX / window.innerWidth  - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: 50 }}
      gl={{
        antialias:       true,
        alpha:           true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.toneMapping        = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.35;
      }}
      style={{ width: "100%", height: "100%" }}
      dpr={[1, 2]}
    >
      <Scene mouse={mouse} onKnotComplete={onKnotComplete} active={active} isMobile={isMobile} />
    </Canvas>
  );
}
