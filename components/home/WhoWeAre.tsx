"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { GraduationCap, CalendarDays, Video, Handshake } from "lucide-react";

const WORDS = "AxisMed helps healthcare organizations, scientific societies, and medical technology companies design, manage, and deliver impactful educational and scientific initiatives.".split(" ");

const HIGHLIGHT = new Set(["organizations,", "societies,", "companies", "design,", "manage,", "deliver"]);

const services = [
  { icon: GraduationCap, label: "Medical Education",      sub: "Cadaveric labs · CME programs · Surgical workshops",   color: "#bcb8df" },
  { icon: CalendarDays,  label: "Scientific Events",       sub: "Conferences · Symposiums · Product launches",          color: "#a49ecf" },
  { icon: Video,         label: "Medical Media",           sub: "Video production · Surgeon profiling · Campaigns",     color: "#8880b8" },
  { icon: Handshake,     label: "Strategic Partnerships",  sub: "MedTech · Pharma · Societies · Institutions",          color: "#6366F1" },
];

const TICKER = ["Medical Education", "Scientific Events", "Medical Media", "Strategic Partnerships", "Cadaveric Training", "Product Launches", "CME Programs", "KOL Engagement", "Advisory Meetings", "Hands-on Workshops"];

export function WhoWeAre() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(textRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "start start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["72px", "0px"]);

  return (
    <motion.div ref={wrapRef} style={{ y }} className="relative z-10 -mt-12">
      <section className="section-white relative overflow-hidden rounded-t-[2.5rem] shadow-[0_-12px_48px_rgba(0,0,0,0.35)]">
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/25 to-transparent" />

        {/* Huge ghost text */}
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none overflow-hidden select-none pt-8">
          <span className="font-display font-black leading-none tracking-tighter text-white/[0.025]"
            style={{ fontSize: "clamp(4rem, 16vw, 14rem)" }}>
            WHO WE ARE
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-0">

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-purple-400 text-xs font-semibold tracking-[0.20em] uppercase mb-10"
          >
            Who We Are
          </motion.p>

          {/* ── Word-by-word animated sentence ── */}
          <p
            ref={textRef}
            className="max-w-4xl mx-auto text-center font-display font-bold leading-snug mb-16"
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.6rem)" }}
          >
            {WORDS.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.45, delay: i * 0.032, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
                style={{
                  marginRight: "0.28em",
                  color: HIGHLIGHT.has(word) ? "#bcb8df" : "white",
                }}
              >
                {word}
              </motion.span>
            ))}
          </p>

          {/* ── 4 Service cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-0">
            {services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={svc.label}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -7, scale: 1.025 }}
                  className="group relative glass glow-border rounded-2xl p-6 overflow-hidden cursor-default"
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{ background: `radial-gradient(ellipse 80% 70% at 50% 110%, ${svc.color}25 0%, transparent 70%)` }}
                  />

                  {/* Ghost number */}
                  <div className="absolute top-3 right-4 font-display text-6xl font-black select-none text-white/[0.04]">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <motion.div
                    whileHover={{ rotate: 8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${svc.color}22`, boxShadow: `0 0 18px ${svc.color}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: svc.color }} />
                  </motion.div>

                  <h3 className="font-display text-sm font-bold text-white mb-1.5">{svc.label}</h3>
                  <p className="text-text-muted text-xs leading-relaxed">{svc.sub}</p>

                  {/* Bottom line that grows in */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-[2px] rounded-b-2xl"
                    style={{ background: `linear-gradient(90deg, ${svc.color} 0%, transparent 100%)` }}
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.4 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Scrolling ticker ── */}
        <div className="relative mt-14 overflow-hidden py-5 border-t border-white/[0.06]">
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: "linear-gradient(90deg, var(--bg-base, #0d0c1a), transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: "linear-gradient(-90deg, var(--bg-base, #0d0c1a), transparent)" }} />

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="flex gap-10 whitespace-nowrap"
            style={{ width: "max-content" }}
          >
            {[...TICKER, ...TICKER].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-3 text-text-muted text-xs font-medium tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500/40 shrink-0" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent" />
      </section>
    </motion.div>
  );
}
