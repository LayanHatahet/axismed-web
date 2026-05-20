"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { Building2, ArrowRight } from "lucide-react";

export function OrganizeCourse() {
  return (
    <section className="relative py-24 section-white overflow-hidden">
      <div className="absolute inset-0 bg-mesh" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionReveal>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/15 mb-6">
            <Building2 className="w-8 h-8 text-purple-400" />
          </div>
        </SectionReveal>

        <SectionReveal delay={0.07}>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Organize a Course{" "}
            <span className="text-gradient">With Us</span>
          </h2>
        </SectionReveal>

        <SectionReveal delay={0.13}>
          <p className="text-text-secondary text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Are you a medical device manufacturer, scientific society, or healthcare
            institution looking to deliver a high-quality educational program in the region?
            AxisMed handles everything â€” from planning and faculty to logistics, media,
            and registration.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.19}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?type=partnership"
              className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-[0_0_24px_rgba(164,158,207,0.4)] hover:shadow-[0_0_36px_rgba(164,158,207,0.6)]"
            >
              Get in Touch <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/partners"
              className="inline-flex items-center gap-2 border border-border-strong text-white font-medium px-7 py-3.5 rounded-xl hover:bg-white/5 transition-all"
            >
              Partnership Info
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
