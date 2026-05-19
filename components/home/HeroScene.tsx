"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Float } from "@react-three/drei";
import * as THREE from "three";
import {
  GraduationCap, Globe, Zap, Activity,
  Users, Scissors, Cpu, Brain, Video,
} from "lucide-react";

type Mouse = { x: number; y: number };

/* ─────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────── */

const ORBIT_DEFS = [
  { radius: 2.8, tubeR: 0.007, rotX: 0.28, rotZ: 0.00, speed:  0.28, color: "#3B0F8C", opacity: 0.55 },
  { radius: 3.9, tubeR: 0.006, rotX: 0.65, rotZ: 0.52, speed: -0.18, color: "#2D0A70", opacity: 0.42 },
  { radius: 5.0, tubeR: 0.005, rotX: 1.12, rotZ: 0.95, speed:  0.12, color: "#1E0850", opacity: 0.30 },
] as const;

const TWO_THIRDS_PI = (Math.PI * 2) / 3;

const NODE_DEFS = [
  { Icon: GraduationCap, label: "Surgical Education",    orbit: 0, angle: 0,                 color: "#4C1D95", href: "/courses"  },
  { Icon: Activity,      label: "ECG / Pulse",            orbit: 0, angle: TWO_THIRDS_PI,     color: "#3B0F8C", href: "/courses"  },
  { Icon: Users,         label: "Surgeon Community",      orbit: 0, angle: TWO_THIRDS_PI * 2, color: "#42148C", href: "/about"    },
  { Icon: Globe,         label: "Global Connection",      orbit: 1, angle: Math.PI * 0.5,     color: "#2D0A6E", href: "/partners" },
  { Icon: Cpu,           label: "Robotic Surgery",        orbit: 1, angle: Math.PI * 1.16,    color: "#3A1080", href: "/courses"  },
  { Icon: Brain,         label: "AI Healthcare",          orbit: 1, angle: Math.PI * 1.83,    color: "#331070", href: "/courses"  },
  { Icon: Zap,           label: "Healthcare Innovation",  orbit: 2, angle: Math.PI * 0.3,     color: "#4A1890", href: "/about"    },
  { Icon: Scissors,      label: "Cadaveric Training",     orbit: 2, angle: Math.PI * 1.0,     color: "#3D0E80", href: "/courses"  },
  { Icon: Video,         label: "Media & Communication",  orbit: 2, angle: Math.PI * 1.7,     color: "#3F1285", href: "/media"    },
] as const;

/* ─────────────────────────────────────────────────────────
   CAMERA
───────────────────────────────────────────────────────── */

function CameraRig({ mouse }: { mouse: React.MutableRefObject<Mouse> }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.current.x * 2.2 - camera.position.x) * 0.034;
    camera.position.y += (mouse.current.y * 1.6 - camera.position.y) * 0.034;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ─────────────────────────────────────────────────────────
   CENTRAL MONUMENT
───────────────────────────────────────────────────────── */

function MonumentLogo({ phase, mouse }: { phase: number; mouse: React.MutableRefObject<Mouse> }) {
  const groupRef = useRef<THREE.Group>(null);
  const autoRotY = useRef(0);
  const tiltX    = useRef(0);
  const tiltY    = useRef(0);
  const t        = useRef(0);

  const coreMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#7C3AED"),
    metalness: 0.88, roughness: 0.06, reflectivity: 1.0,
    envMapIntensity: 3.8,
    emissive: new THREE.Color("#4C2A9A"), emissiveIntensity: 0,
    transparent: true, opacity: 0,
    clearcoat: 0.95, clearcoatRoughness: 0.05,
    iridescence: 0.25, iridescenceIOR: 1.6,
  }), []);

  const glowMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color("#9B5CF6"),
    transparent: true, opacity: 0,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);

  const trailGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const p = 2, q = 3, R = 2.1;
    for (let i = 0; i <= 360; i++) {
      const u = (i / 360) * Math.PI * 2 * p;
      const qu = (q / p) * u;
      pts.push(new THREE.Vector3(
        R * (2 + Math.cos(qu)) * 0.5 * Math.cos(u),
        R * (2 + Math.cos(qu)) * 0.5 * Math.sin(u),
        R * Math.sin(qu) * 0.5,
      ));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 360, 0.0045, 6, true);
  }, []);

  const trailMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color("#E0D8FF"),
    transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);

  const pulse = useRef({ active: false, t: 0, next: 4.5 });

  useFrame((_, delta) => {
    t.current += delta;
    const ps = pulse.current;
    const opT = phase >= 2 ? 1 : 0;
    coreMat.opacity           += (opT               - coreMat.opacity)           * 0.009;
    glowMat.opacity           += (opT * 0.042        - glowMat.opacity)           * 0.009;
    coreMat.emissiveIntensity += (opT * 0.055        - coreMat.emissiveIntensity) * 0.009;
    if (phase >= 2) {
      coreMat.emissiveIntensity = Math.max(0, 0.055 * 0.68 + Math.sin(t.current * 0.36) * 0.028);
    }
    if (phase >= 3 && !ps.active && t.current > ps.next) {
      ps.active = true; ps.t = 0;
      ps.next = t.current + 5.5 + Math.random() * 4.5;
    }
    if (ps.active) {
      ps.t += delta / 3;
      const pr = ps.t;
      trailMat.opacity = pr < 0.14 ? (pr / 0.14) * 0.12 : pr < 0.52 ? 0.12 : 0.12 * (1 - (pr - 0.52) / 0.48);
      if (ps.t >= 1) { ps.active = false; trailMat.opacity = 0; }
    }
    autoRotY.current += delta * 0.085;
    tiltX.current += (mouse.current.y *  0.36 - tiltX.current) * 0.040;
    tiltY.current += (mouse.current.x *  0.48 - tiltY.current) * 0.040;
    if (groupRef.current) {
      groupRef.current.rotation.y = autoRotY.current + tiltY.current;
      groupRef.current.rotation.x = Math.sin(t.current * 0.072) * 0.042 + tiltX.current;
      groupRef.current.rotation.z = Math.cos(t.current * 0.055) * 0.018;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh><torusKnotGeometry args={[2.1, 0.52, 320, 32, 2, 3]} /><primitive object={glowMat} attach="material" /></mesh>
      <mesh><torusKnotGeometry args={[2.1, 0.42, 320, 32, 2, 3]} /><primitive object={coreMat} attach="material" /></mesh>
      <mesh geometry={trailGeo} material={trailMat} />
    </group>
  );
}

/* ─────────────────────────────────────────────────────────
   ORBITAL RING + ENERGY PULSES
───────────────────────────────────────────────────────── */

function OrbitalRing({ def, phase }: { def: typeof ORBIT_DEFS[number]; phase: number }) {
  const groupRef  = useRef<THREE.Group>(null);
  const pulse1Ref = useRef<THREE.Mesh>(null);
  const pulse2Ref = useRef<THREE.Mesh>(null);
  const angleRef  = useRef(0);

  const ringMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(def.color),
    transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), [def.color]);

  const pulseMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color("#D8D0FF"),
    transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = def.rotX;
      groupRef.current.rotation.z = def.rotZ;
    }
  }, [def.rotX, def.rotZ]);

  useFrame((_, delta) => {
    const target = phase >= 2 ? def.opacity : 0;
    ringMat.opacity  += (target       - ringMat.opacity)  * 0.014;
    pulseMat.opacity += (target * 1.4 - pulseMat.opacity) * 0.014;
    if (groupRef.current) groupRef.current.rotation.y += delta * def.speed;
    angleRef.current += delta * Math.abs(def.speed) * 2.2;
    const r = def.radius;
    if (pulse1Ref.current) pulse1Ref.current.position.set(Math.cos(angleRef.current) * r, 0, Math.sin(angleRef.current) * r);
    if (pulse2Ref.current) pulse2Ref.current.position.set(Math.cos(angleRef.current + Math.PI) * r, 0, Math.sin(angleRef.current + Math.PI) * r);
  });

  return (
    <group ref={groupRef}>
      <mesh><torusGeometry args={[def.radius, def.tubeR, 6, 128]} /><primitive object={ringMat} attach="material" /></mesh>
      <mesh ref={pulse1Ref}><sphereGeometry args={[0.045, 8, 8]} /><primitive object={pulseMat} attach="material" /></mesh>
      <mesh ref={pulse2Ref}><sphereGeometry args={[0.038, 8, 8]} /><primitive object={pulseMat} attach="material" /></mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────
   FLOATING GLASS SPHERE NODE
───────────────────────────────────────────────────────── */

function FloatingNode({ nodeDef, orbitDef, phase }: {
  nodeDef:  typeof NODE_DEFS[number];
  orbitDef: typeof ORBIT_DEFS[number];
  phase:    number;
}) {
  const router    = useRouter();
  const groupRef  = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const iconRef   = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const angleRef  = useRef(nodeDef.angle);

  const navigate = useCallback(() => router.push(nodeDef.href), [router, nodeDef.href]);

  const glassMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#0E052A"),
    metalness: 0.0, roughness: 0.05,
    reflectivity: 0.92, envMapIntensity: 2.8,
    emissive: new THREE.Color(nodeDef.color), emissiveIntensity: 0,
    transparent: true, opacity: 0,
    transmission: 0.72, thickness: 0.5, ior: 1.42,
  }), [nodeDef.color]);

  const coreMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(nodeDef.color),
    transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), [nodeDef.color]);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = orbitDef.rotX;
      groupRef.current.rotation.z = orbitDef.rotZ;
    }
  }, [orbitDef.rotX, orbitDef.rotZ]);

  const _wp = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }, delta) => {
    const opTarget = phase >= 3 ? 0.78 : 0;
    glassMat.opacity           += (opTarget                  - glassMat.opacity)           * 0.012;
    glassMat.emissiveIntensity += ((hovered ? 0.22 : 0.07)  - glassMat.emissiveIntensity) * 0.08;
    coreMat.opacity            += (opTarget * 0.55           - coreMat.opacity)            * 0.012;
    if (groupRef.current) groupRef.current.rotation.y += delta * orbitDef.speed;
    angleRef.current += delta * orbitDef.speed;
    if (iconRef.current && sphereRef.current) {
      sphereRef.current.getWorldPosition(_wp);
      iconRef.current.style.visibility = _wp.dot(camera.position) > 0 ? "visible" : "hidden";
    }
  });

  const r = orbitDef.radius;
  const x = Math.cos(nodeDef.angle) * r;
  const z = Math.sin(nodeDef.angle) * r;
  const Icon = nodeDef.Icon;

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.06} floatIntensity={0.18}>
        <group
          position={[x, 0, z]}
          scale={hovered ? 1.18 : 1.0}
          onPointerOver={() => { setHovered(true);  document.body.style.cursor = "pointer"; }}
          onPointerOut ={() => { setHovered(false); document.body.style.cursor = "default"; }}
          onClick={navigate}
        >
          <mesh ref={sphereRef}><sphereGeometry args={[0.40, 32, 32]} /><primitive object={glassMat} attach="material" /></mesh>
          <mesh><sphereGeometry args={[0.12, 16, 16]} /><primitive object={coreMat} attach="material" /></mesh>
          {phase >= 3 && (
            <Html center style={{ pointerEvents: "none", userSelect: "none" }}>
              <div ref={iconRef} style={{ cursor: "pointer" }}>
                <Icon size={22} color="#ffffff" style={{ opacity: hovered ? 1 : 0.75, transition: "opacity 0.3s" }} />
              </div>
            </Html>
          )}
        </group>
      </Float>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────
   DUST FIELD
───────────────────────────────────────────────────────── */

function DustField({ phase }: { phase: number }) {
  const COUNT = 90;
  const { geo, vel } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const v   = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 28;
      pos[i*3+1] = (Math.random() - 0.5) * 22;
      pos[i*3+2] = (Math.random() - 0.5) * 18;
      v[i*3]     = (Math.random() - 0.5) * 0.0028;
      v[i*3+1]   = 0.0010 + Math.random() * 0.0020;
      v[i*3+2]   = (Math.random() - 0.5) * 0.0016;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos.slice(), 3));
    return { geo: g, vel: v };
  }, []);

  const mat = useMemo(() => new THREE.PointsMaterial({
    color: new THREE.Color("#5038A0"), size: 0.014,
    transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  }), []);

  useFrame((_, delta) => {
    mat.opacity += ((phase >= 1 ? 0.15 : 0) - mat.opacity) * 0.007;
    if (mat.opacity < 0.003) return;
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

/* ─────────────────────────────────────────────────────────
   NEURON FIELD
───────────────────────────────────────────────────────── */

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function makeNeuronGeo(seed: number): THREE.BufferGeometry {
  const rand = lcg(seed);
  const verts: number[] = [];
  const BRANCHES = 5 + Math.floor(rand() * 4);
  for (let b = 0; b < BRANCHES; b++) {
    const theta = rand() * Math.PI * 2;
    const phi   = Math.acos(2 * rand() - 1);
    const dx = Math.sin(phi) * Math.cos(theta);
    const dy = Math.sin(phi) * Math.sin(theta);
    const dz = Math.cos(phi);
    const len = 0.32 + rand() * 0.46;
    verts.push(dx*0.13, dy*0.13, dz*0.13, dx*len, dy*len, dz*len);
    const subs = 1 + Math.floor(rand() * 2);
    for (let sb = 0; sb < subs; sb++) {
      const t  = 0.38 + rand() * 0.42;
      const bx = dx*len*t, by = dy*len*t, bz = dz*len*t;
      const st2 = rand() * Math.PI * 2, sp2 = Math.acos(2 * rand() - 1);
      const sdx = Math.sin(sp2)*Math.cos(st2), sdy = Math.sin(sp2)*Math.sin(st2), sdz = Math.cos(sp2);
      const slen = (0.14 + rand() * 0.24) * len;
      verts.push(bx, by, bz, bx+sdx*slen, by+sdy*slen, bz+sdz*slen);
    }
  }
  const at = rand()*Math.PI*2, ap = Math.acos(2*rand()-1);
  const ax = Math.sin(ap)*Math.cos(at), ay = Math.sin(ap)*Math.sin(at), az = Math.cos(ap);
  const alen = 0.75 + rand() * 0.55;
  verts.push(ax*0.13, ay*0.13, az*0.13, ax*alen, ay*alen, az*alen);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  return geo;
}

function NeuronCell({ initPos, rotSpeed, driftVel, scale, seed, phase }: {
  initPos:  THREE.Vector3;
  rotSpeed: number;
  driftVel: THREE.Vector3;
  scale:    number;
  seed:     number;
  phase:    number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pos      = useRef(initPos.clone());
  const t        = useRef(seed % 10);

  const somaGeo = useMemo(() => new THREE.SphereGeometry(0.12, 7, 7), []);
  const dendGeo = useMemo(() => makeNeuronGeo(seed), [seed]);

  const somaMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color("#9B5CF6"),
    transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);

  const dendMat = useMemo(() => new THREE.LineBasicMaterial({
    color: new THREE.Color("#7C5FC8"),
    transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);

  useFrame((_, delta) => {
    t.current += delta;
    const pulse  = 0.72 + Math.sin(t.current * 0.9) * 0.28;
    const baseOp = phase >= 2 ? 0.52 : 0;
    somaMat.opacity += (baseOp * pulse        - somaMat.opacity) * 0.016;
    dendMat.opacity += (baseOp * pulse * 0.70 - dendMat.opacity) * 0.016;
    pos.current.addScaledVector(driftVel, delta * 60);
    if (pos.current.x >  18) pos.current.x = -18;
    if (pos.current.x < -18) pos.current.x =  18;
    if (pos.current.y >  14) pos.current.y = -14;
    if (pos.current.y < -14) pos.current.y =  14;
    if (groupRef.current) {
      groupRef.current.position.copy(pos.current);
      groupRef.current.rotation.y += delta * rotSpeed;
      groupRef.current.rotation.x += delta * rotSpeed * 0.55;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      <mesh geometry={somaGeo} material={somaMat} />
      <lineSegments geometry={dendGeo} material={dendMat} />
    </group>
  );
}

function NeuronField({ phase }: { phase: number }) {
  const cells = useMemo(() => {
    const r = lcg(99991);
    return Array.from({ length: 22 }, (_, i) => ({
      initPos:  new THREE.Vector3((r()-0.5)*34, (r()-0.5)*26, -9 - r()*13),
      rotSpeed: (r()-0.5) * 0.42,
      driftVel: new THREE.Vector3((r()-0.5)*0.038, (r()-0.5)*0.028, 0),
      scale:    0.5 + r() * 1.1,
      seed:     (i+1) * 7919,
    }));
  }, []);
  return (
    <>
      {cells.map((c, i) => <NeuronCell key={i} {...c} phase={phase} />)}
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   FAINT HOLOGRAPHIC BACKGROUND PANELS
───────────────────────────────────────────────────────── */

function buildAmbientTex(variant: "rings" | "grid"): THREE.CanvasTexture {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 512;
  const ctx = cv.getContext("2d")!;
  ctx.clearRect(0, 0, 512, 512);
  ctx.strokeStyle = "rgba(170,138,255,0.85)";
  if (variant === "rings") {
    ctx.lineWidth = 0.8;
    for (let r = 32; r < 238; r += 44) { ctx.beginPath(); ctx.arc(256, 256, r, 0, Math.PI * 2); ctx.stroke(); }
    ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.moveTo(256, 40); ctx.lineTo(256, 472); ctx.moveTo(40, 256); ctx.lineTo(472, 256); ctx.stroke();
  } else {
    ctx.lineWidth = 0.44;
    for (let x = 42; x <= 470; x += 48) { ctx.beginPath(); ctx.moveTo(x, 42); ctx.lineTo(x, 470); ctx.stroke(); }
    for (let y = 42; y <= 470; y += 48) { ctx.beginPath(); ctx.moveTo(42, y); ctx.lineTo(470, y); ctx.stroke(); }
    ctx.lineWidth = 1.8;
    ([[52,52],[460,52],[52,460],[460,460]] as [number,number][]).forEach(([cx,cy]) => {
      const d = 26; const dx = cx < 256 ? d : -d; const dy = cy < 256 ? d : -d;
      ctx.beginPath(); ctx.moveTo(cx+dx, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy+dy); ctx.stroke();
    });
  }
  return new THREE.CanvasTexture(cv);
}

function HolographicSides({ phase }: { phase: number }) {
  const t    = useRef(0);
  const lTex = useMemo(() => buildAmbientTex("rings"), []);
  const rTex = useMemo(() => buildAmbientTex("grid"),  []);
  const lMat = useMemo(() => new THREE.MeshBasicMaterial({ map: lTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), [lTex]);
  const rMat = useMemo(() => new THREE.MeshBasicMaterial({ map: rTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), [rTex]);
  useFrame((_, delta) => {
    t.current += delta;
    const base   = phase >= 3 ? 0.040 : 0;
    const target = Math.max(0, base + Math.sin(t.current * 0.18) * 0.008);
    lMat.opacity += (target - lMat.opacity) * 0.010;
    rMat.opacity += (target - rMat.opacity) * 0.010;
  });
  return (
    <>
      <mesh position={[-7.0, 0, -4.5]} rotation={[0,  0.15, 0]}><planeGeometry args={[6, 6]} /><primitive object={lMat} attach="material" /></mesh>
      <mesh position={[ 7.0, 0, -4.5]} rotation={[0, -0.15, 0]}><planeGeometry args={[6, 6]} /><primitive object={rMat} attach="material" /></mesh>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   SCENE ROOT
───────────────────────────────────────────────────────── */

function Scene({ mouse }: { mouse: React.MutableRefObject<Mouse> }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 350),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <>
      <CameraRig mouse={mouse} />
      <fog attach="fog" args={["#020104", 18, 38]} />

      <ambientLight     intensity={0.055}                             color="#050115" />
      <directionalLight position={[-3.5,  7.5,  4]} intensity={11}   color="#EDE8FF" />
      <directionalLight position={[ 5.5, -2.0, -3]} intensity={4.5}  color="#38108A" />
      <pointLight       position={[ 0.0, -3.5,  5]} intensity={1.4}  color="#180640" />
      <pointLight       position={[ 0.0,  4.5, -2]} intensity={3.0}  color="#6029B8" />
      <pointLight       position={[-4.0,  0.0,  3]} intensity={2.2}  color="#9B5CF6" />

      <NeuronField          phase={phase} />
      <MonumentLogo         phase={phase} mouse={mouse} />
      {ORBIT_DEFS.map((def, i) => <OrbitalRing key={i} def={def} phase={phase} />)}
      {NODE_DEFS.map((nd, i)   => <FloatingNode key={i} nodeDef={nd} orbitDef={ORBIT_DEFS[nd.orbit]} phase={phase} />)}
      <DustField            phase={phase} />
      <HolographicSides     phase={phase} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   CANVAS EXPORT
───────────────────────────────────────────────────────── */

export function HeroScene() {
  const mouse = useRef<Mouse>({ x: 0, y: 0 });

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
      camera={{ position: [0, 0, 11], fov: 54 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x020104, 1);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.22;
      }}
      style={{ width: "100%", height: "100%", background: "#020104" }}
      dpr={[1, 2]}
    >
      <Scene mouse={mouse} />
    </Canvas>
  );
}
