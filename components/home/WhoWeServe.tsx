"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  Cpu,
  Pill,
  FlaskConical,
  Building2,
  Stethoscope,
  GraduationCap,
} from "lucide-react";

const audiences = [
  {
    icon: Cpu,
    title: "Medical Technology Companies",
    description:
      "We help MedTech companies introduce new devices and technologies through educational programs, KOL engagement, hands-on training workshops, and product launch events that build clinical adoption.",
  },
  {
    icon: Pill,
    title: "Pharmaceutical & Healthcare Organizations",
    description:
      "From healthcare professional engagement campaigns to scientific advisory meetings and symposiums, we design initiatives that connect your products and science with the right clinical audience.",
  },
  {
    icon: FlaskConical,
    title: "Scientific Societies",
    description:
      "We partner with medical societies to organize their annual conferences, specialty meetings, and educational programs — handling logistics, content, faculty coordination, and media production.",
  },
  {
    icon: Building2,
    title: "Hospitals & Healthcare Institutions",
    description:
      "We support hospitals and healthcare groups with in-house training programs, staff development workshops, simulation-based education, and content that documents and elevates their clinical capabilities.",
  },
  {
    icon: Stethoscope,
    title: "Healthcare Professionals",
    description:
      "Surgeons, physicians, and specialists access hands-on cadaveric training, CME-accredited courses, and advanced workshops designed to develop genuine operative and clinical competence.",
  },
  {
    icon: GraduationCap,
    title: "Academic Institutions",
    description:
      "We collaborate with medical schools and academic centers to develop joint educational programs, integrate innovative training modalities, and connect faculty with international clinical networks.",
  },
];

export function WhoWeServe() {
  return (
    <section className="section-white relative py-28 overflow-hidden">
      {/* Top border */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(136,128,184,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Who We Serve"
          title="Built for the Full"
          titleHighlight="Healthcare Ecosystem"
          subtitle="We work across the healthcare industry — from MedTech companies and scientific societies to hospitals, academic institutions, and individual healthcare professionals."
          className="mb-16"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiences.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
                whileHover={{ y: -4 }}
                className="group glass glow-border rounded-2xl p-7 hover:border-purple-500/30 hover:shadow-[0_8px_32px_rgba(164,158,207,0.15)] transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-purple-500/12 group-hover:bg-purple-500/20 flex items-center justify-center mb-5 transition-colors">
                  <Icon className="w-6 h-6 text-purple-400" />
                </div>

                <h3 className="font-display text-lg font-bold text-white mb-3 leading-snug">
                  {item.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 text-center"
        >
          <p className="text-text-secondary text-base mb-5">
            Not sure which service fits your needs?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 font-semibold text-sm px-7 py-3.5 rounded-xl transition-all"
            style={{
              background: "#8880b8",
              color: "#fff",
              boxShadow: "0 0 24px rgba(136,128,184,0.35)",
            }}
          >
            Talk to our team →
          </a>
        </motion.div>
      </div>

      <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent" />
    </section>
  );
}
