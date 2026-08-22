"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsDesktop } from "@/lib/axismedia/useIsDesktop";
import { EcgCanvas } from "./EcgCanvas";

/* ── decorative micro-visuals, one per service ─────────────────────────── */

function BrandingVisual() {
  return (
    <div aria-hidden="true" className="relative flex h-full items-center justify-center">
      <div className="relative h-36 w-36">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="absolute h-14 w-14 bg-[var(--axm-accent)]"
            style={{
              left: i % 2 === 0 ? 0 : "auto",
              right: i % 2 === 1 ? 0 : "auto",
              top: i < 2 ? 0 : "auto",
              bottom: i >= 2 ? 0 : "auto",
              opacity: 0.9 - i * 0.15,
            }}
            animate={{
              borderRadius: ["12%", "50%", "12%", "40% 10% 40% 10%", "12%"],
              rotate: [0, 90, 90, 180, 180],
              scale: [1, 0.85, 1, 0.9, 1],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
          />
        ))}
        {/* the negative-space cross between the four squares */}
        <span className="absolute left-1/2 top-0 h-full w-2 -translate-x-1/2 bg-[var(--axm-bg-2)]" />
        <span className="absolute left-0 top-1/2 h-2 w-full -translate-y-1/2 bg-[var(--axm-bg-2)]" />
      </div>
      <div className="absolute bottom-4 flex gap-2">
        {["#b3a6ec", "#cfc6f7", "#f2effc", "#5e5a88"].map((c) => (
          <span key={c} className="h-3 w-8 rounded-sm" style={{ background: c, opacity: 0.85 }} />
        ))}
      </div>
    </div>
  );
}

function WebVisual() {
  return (
    <div aria-hidden="true" className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-[280px] overflow-hidden rounded-lg border border-[var(--axm-line-2)] bg-[var(--axm-bg)]">
        <div className="flex items-center gap-1.5 border-b border-[var(--axm-line)] px-3 py-2">
          {["var(--axm-coral)", "#f5c04e", "var(--axm-accent)"].map((c) => (
            <span key={c} className="h-2 w-2 rounded-full" style={{ background: c, opacity: 0.8 }} />
          ))}
          <span className="axm-mono ml-2 !text-[0.5rem] !tracking-[0.12em]">yourclinic.ae</span>
        </div>
        <div className="space-y-2.5 p-4">
          <div className="h-3 w-3/4 rounded bg-[var(--axm-elevated)]" />
          <div className="h-3 w-1/2 rounded bg-[var(--axm-elevated)]" />
          <div className="h-10">
            <EcgCanvas className="h-full w-full" beatsPerSweep={3} lineWidth={1.5} amplitude={0.3} />
          </div>
          <motion.div
            className="inline-block rounded-full bg-[var(--axm-accent)] px-4 py-1.5 text-[0.55rem] font-bold uppercase tracking-widest text-[#12082C]"
            animate={{ scale: [1, 1, 0.92, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, times: [0, 0.8, 0.86, 1] }}
          >
            Book now
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function AppVisual() {
  return (
    <div aria-hidden="true" className="flex h-full items-center justify-center p-6">
      <div className="relative h-56 w-32 rounded-[1.4rem] border border-[var(--axm-line-2)] bg-[var(--axm-bg)] p-2.5">
        <span className="absolute left-1/2 top-1.5 h-1 w-8 -translate-x-1/2 rounded-full bg-[var(--axm-elevated)]" />
        <motion.div
          className="mt-4 rounded-lg border border-[var(--axm-line-2)] bg-[var(--axm-surface)] p-2"
          animate={{ y: [-6, 0, 0, -6], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.12, 0.85, 1] }}
        >
          <p className="axm-mono !text-[0.45rem] !tracking-[0.1em] !text-[var(--axm-accent)]">
            ♥ reminder
          </p>
          <p className="mt-1 text-[0.55rem] leading-snug text-[var(--axm-muted)]">
            Dr. Sara — checkup today, 4:30 PM
          </p>
        </motion.div>
        <div className="mt-2 space-y-1.5">
          <div className="h-2 w-4/5 rounded bg-[var(--axm-elevated)]" />
          <div className="h-2 w-3/5 rounded bg-[var(--axm-elevated)]" />
        </div>
        <div className="absolute inset-x-4 bottom-3 flex justify-between">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: i === 0 ? "var(--axm-accent)" : "var(--axm-elevated)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MarketingVisual() {
  const bars = [34, 52, 44, 66, 58, 82, 96];
  return (
    <div aria-hidden="true" className="flex h-full items-end justify-center gap-2.5 p-8 pb-12">
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-6 rounded-t-sm bg-[var(--axm-accent)]"
          style={{ opacity: 0.35 + (i / bars.length) * 0.65 }}
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}

/* ── content ───────────────────────────────────────────────────────────── */

const SERVICES = [
  {
    num: "01",
    title: "Branding",
    tag: "Identity with a heartbeat",
    copy: "Naming, visual identity and brand systems that make a clinic feel like a destination and a med-tech company feel inevitable. Built on patient psychology, not design trends.",
    items: ["Brand strategy & naming", "Visual identity systems", "Medical iconography", "Bilingual EN/AR guidelines"],
    Visual: BrandingVisual,
  },
  {
    num: "02",
    title: "Websites",
    tag: "Digital front doors, not waiting rooms",
    copy: "Fast, beautiful, conversion-engineered websites where patients book before they blink. Accessible, multilingual, and built to satisfy the strictest healthcare compliance.",
    items: ["Patient-first UX", "Booking & telehealth flows", "Arabic / English builds", "SEO-ready architecture"],
    Visual: WebVisual,
  },
  {
    num: "03",
    title: "Applications",
    tag: "Care that lives in the pocket",
    copy: "Patient portals, booking apps, clinician tools and connected-device companions — designed for people who are stressed, busy or unwell, and engineered to clinical standards.",
    items: ["Patient & clinician apps", "Portals & dashboards", "Wearable integrations", "HIPAA-grade practices"],
    Visual: AppVisual,
  },
  {
    num: "04",
    title: "Marketing",
    tag: "Growth, prescribed",
    copy: "Full-funnel campaigns tuned to healthcare advertising regulations in the UAE and beyond. We fill appointment books, launch devices, and make specialists famous.",
    items: ["Performance campaigns", "Medical content & social", "Physician branding", "Launch & GTM strategy"],
    Visual: MarketingVisual,
  },
];

function ServiceCard({ s }: { s: (typeof SERVICES)[number] }) {
  return (
    <article className="grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-2xl border border-[var(--axm-line-2)] bg-[var(--axm-surface)] lg:grid-cols-2 lg:grid-rows-1">
      <div className="flex flex-col justify-between gap-6 p-7 lg:p-9">
        <div>
          <p className="axm-mono flex items-center justify-between">
            <span>Rx {s.num} / 04</span>
            <span className="text-[var(--axm-accent)]">✚</span>
          </p>
          <h3 className="axm-display mt-6 text-[clamp(1.8rem,2.6vw,2.6rem)] uppercase">{s.title}</h3>
          <p className="mt-2 font-medium text-[var(--axm-accent)]">{s.tag}</p>
          <p className="mt-5 max-w-md leading-relaxed text-[var(--axm-muted)]">{s.copy}</p>
        </div>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          {s.items.map((it) => (
            <li key={it} className="flex items-center gap-2 text-sm text-[var(--axm-text)]">
              <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--axm-accent)]" aria-hidden="true" />
              {it}
            </li>
          ))}
        </ul>
      </div>
      <div className="axm-grid-bg min-h-[260px] border-t border-[var(--axm-line)] bg-[var(--axm-bg-2)] lg:border-l lg:border-t-0">
        <s.Visual />
      </div>
    </article>
  );
}

/**
 * "The treatment plan" — on desktop a sticky horizontal scroll through the
 * four prescriptions; on touch/small screens a vertical stack.
 */
export function ServicesSection() {
  const isDesktop = useIsDesktop();
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.04, 0.96], [0, -shift]);
  const lineScale = useTransform(scrollYProgress, [0.04, 0.96], [0, 1]);

  useLayoutEffect(() => {
    if (!isDesktop) return;
    function measure() {
      const track = trackRef.current;
      if (!track) return;
      setShift(Math.max(0, track.scrollWidth - window.innerWidth));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isDesktop]);

  const header = (
    <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8">
      <p className="axm-mono mb-4">/ 02 — the treatment plan</p>
      <h2 className="axm-display max-w-4xl text-[clamp(1.9rem,3.4vw,3.2rem)] uppercase">
        Four prescriptions.{" "}
        <span className="text-[var(--axm-accent)]">One healthy brand.</span>
      </h2>
    </div>
  );

  if (!isDesktop) {
    return (
      <section id="treatment" className="axm-frame relative py-20">
        <span className="axm-tick axm-tick-tl" aria-hidden="true" />
        <span className="axm-tick axm-tick-tr" aria-hidden="true" />
        {header}
        <div className="mx-auto mt-10 flex max-w-[1500px] flex-col gap-6 px-5 sm:px-8">
          {SERVICES.map((s) => (
            <ServiceCard key={s.num} s={s} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="treatment" className="axm-frame relative h-[420vh]">
      <span className="axm-tick axm-tick-tl" aria-hidden="true" />
      <span className="axm-tick axm-tick-tr" aria-hidden="true" />

      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-20">
        <div className="mb-8">{header}</div>

        <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-8 pl-[max(1.25rem,calc((100vw-1500px)/2+2rem))] pr-[8vw]">
          {SERVICES.map((s) => (
            <div key={s.num} className="h-[62vh] min-h-[500px] w-[min(72vw,1060px)] shrink-0">
              <ServiceCard s={s} />
            </div>
          ))}
        </motion.div>

        {/* syringe-style progress line */}
        <div className="mx-auto mt-7 flex w-full max-w-[1500px] items-center gap-4 px-5 sm:px-8">
          <span className="axm-mono !text-[0.55rem]">01</span>
          <div className="h-px flex-1 bg-[var(--axm-line)]">
            <motion.div
              style={{ scaleX: lineScale }}
              className="h-full w-full origin-left bg-[var(--axm-accent)]"
            />
          </div>
          <span className="axm-mono !text-[0.55rem]">04</span>
        </div>
      </div>
    </section>
  );
}
