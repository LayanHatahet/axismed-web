"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, FlaskConical, Megaphone, Users, BookOpen, Radio } from "lucide-react";

type Category = "All" | "Medical Education" | "Scientific Events" | "Medical Media";

const activities = [
  {
    icon: Scissors,
    category: "Medical Education" as Category,
    title: "Orthognathic Surgery Programs",
    description:
      "Multi-day surgical training combining didactic sessions, live demonstrations, and hands-on cadaveric practice for maxillofacial and oral surgery specialists.",
    accent: "#bcb8df",
  },
  {
    icon: FlaskConical,
    category: "Medical Education" as Category,
    title: "Cadaveric Training Workshops",
    description:
      "Intensive laboratory-based programs providing direct operative experience in anatomy and surgical technique — designed for practicing surgeons across multiple specialties.",
    accent: "#a49ecf",
  },
  {
    icon: Megaphone,
    category: "Scientific Events" as Category,
    title: "Product Launch Events",
    description:
      "End-to-end management of clinical introduction events for new medical devices — faculty selection, pre-launch education, live demonstrations, and post-event media.",
    accent: "#8880b8",
  },
  {
    icon: Users,
    category: "Scientific Events" as Category,
    title: "Scientific Advisory Meetings",
    description:
      "Structured expert panels bringing together KOLs and industry stakeholders to review clinical evidence, shape educational strategy, and build scientific consensus.",
    accent: "#7c6fbd",
  },
  {
    icon: BookOpen,
    category: "Medical Education" as Category,
    title: "CME Activities",
    description:
      "Accredited continuing medical education programs designed in collaboration with recognized bodies — delivered in-person, hybrid, or digitally for maximum reach.",
    accent: "#6366F1",
  },
  {
    icon: Radio,
    category: "Medical Media" as Category,
    title: "HCP Engagement Campaigns",
    description:
      "Multi-channel healthcare professional engagement programs combining educational content, digital media, events, and KOL-driven outreach to build clinical awareness.",
    accent: "#c084fc",
  },
];

const FILTERS: Category[] = ["All", "Medical Education", "Scientific Events", "Medical Media"];

const catColor: Record<string, string> = {
  "Medical Education": "#bcb8df",
  "Scientific Events": "#8880b8",
  "Medical Media":     "#c084fc",
};

export function ActivitiesShowcase() {
  const [filter, setFilter] = useState<Category>("All");

  const visible = filter === "All" ? activities : activities.filter((a) => a.category === filter);

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #edeaf8 0%, #e8e5f4 50%, #ede9f7 100%)" }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(104,96,168,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(104,96,168,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-purple-600 text-xs font-semibold tracking-[0.20em] uppercase mb-4">
            Examples of What We Do
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight" style={{ color: "#2d2a52" }}>
              Activities &{" "}
              <span className="text-gradient">Programs</span>
            </h2>

            {/* ── Filter pills ── */}
            <div className="flex flex-wrap gap-2 shrink-0">
              {FILTERS.map((cat) => {
                const isActive = filter === cat;
                const color = cat === "All" ? "#8880b8" : catColor[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className="relative text-xs font-semibold px-4 py-2 rounded-full transition-all duration-300"
                    style={{
                      background: isActive ? color : "rgba(136,128,184,0.1)",
                      color: isActive ? "white" : "#6b6899",
                      border: `1px solid ${isActive ? color : "rgba(136,128,184,0.2)"}`,
                      boxShadow: isActive ? `0 0 16px ${color}40` : "none",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── Cards grid with layout animation ── */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {visible.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  layout
                  initial={{ opacity: 0, scale: 0.94, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -5 }}
                  className="group relative bg-white/75 backdrop-blur-sm rounded-2xl overflow-hidden cursor-default"
                  style={{
                    border: "1px solid rgba(136,128,184,0.18)",
                    boxShadow: "0 2px 20px rgba(136,128,184,0.08)",
                  }}
                >
                  {/* Colored top bar */}
                  <div
                    className="h-1 w-full transition-all duration-300"
                    style={{ background: `linear-gradient(90deg, ${item.accent}, ${item.accent}88)` }}
                  />

                  <div className="p-7">
                    {/* Category + icon row */}
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                        style={{ background: `${item.accent}18` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: item.accent }} />
                      </div>
                      <span
                        className="text-[10px] font-bold tracking-[0.16em] uppercase"
                        style={{ color: item.accent }}
                      >
                        {item.category}
                      </span>
                    </div>

                    <h3
                      className="font-display text-lg font-bold mb-3 leading-snug"
                      style={{ color: "#2d2a52" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#5a5680" }}>
                      {item.description}
                    </p>
                  </div>

                  {/* Hover bottom glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{ background: `radial-gradient(ellipse 80% 40% at 50% 100%, ${item.accent}10 0%, transparent 70%)` }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center text-xs tracking-wide"
          style={{ color: "#9d9ac0" }}
        >
          Illustrative examples of program types — every engagement is tailored to your specific objectives.
          <a href="/contact" className="ml-2 font-semibold underline underline-offset-2 hover:text-purple-600 transition-colors">
            Talk to us →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
