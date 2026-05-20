"use client";

import Link from "next/link";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { MotionBackground } from "@/components/ui/MotionBackground";
import { ArrowRight, Mail } from "lucide-react";

export function HomeCTA() {
  return (
    <section className="relative py-32 bg-bg-base overflow-hidden">
      <MotionBackground variant="purple" particles scanLine grid />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionReveal>
          <p className="text-purple-400 text-xs font-semibold tracking-[0.18em] uppercase mb-5">
            Work With AxisMed
          </p>
        </SectionReveal>

        <SectionReveal delay={0.07}>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Looking to organize a{" "}
            <span className="text-gradient">medical course</span>,{" "}
            scientific event, or healthcare media project?
          </h2>
        </SectionReveal>

        <SectionReveal delay={0.14}>
          <p className="text-text-secondary text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            AxisMed partners with medical device manufacturers, healthcare institutions,
            scientific societies, and industry leaders to design and execute world-class
            programs that make a genuine clinical impact.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="flex items-center justify-center">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(164,158,207,0.5)] hover:shadow-[0_0_44px_rgba(164,158,207,0.7)] text-base"
            >
              <Mail className="w-5 h-5" />
              Contact Us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
