"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { SectionReveal, StaggerReveal } from "@/components/ui/SectionReveal";
import { GraduationCap, Microscope, Radio } from "lucide-react";
import { MotionBackground } from "@/components/ui/MotionBackground";

const pillars = [
  {
    icon: GraduationCap,
    label: "Medical Education",
    desc: "Premium hands-on and digital surgical training programs.",
  },
  {
    icon: Microscope,
    label: "Scientific Events",
    desc: "Industry-grade conferences, cadaveric labs, and symposiums.",
  },
  {
    icon: Radio,
    label: "Healthcare Media",
    desc: "Educational content, surgeon profiling, and professional production.",
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
    <motion.div
      ref={ref}
      style={{ y }}
      className="relative z-10 -mt-12"
    >
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
                Where Knowledge,{" "}
                <span className="text-gradient">Innovation</span> and{" "}
                People Converge
              </h2>
            </SectionReveal>
            <SectionReveal delay={0.12}>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                AxisMed bridges medical education, healthcare innovation, and
                professional communication through premium training programs,
                scientific events, and specialized healthcare media solutions.
              </p>
            </SectionReveal>
            <SectionReveal delay={0.18}>
              <p className="text-text-secondary leading-relaxed mb-8">
                We are being developed as the leading independent platform for
                medical education and healthcare media in the Middle East — built by
                healthcare professionals, for healthcare professionals. Our approach
                combines international standards with deep regional understanding
                to deliver experiences that are both globally relevant and locally
                impactful.
              </p>
            </SectionReveal>
            <SectionReveal delay={0.22}>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="font-display text-3xl font-bold text-gradient">50+</div>
                  <div className="text-text-muted text-sm">Programs/year</div>
                </div>
                <div className="w-px h-12 bg-border-strong" />
                <div className="text-center">
                  <div className="font-display text-3xl font-bold text-gradient">15+</div>
                  <div className="text-text-muted text-sm">Countries reached</div>
                </div>
                <div className="w-px h-12 bg-border-strong" />
                <div className="text-center">
                  <div className="font-display text-3xl font-bold text-gradient">100%</div>
                  <div className="text-text-muted text-sm">Healthcare-focused</div>
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* Right side: photo + pillar cards stacked below */}
          <div className="space-y-5">
            {/*
             * PHOTO PLACEHOLDER — upload via Admin > Media Library → "who-we-are.jpg"
             * Type: Editorial / brand photography
             * Mood: Authoritative, warm, human — showcasing trust and expertise
             * Composition: Wide shot of a live AxisMed medical conference or hands-on surgical training workshop
             *              Multiple physicians engaged, large screen/projector visible, modern venue
             * Lighting: Stage lighting on presenter, warm ambient fill, audience in foreground bokeh
             * Environment: Premium hotel conference hall or modern simulation center, Middle East setting
             * Direction: Landscape orientation, high-resolution, avoid stock-photo look — real event candid
             */}
            <SectionReveal delay={0.08} direction="left">
              <div className="relative h-56 rounded-2xl overflow-hidden glass glow-border">
                <Image
                  src="https://images.unsplash.com/photo-1576089172869-4f5f6f315620?w=1200&h=600&q=80&auto=format&fit=crop"
                  alt="AxisMed medical conference — live event photography"
                  fill
                  className="object-cover object-center"
                  onError={() => {}}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-bg-base/30 to-bg-base/70" />
                {/* Placeholder label shown when image is missing */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-40">
                  <span className="text-purple-300 text-xs font-medium tracking-widest uppercase">Photo Placeholder</span>
                  <span className="text-white/40 text-[11px] text-center px-6 leading-relaxed">
                    Medical conference · wide-shot · stage lighting · premium venue
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-bg-base/70 via-transparent to-purple-900/30" />
                {/* Floating label */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">
                    Regional Healthcare Platform
                  </span>
                </div>
              </div>
            </SectionReveal>

            {/* Pillar cards */}
            <StaggerReveal
              className="space-y-4"
              direction="left"
              delay={0.14}
            >
              {pillars.map(({ icon: Icon, label, desc }) => (
                <motion.div
                  key={label}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="glass glow-border rounded-2xl p-5 flex items-start gap-5 hover:border-purple-500/30 transition-colors"
                >
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-purple-500/15 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white mb-1">{label}</h3>
                    <p className="text-text-secondary text-sm">{desc}</p>
                  </div>
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
