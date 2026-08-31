"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { BrandKit } from "@/lib/axismedia/generator";

type Tab = "home" | "vitals" | "chat";
type Screen = "home" | "slots" | "confirm" | "success";

const EASE = [0.22, 1, 0.36, 1] as const;

const DOC_REPLIES: Record<string, string> = {
  "Book a follow-up": "Of course — I have Tuesday 4:30 free. Shall I lock it in?",
  "Send my results": "Your labs are on the way to your inbox 📄 All values in range.",
  "Thank you, doctor 🙏": "Anytime! That's what we're here for ♥",
};

/**
 * A working mini health app in the generated brand — three live tabs:
 * booking (full flow), vitals (animated readouts, tappable hydration), and a
 * doctor chat that actually replies. Everything is real UI, not a mockup.
 */
export function PhoneDemo({ kit }: { kit: BrandKit }) {
  const [tab, setTab] = useState<Tab>("home");
  const [screen, setScreen] = useState<Screen>("home");
  const [doctor, setDoctor] = useState(0);
  const [slot, setSlot] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);

  const { accent, paper, ink, inkSoft, darkPreview, displayFamily } = kit;
  const card = darkPreview ? "rgba(255,255,255,0.06)" : "#ffffff";
  const cardBorder = darkPreview ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)";
  const onAccent = darkPreview ? "#0d0a1c" : "#fff";
  const doc = kit.doctors[doctor];

  function touch() {
    setTouched(true);
  }

  return (
    <div className="relative mx-auto w-[300px] max-w-full">
      {!touched && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-2 rounded-[3rem] border-2"
          style={{ borderColor: "var(--axm-accent)" }}
          animate={{ opacity: [0.7, 0.15, 0.7], scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="relative h-[604px] overflow-hidden rounded-[2.8rem] border border-[var(--axm-line-2)] bg-black p-[7px] shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        <div
          className="relative flex h-full flex-col overflow-hidden rounded-[2.4rem]"
          style={{ background: paper, color: ink }}
        >
          {/* status bar + notch */}
          <div className="relative z-10 flex items-center justify-between px-5 pb-1 pt-2.5 text-[0.55rem] font-semibold">
            <span>9:41</span>
            <span className="absolute left-1/2 top-1.5 h-[18px] w-20 -translate-x-1/2 rounded-full bg-black" />
            <span>▮▮▮</span>
          </div>

          {/* tab content */}
          <div className="min-h-0 flex-1">
            <AnimatePresence mode="wait" initial={false}>
              {tab === "home" && (
                <HomeTab
                  key="tab-home"
                  {...{ kit, screen, setScreen, doctor, setDoctor, slot, setSlot, touch, card, cardBorder, onAccent, doc, displayFamily }}
                />
              )}
              {tab === "vitals" && (
                <VitalsTab key="tab-vitals" {...{ kit, card, cardBorder, displayFamily }} />
              )}
              {tab === "chat" && (
                <ChatTab key="tab-chat" {...{ kit, card, cardBorder, onAccent, touch, displayFamily }} />
              )}
            </AnimatePresence>
          </div>

          {/* working tab bar */}
          <div className="flex justify-around border-t px-2 py-2" style={{ borderColor: cardBorder }}>
            {(
              [
                ["home", "⌂", "Home"],
                ["vitals", "♥", "Vitals"],
                ["chat", "💬", "Chat"],
              ] as [Tab, string, string][]
            ).map(([t, icon, label]) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => {
                    touch();
                    setTab(t);
                  }}
                  className="flex flex-col items-center gap-0.5 rounded-xl px-4 py-1 transition-transform active:scale-90"
                  style={{ color: active ? accent : inkSoft, opacity: active ? 1 : 0.55 }}
                >
                  <span className="text-[1rem] leading-none">{icon}</span>
                  <span className="text-[0.5rem] font-bold">{label}</span>
                  <span
                    className="h-1 w-1 rounded-full transition-opacity"
                    style={{ background: accent, opacity: active ? 1 : 0 }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p className="axm-mono mt-4 flex items-center justify-center gap-2 !text-[0.55rem]">
        <span className="axm-live-dot !h-1.5 !w-1.5" aria-hidden="true" />
        your app, live — tap everything
      </p>
    </div>
  );
}

/* ── Home tab: the booking flow ────────────────────────────────────────── */

function HomeTab(props: {
  kit: BrandKit;
  screen: Screen;
  setScreen: (s: Screen) => void;
  doctor: number;
  setDoctor: (i: number) => void;
  slot: number | null;
  setSlot: (i: number | null) => void;
  touch: () => void;
  card: string;
  cardBorder: string;
  onAccent: string;
  doc: BrandKit["doctors"][number];
  displayFamily: string;
}) {
  const { kit, screen, setScreen, setDoctor, slot, setSlot, touch, card, cardBorder, onAccent, doc, displayFamily } = props;
  const { accent, accentSoft, ink, inkSoft } = kit;
  const grad = `linear-gradient(130deg, ${accent}, ${accentSoft})`;

  function go(next: Screen) {
    touch();
    setScreen(next);
  }
  const initialsOf = (n: string) =>
    n.replace("Dr. ", "").split(" ").map((w) => w[0]).join("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      <AnimatePresence mode="wait" initial={false}>
        {screen === "home" && (
          <motion.div
            key="home"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex min-h-0 flex-1 flex-col"
          >
            {/* gradient hero header */}
            <div
              className="relative mx-3 overflow-hidden rounded-3xl px-4 pb-4 pt-3"
              style={{ background: grad, color: onAccent }}
            >
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full"
                style={{ background: "rgba(255,255,255,0.18)", filter: "blur(2px)" }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <p className="text-[0.58rem] opacity-80">Good morning 👋</p>
              <p className="text-[1.2rem] uppercase leading-none tracking-wide" style={{ fontFamily: displayFamily }}>
                {kit.name}
              </p>
              <div
                className="mt-2.5 flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.6rem] backdrop-blur"
                style={{ background: "rgba(255,255,255,0.22)", color: onAccent }}
              >
                🔍 Search doctors, services…
              </div>
            </div>

            {/* floating next-appointment card */}
            <div className="relative z-10 mx-5 -mt-2.5">
              <div
                className="flex items-center gap-2 rounded-2xl px-3 py-2 backdrop-blur-md"
                style={{
                  background: card,
                  border: `1px solid ${cardBorder}`,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                }}
              >
                <span className="text-[0.8rem]">📅</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.5rem] font-bold uppercase tracking-widest" style={{ color: inkSoft }}>
                    next appointment
                  </span>
                  <span className="block truncate text-[0.62rem] font-bold">Tue · 16:00 · {kit.doctors[0].name}</span>
                </span>
                <span className="text-[0.65rem] font-bold" style={{ color: accent }}>
                  →
                </span>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden px-5 pt-3">
              <p className="mb-2 text-[0.56rem] font-bold uppercase tracking-widest" style={{ color: inkSoft }}>
                Book an appointment
              </p>
              <div className="space-y-2">
                {kit.doctors.map((d, i) => (
                  <button
                    key={d.name}
                    onClick={() => {
                      setDoctor(i);
                      setSlot(null);
                      go("slots");
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-transform active:scale-[0.97]"
                    style={{ background: card, border: `1px solid ${cardBorder}` }}
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[0.62rem] font-bold"
                      style={{ background: grad, color: onAccent, boxShadow: `0 4px 12px ${accent}55` }}
                    >
                      {initialsOf(d.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.7rem] font-bold">{d.name}</span>
                      <span className="block text-[0.58rem]" style={{ color: inkSoft }}>
                        {d.spec}
                      </span>
                    </span>
                    <span className="text-[0.58rem] font-bold" style={{ color: accent }}>
                      ★ {d.rating}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {screen === "slots" && (
          <motion.div
            key="slots"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex min-h-0 flex-1 flex-col px-5 pt-1"
          >
            <button onClick={() => go("home")} className="self-start text-[0.65rem] font-bold" style={{ color: accent }}>
              ← Back
            </button>
            <div className="mt-2.5 flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-[0.65rem] font-bold"
                style={{ background: grad, color: onAccent, boxShadow: `0 4px 12px ${accent}55` }}
              >
                {initialsOf(doc.name)}
              </span>
              <div>
                <p className="text-[0.78rem] font-bold">{doc.name}</p>
                <p className="text-[0.6rem]" style={{ color: inkSoft }}>
                  {doc.spec} · ★ {doc.rating}
                </p>
              </div>
            </div>

            <p className="mb-2 mt-4 text-[0.56rem] font-bold uppercase tracking-widest" style={{ color: inkSoft }}>
              Tomorrow&apos;s slots
            </p>
            <div className="grid grid-cols-3 gap-2">
              {kit.slots.map((t, i) => {
                const active = slot === i;
                return (
                  <button
                    key={t}
                    onClick={() => {
                      touch();
                      setSlot(i);
                    }}
                    className="rounded-xl py-2.5 text-[0.64rem] font-bold transition-transform active:scale-95"
                    style={{
                      background: active ? grad : card,
                      color: active ? onAccent : ink,
                      border: `1px solid ${active ? accent : cardBorder}`,
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pb-4">
              <button
                onClick={() => slot !== null && go("confirm")}
                className="w-full rounded-2xl py-3 text-[0.7rem] font-bold transition-all active:scale-[0.98]"
                style={{
                  background: slot !== null ? grad : cardBorder,
                  color: slot !== null ? onAccent : inkSoft,
                  boxShadow: slot !== null ? `0 8px 24px ${accent}55` : "none",
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
            transition={{ duration: 0.3, ease: EASE }}
            className="flex min-h-0 flex-1 flex-col px-5 pt-1"
          >
            <button onClick={() => go("slots")} className="self-start text-[0.65rem] font-bold" style={{ color: accent }}>
              ← Back
            </button>
            <p className="mt-3 text-[0.95rem] font-bold" style={{ fontFamily: displayFamily }}>
              Confirm booking
            </p>
            <div className="mt-3 space-y-2.5 rounded-2xl p-4" style={{ background: card, border: `1px solid ${cardBorder}` }}>
              {[
                ["Doctor", doc.name],
                ["Specialty", doc.spec],
                ["Time", `Tomorrow · ${slot !== null ? kit.slots[slot] : ""}`],
                ["Location", `${kit.name}, Dubai`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-3 text-[0.64rem]">
                  <span style={{ color: inkSoft }}>{k}</span>
                  <span className="text-right font-bold">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto pb-4">
              <button
                onClick={() => go("success")}
                className="w-full rounded-2xl py-3 text-[0.7rem] font-bold transition-transform active:scale-[0.98]"
                style={{ background: grad, color: onAccent, boxShadow: `0 8px 24px ${accent}55` }}
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
            <motion.svg width="72" height="72" viewBox="0 0 76 76" aria-hidden="true">
              <motion.circle
                cx="38" cy="38" r="34" fill="none" stroke={accent} strokeWidth="3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
              <motion.path
                d="M24 39 L34 49 L53 29" fill="none" stroke={accent} strokeWidth="4"
                strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
              />
            </motion.svg>
            <p className="mt-3 text-[0.95rem] font-bold" style={{ fontFamily: displayFamily }}>
              You&apos;re booked!
            </p>
            <p className="mt-1.5 text-[0.64rem] leading-relaxed" style={{ color: inkSoft }}>
              {doc.name} · tomorrow at {slot !== null ? kit.slots[slot] : ""}
            </p>
            <button
              onClick={() => {
                setSlot(null);
                go("home");
              }}
              className="mt-5 rounded-full px-6 py-2.5 text-[0.64rem] font-bold"
              style={{ background: card, border: `1px solid ${cardBorder}`, color: accent }}
            >
              Back to home
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Vitals tab: live readouts ─────────────────────────────────────────── */

function VitalsTab({
  kit,
  card,
  cardBorder,
  displayFamily,
}: {
  kit: BrandKit;
  card: string;
  cardBorder: string;
  displayFamily: string;
}) {
  const { accent, ink, inkSoft } = kit;
  const [hr, setHr] = useState(72);
  const [water, setWater] = useState(4);

  useEffect(() => {
    const id = setInterval(() => setHr(70 + Math.round(Math.random() * 6)), 1100);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex h-full flex-col gap-2.5 px-5 pt-1"
    >
      <p className="text-[0.95rem] font-bold" style={{ fontFamily: displayFamily }}>
        Your vitals
      </p>

      {/* heart rate */}
      <div className="rounded-2xl p-3.5" style={{ background: card, border: `1px solid ${cardBorder}` }}>
        <div className="flex items-center justify-between">
          <span className="text-[0.56rem] font-bold uppercase tracking-widest" style={{ color: inkSoft }}>
            Heart rate
          </span>
          <motion.span
            key={hr}
            initial={{ scale: 1.25 }}
            animate={{ scale: 1 }}
            className="text-[1.15rem] font-extrabold tabular-nums"
            style={{ color: accent }}
          >
            {hr} <span className="text-[0.55rem] font-bold">bpm</span>
          </motion.span>
        </div>
        <svg viewBox="0 0 200 34" className="mt-1.5 w-full" aria-hidden="true">
          <motion.path
            d="M0 17 H36 L44 17 L50 5 L57 30 L63 12 L68 17 H104 L112 17 L118 6 L124 29 L130 13 L135 17 H172 L179 17 L184 8 L190 26 L195 17 H200"
            fill="none"
            stroke={accent}
            strokeWidth="1.8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* steps ring + sleep */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex items-center gap-2.5 rounded-2xl p-3" style={{ background: card, border: `1px solid ${cardBorder}` }}>
          <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
            <circle cx="22" cy="22" r="18" fill="none" stroke={cardBorder} strokeWidth="4.5" />
            <motion.circle
              cx="22" cy="22" r="18" fill="none" stroke={accent} strokeWidth="4.5"
              strokeLinecap="round" strokeDasharray="113"
              initial={{ strokeDashoffset: 113 }}
              animate={{ strokeDashoffset: 113 * 0.28 }}
              transition={{ duration: 1.2, ease: EASE }}
              transform="rotate(-90 22 22)"
            />
          </svg>
          <div>
            <p className="text-[0.78rem] font-extrabold leading-none" style={{ color: ink }}>
              7,214
            </p>
            <p className="mt-0.5 text-[0.52rem]" style={{ color: inkSoft }}>
              steps · 72%
            </p>
          </div>
        </div>
        <div className="rounded-2xl p-3" style={{ background: card, border: `1px solid ${cardBorder}` }}>
          <p className="text-[0.52rem] font-bold uppercase tracking-widest" style={{ color: inkSoft }}>
            Sleep
          </p>
          <p className="mt-1 text-[0.78rem] font-extrabold" style={{ color: ink }}>
            7h 40m
          </p>
          <div className="mt-1.5 flex gap-0.5">
            {[0.9, 0.6, 1, 0.75, 0.5, 0.85, 0.7].map((h, i) => (
              <motion.span
                key={i}
                className="w-2 rounded-sm"
                style={{ background: accent, opacity: 0.4 + h * 0.6 }}
                initial={{ height: 2 }}
                animate={{ height: 4 + h * 14 }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* hydration — tappable */}
      <div className="flex items-center justify-between rounded-2xl p-3.5" style={{ background: card, border: `1px solid ${cardBorder}` }}>
        <div>
          <p className="text-[0.56rem] font-bold uppercase tracking-widest" style={{ color: inkSoft }}>
            Hydration
          </p>
          <p className="mt-1 text-[0.8rem] font-extrabold" style={{ color: ink }}>
            {water} / 8 glasses
          </p>
          <div className="mt-1.5 flex gap-1">
            {Array.from({ length: 8 }, (_, i) => (
              <span
                key={i}
                className="h-1.5 w-4 rounded-full transition-colors duration-300"
                style={{ background: i < water ? accent : cardBorder }}
              />
            ))}
          </div>
        </div>
        <motion.button
          onClick={() => setWater((w) => (w >= 8 ? 8 : w + 1))}
          whileTap={{ scale: 0.85 }}
          className="flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold"
          style={{ background: accent, color: kit.darkPreview ? "#0d0a1c" : "#fff" }}
          aria-label="Add a glass of water"
        >
          +
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ── Chat tab: a doctor who replies ────────────────────────────────────── */

function ChatTab({
  kit,
  card,
  cardBorder,
  onAccent,
  touch,
  displayFamily,
}: {
  kit: BrandKit;
  card: string;
  cardBorder: string;
  onAccent: string;
  touch: () => void;
  displayFamily: string;
}) {
  const { accent, inkSoft } = kit;
  const doc = kit.doctors[0];
  const [msgs, setMsgs] = useState<{ from: "doc" | "me"; text: string }[]>([
    { from: "doc", text: `Hi! ${doc.name.replace("Dr. ", "Dr. ")} here. How are you feeling after Tuesday's visit?` },
  ]);
  const [typing, setTyping] = useState(false);
  const [used, setUsed] = useState<string[]>([]);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 9999, behavior: "smooth" });
  }, [msgs, typing]);

  function send(text: string) {
    touch();
    setUsed((u) => [...u, text]);
    setMsgs((m) => [...m, { from: "me", text }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "doc", text: DOC_REPLIES[text] ?? "Noted — see you soon!" }]);
    }, 1100);
  }

  const options = Object.keys(DOC_REPLIES).filter((o) => !used.includes(o));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex h-full flex-col px-4 pt-1"
    >
      <div className="flex items-center gap-2.5 pb-2" style={{ borderBottom: `1px solid ${cardBorder}` }}>
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-[0.55rem] font-bold"
          style={{ background: accent, color: onAccent }}
        >
          {doc.name.replace("Dr. ", "").split(" ").map((w) => w[0]).join("")}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[0.72rem] font-bold" style={{ fontFamily: displayFamily }}>
            {doc.name}
          </p>
          <p className="flex items-center gap-1 text-[0.52rem]" style={{ color: inkSoft }}>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> online now
          </p>
        </div>
      </div>

      <div ref={scroller} className="min-h-0 flex-1 space-y-2 overflow-y-auto py-2.5">
        {msgs.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: EASE }}
            className={`max-w-[82%] rounded-2xl px-3 py-2 text-[0.62rem] leading-relaxed ${
              m.from === "me" ? "ml-auto rounded-br-md" : "rounded-bl-md"
            }`}
            style={
              m.from === "me"
                ? { background: accent, color: onAccent }
                : { background: card, border: `1px solid ${cardBorder}` }
            }
          >
            {m.text}
          </motion.div>
        ))}
        {typing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex w-14 items-center justify-center gap-1 rounded-2xl rounded-bl-md px-3 py-2.5"
            style={{ background: card, border: `1px solid ${cardBorder}` }}
            aria-label={`${doc.name} is typing`}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: inkSoft }}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </motion.div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 pb-3">
        {options.length > 0 ? (
          options.map((o) => (
            <button
              key={o}
              onClick={() => send(o)}
              className="rounded-full px-3 py-1.5 text-[0.58rem] font-bold transition-transform active:scale-95"
              style={{ border: `1.5px solid ${accent}`, color: accent }}
            >
              {o}
            </button>
          ))
        ) : (
          <p className="w-full pb-1 text-center text-[0.55rem]" style={{ color: inkSoft }}>
            ♥ this is your patients&apos; experience, every day
          </p>
        )}
      </div>
    </motion.div>
  );
}
