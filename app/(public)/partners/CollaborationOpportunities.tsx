"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BookOpen, Award, Handshake } from "lucide-react";

const opportunities = [
  {
    icon: BookOpen,
    title: "Support Medical Education",
    description:
      "Organisations can support independent educational programmes, hands-on training, and scientific initiatives designed to advance clinical knowledge and professional development.",
    cta: "Start a Conversation",
  },
  {
    icon: Award,
    title: "Design & Deliver Training Programmes",
    description:
      "AxisMed supports healthcare institutions and organisations in planning and delivering tailored workshops, clinical education programmes, surgical training, and professional meetings. Our team manages programme design, faculty coordination, participant experience, logistics, and delivery.",
    cta: "Plan a Programme",
  },
  {
    icon: Handshake,
    title: "Strategic Educational Partnerships",
    description:
      "We establish long-term collaborations for recurring educational programmes, scientific initiatives, regional faculty engagement, and medical content development.",
    cta: "Discuss Partnership",
  },
];

export function CollaborationOpportunities() {
  return (
    <section className="relative py-28 bg-bg-surface overflow-hidden" id="collaborate">
      <div className="absolute inset-0 bg-mesh" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Work With Us"
          title="How We"
          titleHighlight="Collaborate"
          subtitle="The ways organisations and institutions can work with AxisMed to develop and deliver meaningful medical education."
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {opportunities.map((opp, i) => {
            const Icon = opp.icon;
            return (
              <motion.div
                key={opp.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass glow-border rounded-2xl p-8 flex flex-col hover:border-purple-500/30 hover:shadow-[0_8px_32px_rgba(164,158,207,0.15)] transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-purple-500/15 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">{opp.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-6 flex-1">
                  {opp.description}
                </p>
                <Link
                  href="/contact?type=partnership"
                  className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                >
                  {opp.cta} →
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Our Commitment */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 max-w-3xl mx-auto text-center"
        >
          <h3 className="font-display text-2xl font-bold text-white mb-3">Our Commitment</h3>
          <p className="text-text-secondary leading-relaxed">
            AxisMed maintains a clear focus on educational value, clinical relevance, and responsible
            collaboration. Each programme is designed to support healthcare professionals through
            credible, practical, and outcome-focused learning experiences.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
