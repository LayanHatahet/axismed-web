"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, ImageIcon, Mic } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { MediaItem } from "@/lib/types";
import { formatDateShort } from "@/lib/utils/formatDate";

const typeIcon = { video: Play, podcast: Mic, interview: Mic, image: ImageIcon } as const;

export function MediaGallery() {
  const [items, setItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    fetch("/api/media")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="relative py-28 section-white" id="gallery">
      <div className="absolute inset-0 bg-mesh" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Portfolio"
          title="Media Gallery &"
          titleHighlight="Portfolio"
          subtitle="A selection of our latest productions, event coverage, and educational content."
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const Icon = typeIcon[item.type] ?? ImageIcon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className="group cursor-pointer"
              >
                <div className="glass glow-border rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all hover:shadow-[0_8px_32px_rgba(164,158,207,0.15)]">
                  <div className="relative h-52 bg-bg-elevated flex items-center justify-center overflow-hidden">
                    {item.thumbnail ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.thumbnail} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        {item.type !== "image" && (
                          <div className="relative z-10 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 flex items-center justify-center transition-colors">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-bg-base/70" />
                        <div className="relative z-10 flex flex-col items-center gap-3">
                          <div className="w-14 h-14 rounded-full bg-purple-500/20 group-hover:bg-purple-500/30 flex items-center justify-center transition-colors">
                            <Icon className="w-6 h-6 text-purple-400" />
                          </div>
                          <span className="text-xs text-purple-300 font-semibold tracking-wider uppercase">{item.category}</span>
                        </div>
                      </>
                    )}
                    {item.duration && (
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md backdrop-blur-sm z-10">
                        {item.duration}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="text-text-dim text-xs mb-2">{formatDateShort(item.date)}</div>
                    <h3 className="font-display text-sm font-bold text-white leading-snug line-clamp-2">{item.title}</h3>
                    {item.description && <p className="text-text-muted text-xs mt-1.5 line-clamp-2">{item.description}</p>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
