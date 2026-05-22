"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MotionBackground } from "@/components/ui/MotionBackground";
import { CheckCircle2, ArrowRight } from "lucide-react";

const benefits = [
  "Brand visibility in front of 500+ healthcare professionals per event",
  "Speaking slots, exhibition space, and symposium co-development",
  "Branded content integration across our media production network",
  "Access to curated faculty and key opinion leader relationships",
  "Post-event reports with engagement metrics and attendee insights",
];

export function SponsorCTA() {
  return (
    <section className="relative py-28 overflow-hidden bg-bg-base">
      <MotionBackground variant="deep" particles scanLine={false} grid />

      {/* Diagonal accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(136,128,184,0.08) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <p className="text-purple-400 text-xs font-semibold tracking-[0.18em] uppercase mb-4">
              Partner With AxisMed
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
              Reach the{" "}
              <span className="text-gradient">Surgeons &amp; Specialists</span>{" "}
              Who Matter
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-8">
              AxisMed connects pharmaceutical companies, medical device manufacturers, and healthcare institutions directly with practicing specialists through world-class education and scientific events.
            </p>

            <ul className="space-y-3 mb-10">
              {benefits.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                  className="flex items-start gap-3 text-text-secondary text-sm leading-relaxed"
                >
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  {b}
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-[0_0_28px_rgba(164,158,207,0.4)] hover:shadow-[0_0_40px_rgba(164,158,207,0.6)] text-sm"
              >
                Become a Sponsor
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/partners"
                className="inline-flex items-center gap-2 border border-white/15 hover:border-purple-400/40 text-text-secondary hover:text-white font-medium px-7 py-3.5 rounded-xl transition-all text-sm"
              >
                View Our Partners
              </Link>
            </div>
          </motion.div>

          {/* Right — highlight card */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
            className="glass glow-border rounded-2xl p-10 border-purple-500/20"
          >
            <p className="text-purple-400 text-xs font-semibold tracking-[0.15em] uppercase mb-6">
              Sponsorship Packages
            </p>

            {[
              { tier: "Gold", desc: "Premier logo placement, keynote speaking slot, dedicated exhibition stand, full attendee list", color: "#f5c518" },
              { tier: "Silver", desc: "Logo on all materials, exhibition stand, branded session co-hosting, highlight reel inclusion", color: "#a49ecf" },
              { tier: "Bronze", desc: "Logo on event materials and website, exhibition table, social media mentions", color: "#cd7f32" },
            ].map((pkg, i) => (
              <motion.div
                key={pkg.tier}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-4 pb-6 mb-6 border-b border-white/8 last:border-0 last:mb-0 last:pb-0"
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0 mt-2"
                  style={{ background: pkg.color, boxShadow: `0 0 8px ${pkg.color}80` }}
                />
                <div>
                  <div className="text-white font-semibold mb-1">{pkg.tier} Sponsor</div>
                  <div className="text-text-secondary text-sm leading-relaxed">{pkg.desc}</div>
                </div>
              </motion.div>
            ))}

            <Link
              href="/contact"
              className="mt-2 block text-center text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              Request a custom package →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
