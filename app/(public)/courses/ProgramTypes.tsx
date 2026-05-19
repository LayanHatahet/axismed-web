"use client";

import { motion } from "framer-motion";
import { Microscope, Wrench, Monitor, Building2, Lock } from "lucide-react";

const types = [
  { icon: Microscope, label: "Cadaveric Training",          desc: "Anatomy lab with real specimens" },
  { icon: Wrench,    label: "Hands-on Workshops",           desc: "Practical surgical simulation" },
  { icon: Monitor,   label: "Digital Surgery Programs",     desc: "Virtual planning & navigation" },
  { icon: Building2, label: "Industry Educational Events",  desc: "Company-sponsored symposiums" },
  { icon: Lock,      label: "Custom Private Training",      desc: "Bespoke closed-group programs" },
];

export function ProgramTypes() {
  return (
    <section className="py-16 bg-bg-dark border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-4 overflow-x-auto pb-2">
          {types.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.button
                key={t.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -2 }}
                className="flex-shrink-0 flex items-center gap-3 px-5 py-4 glass glow-border rounded-xl hover:border-purple-500/30 transition-all text-left group"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-500/12 group-hover:bg-purple-500/20 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium leading-tight">{t.label}</div>
                  <div className="text-text-muted text-xs mt-0.5">{t.desc}</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
