"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ACCENTS,
  BrandKit,
  FONT_PAIRS,
  FontKey,
  KitOverrides,
  SECTORS,
  SectorKey,
  VIBES,
  VibeKey,
  customizeKit,
  generateKit,
} from "@/lib/axismedia/generator";
import { Magnetic } from "../Magnetic";
import { NeuralCanvas } from "./NeuralCanvas";
import { BuildConsole } from "./BuildConsole";
import { EmblemLogo } from "./EmblemLogo";
import { PhoneDemo } from "./PhoneDemo";
import { SitePreview } from "./SitePreview";
import { StrategyCard } from "./StrategyCard";

type Phase = "intake" | "building" | "studio";
type Stage = "brand" | "website" | "app" | "growth";
const EASE = [0.22, 1, 0.36, 1] as const;

const STAGES: { key: Stage; num: string; label: string }[] = [
  { key: "brand", num: "01", label: "Brand" },
  { key: "website", num: "02", label: "Website" },
  { key: "app", num: "03", label: "App" },
  { key: "growth", num: "04", label: "Growth" },
];

function buildLines(kit: BrandKit): string[] {
  return [
    "axis studio — boot ok",
    `patient intake: ${kit.name} [${kit.sectorLabel.toLowerCase()}]`,
    "scanning the GCC market… 412 competitors mapped",
    `drawing emblem — ${kit.sector} construction ✓`,
    "composing website ✓ compiling app ✓",
    "designing campaign ✓ prescribing growth ✓",
    "handing you the controls…",
  ];
}

/**
 * The Studio — the heart of the site. Name it, then walk your brand through
 * four full-stage experiences (brand / website / app / growth), reshaping it
 * live with the vibe, color and type controls. The logo is never picked:
 * it is generated, sector by sector.
 */
export function EngineSection() {
  const [phase, setPhase] = useState<Phase>("intake");
  const [stage, setStage] = useState<Stage>("brand");
  const [name, setName] = useState("");
  const [sector, setSector] = useState<SectorKey>("clinic");
  const [vibe, setVibe] = useState<VibeKey>("premium");
  const [overrides, setOverrides] = useState<KitOverrides>({});

  const kit = useMemo(
    () => customizeKit(generateKit(name, sector, vibe), overrides),
    [name, sector, vibe, overrides]
  );

  function set<K extends keyof KitOverrides>(key: K, value: KitOverrides[K]) {
    setOverrides((o) => ({ ...o, [key]: o[key] === value ? undefined : value }));
  }

  const chip = (active: boolean) =>
    ({
      borderColor: active ? "var(--axm-accent)" : "var(--axm-line-2)",
      background: active ? "rgba(179,166,236,0.12)" : "transparent",
      color: active ? "var(--axm-text)" : "var(--axm-muted)",
    }) as const;

  const stageIndex = STAGES.findIndex((s) => s.key === stage);

  return (
    <section id="studio" className="axm-frame relative overflow-hidden py-20 lg:py-24">
      <span className="axm-tick axm-tick-tl" aria-hidden="true" />
      <span className="axm-tick axm-tick-tr" aria-hidden="true" />

      <NeuralCanvas
        className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-1000 ${
          phase === "building" ? "opacity-60" : "opacity-[0.12]"
        }`}
      />

      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="axm-mono mb-4">/ 01 — the studio · create yours</p>
          <h2 className="axm-display text-[clamp(2.4rem,5.5vw,4.8rem)] uppercase">
            Your brand, <span className="text-[var(--axm-accent)]">built live</span>
          </h2>
        </div>

        <div className="relative mx-auto mt-10 min-h-[440px]">
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
                  setStage("brand");
                  setPhase("building");
                }}
                className="mx-auto max-w-2xl rounded-2xl border border-[var(--axm-line-2)] bg-[rgba(10,6,24,0.7)] p-6 backdrop-blur-md sm:p-9"
              >
                <label className="axm-mono !text-[0.58rem]" htmlFor="axm-name">
                  01 · name it
                </label>
                <input
                  id="axm-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nova Health"
                  maxLength={26}
                  autoComplete="off"
                  className="mt-2 w-full border-b-2 border-[var(--axm-line-2)] bg-transparent pb-2 font-[family-name:var(--axm-body)] text-2xl font-bold text-[var(--axm-text)] outline-none transition-colors placeholder:text-[var(--axm-faint)] focus:border-[var(--axm-accent)] sm:text-3xl"
                />

                <p className="axm-mono mt-7 !text-[0.58rem]">02 · your world</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SECTORS.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setSector(s.key)}
                      className="rounded-full border px-4 py-2 text-xs font-medium transition-all"
                      style={chip(sector === s.key)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="mt-9 text-center">
                  <Magnetic strength={22}>
                    <button type="submit" className="axm-btn axm-btn-solid !px-9 !py-4">
                      ⚡ Build it
                    </button>
                  </Magnetic>
                </div>
              </motion.form>
            )}

            {phase === "building" && (
              <motion.div
                key="building"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="flex min-h-[440px] items-center justify-center"
              >
                <BuildConsole lines={buildLines(kit)} onDone={() => setPhase("studio")} />
              </motion.div>
            )}

            {phase === "studio" && (
              <motion.div
                key="studio"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                {/* header + live controls */}
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <h3 className="axm-display text-[clamp(1.7rem,3.4vw,2.8rem)] uppercase">
                    {kit.name} <span className="text-[var(--axm-accent)]">— live</span>
                  </h3>
                  <button
                    onClick={() => {
                      setOverrides({});
                      setName("");
                      setPhase("intake");
                    }}
                    className="axm-mono !text-[0.55rem] underline decoration-[var(--axm-line-2)] underline-offset-4 transition-colors hover:!text-[var(--axm-accent)]"
                  >
                    start over
                  </button>
                </div>

                <div className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl border border-[var(--axm-line-2)] bg-[rgba(10,6,24,0.7)] px-5 py-4 backdrop-blur-md">
                  <div className="flex items-center gap-2.5">
                    <span className="axm-mono !text-[0.52rem]">vibe</span>
                    {VIBES.map((v) => (
                      <button
                        key={v.key}
                        onClick={() => setVibe(v.key)}
                        aria-label={`Vibe ${v.label}`}
                        title={v.label}
                        className="h-6 w-6 rounded-full border-2 transition-transform hover:scale-110"
                        style={{
                          background: v.swatch,
                          borderColor: vibe === v.key ? "var(--axm-text)" : "transparent",
                          opacity: vibe === v.key ? 1 : 0.55,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="axm-mono !text-[0.52rem]">color</span>
                    {ACCENTS.map((a) => {
                      const active = overrides.accent === a.hex;
                      return (
                        <button
                          key={a.key}
                          onClick={() => set("accent", a.hex)}
                          aria-label={`Accent color ${a.key}`}
                          className="h-6 w-6 rounded-md border-2 transition-transform hover:scale-110"
                          style={{
                            background: a.hex,
                            borderColor: active ? "var(--axm-text)" : "transparent",
                            boxShadow: active ? `0 0 14px ${a.hex}` : "none",
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="axm-mono !text-[0.52rem]">type</span>
                    {FONT_PAIRS.map((f) => (
                      <button
                        key={f.key}
                        onClick={() => set("font", f.key as FontKey)}
                        className="rounded-full border px-3 py-1.5 text-[0.62rem] transition-all"
                        style={{ ...chip(kit.fontKey === f.key), fontFamily: f.display }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* stage tabs — each deliverable is its own experience */}
                <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {STAGES.map((s) => {
                    const active = stage === s.key;
                    return (
                      <button
                        key={s.key}
                        onClick={() => setStage(s.key)}
                        className="group relative overflow-hidden rounded-xl border px-4 py-3 text-left transition-all duration-300"
                        style={{
                          borderColor: active ? "var(--axm-accent)" : "var(--axm-line-2)",
                          background: active ? "rgba(179,166,236,0.1)" : "var(--axm-surface)",
                        }}
                      >
                        <span
                          className="axm-display block text-2xl"
                          style={{ color: active ? "var(--axm-accent)" : "var(--axm-faint)" }}
                        >
                          {s.num}
                        </span>
                        <span
                          className="axm-mono !text-[0.58rem]"
                          style={{ color: active ? "var(--axm-text)" : "var(--axm-muted)" }}
                        >
                          {s.label}
                        </span>
                        {active && (
                          <motion.span
                            layoutId="axm-stage-glow"
                            className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--axm-accent)]"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* the stage itself */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    {stage === "brand" && (
                      <div className="axm-grid-bg overflow-hidden rounded-xl border border-[var(--axm-line-2)] bg-[var(--axm-surface)]">
                        <div className="grid gap-8 p-7 lg:grid-cols-[auto_1fr] lg:gap-14 lg:p-12">
                          <div className="flex items-center justify-center">
                            <motion.div
                              key={`${kit.sector}-${kit.accent}`}
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.6, ease: EASE }}
                            >
                              <EmblemLogo kit={kit} size={220} />
                            </motion.div>
                          </div>
                          <div className="min-w-0">
                            <p className="axm-mono !text-[0.55rem]">generated emblem — {kit.sector} construction</p>
                            <p
                              className="mt-3 break-words text-[clamp(2rem,4.5vw,3.8rem)] uppercase leading-[0.95] text-[var(--axm-text)]"
                              style={{ fontFamily: kit.displayFamily }}
                            >
                              {kit.name}
                            </p>
                            <p className="mt-2 text-lg italic text-[var(--axm-muted)]">“{kit.tagline}”</p>

                            <div className="mt-7 flex max-w-md overflow-hidden rounded-lg border border-[var(--axm-line)]">
                              {[kit.accent, kit.accentSoft, kit.paper, kit.ink].map((c, i) => (
                                <div key={`${c}-${i}`} className="flex-1">
                                  <div className="h-12" style={{ background: c }} />
                                  <p className="axm-mono bg-[var(--axm-bg-2)] px-1.5 py-1 text-center !text-[0.42rem]">
                                    {c.toUpperCase()}
                                  </p>
                                </div>
                              ))}
                            </div>

                            <div className="mt-6 flex flex-wrap items-baseline gap-x-8 gap-y-2">
                              <span className="text-4xl text-[var(--axm-text)]" style={{ fontFamily: kit.displayFamily }}>
                                Aa
                              </span>
                              <span className="font-[family-name:var(--axm-body)] text-2xl text-[var(--axm-muted)]">Aa</span>
                              <span className="axm-mono !text-[0.55rem]">
                                {kit.fontKey === "modern" ? "Anton" : kit.fontKey === "editorial" ? "Space Grotesk" : "IBM Plex Mono"}{" "}
                                / Space Grotesk
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {stage === "website" && (
                      <div className="mx-auto max-w-4xl">
                        <SitePreview kit={kit} />
                      </div>
                    )}

                    {stage === "app" && (
                      <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">
                        <div className="hidden space-y-10 text-right lg:block">
                          <div>
                            <p className="axm-mono !text-[0.55rem] text-[var(--axm-accent)]">booking</p>
                            <p className="mt-1 text-sm text-[var(--axm-muted)]">doctor → slot → confirmed, in three taps</p>
                          </div>
                          <div>
                            <p className="axm-mono !text-[0.55rem] text-[var(--axm-accent)]">vitals</p>
                            <p className="mt-1 text-sm text-[var(--axm-muted)]">live readouts patients check daily</p>
                          </div>
                        </div>
                        <PhoneDemo kit={kit} />
                        <div className="hidden space-y-10 lg:block">
                          <div>
                            <p className="axm-mono !text-[0.55rem] text-[var(--axm-accent)]">chat</p>
                            <p className="mt-1 text-sm text-[var(--axm-muted)]">a doctor who answers — try it</p>
                          </div>
                          <div>
                            <p className="axm-mono !text-[0.55rem] text-[var(--axm-accent)]">your brand</p>
                            <p className="mt-1 text-sm text-[var(--axm-muted)]">every pixel follows the controls above</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {stage === "growth" && <StrategyCard kit={kit} />}
                  </motion.div>
                </AnimatePresence>

                {/* stage advance + closing CTA */}
                <div className="mt-9 flex flex-col items-center gap-5">
                  {stageIndex < STAGES.length - 1 ? (
                    <button
                      onClick={() => setStage(STAGES[stageIndex + 1].key)}
                      className="axm-btn axm-btn-ghost"
                    >
                      next: {STAGES[stageIndex + 1].num} {STAGES[stageIndex + 1].label} →
                    </button>
                  ) : (
                    <>
                      <p className="axm-mono !text-[0.6rem]">
                        30 seconds, your hands. <span className="text-[var(--axm-accent)]">30 days, ours.</span>
                      </p>
                      <Magnetic strength={22}>
                        <a href="#contact" className="axm-btn axm-btn-solid">
                          Build {kit.name} for real →
                        </a>
                      </Magnetic>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
