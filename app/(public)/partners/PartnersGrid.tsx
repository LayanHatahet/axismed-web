"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Partner, PartnerCategory } from "@/lib/types";

const CATEGORIES: PartnerCategory[] = [
  "Industry Partner",
  "Healthcare Institution",
  "Scientific Collaborator",
  "Training Facility",
  "Media Partner",
];

export function PartnersGrid() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    fetch("/api/partners")
      .then((r) => r.json())
      .then(setPartners)
      .catch(() => {});
  }, []);

  if (partners.length === 0) return null;

  return (
    <section className="py-24 section-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Our Partners"
          title="The AxisMed"
          titleHighlight="Partner Network"
          subtitle="A curated network of industry leaders, healthcare institutions, and scientific collaborators united around advancing medical education."
          className="mb-16"
        />

        <div className="space-y-16">
          {CATEGORIES.map((cat) => {
            const items = partners.filter((p) => p.category === cat);
            if (!items.length) return null;
            return (
              <div key={cat}>
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="font-display text-lg font-semibold text-white">{cat}s</h3>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-text-muted text-sm">{items.length}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {items.map((partner, i) => (
                    <motion.a
                      key={partner.id}
                      href={partner.website || undefined}
                      target={partner.website ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      whileHover={{ scale: 1.04, y: -2 }}
                      className="glass glow-border rounded-xl flex flex-col items-center justify-center h-24 px-4 gap-2 hover:border-purple-500/30 transition-all group cursor-pointer"
                    >
                      {partner.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="max-h-10 max-w-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <span className="text-text-muted group-hover:text-text-secondary text-xs font-medium text-center transition-colors leading-tight">
                          {partner.name}
                        </span>
                      )}
                    </motion.a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
