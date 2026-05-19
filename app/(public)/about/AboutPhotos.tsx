"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { GalleryPhoto } from "@/app/api/gallery/route";

export function AboutPhotos() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((all: GalleryPhoto[]) => {
        const filtered = all.filter(
          (p) => p.category === "Team" || p.category === "About"
        );
        setPhotos(filtered.slice(0, 16));
      })
      .catch(() => {});
  }, []);

  if (photos.length === 0) return null;

  const featured  = photos.slice(0, Math.min(3, photos.length));
  const rest      = photos.slice(featured.length);
  const hasHero   = photos.length >= 3;

  return (
    <section className="section-tonal relative overflow-hidden">
      {/* Top edge accent */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-purple-600/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-purple-800/6 rounded-full blur-[80px] pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10 pt-20 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-purple-400 text-xs font-semibold tracking-[0.18em] uppercase mb-3"
        >
          Our Team & Moments
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.07 }}
          className="font-display text-4xl md:text-5xl font-bold text-white"
        >
          The People Behind{" "}
          <span className="text-gradient">AxisMed</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.13 }}
          className="text-text-muted text-base mt-4 max-w-xl mx-auto"
        >
          A glimpse into the professionals, events, and moments that define who we are.
        </motion.p>
      </div>

      <div className="relative z-10 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">

        {/* ── Featured hero row (3 photos in a cinematic layout) ── */}
        {hasHero && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-72 md:h-96">
            {/* Large left photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="col-span-1 md:col-span-2 group relative overflow-hidden rounded-2xl border border-white/8 hover:border-purple-500/40 transition-all cursor-zoom-in"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured[0].url}
                alt={featured[0].caption || "AxisMed"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {featured[0].caption && (
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-sm font-medium">{featured[0].caption}</p>
                </div>
              )}
              {/* Subtle corner accent */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-purple-400/40 rounded-tl-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>

            {/* Right column: two stacked photos */}
            <div className="flex flex-col gap-4">
              {featured.slice(1, 3).map((photo, i) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
                  className="flex-1 group relative overflow-hidden rounded-2xl border border-white/8 hover:border-purple-500/40 transition-all cursor-zoom-in"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.caption || "AxisMed"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {photo.caption && (
                    <div className="absolute inset-x-0 bottom-0 p-3 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-white text-xs font-medium">{photo.caption}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── Remaining photos: masonry grid ── */}
        {rest.length > 0 && (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {rest.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="break-inside-avoid group relative overflow-hidden rounded-xl border border-white/8 hover:border-purple-500/40 transition-all cursor-zoom-in"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption || "AxisMed"}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {photo.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium">{photo.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Single or two photos fallback (no hero, just masonry) */}
        {!hasHero && (
          <div className="columns-2 sm:columns-3 gap-4 space-y-4">
            {photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="break-inside-avoid group relative overflow-hidden rounded-xl border border-white/8 hover:border-purple-500/40 transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption || "AxisMed"}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {photo.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium">{photo.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom edge accent */}
      <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
    </section>
  );
}
