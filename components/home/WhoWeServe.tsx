"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Pill, FlaskConical, Building2, Stethoscope, GraduationCap, ArrowRight } from "lucide-react";

const audiences = [
  {
    num: "01",
    icon: Cpu,
    title: "Medical Technology Companies",
    color: "#bcb8df",
    description:
      "MedTech companies need clinical adoption — not just awareness. We build educational ecosystems around your technology: hands-on workshops with KOLs, cadaveric training for surgeons, product launch events that create genuine clinical interest, and HCP media that documents real-world outcomes.",
    howWeHelp: [
      "Device introduction training workshops",
      "KOL identification & engagement",
      "Product launch event management",
      "Surgeon education programs",
      "Clinical content & case documentation",
    ],
  },
  {
    num: "02",
    icon: Pill,
    title: "Pharmaceutical & Healthcare Organizations",
    color: "#a49ecf",
    description:
      "From scientific advisory meetings to healthcare professional engagement campaigns, we design initiatives that connect your science with the right clinical audience — built around educational value, not promotional noise. We understand compliance and deliver programs that are credible and impactful.",
    howWeHelp: [
      "Scientific advisory meeting management",
      "HCP engagement campaigns",
      "Disease awareness programs",
      "Symposium & satellite session management",
      "Congress presence support",
    ],
  },
  {
    num: "03",
    icon: FlaskConical,
    title: "Scientific Societies",
    color: "#8880b8",
    description:
      "We partner with medical societies to bring their annual conferences, specialty meetings, and educational programs to life — taking the operational burden off their leadership while elevating the quality of the event. From abstract management to AV production, we handle every detail.",
    howWeHelp: [
      "Annual conference management",
      "Abstract submission & review platforms",
      "Faculty coordination",
      "Scientific program design",
      "Event media production",
    ],
  },
  {
    num: "04",
    icon: Building2,
    title: "Hospitals & Healthcare Institutions",
    color: "#7c6fbd",
    description:
      "Hospitals looking to build internal training capabilities, run in-house education programs, or produce content that documents their clinical work — we bring the infrastructure, faculty network, and production capabilities they don't have in-house.",
    howWeHelp: [
      "In-house training program design",
      "Staff development workshops",
      "Simulation-based education",
      "Clinical documentation & media",
      "Institutional capability building",
    ],
  },
  {
    num: "05",
    icon: Stethoscope,
    title: "Healthcare Professionals",
    color: "#6366F1",
    description:
      "Surgeons, physicians, and specialists who want to develop genuine operative skill, earn CME credit, or access the latest techniques. Our programs are built for real clinical practice — small groups, expert faculty, and the hands-on time that actually makes a difference.",
    howWeHelp: [
      "Accredited CME/CPD programs",
      "Cadaveric & simulation training",
      "Specialty masterclasses",
      "International faculty access",
      "Certificate programs",
    ],
  },
  {
    num: "06",
    icon: GraduationCap,
    title: "Academic Institutions",
    color: "#c084fc",
    description:
      "Medical schools and academic centers looking to expand their training capabilities, develop joint programs, or connect their faculty with international clinical networks. We bridge academic rigor with industry relevance — building programs that are both scientifically credible and practically valuable.",
    howWeHelp: [
      "Joint program development",
      "International faculty networks",
      "Innovative training modality integration",
      "Academic conference support",
      "Research & education collaboration",
    ],
  },
];

export function WhoWeServe() {
  const [active, setActive] = useState(0);
  const sel = audiences[active];
  const SelIcon = sel.icon;

  return (
    <section className="section-white relative py-28 overflow-hidden">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      {/* Ghost text */}
      <div className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none overflow-hidden select-none">
        <span
          className="font-display font-black leading-none tracking-tighter text-white/[0.025]"
          style={{ fontSize: "clamp(3rem, 12vw, 11rem)", writingMode: "vertical-rl" }}
        >
          WHO WE SERVE
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-purple-400 text-xs font-semibold tracking-[0.20em] uppercase mb-4">Who We Serve</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Built for the Full <span className="text-gradient">Healthcare Ecosystem</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl">
            We work across the entire healthcare industry — select your organisation type to see how we can help.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-4">

          {/* ── Left: list ── */}
          <div className="space-y-1.5">
            {audiences.map((item, i) => {
              const ItemIcon = item.icon;
              const isActive = active === i;
              return (
                <motion.button
                  key={item.num}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  onClick={() => setActive(i)}
                  className="w-full group flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all duration-300 relative overflow-hidden"
                  style={{
                    background: isActive ? `${item.color}12` : "rgba(255,255,255,0.025)",
                    border: `1px solid ${isActive ? item.color + "35" : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  {/* Active left bar */}
                  {isActive && (
                    <motion.div
                      layoutId="serve-bar"
                      className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
                      style={{ background: item.color }}
                    />
                  )}

                  <div
                    className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                    style={{ background: `${item.color}${isActive ? "25" : "12"}` }}
                  >
                    <ItemIcon className="w-4 h-4" style={{ color: isActive ? item.color : "#7c7aaa" }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-text-muted font-bold tracking-widest">{item.num}</span>
                    <p
                      className="font-display text-sm font-bold leading-tight transition-colors truncate"
                      style={{ color: isActive ? "white" : "#9d9ac0" }}
                    >
                      {item.title}
                    </p>
                  </div>

                  <ArrowRight
                    className="w-4 h-4 shrink-0 transition-all duration-300"
                    style={{ color: isActive ? sel.color : "transparent", transform: isActive ? "translateX(0)" : "translateX(-4px)" }}
                  />
                </motion.button>
              );
            })}
          </div>

          {/* ── Right: detail panel ── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${sel.color}25` }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="h-full p-8 md:p-10 relative"
                style={{ background: `linear-gradient(135deg, ${sel.color}10 0%, rgba(255,255,255,0.02) 100%)` }}
              >
                {/* Ghost number */}
                <div
                  className="absolute right-6 top-4 font-display font-black select-none leading-none"
                  style={{ fontSize: "clamp(5rem, 12vw, 10rem)", color: `${sel.color}08` }}
                >
                  {sel.num}
                </div>

                {/* Icon + title */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: `${sel.color}20`, boxShadow: `0 0 28px ${sel.color}22` }}
                  >
                    <SelIcon className="w-7 h-7" style={{ color: sel.color }} />
                  </div>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-white leading-tight">
                    {sel.title}
                  </h3>
                </div>

                <p className="text-text-secondary leading-relaxed mb-8 text-[15px] relative z-10">
                  {sel.description}
                </p>

                {/* How we help */}
                <div className="relative z-10">
                  <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: sel.color }}>
                    How we help
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {sel.howWeHelp.map((item, i) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.055 }}
                        className="flex items-start gap-2.5 text-sm text-text-secondary"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                          style={{ background: sel.color }}
                        />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 relative z-10">
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold transition-colors group/cta"
                    style={{ color: sel.color }}
                  >
                    <span>Talk to our team about your needs</span>
                    <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent" />
    </section>
  );
}
