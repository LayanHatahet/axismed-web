"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BookOpen, Award, Handshake } from "lucide-react";

const opportunities = [
  {
    icon: BookOpen,
    title: "Sponsor a Course",
    description:
      "Partner with AxisMed to sponsor an existing program or create a branded educational event. Reach hundreds of healthcare professionals with your brand and message in a credible, clinical context.",
    cta: "Explore Sponsorship",
  },
  {
    icon: Award,
    title: "Organize Workshops",
    description:
      "Leverage our network, facilities, and organizational expertise to run product training, clinical workshops, or investigator meetings in the region. We handle all logistics end to end.",
    cta: "Plan a Workshop",
  },
  {
    icon: Handshake,
    title: "Educational Partnerships",
    description:
      "Establish a long-term educational partnership with AxisMed for recurring programs, joint scientific initiatives, or digital content collaboration that builds sustained engagement.",
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
          title="Collaboration"
          titleHighlight="Opportunities"
          subtitle="Three ways your organization can work with AxisMed to deliver meaningful educational impact across the region."
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
                className="glass glow-border rounded-2xl p-8 flex flex-col hover:border-purple-500/30 hover:shadow-[0_8px_32px_rgba(124,58,237,0.15)] transition-all"
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
      </div>
    </section>
  );
}
