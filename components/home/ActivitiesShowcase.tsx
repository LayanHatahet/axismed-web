"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  Scissors,
  FlaskConical,
  Megaphone,
  Users,
  BookOpen,
  Radio,
} from "lucide-react";

const activities = [
  {
    icon: Scissors,
    category: "Medical Education",
    title: "Orthognathic Surgery Programs",
    description:
      "Structured multi-day surgical training combining didactic sessions, live demonstrations, and hands-on cadaveric practice for maxillofacial and oral surgery specialists.",
    accent: "#bcb8df",
  },
  {
    icon: FlaskConical,
    category: "Medical Education",
    title: "Cadaveric Training Workshops",
    description:
      "Intensive laboratory-based programs providing direct operative experience in anatomy and surgical technique — designed for practicing surgeons across multiple specialties.",
    accent: "#a49ecf",
  },
  {
    icon: Megaphone,
    category: "Scientific Events",
    title: "Product Launch Events",
    description:
      "End-to-end management of clinical introduction events for new medical devices — from faculty selection and pre-launch education to live demonstrations and post-event media.",
    accent: "#8880b8",
  },
  {
    icon: Users,
    category: "Scientific Events",
    title: "Scientific Advisory Meetings",
    description:
      "Structured expert panels bringing together KOLs and industry stakeholders to review clinical evidence, shape educational strategy, and build scientific consensus.",
    accent: "#7c6fbd",
  },
  {
    icon: BookOpen,
    category: "Medical Education",
    title: "CME Activities",
    description:
      "Accredited continuing medical education programs designed in collaboration with recognized bodies — delivered in-person, hybrid, or digitally for maximum reach.",
    accent: "#6366F1",
  },
  {
    icon: Radio,
    category: "Medical Media",
    title: "HCP Engagement Campaigns",
    description:
      "Multi-channel healthcare professional engagement programs combining educational content, digital media, events, and KOL-driven outreach to build clinical awareness.",
    accent: "#c084fc",
  },
];

export function ActivitiesShowcase() {
  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #edeaf8 0%, #e8e5f4 50%, #ede9f7 100%)",
      }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(104,96,168,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(104,96,168,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Examples of What We Do"
          title="Activities &"
          titleHighlight="Programs"
          subtitle="Illustrative examples of the types of initiatives we design, manage, and deliver — every program is tailored to the specific objectives of the client."
          className="mb-16"
          light
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
                whileHover={{ y: -4 }}
                className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-7 border border-purple-200/50 hover:border-purple-400/40 hover:shadow-[0_8px_32px_rgba(136,128,184,0.18)] transition-all duration-300"
              >
                {/* Category badge */}
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${item.accent}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: item.accent }} />
                  </div>
                  <span
                    className="text-xs font-semibold tracking-widest uppercase"
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
              </motion.div>
            );
          })}
        </div>

        {/* Disclaimer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 text-center text-xs"
          style={{ color: "#8880b8", letterSpacing: "0.04em" }}
        >
          These are examples of program types, not an exhaustive list. Contact us to discuss your specific objectives.
        </motion.p>
      </div>
    </section>
  );
}
