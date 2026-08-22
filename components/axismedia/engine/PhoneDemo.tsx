"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { BrandKit } from "@/lib/axismedia/generator";

type Screen = "home" | "slots" | "confirm" | "success";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * A working mini booking app, skinned in the generated brand — the visitor
 * taps a doctor, picks a slot, confirms, and gets the success moment. Every
 * screen is real UI, not a mockup.
 */
export function PhoneDemo({ kit }: { kit: BrandKit }) {
  const [screen, setScreen] = useState<Screen>("home");
  const [doctor, setDoctor] = useState(0);
  const [slot, setSlot] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);

  const { accent, accentSoft, paper, ink, inkSoft, darkPreview } = kit;
  const card = darkPreview ? "rgba(255,255,255,0.06)" : "#ffffff";
  const cardBorder = darkPreview ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)";
  const doc = kit.doctors[doctor];

  function go(next: Screen) {
    setTouched(true);
    setScreen(next);
  }

  const screenStyle = { background: paper, color: ink };

  return (
    <div className="relative mx-auto w-[264px]">
      {/* attention ring until first tap */}
      {!touched && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-2 rounded-[3rem] border-2 border-[var(--axm-accent)]"
          animate={{ opacity: [0.7, 0.15, 0.7], scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="relative h-[540px] overflow-hidden rounded-[2.6rem] border border-[var(--axm-line-2)] bg-black p-[7px] shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[2.2rem]" style={screenStyle}>
          {/* status bar + notch */}
          <div className="relative z-10 flex items-center justify-between px-5 pb-1 pt-2.5 text-[0.55rem] font-semibold" style={{ color: ink }}>
            <span>9:41</span>
            <span className="absolute left-1/2 top-1.5 h-[18px] w-20 -translate-x-1/2 rounded-full bg-black" />
            <span>▮▮▮</span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {screen === "home" && (
              <motion.div
                key="home"
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.32, ease: EASE }}
                className="flex min-h-0 flex-1 flex-col"
              >
                <div className="px-5 pb-4 pt-3" style={{ background: darkPreview ? "transparent" : accentSoft, borderRadius: "0 0 22px 22px" }}>
                  <p className="text-[0.6rem]" style={{ color: inkSoft }}>
                    Good morning 👋
                  </p>
                  <p className="font-[family-name:var(--axm-display)] text-[1.05rem] font-bold leading-tight">
                    {kit.name}
                  </p>
                  <div
                    className="mt-3 flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.62rem]"
                    style={{ background: card, border: `1px solid ${cardBorder}`, color: inkSoft }}
                  >
                    🔍 Search doctors, services…
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-hidden px-5 pt-4">
                  <p className="mb-2 text-[0.58rem] font-bold uppercase tracking-widest" style={{ color: inkSoft }}>
                    Book an appointment
                  </p>
                  <div className="space-y-2.5">
                    {kit.doctors.map((d, i) => (
                      <button
                        key={d.name}
                        onClick={() => {
                          setDoctor(i);
                          setSlot(null);
                          go("slots");
                        }}
                        className="flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-transform active:scale-[0.97]"
                        style={{ background: card, border: `1px solid ${cardBorder}` }}
                      >
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold"
                          style={{ background: accent, color: darkPreview ? "#0d0a1c" : "#fff" }}
                        >
                          {d.name.replace("Dr. ", "").split(" ").map((w) => w[0]).join("")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.72rem] font-bold">{d.name}</span>
                          <span className="block text-[0.6rem]" style={{ color: inkSoft }}>
                            {d.spec}
                          </span>
                        </span>
                        <span className="text-[0.6rem] font-bold" style={{ color: accent }}>
                          ★ {d.rating}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-around border-t px-4 py-2.5 text-[0.95rem]" style={{ borderColor: cardBorder }}>
                  {["🏠", "📅", "💬", "👤"].map((ic, i) => (
                    <span key={i} style={{ opacity: i === 0 ? 1 : 0.35 }}>
                      {ic}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {screen === "slots" && (
              <motion.div
                key="slots"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 40, opacity: 0 }}
                transition={{ duration: 0.32, ease: EASE }}
                className="flex min-h-0 flex-1 flex-col px-5 pt-2"
              >
                <button onClick={() => go("home")} className="self-start text-[0.65rem] font-bold" style={{ color: accent }}>
                  ← Back
                </button>
                <div className="mt-3 flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full text-[0.7rem] font-bold"
                    style={{ background: accent, color: darkPreview ? "#0d0a1c" : "#fff" }}
                  >
                    {doc.name.replace("Dr. ", "").split(" ").map((w) => w[0]).join("")}
                  </span>
                  <div>
                    <p className="text-[0.8rem] font-bold">{doc.name}</p>
                    <p className="text-[0.62rem]" style={{ color: inkSoft }}>
                      {doc.spec} · ★ {doc.rating}
                    </p>
                  </div>
                </div>

                <p className="mb-2 mt-5 text-[0.58rem] font-bold uppercase tracking-widest" style={{ color: inkSoft }}>
                  Tomorrow&apos;s slots
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {kit.slots.map((t, i) => {
                    const active = slot === i;
                    return (
                      <button
                        key={t}
                        onClick={() => setSlot(i)}
                        className="rounded-xl py-2.5 text-[0.66rem] font-bold transition-transform active:scale-95"
                        style={{
                          background: active ? accent : card,
                          color: active ? (darkPreview ? "#0d0a1c" : "#fff") : ink,
                          border: `1px solid ${active ? accent : cardBorder}`,
                        }}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-auto pb-5">
                  <button
                    onClick={() => slot !== null && go("confirm")}
                    className="w-full rounded-2xl py-3.5 text-[0.72rem] font-bold transition-all active:scale-[0.98]"
                    style={{
                      background: slot !== null ? accent : cardBorder,
                      color: slot !== null ? (darkPreview ? "#0d0a1c" : "#fff") : inkSoft,
                    }}
                  >
                    {slot !== null ? "Continue" : "Pick a time"}
                  </button>
                </div>
              </motion.div>
            )}

            {screen === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 40, opacity: 0 }}
                transition={{ duration: 0.32, ease: EASE }}
                className="flex min-h-0 flex-1 flex-col px-5 pt-2"
              >
                <button onClick={() => go("slots")} className="self-start text-[0.65rem] font-bold" style={{ color: accent }}>
                  ← Back
                </button>
                <p className="mt-4 font-[family-name:var(--axm-display)] text-[1rem] font-bold">Confirm booking</p>
                <div className="mt-4 space-y-3 rounded-2xl p-4" style={{ background: card, border: `1px solid ${cardBorder}` }}>
                  {[
                    ["Doctor", doc.name],
                    ["Specialty", doc.spec],
                    ["Time", `Tomorrow · ${slot !== null ? kit.slots[slot] : ""}`],
                    ["Location", `${kit.name}, Dubai`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-start justify-between gap-3 text-[0.66rem]">
                      <span style={{ color: inkSoft }}>{k}</span>
                      <span className="text-right font-bold">{v}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-center text-[0.56rem]" style={{ color: inkSoft }}>
                  Free cancellation up to 3h before
                </p>
                <div className="mt-auto pb-5">
                  <button
                    onClick={() => go("success")}
                    className="w-full rounded-2xl py-3.5 text-[0.72rem] font-bold transition-transform active:scale-[0.98]"
                    style={{ background: accent, color: darkPreview ? "#0d0a1c" : "#fff" }}
                  >
                    Confirm booking
                  </button>
                </div>
              </motion.div>
            )}

            {screen === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center"
              >
                <motion.svg width="76" height="76" viewBox="0 0 76 76" aria-hidden="true">
                  <motion.circle
                    cx="38"
                    cy="38"
                    r="34"
                    fill="none"
                    stroke={accent}
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  />
                  <motion.path
                    d="M24 39 L34 49 L53 29"
                    fill="none"
                    stroke={accent}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
                  />
                </motion.svg>
                <p className="mt-4 font-[family-name:var(--axm-display)] text-[1rem] font-bold">You&apos;re booked!</p>
                <p className="mt-1.5 text-[0.66rem] leading-relaxed" style={{ color: inkSoft }}>
                  {doc.name} · tomorrow at {slot !== null ? kit.slots[slot] : ""}.
                  <br />
                  We&apos;ll send a reminder an hour before.
                </p>
                <button
                  onClick={() => {
                    setSlot(null);
                    go("home");
                  }}
                  className="mt-6 rounded-full px-6 py-2.5 text-[0.66rem] font-bold"
                  style={{ background: card, border: `1px solid ${cardBorder}`, color: accent }}
                >
                  Back to home
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="axm-mono mt-4 flex items-center justify-center gap-2 !text-[0.55rem]">
        <span className="axm-live-dot !h-1.5 !w-1.5" aria-hidden="true" />
        live demo — go ahead, tap it
      </p>
    </div>
  );
}
