"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { GraduationCap, CalendarDays, Video, Handshake } from "lucide-react";

const WORDS = "AxisMed helps healthcare organizations, scientific societies, and medical technology companies design, manage, and deliver impactful educational and scientific initiatives.".split(" ");
const HIGHLIGHT = new Set(["organizations,", "societies,", "companies", "design,", "manage,", "deliver"]);

const services = [
  { icon: GraduationCap, label: "Medical Education",     sub: "Cadaveric labs · CME programs · Surgical workshops",  color: "#8880b8" },
  { icon: CalendarDays,  label: "Scientific Events",      sub: "Conferences · Symposiums · Product launches",         color: "#726da0" },
  { icon: Video,         label: "Medical Media",          sub: "Video production · Surgeon profiling · Campaigns",    color: "#8880b8" },
  { icon: Handshake,     label: "Strategic Partnerships", sub: "MedTech · Pharma · Societies · Institutions",         color: "#726da0" },
];

const TICKER = ["Medical Education","Scientific Events","Medical Media","Strategic Partnerships","Cadaveric Training","Product Launches","CME Programs","KOL Engagement","Advisory Meetings","Hands-on Workshops"];

export function WhoWeAre() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(textRef, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "start start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["72px", "0px"]);

  return (
    <motion.div ref={wrapRef} style={{ y }} className="relative z-10 -mt-12">
      <section className="section-white relative overflow-hidden rounded-t-[2.5rem] shadow-[0_-12px_48px_rgba(136,128,184,0.12)]">
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />

        {/* Faint decorative text */}
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none overflow-hidden select-none pt-6">
          <span className="font-display font-black leading-none tracking-tighter"
            style={{ fontSize: "clamp(4rem,16vw,14rem)", color: "rgba(164,158,207,0.18)" }}>
            WHO WE ARE
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-0">

          {/* Eyebrow */}
          <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-center text-purple-600 text-xs font-semibold tracking-[0.20em] uppercase mb-10">
            Who We Are
          </motion.p>

          {/* Word-by-word sentence */}
          <p ref={textRef} className="max-w-4xl mx-auto text-center font-display font-bold leading-snug mb-16"
            style={{ fontSize: "clamp(1.5rem,3.5vw,2.6rem)" }}>
            {WORDS.map((word, i) => (
              <motion.span key={i}
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.45, delay: i * 0.032, ease: [0.22,1,0.36,1] }}
                className="inline-block"
                style={{ marginRight: "0.28em", color: HIGHLIGHT.has(word) ? "#8880b8" : "#12082C" }}>
                {word}
              </motion.span>
            ))}
          </p>

          {/* 4 Service cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-0">
            {services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div key={svc.label}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22,1,0.36,1] }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative rounded-2xl p-6 overflow-hidden cursor-default transition-shadow duration-300"
                  style={{
                    background: "white",
                    border: "1px solid rgba(164,158,207,0.22)",
                    boxShadow: "0 2px 16px rgba(136,128,184,0.06)",
                  }}>

                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{ background: `radial-gradient(ellipse 80% 70% at 50% 110%, ${svc.color}12 0%, transparent 70%)` }} />

                  {/* Ghost number */}
                  <div className="absolute top-3 right-4 font-display text-6xl font-black select-none leading-none"
                    style={{ color: "rgba(164,158,207,0.28)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <motion.div whileHover={{ rotate: 8 }} transition={{ type: "spring", stiffness: 300 }}
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${svc.color}14` }}>
                    <Icon className="w-5 h-5" style={{ color: svc.color }} />
                  </motion.div>

                  <h3 className="font-display text-sm font-bold mb-1.5" style={{ color: "#2d2a52" }}>{svc.label}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#8880b8" }}>{svc.sub}</p>

                  {/* Bottom accent line */}
                  <motion.div className="absolute bottom-0 left-0 h-[2px] rounded-b-2xl"
                    style={{ background: `linear-gradient(90deg, ${svc.color} 0%, transparent 100%)` }}
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.4 + i * 0.1, ease: [0.22,1,0.36,1] }} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Scrolling ticker */}
        <div className="relative mt-14 overflow-hidden py-5 border-t border-purple-200/50">
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: "linear-gradient(90deg, #ffffff, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: "linear-gradient(-90deg, #ffffff, transparent)" }} />
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="flex gap-10 whitespace-nowrap" style={{ width: "max-content" }}>
            {[...TICKER, ...TICKER].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-3 text-xs font-medium tracking-widest uppercase"
                style={{ color: "#a49ecf" }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#bcb8df" }} />
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-300/50 to-transparent" />
      </section>
    </motion.div>
  );
}
