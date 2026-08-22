"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { BrandKit } from "@/lib/axismedia/generator";
import { EmblemLogo } from "./EmblemLogo";

const EASE = [0.22, 1, 0.36, 1] as const;

function Piece({ delay, children, className = "" }: { delay: number; children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay, duration: 0.6, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * The generated website — designed like the sites that win awards: aurora
 * gradients, giant editorial type, a running marquee, floating glass, live
 * shine. Every pixel re-skins from the visitor's kit.
 */
export function SitePreview({ kit }: { kit: BrandKit }) {
  const [mobile, setMobile] = useState(false);
  const { accent, accentSoft, paper, ink, inkSoft, darkPreview, displayFamily } = kit;
  const glass = darkPreview ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.6)";
  const glassBorder = darkPreview ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.9)";
  const hairline = darkPreview ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";
  const onAccent = darkPreview ? "#0d0a1c" : "#fff";
  const gradText = {
    background: `linear-gradient(120deg, ${accent}, ${accentSoft})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  } as const;

  const words = kit.tagline.replace(/\.$/, "").split(" ");
  const head = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const tail = words.slice(Math.ceil(words.length / 2)).join(" ");

  const features =
    kit.sector === "pharma"
      ? ["Pipeline", "For HCPs", "Partnerships"]
      : kit.sector === "digital"
        ? ["Video consults", "e-Prescriptions", "Lab results"]
        : ["Same-day booking", "Insurance direct", "Arabic / English"];

  const marqueeItems = [...features, kit.sectorLabel, "Dubai · UAE"];

  return (
    <div>
      {/* browser chrome */}
      <div className="overflow-hidden rounded-xl border border-[var(--axm-line-2)] bg-[var(--axm-bg-2)]">
        <div className="flex items-center gap-2 border-b border-[var(--axm-line)] px-3.5 py-2.5">
          {["var(--axm-coral)", "#f5c04e", "var(--axm-accent)"].map((c) => (
            <span key={c} className="h-2 w-2 rounded-full" style={{ background: c, opacity: 0.8 }} />
          ))}
          <span className="axm-mono ml-2 flex-1 truncate rounded-full border border-[var(--axm-line)] px-3 py-1 !text-[0.52rem] !tracking-[0.12em]">
            {kit.name.toLowerCase().replace(/[^a-z0-9]+/g, "")}.ae
          </span>
          <div className="flex gap-1">
            {(["desktop", "mobile"] as const).map((m) => {
              const active = mobile === (m === "mobile");
              return (
                <button
                  key={m}
                  onClick={() => setMobile(m === "mobile")}
                  className="axm-mono rounded-md border px-2 py-1 !text-[0.5rem] transition-colors"
                  style={{
                    borderColor: active ? "var(--axm-accent)" : "var(--axm-line-2)",
                    color: active ? "var(--axm-accent)" : "var(--axm-muted)",
                  }}
                >
                  {m === "desktop" ? "🖥" : "📱"}
                </button>
              );
            })}
          </div>
        </div>

        {/* the page */}
        <div className="flex justify-center" style={{ background: darkPreview ? "#080614" : "#e9e6f2" }}>
          <motion.div
            animate={{ width: mobile ? 260 : "100%" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative overflow-hidden"
            style={{ background: paper, color: ink }}
          >
            {/* aurora */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -left-10 -top-16 h-44 w-44 rounded-full blur-3xl"
              style={{ background: accent, opacity: darkPreview ? 0.35 : 0.3 }}
              animate={{ x: [0, 30, 0], y: [0, 16, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 top-10 h-40 w-40 rounded-full blur-3xl"
              style={{ background: accentSoft, opacity: darkPreview ? 0.22 : 0.5 }}
              animate={{ x: [0, -24, 0], y: [0, 22, 0] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* shine sweep */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-16 rotate-12"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)" }}
              animate={{ x: ["-120%", "1400%"] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.5 }}
            />

            {/* nav */}
            <Piece delay={0.05}>
              <div className="relative flex items-center justify-between px-4 py-2.5">
                <span className="flex items-center gap-1.5 text-[0.64rem] font-bold">
                  <EmblemLogo kit={kit} size={20} onPaper={false} />
                  <span style={{ fontFamily: displayFamily }} className="tracking-wide">
                    {kit.name}
                  </span>
                </span>
                {!mobile && (
                  <span className="flex gap-3 text-[0.52rem]" style={{ color: inkSoft }}>
                    <span>Services</span>
                    <span>Doctors</span>
                    <span>About</span>
                  </span>
                )}
                <span
                  className="rounded-full px-2.5 py-1 text-[0.5rem] font-bold backdrop-blur"
                  style={{ background: glass, border: `1px solid ${glassBorder}`, color: ink }}
                >
                  Book →
                </span>
              </div>
            </Piece>

            {/* hero */}
            <div className={`relative px-4 pt-4 ${mobile ? "pb-4 text-center" : "pb-5"}`}>
              <Piece delay={0.15}>
                <p className="text-[0.48rem] font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>
                  {kit.sectorLabel} — Dubai
                </p>
                <h4
                  className={`mt-1.5 uppercase leading-[0.95] ${mobile ? "text-[1.5rem]" : "text-[2.2rem]"}`}
                  style={{ fontFamily: displayFamily }}
                >
                  <span className="block">{head}</span>
                  <span className="block" style={gradText}>
                    {tail}
                  </span>
                </h4>
              </Piece>

              <Piece delay={0.35} className={`mt-3 flex items-center gap-2 ${mobile ? "justify-center" : ""}`}>
                <span
                  className="rounded-full px-3.5 py-1.5 text-[0.55rem] font-bold"
                  style={{ background: `linear-gradient(120deg, ${accent}, ${accentSoft})`, color: onAccent }}
                >
                  Book appointment
                </span>
                <span className="text-[0.55rem] font-bold underline underline-offset-2" style={{ color: inkSoft }}>
                  Our doctors
                </span>
              </Piece>

              {/* floating glass appointment card */}
              {!mobile && (
                <motion.div
                  className="absolute right-4 top-9 w-32 rounded-xl p-2.5 backdrop-blur-md"
                  style={{ background: glass, border: `1px solid ${glassBorder}`, boxShadow: "0 14px 40px rgba(0,0,0,0.18)" }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <p className="text-[0.44rem] font-bold uppercase tracking-widest" style={{ color: inkSoft }}>
                    next available
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full text-[0.4rem] font-bold"
                      style={{ background: `linear-gradient(120deg, ${accent}, ${accentSoft})`, color: onAccent }}
                    >
                      {kit.doctors[0].name.replace("Dr. ", "")[0]}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[0.5rem] font-bold">{kit.doctors[0].name}</span>
                      <span className="block text-[0.44rem]" style={{ color: inkSoft }}>
                        Today · 16:00
                      </span>
                    </span>
                  </div>
                  <span className="mt-1.5 block text-right text-[0.55rem] font-bold" style={{ color: accent }}>
                    →
                  </span>
                </motion.div>
              )}
            </div>

            {/* running marquee */}
            <Piece delay={0.45}>
              <div
                className="relative overflow-hidden py-1.5"
                style={{ background: darkPreview ? "rgba(255,255,255,0.05)" : ink, color: darkPreview ? ink : paper }}
              >
                <motion.div
                  className="flex w-max items-center gap-4 whitespace-nowrap"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                >
                  {[0, 1].map((h) => (
                    <span key={h} className="flex items-center gap-4 pr-4">
                      {marqueeItems.map((it) => (
                        <span key={`${h}-${it}`} className="flex items-center gap-4 text-[0.5rem] font-bold uppercase tracking-[0.2em]">
                          {it} <span style={{ color: accent }}>✦</span>
                        </span>
                      ))}
                    </span>
                  ))}
                </motion.div>
              </div>
            </Piece>

            {/* editorial numbered rows */}
            <div className="relative px-4 py-3">
              {features.map((f, i) => (
                <Piece key={f} delay={0.55 + i * 0.12}>
                  <div
                    className="flex items-center gap-3 py-2"
                    style={{ borderBottom: i < features.length - 1 ? `1px solid ${hairline}` : "none" }}
                  >
                    <span
                      className="text-[1.1rem] leading-none opacity-30"
                      style={{ fontFamily: displayFamily, WebkitTextStroke: `1px ${ink}`, WebkitTextFillColor: "transparent" }}
                    >
                      0{i + 1}
                    </span>
                    <span className="text-[0.66rem] font-bold">{f}</span>
                    <span className="ml-auto text-[0.6rem]" style={{ color: accent }}>
                      →
                    </span>
                  </div>
                </Piece>
              ))}
            </div>

            {/* stats band */}
            <Piece delay={0.85}>
              <div
                className="relative flex items-center justify-around px-4 py-3"
                style={{ background: darkPreview ? "rgba(255,255,255,0.04)" : accentSoft }}
              >
                {[
                  ["25k+", "patients"],
                  ["4.9★", "rating"],
                  ["12", "specialists"],
                ].map(([v, l]) => (
                  <span key={l} className="text-center">
                    <span className="block text-[1.15rem] leading-none" style={{ fontFamily: displayFamily, color: ink }}>
                      {v}
                    </span>
                    <span className="block text-[0.46rem] uppercase tracking-widest" style={{ color: inkSoft }}>
                      {l}
                    </span>
                  </span>
                ))}
              </div>
            </Piece>

            {/* footer wordmark */}
            <div className="relative overflow-hidden pb-1 pt-2">
              <p
                className="whitespace-nowrap text-center uppercase leading-[0.8]"
                style={{
                  fontFamily: displayFamily,
                  fontSize: mobile ? "1.6rem" : "2.6rem",
                  WebkitTextStroke: `1px ${darkPreview ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.22)"}`,
                  WebkitTextFillColor: "transparent",
                }}
                aria-hidden="true"
              >
                {kit.name}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <p className="axm-mono mt-3 !text-[0.55rem]">their website — live · toggle 🖥/📱</p>
    </div>
  );
}
