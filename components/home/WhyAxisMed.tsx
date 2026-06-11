"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MotionBackground } from "@/components/ui/MotionBackground";
import {
  BrainCircuit,
  Network,
  UserCheck,
  Microscope,
  Rocket,
  Layers,
} from "lucide-react";

const reasons = [
  {
    icon: BrainCircuit,
    title: "Deep Healthcare Industry Knowledge",
    description:
      "Our team's background through GalMed and MedLab means we understand the clinical, regulatory, and commercial realities of the healthcare industry — not just the theory. We speak the language of both clinicians and industry.",
  },
  {
    icon: Network,
    title: "Extensive Regional Network",
    description:
      "Years of operating across the Middle East have built us a trusted network of healthcare institutions, hospital groups, medical societies, and academic centers — connections that make every initiative easier to design and faster to execute.",
  },
  {
    icon: UserCheck,
    title: "Access to KOLs & Healthcare Institutions",
    description:
      "We have established relationships with key opinion leaders across multiple specialties and geographies. We can identify, engage, and mobilize the right clinical experts for your program — quickly and credibly.",
  },
  {
    icon: Microscope,
    title: "Cadaveric & Hands-on Education Experience",
    description:
      "We have direct experience designing and running cadaveric training workshops — one of the most complex and high-value formats in medical education. From lab setup to faculty coordination and regulatory compliance, we manage it all.",
  },
  {
    icon: Rocket,
    title: "Experience Launching Medical Technologies",
    description:
      "We have supported the introduction of innovative medical technologies into clinical practice, understanding how education, KOL engagement, and event strategy combine to build product awareness and drive adoption.",
  },
  {
    icon: Layers,
    title: "End-to-End Capabilities",
    description:
      "Unlike single-service agencies, AxisMed covers education design, event management, and media production under one roof. This means tighter integration, consistent quality, and a single accountable partner from concept to delivery.",
  },
];

export function WhyAxisMed() {
  return (
    <section className="section-white relative py-28 overflow-hidden">
      <MotionBackground variant="deep" particles scanLine={false} grid />

      {/* Large decorative text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-display text-[20vw] font-black text-white/[0.015] leading-none tracking-tighter">
          AXISMED
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Why AxisMed"
          title="What Sets Us"
          titleHighlight="Apart"
          subtitle="Our differentiators are rooted in genuine experience — not aspirational statements. Here is what we actually bring to every engagement."
          className="mb-16"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
                whileHover={{ y: -4 }}
                className="group glass glow-border rounded-2xl p-7 hover:border-purple-500/30 hover:shadow-[0_8px_32px_rgba(164,158,207,0.15)] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/12 group-hover:bg-purple-500/20 flex items-center justify-center mb-5 transition-colors">
                  <Icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-3 leading-snug">
                  {reason.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
