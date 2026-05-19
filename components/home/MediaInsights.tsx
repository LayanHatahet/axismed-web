"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Play, Mic, Image as ImageIcon, ArrowRight } from "lucide-react";
import { MotionBackground } from "@/components/ui/MotionBackground";
import { getFeaturedMedia } from "@/lib/data/media";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatDateShort } from "@/lib/utils/formatDate";

const typeIcon = {
  video: Play,
  podcast: Mic,
  interview: Mic,
  image: ImageIcon,
};

const typeBg = {
  video: "bg-purple-500/20 text-purple-400",
  podcast: "bg-violet-500/20 text-violet-400",
  interview: "bg-indigo-500/20 text-indigo-400",
  image: "bg-slate-500/20 text-slate-400",
};

export function MediaInsights() {
  const items = getFeaturedMedia();

  return (
    <section className="section-tonal relative py-28 overflow-hidden">
      <MotionBackground variant="deep" particles grid />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <SectionHeader
            eyebrow="Media & Insights"
            title="Latest"
            titleHighlight="Content & Highlights"
            subtitle="Event highlights, educational videos, interviews and podcast episodes from AxisMed."
            align="left"
            className="max-w-xl"
          />
          <Link
            href="/media"
            className="flex-shrink-0 inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            All Media <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = typeIcon[item.type] ?? Play;
            const iconStyle = typeBg[item.type] ?? "bg-purple-500/20 text-purple-400";

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Link href="/media" className="block">
                  <div className="glass glow-border rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all hover:shadow-[0_8px_32px_rgba(124,58,237,0.15)]">
                    {/*
                     * PHOTO PLACEHOLDER — upload via Admin > Media Library
                     * Type: Video/podcast thumbnail or event photo
                     * Mood: Dynamic, editorial, professional media production feel
                     * Composition: Surgeon/speaker in dramatic lighting for video; candid audience shot for events
                     * Lighting: Studio rim-lighting on subject, dark dramatic background
                     * Environment: Broadcast studio, operating theatre, or conference stage
                     * Direction: 16:9 crop, high contrast, subject offset-center (rule of thirds)
                     */}
                    <div className="relative h-48 bg-bg-elevated overflow-hidden">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        onError={() => {}}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-bg-base/30 to-bg-base/60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-bg-base/20 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-transparent" />
                      {/* Play/type icon centered */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-12 h-12 rounded-full ${iconStyle} flex items-center justify-center backdrop-blur-sm`}>
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${iconStyle} uppercase tracking-wider`}>
                          {item.type}
                        </span>
                      </div>
                      {item.duration && (
                        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                          {item.duration}
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="text-text-dim text-xs mb-2">{formatDateShort(item.date)}</div>
                      <h3 className="font-display text-base font-bold text-white mb-2 group-hover:text-purple-200 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-text-muted text-sm line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
