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
import { MonogramLogo } from "./MonogramLogo";
import { PhoneDemo } from "./PhoneDemo";
import { SitePreview } from "./SitePreview";
import { StrategyCard } from "./StrategyCard";

type Phase = "intake" | "building" | "studio";
const EASE = [0.22, 1, 0.36, 1] as const;

function buildLines(kit: BrandKit): string[] {
  return [
    "axis studio — boot ok",
    `patient intake: ${kit.name} [${kit.sectorLabel.toLowerCase()}]`,
    "scanning the GCC market… 412 competitors mapped",
    `generating identity — ${kit.vibeLabel.toLowerCase()} ✓`,
    "composing website ✓ compiling app ✓",
    "designing campaign ✓ prescribing growth ✓",
    "handing you the controls…",
  ];
}

function ControlLabel({ children }: { children: React.ReactNode }) {
  return <p className="axm-mono !text-[0.52rem]">{children}</p>;
}

/**
 * The Studio — the heart of the site. Visitors name their brand, then hold
 * the controls: vibe, color, logo mark, typography — and watch the identity,
 * website, live app and campaign redraw instantly with every choice.
 */
export function EngineSection() {
  const [phase, setPhase] = useState<Phase>("intake");
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
          <h2 className="axm-display text-[clamp(2.2rem,5vw,4.2rem)] uppercase">
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
                {/* header */}
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                  <h3 className="axm-display text-[clamp(1.5rem,3vw,2.4rem)] uppercase">
                    {kit.name} <span className="text-[var(--axm-accent)]">— live</span>
                  </h3>
                  <button
                    onClick={() => {
                      setOverrides({});
                      setPhase("intake");
                    }}
                    className="axm-mono !text-[0.55rem] underline decoration-[var(--axm-line-2)] underline-offset-4 transition-colors hover:!text-[var(--axm-accent)]"
                  >
                    start over
                  </button>
                </div>

                {/* THE CONTROLS — everything redraws instantly */}
                <div className="mb-8 grid gap-x-8 gap-y-5 rounded-2xl border border-[var(--axm-line-2)] bg-[rgba(10,6,24,0.7)] p-5 backdrop-blur-md sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <ControlLabel>vibe</ControlLabel>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {VIBES.map((v) => (
                        <button
                          key={v.key}
                          onClick={() => setVibe(v.key)}
                          className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.62rem] font-medium transition-all"
                          style={chip(vibe === v.key)}
                        >
                          <span className="h-2 w-2 rounded-full" style={{ background: v.swatch }} />
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <ControlLabel>color</ControlLabel>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      {ACCENTS.map((a) => {
                        const active = overrides.accent === a.hex;
                        return (
                          <button
                            key={a.key}
                            onClick={() => set("accent", a.hex)}
                            aria-label={`Accent color ${a.key}`}
                            className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
                            style={{
                              background: a.hex,
                              borderColor: active ? "var(--axm-text)" : "transparent",
                              boxShadow: active ? `0 0 14px ${a.hex}` : "none",
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <ControlLabel>logo mark</ControlLabel>
                    <div className="mt-2.5 flex gap-1.5">
                      {[0, 1, 2, 3].map((m) => {
                        const active = kit.monogramVariant === m;
                        return (
                          <button
                            key={m}
                            onClick={() => set("mark", m)}
                            aria-label={`Logo mark style ${m + 1}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border transition-all"
                            style={chip(active)}
                          >
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                              {m === 0 && <circle cx="12" cy="12" r="8" strokeDasharray="2 2.4" />}
                              {m === 1 && (
                                <>
                                  <circle cx="12" cy="12" r="8" strokeDasharray="10 6" />
                                  <circle cx="12" cy="12" r="4.5" strokeDasharray="6 4" />
                                </>
                              )}
                              {m === 2 && <rect x="4" y="4" width="16" height="16" rx="5" />}
                              {m === 3 && <polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" />}
                            </svg>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <ControlLabel>type</ControlLabel>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
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
                </div>

                {/* THE OUTPUTS */}
                <div className="grid gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <div className="h-full overflow-hidden rounded-xl border border-[var(--axm-line-2)] bg-[var(--axm-surface)]">
                      <div className="flex items-center justify-between border-b border-[var(--axm-line)] px-5 py-3">
                        <span className="axm-mono !text-[0.55rem]">identity</span>
                        <span className="text-[var(--axm-accent)]">✚</span>
                      </div>
                      <div className="flex flex-col items-center p-6">
                        <MonogramLogo kit={kit} size={132} />
                        <p className="mt-4 text-xl font-bold text-[var(--axm-text)]" style={{ fontFamily: kit.displayFamily }}>
                          {kit.name}
                        </p>
                        <p className="mt-1 text-center text-xs italic text-[var(--axm-muted)]">
                          “{kit.tagline}”
                        </p>
                        <div className="mt-5 flex gap-1.5">
                          {[kit.accent, kit.accentSoft, kit.paper, kit.ink].map((c, i) => (
                            <motion.span
                              key={`${c}-${i}`}
                              layout
                              className="h-7 w-10 rounded-md border border-[var(--axm-line)]"
                              style={{ background: c }}
                              title={c}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-8">
                    <SitePreview kit={kit} />
                  </div>

                  <div className="lg:col-span-5">
                    <div className="flex h-full flex-col justify-center rounded-xl border border-[var(--axm-line-2)] bg-[var(--axm-surface)] p-5">
                      <PhoneDemo kit={kit} />
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <StrategyCard kit={kit} />
                  </div>
                </div>

                {/* closing pitch — short */}
                <div className="mt-10 text-center">
                  <p className="axm-mono !text-[0.6rem]">
                    30 seconds, your hands. <span className="text-[var(--axm-accent)]">30 days, ours.</span>
                  </p>
                  <div className="mt-5">
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
