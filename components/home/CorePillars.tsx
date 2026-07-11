"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, CalendarDays, Clapperboard, Handshake, ArrowRight } from "lucide-react";

const pillars = [
  {
    num: "01", icon: GraduationCap,
    title: "Medical Education", tagline: "Train. Certify. Advance.",
    description: "We design and deliver accredited CME programs, cadaveric training workshops, simulation-based courses, and hands-on surgical training for healthcare professionals at every career stage. Every program is built around measurable clinical outcomes — not just attendance hours.",
    includes: ["Cadaveric Labs","CME Programs","Simulation Training","Surgical Workshops","Digital Courses"],
    activities: ["Orthopedic – CMF Surgery programs","Advanced Laparoscopy Workshops","Anatomy Dissection Labs","Specialty Masterclasses"],
    accent: "#8880b8", light: "#f0eef8",
  },
  {
    num: "02", icon: CalendarDays,
    title: "Scientific Events", tagline: "Connect. Exchange. Advance.",
    description: "End-to-end management of scientific conferences, symposiums, product launch events, and scientific advisory meetings. We handle every detail — from faculty coordination and abstract management to venue logistics, AV production, and post-event reporting.",
    includes: ["Conferences","Symposiums","Advisory Meetings","Product Launches","Industry Workshops"],
    activities: ["Annual Surgical Congresses","Product Introduction Events","Expert Advisory Panels","Interdisciplinary Symposiums"],
    accent: "#726da0", light: "#eceaf6",
  },
  {
    num: "03", icon: Clapperboard,
    title: "Medical Media", tagline: "Document. Profile. Communicate.",
    description: "High-quality educational content, surgical documentation, surgeon profiling, podcasts, and healthcare professional engagement campaigns. We produce media that communicates clinical science with the precision and credibility it deserves.",
    includes: ["Video Production","Surgeon Profiling","Podcast Production","HCP Campaigns","Event Documentation"],
    activities: ["Surgical Technique Videos","KOL Interview Series","Medical Podcast Episodes","Healthcare Professional Campaigns"],
    accent: "#5e5a88", light: "#e8e6f2",
  },
  {
    num: "04", icon: Handshake,
    title: "Strategic Partnerships", tagline: "Connect. Collaborate. Grow.",
    description: "We connect medical technology companies, pharmaceutical organizations, scientific societies, and healthcare institutions through co-developed programs and long-term strategic collaboration. Our regional network and industry relationships make things happen.",
    includes: ["MedTech Partnerships","Pharma Collaboration","Society Alliances","Institutional Links","KOL Networks"],
    activities: ["Co-developed Educational Programs","Joint Research Initiatives","Industry Access Programs","Institutional Network Programs"],
    accent: "#9d4ed6", light: "#f3eef9",
  },
];

// Map each pillar to a real, existing route (the old auto-generated
// /medical-education etc. slugs did not exist and 404'd).
const PILLAR_HREFS: Record<string, string> = {
  "Medical Education": "/courses",
  "Scientific Events": "/events",
  "Medical Media": "/media",
  "Strategic Partnerships": "/partners",
};

export function CorePillars() {
  const [active, setActive] = useState(0);
  const p = pillars[active];
  const Icon = p.icon;

  return (
    <section className="section-lift relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-mesh" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
          <p className="text-purple-600 text-xs font-semibold tracking-[0.20em] uppercase mb-4">What We Do</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "#12082C" }}>
            Four Areas of <span className="text-gradient">Expertise</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#484575" }}>
            Medical Education · Scientific Events · Medical Media · Strategic Partnerships
          </p>
        </motion.div>

        {/* Tab bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
          {pillars.map((tab, i) => {
            const TabIcon = tab.icon;
            const isActive = active === i;
            return (
              <button key={tab.num} onClick={() => setActive(i)}
                className="group relative rounded-xl px-4 py-4 text-left transition-all duration-300 overflow-hidden"
                style={{
                  background: isActive ? tab.light : "rgba(255,255,255,0.7)",
                  border: `1px solid ${isActive ? tab.accent + "50" : "rgba(164,158,207,0.22)"}`,
                  boxShadow: isActive ? `0 4px 24px ${tab.accent}18` : "none",
                }}>

                {isActive && (
                  <motion.div layoutId="tab-glow" className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${tab.accent}10 0%, transparent 70%)` }} />
                )}

                <div className="flex items-start gap-3 relative z-10">
                  <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 transition-colors"
                    style={{ background: isActive ? `${tab.accent}20` : "rgba(164,158,207,0.12)" }}>
                    <TabIcon className="w-4 h-4" style={{ color: isActive ? tab.accent : "#a49ecf" }} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-widest mb-0.5" style={{ color: "#a49ecf" }}>{tab.num}</div>
                    <div className="font-display text-sm font-bold leading-tight transition-colors"
                      style={{ color: isActive ? "#12082C" : "#726da0" }}>
                      {tab.title}
                    </div>
                  </div>
                </div>

                {isActive && (
                  <motion.div layoutId="tab-bar" className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${tab.accent}, transparent)` }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Content panel */}
        <div className="rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${p.accent}30`, boxShadow: `0 8px 40px ${p.accent}10` }}>
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}
              className="relative p-8 md:p-12"
              style={{ background: p.light }}>

              {/* Ghost number */}
              <div className="absolute right-8 top-4 font-display font-black select-none leading-none"
                style={{ fontSize: "clamp(6rem,15vw,12rem)", color: `${p.accent}1c` }}>
                {p.num}
              </div>

              <div className="grid lg:grid-cols-[1fr_1fr] gap-10 relative z-10">
                {/* Left */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: `${p.accent}18`, boxShadow: `0 0 28px ${p.accent}20` }}>
                      <Icon className="w-8 h-8" style={{ color: p.accent }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: p.accent }}>{p.tagline}</p>
                      <h3 className="font-display text-2xl md:text-3xl font-bold" style={{ color: "#12082C" }}>{p.title}</h3>
                    </div>
                  </div>

                  <p className="leading-relaxed mb-8 text-[15px]" style={{ color: "#484575" }}>{p.description}</p>

                  <a href={PILLAR_HREFS[p.title] ?? "/courses"}
                    className="inline-flex items-center gap-2 text-sm font-semibold group/link"
                    style={{ color: p.accent }}>
                    <span>Explore {p.title}</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Right */}
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#a49ecf" }}>What this covers</p>
                    <div className="flex flex-wrap gap-2">
                      {p.includes.map((tag) => (
                        <span key={tag} className="text-xs font-medium px-3 py-1.5 rounded-full"
                          style={{ background: `${p.accent}12`, border: `1px solid ${p.accent}30`, color: p.accent }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#a49ecf" }}>Example activities</p>
                    <ul className="space-y-2">
                      {p.activities.map((act, i) => (
                        <motion.li key={act}
                          initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.35, delay: i * 0.06 }}
                          className="flex items-center gap-3 text-sm" style={{ color: "#484575" }}>
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: p.accent }} />
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
