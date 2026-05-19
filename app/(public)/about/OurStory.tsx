"use client";

import { useEffect, useState } from "react";
import { SectionReveal, StaggerReveal } from "@/components/ui/SectionReveal";
import { CheckCircle2 } from "lucide-react";
import type { WebsiteContent } from "@/lib/types";

const milestones = [
  "Identified the gap in high-quality, regionally focused medical education",
  "Built a network of premier surgical faculty and industry partnerships",
  "Launched the first cadaveric surgical training programs in the UAE",
  "Expanded into healthcare media production and digital content",
  "Established strategic collaborations with global medical device leaders",
];

export function OurStory() {
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((c: WebsiteContent) => {
        if (c?.about?.story?.image) setImage(c.about.story.image);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="section-white relative py-28">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Text */}
          <div>
            <SectionReveal>
              <p className="text-purple-400 text-xs font-semibold tracking-[0.18em] uppercase mb-4">Our Background</p>
            </SectionReveal>
            <SectionReveal delay={0.07}>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Built from a{" "}
                <span className="text-gradient">genuine need</span>{" "}
                in regional healthcare
              </h2>
            </SectionReveal>
            <SectionReveal delay={0.13}>
              <p className="text-text-secondary leading-relaxed mb-5">
                AxisMed was established in response to a growing demand for premium,
                professionally managed medical education in the Middle East. While global
                standards of surgical practice were rapidly evolving, the region lacked
                a dedicated platform capable of delivering world-class training experiences
                at scale and with the level of professional care that healthcare education demands.
              </p>
            </SectionReveal>
            <SectionReveal delay={0.18}>
              <p className="text-text-secondary leading-relaxed mb-5">
                We recognized that healthcare professionals in the region deserved more
                than generic CME events — they needed immersive, evidence-based, hands-on
                programs delivered by internationally recognized faculty in state-of-the-art
                facilities. That insight became the founding principle of AxisMed.
              </p>
            </SectionReveal>
            <SectionReveal delay={0.23}>
              <p className="text-text-secondary leading-relaxed">
                Today, AxisMed operates at the intersection of surgical education, healthcare
                media, and professional communication — building the infrastructure that the
                region's medical community needs to learn, connect, and grow.
              </p>
            </SectionReveal>
          </div>

          {/* Right column: story photo + milestones */}
          <div className="space-y-6">
            {/* Story photo — shown only when set in admin */}
            {image && (
              <SectionReveal delay={0.08} direction="left">
                <div className="rounded-2xl overflow-hidden border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt="Our Story"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </SectionReveal>
            )}

            <SectionReveal delay={image ? 0.14 : 0.1} direction="left">
              <div className="glass glow-border rounded-2xl p-8">
                <h3 className="font-display text-xl font-bold text-white mb-6">Our Journey</h3>
                <StaggerReveal direction="left" stagger={0.08}>
                  {milestones.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 py-4 border-b border-border last:border-0">
                      <CheckCircle2 className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                      <span className="text-text-secondary text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </StaggerReveal>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
