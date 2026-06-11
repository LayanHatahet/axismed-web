"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, CalendarDays, Clapperboard, Handshake, ArrowRight } from "lucide-react";

const pillars = [
  {
    num: "01",
    icon: GraduationCap,
    title: "Medical Education",
    tagline: "Train. Certify. Advance.",
    description:
      "We design and deliver accredited CME programs, cadaveric training workshops, simulation-based courses, and hands-on surgical training for healthcare professionals at every career stage. Every program is built around measurable clinical outcomes — not just attendance hours.",
    includes: ["Cadaveric Labs", "CME Programs", "Simulation Training", "Surgical Workshops", "Digital Courses"],
    activities: ["Orthognathic Surgery Programs", "Advanced Laparoscopy Workshops", "Anatomy Dissection Labs", "Specialty Masterclasses"],
    color: "#bcb8df",
    bg: "from-purple-900/30 to-purple-950/10",
  },
  {
    num: "02",
    icon: CalendarDays,
    title: "Scientific Events",
    tagline: "Connect. Exchange. Advance.",
    description:
      "End-to-end management of scientific conferences, symposiums, product launch events, and scientific advisory meetings. We handle every detail — from faculty coordination and abstract management to venue logistics, AV production, and post-event reporting.",
    includes: ["Conferences", "Symposiums", "Advisory Meetings", "Product Launches", "Industry Workshops"],
    activities: ["Annual Surgical Congresses", "Product Introduction Events", "Expert Advisory Panels", "Interdisciplinary Symposiums"],
    color: "#a49ecf",
    bg: "from-violet-900/30 to-violet-950/10",
  },
  {
    num: "03",
    icon: Clapperboard,
    title: "Medical Media",
    tagline: "Document. Profile. Communicate.",
    description:
      "High-quality educational content, surgical documentation, surgeon profiling, podcasts, and healthcare professional engagement campaigns. We produce media that communicates clinical science with the precision and credibility it deserves — built for healthcare audiences.",
    includes: ["Video Production", "Surgeon Profiling", "Podcast Production", "HCP Campaigns", "Event Documentation"],
    activities: ["Surgical Technique Videos", "KOL Interview Series", "Medical Podcast Episodes", "Healthcare Professional Campaigns"],
    color: "#8880b8",
    bg: "from-indigo-900/30 to-indigo-950/10",
  },
  {
    num: "04",
    icon: Handshake,
    title: "Strategic Partnerships",
    tagline: "Connect. Collaborate. Grow.",
    description:
      "We connect medical technology companies, pharmaceutical organizations, scientific societies, and healthcare institutions through co-developed programs and long-term strategic collaboration. Our regional network and industry relationships make things happen that wouldn't otherwise.",
    includes: ["MedTech Partnerships", "Pharma Collaboration", "Society Alliances", "Institutional Links", "KOL Networks"],
    activities: ["Co-developed Educational Programs", "Joint Research Initiatives", "Industry Access Programs", "Institutional Network Programs"],
    color: "#c084fc",
    bg: "from-fuchsia-900/30 to-fuchsia-950/10",
  },
];

export function CorePillars() {
  const [active, setActive] = useState(0);
  const p = pillars[active];
  const Icon = p.icon;

  return (
    <section className="section-lift relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-mesh" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-purple-400 text-xs font-semibold tracking-[0.20em] uppercase mb-4">What We Do</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Four Areas of <span className="text-gradient">Expertise</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Medical Education · Scientific Events · Medical Media · Strategic Partnerships
          </p>
        </motion.div>

        {/* ── Tab bar ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
          {pillars.map((tab, i) => {
            const TabIcon = tab.icon;
            const isActive = active === i;
            return (
              <button
                key={tab.num}
                onClick={() => setActive(i)}
                className="group relative rounded-xl px-4 py-4 text-left transition-all duration-300 overflow-hidden"
                style={{
                  background: isActive ? `linear-gradient(135deg, ${tab.color}18 0%, ${tab.color}08 100%)` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? tab.color + "40" : "rgba(255,255,255,0.07)"}`,
                }}
              >
                {/* Active glow */}
                {isActive && (
                  <motion.div
                    layoutId="tab-glow"
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${tab.color}12 0%, transparent 70%)` }}
                  />
                )}

                <div className="flex items-start gap-3 relative z-10">
                  <div
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 transition-colors"
                    style={{ background: `${tab.color}${isActive ? "25" : "12"}` }}
                  >
                    <TabIcon className="w-4 h-4" style={{ color: isActive ? tab.color : "#7c7aaa" }} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-text-muted tracking-widest mb-0.5">{tab.num}</div>
                    <div
                      className="font-display text-sm font-bold leading-tight transition-colors"
                      style={{ color: isActive ? "white" : "#9d9ac0" }}
                    >
                      {tab.title}
                    </div>
                  </div>
                </div>

                {/* Active bottom bar */}
                {isActive && (
                  <motion.div
                    layoutId="tab-bar"
                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${tab.color}, transparent)` }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Content panel ── */}
        <div
          className="rounded-2xl overflow-hidden border"
          style={{ borderColor: `${p.color}25` }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={`relative p-8 md:p-12 bg-gradient-to-br ${p.bg}`}
            >
              {/* Background number */}
              <div
                className="absolute right-8 top-4 font-display font-black select-none leading-none"
                style={{ fontSize: "clamp(6rem, 15vw, 12rem)", color: `${p.color}08` }}
              >
                {p.num}
              </div>

              <div className="grid lg:grid-cols-[1fr_1fr] gap-10 relative z-10">
                {/* Left */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: `${p.color}20`, boxShadow: `0 0 30px ${p.color}25` }}
                    >
                      <Icon className="w-8 h-8" style={{ color: p.color }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: p.color }}>
                        {p.tagline}
                      </p>
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-white">{p.title}</h3>
                    </div>
                  </div>

                  <p className="text-text-secondary leading-relaxed mb-8 text-[15px]">{p.description}</p>

                  <a
                    href={`/${p.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold transition-colors group/link"
                    style={{ color: p.color }}
                  >
                    <span>Explore {p.title}</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Right */}
                <div className="space-y-6">
                  {/* Includes */}
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-3">What this covers</p>
                    <div className="flex flex-wrap gap-2">
                      {p.includes.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium px-3 py-1.5 rounded-full border"
                          style={{ background: `${p.color}12`, borderColor: `${p.color}30`, color: p.color }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Activities */}
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-3">Example activities</p>
                    <ul className="space-y-2">
                      {p.activities.map((act, i) => (
                        <motion.li
                          key={act}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.35, delay: i * 0.06 }}
                          className="flex items-center gap-3 text-sm text-text-secondary"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: p.color }}
                          />
                          {act}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
