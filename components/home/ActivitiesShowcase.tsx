"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, FlaskConical, Megaphone, Users, BookOpen, Radio } from "lucide-react";

type Category = "All" | "Medical Education" | "Scientific Events" | "Medical Media";

const activities = [
  {
    icon: Scissors, category: "Medical Education" as Category,
    title: "Orthognathic Surgery Programs", accent: "#8880b8",
    description: "Multi-day surgical training combining didactic sessions, live demonstrations, and hands-on cadaveric practice for maxillofacial and oral surgery specialists.",
  },
  {
    icon: FlaskConical, category: "Medical Education" as Category,
    title: "Cadaveric Training Workshops", accent: "#726da0",
    description: "Intensive laboratory-based programs providing direct operative experience in anatomy and surgical technique — designed for practicing surgeons across multiple specialties.",
  },
  {
    icon: Megaphone, category: "Scientific Events" as Category,
    title: "Product Launch Events", accent: "#5e5a88",
    description: "End-to-end management of clinical introduction events for new medical devices — faculty selection, pre-launch education, live demonstrations, and post-event media.",
  },
  {
    icon: Users, category: "Scientific Events" as Category,
    title: "Scientific Advisory Meetings", accent: "#484575",
    description: "Structured expert panels bringing together KOLs and industry stakeholders to review clinical evidence, shape educational strategy, and build scientific consensus.",
  },
  {
    icon: BookOpen, category: "Medical Education" as Category,
    title: "CME Activities", accent: "#8880b8",
    description: "Accredited continuing medical education programs designed in collaboration with recognized bodies — delivered in-person, hybrid, or digitally for maximum reach.",
  },
  {
    icon: Radio, category: "Medical Media" as Category,
    title: "HCP Engagement Campaigns", accent: "#9d4ed6",
    description: "Multi-channel healthcare professional engagement programs combining educational content, digital media, events, and KOL-driven outreach to build clinical awareness.",
  },
];

const FILTERS: Category[] = ["All", "Medical Education", "Scientific Events", "Medical Media"];

const catAccent: Record<string, string> = {
  "Medical Education": "#8880b8",
  "Scientific Events": "#5e5a88",
  "Medical Media":     "#9d4ed6",
};

export function ActivitiesShowcase() {
  const [filter, setFilter] = useState<Category>("All");
  const visible = filter === "All" ? activities : activities.filter((a) => a.category === filter);

  return (
    <section className="section-white relative py-28 overflow-hidden">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-300/60 to-transparent" />

      {/* Subtle dot grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(164,158,207,0.25) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.5,
        }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header + filters row */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12">
          <p className="text-purple-600 text-xs font-semibold tracking-[0.20em] uppercase mb-4">Examples of What We Do</p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight" style={{ color: "#12082C" }}>
              Activities & <span className="text-gradient">Programs</span>
            </h2>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2 shrink-0">
              {FILTERS.map((cat) => {
                const isActive = filter === cat;
                const color = cat === "All" ? "#8880b8" : catAccent[cat];
                return (
                  <button key={cat} onClick={() => setFilter(cat)}
                    className="text-xs font-semibold px-4 py-2 rounded-full transition-all duration-300"
                    style={{
                      background: isActive ? color : "rgba(255,255,255,0.9)",
                      color: isActive ? "#ffffff" : "#726da0",
                      border: `1px solid ${isActive ? color : "rgba(164,158,207,0.30)"}`,
                      boxShadow: isActive ? `0 4px 16px ${color}30` : "none",
                    }}>
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Cards grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {visible.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} layout
                  initial={{ opacity: 0, scale: 0.94, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}
                  whileHover={{ y: -5 }}
                  className="group relative rounded-2xl overflow-hidden cursor-default"
                  style={{
                    background: "white",
                    border: "1px solid rgba(164,158,207,0.22)",
                    boxShadow: "0 2px 20px rgba(136,128,184,0.07)",
                  }}>

                  {/* Coloured top bar */}
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${item.accent}, ${item.accent}66)` }} />

                  <div className="p-7">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                        style={{ background: `${item.accent}12` }}>
                        <Icon className="w-5 h-5" style={{ color: item.accent }} />
                      </div>
                      <span className="text-[10px] font-bold tracking-[0.16em] uppercase" style={{ color: item.accent }}>
                        {item.category}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold mb-3 leading-snug" style={{ color: "#2d2a52" }}>
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#484575" }}>
                      {item.description}
                    </p>
                  </div>

                  {/* Hover bottom glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{ background: `radial-gradient(ellipse 80% 40% at 50% 100%, ${item.accent}0a 0%, transparent 70%)` }} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Footer note */}
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.5 }} className="mt-10 text-center text-xs tracking-wide" style={{ color: "#a49ecf" }}>
          Illustrative examples of program types — every engagement is tailored to your specific objectives.{" "}
          <a href="/contact" className="font-semibold underline underline-offset-2 hover:text-purple-600 transition-colors"
            style={{ color: "#8880b8" }}>
            Talk to us →
          </a>
        </motion.p>
      </div>

      <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-300/50 to-transparent" />
    </section>
  );
}
