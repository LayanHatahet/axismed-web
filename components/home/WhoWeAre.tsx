"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { SectionReveal, StaggerReveal } from "@/components/ui/SectionReveal";
import { GraduationCap, CalendarDays, Video, Handshake } from "lucide-react";
import { MotionBackground } from "@/components/ui/MotionBackground";

const services = [
  {
    icon: GraduationCap,
    label: "Medical Education",
    desc: "Hands-on surgical training, cadaveric labs, and CME programs.",
  },
  {
    icon: CalendarDays,
    label: "Scientific Events",
    desc: "Conferences, symposiums, and industry educational events.",
  },
  {
    icon: Video,
    label: "Medical Media",
    desc: "Educational content, surgical documentation, and surgeon profiling.",
  },
  {
    icon: Handshake,
    label: "Strategic Partnerships",
    desc: "Connecting MedTech companies, societies, and institutions.",
  },
];

export function WhoWeAre() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["72px", "0px"]);

  return (
    <motion.div ref={ref} style={{ y }} className="relative z-10 -mt-12">
      <section className="section-white relative py-28 overflow-hidden rounded-t-[2.5rem] shadow-[0_-12px_48px_rgba(0,0,0,0.35)]">
        {/* Decorative line */}
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/25 to-transparent" />

        <MotionBackground variant="subtle" particles={false} grid />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <SectionReveal>
                <p className="text-purple-400 text-xs font-semibold tracking-[0.18em] uppercase mb-4">
                  Who We Are
                </p>
              </SectionReveal>
              <SectionReveal delay={0.06}>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                  Designing &amp; Delivering{" "}
                  <span className="text-gradient">Impactful Healthcare</span>{" "}
                  Initiatives
                </h2>
              </SectionReveal>
              <SectionReveal delay={0.12}>
                <p className="text-text-secondary text-lg leading-relaxed mb-6">
                  AxisMed helps healthcare organizations, scientific societies, and
                  medical technology companies design, manage, and deliver impactful
                  educational and scientific initiatives.
                </p>
              </SectionReveal>
              <SectionReveal delay={0.18}>
                <p className="text-text-secondary leading-relaxed mb-8">
                  Headquartered in Dubai and backed by deep regional expertise through
                  GalMed and MedLab, we bring together clinical knowledge, extensive
                  institutional networks, and end-to-end production capabilities —
                  so every program we deliver achieves its scientific and commercial
                  objectives.
                </p>
              </SectionReveal>

              {/* Service tags */}
              <SectionReveal delay={0.22}>
                <div className="flex flex-wrap gap-2">
                  {["Medical Education", "Scientific Events", "Medical Media", "Strategic Partnerships"].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-4 py-2 rounded-full border"
                      style={{
                        background: "rgba(136,128,184,0.08)",
                        borderColor: "rgba(136,128,184,0.25)",
                        color: "#bcb8df",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </SectionReveal>
            </div>

            {/* Right side: photo + service cards */}
            <div className="space-y-5">
              <SectionReveal delay={0.08} direction="left">
                <div className="relative h-56 rounded-2xl overflow-hidden glass glow-border">
                  <Image
                    src="https://images.unsplash.com/photo-1576089172869-4f5f6f315620?w=1200&h=600&q=80&auto=format&fit=crop"
                    alt="AxisMed medical conference"
                    fill
                    className="object-cover object-center"
                    onError={() => {}}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-bg-base/30 to-bg-base/70" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-40">
                    <span className="text-purple-300 text-xs font-medium tracking-widest uppercase">Photo Placeholder</span>
                    <span className="text-white/40 text-[11px] text-center px-6 leading-relaxed">
                      Medical conference · wide-shot · stage lighting · premium venue
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-bg-base/70 via-transparent to-purple-900/30" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">
                      Dubai · Regional &amp; Global Reach
                    </span>
                  </div>
                </div>
              </SectionReveal>

              {/* Service cards */}
              <StaggerReveal className="grid grid-cols-2 gap-3" direction="left" delay={0.14}>
                {services.map(({ icon: Icon, label, desc }) => (
                  <motion.div
                    key={label}
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="glass glow-border rounded-xl p-4 hover:border-purple-500/30 transition-colors"
                  >
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4 text-purple-400" />
                    </div>
                    <h3 className="font-display text-sm font-bold text-white mb-1">{label}</h3>
                    <p className="text-text-secondary text-xs leading-relaxed">{desc}</p>
                  </motion.div>
                ))}
              </StaggerReveal>
            </div>
          </div>
        </div>

        <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent" />
      </section>
    </motion.div>
  );
}
