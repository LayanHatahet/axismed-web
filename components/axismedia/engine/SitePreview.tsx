"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { BrandKit } from "@/lib/axismedia/generator";

const EASE = [0.22, 1, 0.36, 1] as const;

function Piece({ delay, children, className = "" }: { delay: number; children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, duration: 0.55, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * The client's website, assembling piece by piece in their generated brand —
 * with a desktop/mobile viewport toggle so they see it respond live.
 */
export function SitePreview({ kit }: { kit: BrandKit }) {
  const [mobile, setMobile] = useState(false);
  const { accent, accentSoft, paper, ink, inkSoft, darkPreview } = kit;
  const card = darkPreview ? "rgba(255,255,255,0.06)" : "#ffffff";
  const cardBorder = darkPreview ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)";
  const onAccent = darkPreview ? "#0d0a1c" : "#fff";

  const features =
    kit.sector === "pharma"
      ? ["Pipeline", "For HCPs", "Partnerships"]
      : kit.sector === "digital"
        ? ["Video consults", "e-Prescriptions", "Lab results"]
        : ["Same-day booking", "Insurance direct", "Arabic / English"];

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

        {/* the page itself */}
        <div className="flex justify-center" style={{ background: darkPreview ? "#080614" : "#e9e6f2" }}>
          <motion.div
            animate={{ width: mobile ? 250 : "100%" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden"
            style={{ background: paper, color: ink }}
          >
            {/* nav */}
            <Piece delay={0.1}>
              <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: `1px solid ${cardBorder}` }}>
                <span className="flex items-center gap-1.5 text-[0.62rem] font-bold">
                  <span
                    className="flex h-4.5 w-4.5 items-center justify-center rounded-md text-[0.45rem]"
                    style={{ background: accent, color: onAccent, width: 18, height: 18 }}
                  >
                    {kit.initials}
                  </span>
                  {kit.name}
                </span>
                {!mobile && (
                  <span className="flex gap-3 text-[0.52rem]" style={{ color: inkSoft }}>
                    <span>Services</span>
                    <span>Doctors</span>
                    <span>About</span>
                  </span>
                )}
                <span className="rounded-full px-2.5 py-1 text-[0.5rem] font-bold" style={{ background: accent, color: onAccent }}>
                  Book now
                </span>
              </div>
            </Piece>

            {/* hero */}
            <Piece delay={0.35}>
              <div className={`px-4 pt-5 ${mobile ? "pb-4 text-center" : "pb-5"}`}>
                <p className="text-[0.5rem] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
                  {kit.sectorLabel} · Dubai
                </p>
                <p
                  className="mt-1.5 text-[1.05rem] font-extrabold leading-tight"
                  style={{ fontFamily: kit.displayFamily }}
                >
                  {kit.tagline}
                </p>
                <p className="mt-1.5 text-[0.6rem] leading-relaxed" style={{ color: inkSoft }}>
                  {kit.subline}
                </p>
                <div className={`mt-3 flex gap-2 ${mobile ? "justify-center" : ""}`}>
                  <span className="rounded-full px-3 py-1.5 text-[0.55rem] font-bold" style={{ background: accent, color: onAccent }}>
                    Book appointment
                  </span>
                  <span
                    className="rounded-full px-3 py-1.5 text-[0.55rem] font-bold"
                    style={{ border: `1px solid ${cardBorder}`, color: inkSoft }}
                  >
                    Our doctors
                  </span>
                </div>
              </div>
            </Piece>

            {/* feature cards */}
            <Piece delay={0.6} className="px-4 pb-4">
              <div className={`grid gap-2 ${mobile ? "grid-cols-1" : "grid-cols-3"}`}>
                {features.map((f, i) => (
                  <div key={f} className="rounded-xl p-2.5" style={{ background: card, border: `1px solid ${cardBorder}` }}>
                    <span
                      className="mb-1.5 flex h-5 w-5 items-center justify-center rounded-md text-[0.5rem]"
                      style={{ background: accentSoft, color: darkPreview ? "#0d0a1c" : accent }}
                    >
                      {["✚", "◉", "✦"][i]}
                    </span>
                    <p className="text-[0.58rem] font-bold">{f}</p>
                  </div>
                ))}
              </div>
            </Piece>

            {/* stats strip */}
            <Piece delay={0.85}>
              <div
                className="flex items-center justify-around px-4 py-3"
                style={{ background: darkPreview ? "rgba(255,255,255,0.04)" : accentSoft }}
              >
                {[
                  ["25k+", "patients"],
                  ["4.9★", "rating"],
                  ["12", "specialists"],
                ].map(([v, l]) => (
                  <span key={l} className="text-center">
                    <span className="block text-[0.75rem] font-extrabold" style={{ color: darkPreview ? kit.ink : ink }}>
                      {v}
                    </span>
                    <span className="block text-[0.5rem]" style={{ color: inkSoft }}>
                      {l}
                    </span>
                  </span>
                ))}
              </div>
            </Piece>
          </motion.div>
        </div>
      </div>

      <p className="axm-mono mt-3 !text-[0.55rem]">
        website — assembled live in {kit.vibeLabel.toLowerCase()} · toggle 🖥/📱
      </p>
    </div>
  );
}
