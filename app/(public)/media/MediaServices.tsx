"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Video, Camera, Palette, Mic, Share2, Radio } from "lucide-react";

const services = [
  {
    icon: Video,
    title: "Educational Video Production",
    description:
      "High-quality surgical tutorial videos, procedure documentation, and curriculum content â€” produced for CME platforms, institutional use, and educational distribution.",
    highlight: "Surgical Documentation",
  },
  {
    icon: Camera,
    title: "Surgical & Event Coverage",
    description:
      "Multi-camera coverage of live surgical procedures, cadaveric lab sessions, conference keynotes, and event highlights â€” captured and edited for professional distribution.",
    highlight: "Live Coverage",
  },
  {
    icon: Palette,
    title: "Healthcare Branding",
    description:
      "Visual identity, event branding, digital assets, and communication materials for healthcare brands and medical institutions â€” designed with a clinical audience in mind.",
    highlight: "Brand Identity",
  },
  {
    icon: Mic,
    title: "Professional Interviews",
    description:
      "Surgeon profiles, expert interviews, thought-leadership conversations, and opinion pieces â€” produced in AxisMed's dedicated healthcare media studio.",
    highlight: "Surgeon Profiles",
  },
  {
    icon: Share2,
    title: "Social Media Content",
    description:
      "Strategic content production for LinkedIn, Instagram, and YouTube â€” formatted for healthcare audiences, designed to build professional brand visibility.",
    highlight: "Digital Strategy",
  },
  {
    icon: Radio,
    title: "Medical Podcast & Digital Content",
    description:
      "End-to-end podcast production â€” from concept and scripting through recording, editing, and distribution â€” for healthcare organizations and individual experts.",
    highlight: "Podcast Production",
  },
];

export function MediaServices() {
  return (
    <section className="relative py-28 section-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Our Services"
          title="Media Solutions for"
          titleHighlight="Healthcare"
          subtitle="From surgical documentation to strategic digital content â€” we produce media that informs, educates, and builds authority within the medical profession."
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="group glass glow-border rounded-2xl p-7 hover:border-purple-500/30 hover:shadow-[0_8px_32px_rgba(124,58,237,0.15)] transition-all"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/12 group-hover:bg-purple-500/20 flex items-center justify-center transition-colors">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-xs text-purple-400 font-medium px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/15">
                    {service.highlight}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-3">{service.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
