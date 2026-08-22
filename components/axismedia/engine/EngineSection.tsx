"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BrandKit,
  SECTORS,
  SectorKey,
  VIBES,
  VibeKey,
  generateKit,
} from "@/lib/axismedia/generator";
import { Magnetic } from "../Magnetic";
import { NeuralCanvas } from "./NeuralCanvas";
import { BuildConsole } from "./BuildConsole";
import { MonogramLogo } from "./MonogramLogo";
import { PhoneDemo } from "./PhoneDemo";
import { SitePreview } from "./SitePreview";
import { StrategyCard } from "./StrategyCard";

type Phase = "intake" | "building" | "reveal";
const EASE = [0.22, 1, 0.36, 1] as const;

function buildLines(kit: BrandKit): string[] {
  return [
    "axis engine v2.1 — boot ok",
    `patient intake: ${kit.name} [${kit.sectorLabel.toLowerCase()}]`,
    "scanning the GCC market… 412 competitors mapped",
    "diagnosis: strong medicine, invisible brand",
    `generating identity — ${kit.vibeLabel.toLowerCase()} direction ✓`,
    "composing website — bilingual, booking-first ✓",
    "compiling patient app — iOS / Android ✓",
    "prescribing 12-week growth plan ✓",
    "vitals stable. preparing reveal…",
  ];
}

/**
 * The Axis Engine — the visitor types their name, picks a sector and a vibe,
 * and watches a brand, website, live app and marketing plan get "generated"
 * before their eyes. The pitch: this is the 30-second sketch; the studio
 * builds the real thing.
 */
export function EngineSection() {
  const [phase, setPhase] = useState<Phase>("intake");
  const [name, setName] = useState("");
  const [sector, setSector] = useState<SectorKey>("clinic");
  const [vibe, setVibe] = useState<VibeKey>("premium");
  const [kit, setKit] = useState<BrandKit | null>(null);

  function generate(v: VibeKey = vibe) {
    setKit(generateKit(name, sector, v));
    setPhase("building");
  }

  return (
    <section id="engine" className="axm-frame relative overflow-hidden py-20 lg:py-28">
      <span className="axm-tick axm-tick-tl" aria-hidden="true" />
      <span className="axm-tick axm-tick-tr" aria-hidden="true" />

      {/* thinking texture */}
      <NeuralCanvas
        className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-1000 ${
          phase === "building" ? "opacity-60" : "opacity-[0.14]"
        }`}
      />

      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="axm-mono mb-4">/ 03 — the axis engine · live demo</p>
          <h2 className="axm-display text-[clamp(2.2rem,5vw,4.2rem)] uppercase">
            Watch us build <span className="text-[var(--axm-accent)]">your brand</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[var(--axm-muted)]">
            Type your name, pick your world, and the Engine sketches your identity, website,
            patient app and growth plan — live, in seconds. No email. No sales call. Just proof.
          </p>
        </div>

        <div className="relative mx-auto mt-12 min-h-[440px] max-w-5xl">
          <AnimatePresence mode="wait">
            {phase === "intake" && (
              <motion.form
                key="intake"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.5, ease: EASE }}
                onSubmit={(e) => {
                  e.preventDefault();
                  generate();
                }}
                className="mx-auto max-w-2xl rounded-2xl border border-[var(--axm-line-2)] bg-[rgba(10,6,24,0.7)] p-6 backdrop-blur-md sm:p-9"
              >
                <label className="axm-mono !text-[0.58rem]" htmlFor="axm-name">
                  01 · your clinic / company name
                </label>
                <input
                  id="axm-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nova Health"
                  maxLength={26}
                  autoComplete="off"
                  className="mt-2 w-full border-b-2 border-[var(--axm-line-2)] bg-transparent pb-2 font-[family-name:var(--axm-display)] text-2xl font-bold text-[var(--axm-text)] outline-none transition-colors placeholder:text-[var(--axm-faint)] focus:border-[var(--axm-accent)] sm:text-3xl"
                />

                <p className="axm-mono mt-7 !text-[0.58rem]">02 · your world</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SECTORS.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setSector(s.key)}
                      className="rounded-full border px-4 py-2 text-xs font-medium transition-all"
                      style={{
                        borderColor: sector === s.key ? "var(--axm-accent)" : "var(--axm-line-2)",
                        background: sector === s.key ? "rgba(179,166,236,0.12)" : "transparent",
                        color: sector === s.key ? "var(--axm-accent)" : "var(--axm-muted)",
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <p className="axm-mono mt-7 !text-[0.58rem]">03 · your vibe</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {VIBES.map((v) => (
                    <button
                      key={v.key}
                      type="button"
                      onClick={() => setVibe(v.key)}
                      className="flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all"
                      style={{
                        borderColor: vibe === v.key ? "var(--axm-accent)" : "var(--axm-line-2)",
                        background: vibe === v.key ? "rgba(179,166,236,0.12)" : "transparent",
                        color: vibe === v.key ? "var(--axm-text)" : "var(--axm-muted)",
                      }}
                    >
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: v.swatch }} />
                      {v.label}
                    </button>
                  ))}
                </div>

                <div className="mt-9 text-center">
                  <Magnetic strength={22}>
                    <button type="submit" className="axm-btn axm-btn-solid !px-9 !py-4">
                      ⚡ Generate my brand
                    </button>
                  </Magnetic>
                  <p className="axm-mono mt-4 !text-[0.5rem] !normal-case !tracking-[0.08em]">
                    a 30-second sketch, generated on your device — the real thing takes us 30 days
                  </p>
                </div>
              </motion.form>
            )}

            {phase === "building" && kit && (
              <motion.div
                key="building"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="flex min-h-[440px] items-center justify-center"
              >
                <BuildConsole lines={buildLines(kit)} onDone={() => setPhase("reveal")} />
              </motion.div>
            )}

            {phase === "reveal" && kit && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                {/* reveal header */}
                <div className="mb-10 text-center">
                  <p className="axm-mono !text-[0.58rem] text-[var(--axm-accent)]">
                    ✓ generated in 28.4s — patient: {kit.name}
                  </p>
                  <h3 className="axm-display mt-3 text-[clamp(1.8rem,3.6vw,3rem)] uppercase">
                    {kit.name}, <span className="text-[var(--axm-accent)]">alive.</span>
                  </h3>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    {VIBES.map((v) => (
                      <button
                        key={v.key}
                        onClick={() => generate(v.key)}
                        className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.62rem] transition-all"
                        style={{
                          borderColor: kit.vibe === v.key ? "var(--axm-accent)" : "var(--axm-line-2)",
                          color: kit.vibe === v.key ? "var(--axm-accent)" : "var(--axm-muted)",
                        }}
                      >
                        <span className="h-2 w-2 rounded-full" style={{ background: v.swatch }} />
                        {v.label}
                      </button>
                    ))}
                    <button
                      onClick={() => setPhase("intake")}
                      className="axm-mono !text-[0.55rem] underline decoration-[var(--axm-line-2)] underline-offset-4 transition-colors hover:!text-[var(--axm-accent)]"
                    >
                      start over
                    </button>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-12">
                  {/* identity */}
                  <div className="lg:col-span-4">
                    <div className="h-full overflow-hidden rounded-xl border border-[var(--axm-line-2)] bg-[var(--axm-surface)]">
                      <div className="flex items-center justify-between border-b border-[var(--axm-line)] px-5 py-3">
                        <span className="axm-mono !text-[0.55rem]">identity system</span>
                        <span className="text-[var(--axm-accent)]">✚</span>
                      </div>
                      <div className="flex flex-col items-center p-6">
                        <MonogramLogo kit={kit} size={132} />
                        <p className="mt-4 font-[family-name:var(--axm-display)] text-xl font-bold text-[var(--axm-text)]">
                          {kit.name}
                        </p>
                        <p className="mt-1 text-center text-xs italic text-[var(--axm-muted)]">
                          “{kit.tagline}”
                        </p>
                        <div className="mt-5 flex gap-1.5">
                          {[kit.accent, kit.accentSoft, kit.paper, kit.ink].map((c) => (
                            <span
                              key={c}
                              className="h-7 w-10 rounded-md border border-[var(--axm-line)]"
                              style={{ background: c }}
                              title={c}
                            />
                          ))}
                        </div>
                        <div className="mt-5 w-full border-t border-[var(--axm-line)] pt-4 text-center">
                          <p className="axm-mono !text-[0.5rem]">type pairing</p>
                          <p className="mt-1 font-[family-name:var(--axm-display)] text-sm font-bold text-[var(--axm-text)]">
                            Syne <span className="font-[family-name:var(--axm-body)] font-normal text-[var(--axm-muted)]">/ Space Grotesk</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* website */}
                  <div className="lg:col-span-8">
                    <SitePreview kit={kit} />
                  </div>

                  {/* app */}
                  <div className="lg:col-span-5">
                    <div className="flex h-full flex-col justify-center rounded-xl border border-[var(--axm-line-2)] bg-[var(--axm-surface)] p-6">
                      <PhoneDemo kit={kit} />
                    </div>
                  </div>

                  {/* strategy */}
                  <div className="lg:col-span-7">
                    <StrategyCard kit={kit} />
                  </div>
                </div>

                {/* closing pitch */}
                <div className="mt-12 text-center">
                  <p className="mx-auto max-w-xl text-sm leading-relaxed text-[var(--axm-muted)]">
                    This sketch took <span className="text-[var(--axm-accent)]">30 seconds</span>
                    {" and it's already tappable."} Now imagine what our specialists do with{" "}
                    <span className="text-[var(--axm-accent)]">30 days</span> — research, strategy,
                    craft and compliance included.
                  </p>
                  <div className="mt-6">
                    <Magnetic strength={22}>
                      <a href="#contact" className="axm-btn axm-btn-solid">
                        Build {kit.name} for real →
                      </a>
                    </Magnetic>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
