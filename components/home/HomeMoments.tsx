"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { GalleryPhoto } from "@/app/api/gallery/route";

export function HomeMoments() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((all: GalleryPhoto[]) => {
        const filtered = all.filter((p) => p.category === "Home");
        setPhotos(filtered.slice(0, 8));
      })
      .catch(() => {});
  }, []);

  if (photos.length === 0) return null;

  return (
    <section className="section-tonal relative py-20 overflow-hidden">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-purple-400 text-xs font-semibold tracking-[0.18em] uppercase mb-3"
        >
          Our World
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.07 }}
          className="font-display text-4xl md:text-5xl font-bold text-white"
        >
          Moments from <span className="text-gradient">AxisMed</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {photos.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className={`relative group overflow-hidden rounded-2xl border border-border hover:border-purple-500/25 transition-all ${
              i === 0 || i === 5 ? "row-span-2" : ""
            }`}
            style={{ aspectRatio: i === 0 || i === 5 ? "3/4" : "4/3" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={photo.caption || "AxisMed"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {photo.caption && (
              <div className="absolute inset-x-0 bottom-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-xs font-medium">{photo.caption}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
