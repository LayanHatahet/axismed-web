"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Network, UserCheck, Microscope, Rocket, Layers, ChevronDown } from "lucide-react";

const reasons = [
  {
    num: "01", icon: BrainCircuit,
    title: "Deep Healthcare Industry Knowledge",
    short: "Industry fluency from GalMed & MedLab",
    description: "Our team's background through GalMed and MedLab means we understand the clinical, regulatory, and commercial realities of the healthcare industry — not just the theory. We speak the language of both clinicians and industry decision-makers, which changes how we design every program.",
    detail: "This means we ask the right questions from day one, anticipate compliance requirements, and build programs that work in the real environment of clinical practice — not just on paper.",
  },
  {
    num: "02", icon: Network,
    title: "Extensive Regional Network",
    short: "Trusted across the Middle East",
    description: "Years of operating across the Middle East have built us a trusted network of healthcare institutions, hospital groups, medical societies, and academic centers — connections that make every initiative easier to design and faster to execute.",
    detail: "When you need a venue, a faculty member, a regulatory contact, or an institution to co-host a program, we can make introductions that would otherwise take months to develop.",
  },
  {
    num: "03", icon: UserCheck,
    title: "Access to KOLs & Healthcare Institutions",
    short: "The right experts, engaged credibly",
    description: "We have established relationships with key opinion leaders across multiple specialties and geographies. We can identify, engage, and mobilize the right clinical experts for your program — quickly and credibly.",
    detail: "KOL relationships built on genuine scientific respect carry more weight than transactional arrangements. Our faculty come to programs because they trust the quality — and that trust transfers to your brand.",
  },
  {
    num: "04", icon: Microscope,
    title: "Cadaveric & Hands-on Education Experience",
    short: "Complex lab programs done right",
    description: "We have direct experience designing and running cadaveric training workshops — one of the most complex and high-value formats in medical education. From lab setup to faculty coordination and regulatory compliance, we manage it all.",
    detail: "Cadaveric programs require relationships with labs, anatomy departments, regulatory bodies, and senior surgical faculty simultaneously. We have managed this complexity and know how to make these programs run smoothly.",
  },
  {
    num: "05", icon: Rocket,
    title: "Experience Launching Medical Technologies",
    short: "From introduction to clinical adoption",
    description: "We have supported the introduction of innovative medical technologies into clinical practice, understanding how education, KOL engagement, and event strategy combine to build clinical product awareness and drive sustainable adoption.",
    detail: "Product adoption in healthcare is not a marketing problem — it is an education problem. We understand how surgeons and physicians learn, how they adopt new techniques, and how to build the clinical evidence and peer influence that drives real uptake.",
  },
  {
    num: "06", icon: Layers,
    title: "End-to-End Capabilities",
    short: "One partner. Complete delivery.",
    description: "Unlike single-service agencies, AxisMed covers education design, event management, and media production under one roof. Tighter integration, consistent quality, and a single accountable partner from concept to delivery.",
    detail: "When the same team designs the program, manages the event, and produces the media, the output is coherent — not cobbled together from different vendors with different standards.",
  },
];

export function WhyAxisMed() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="section-lift relative py-28 overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid opacity-60" />

      {/* Ghost watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-display font-black leading-none tracking-tighter"
          style={{ fontSize: "20vw", color: "rgba(164,158,207,0.18)" }}>
          AXISMED
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16">
          <p className="text-purple-600 text-xs font-semibold tracking-[0.20em] uppercase mb-4">Why AxisMed</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "#12082C" }}>
            What Sets Us <span className="text-gradient">Apart</span>
          </h2>
          <p className="text-lg max-w-2xl" style={{ color: "#484575" }}>
            Rooted in genuine experience — not aspirational statements. Six real differentiators.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-2">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            const isOpen = expanded === i;

            return (
              <motion.div key={r.num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22,1,0.36,1] }}>

                <button onClick={() => setExpanded(isOpen ? null : i)}
                  className="w-full group relative rounded-2xl text-left transition-all duration-300 overflow-hidden"
                  style={{
                    background: isOpen ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.75)",
                    border: `1px solid ${isOpen ? "rgba(164,158,207,0.40)" : "rgba(164,158,207,0.22)"}`,
                    boxShadow: isOpen ? "0 8px 32px rgba(136,128,184,0.12)" : "0 2px 8px rgba(136,128,184,0.05)",
                  }}>

                  {/* Left accent bar */}
                  <motion.div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
                    style={{ background: "linear-gradient(180deg, #bcb8df, #8880b8)" }}
                    initial={{ scaleY: 0 }} animate={{ scaleY: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.3 }} />

                  {/* Header row */}
                  <div className="flex items-center gap-5 p-5 md:p-6">
                    <span className="font-display text-3xl font-black shrink-0 leading-none select-none transition-colors duration-300"
                      style={{ color: isOpen ? "rgba(136,128,184,0.75)" : "rgba(164,158,207,0.40)" }}>
                      {r.num}
                    </span>

                    <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300"
                      style={{ background: isOpen ? "rgba(136,128,184,0.14)" : "rgba(164,158,207,0.08)" }}>
                      <Icon className="w-5 h-5" style={{ color: isOpen ? "#8880b8" : "#a49ecf" }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base md:text-lg font-bold leading-snug transition-colors duration-300"
                        style={{ color: isOpen ? "#12082C" : "#2d2a52" }}>
                        {r.title}
                      </h3>
                      {!isOpen && (
                        <p className="text-sm mt-0.5 hidden sm:block" style={{ color: "#a49ecf" }}>{r.short}</p>
                      )}
                    </div>

                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="shrink-0">
                      <ChevronDown className="w-5 h-5" style={{ color: "#8880b8" }} />
                    </motion.div>
                  </div>

                  {/* Expanded */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}
                        className="overflow-hidden">
                        <div className="px-6 pb-7 pl-[5.5rem]">
                          <p className="leading-relaxed mb-4 text-[15px]" style={{ color: "#484575" }}>
                            {r.description}
                          </p>
                          <div className="rounded-xl p-4 border-l-2"
                            style={{ background: "rgba(164,158,207,0.07)", borderColor: "rgba(164,158,207,0.40)" }}>
                            <p className="text-sm leading-relaxed italic" style={{ color: "#726da0" }}>{r.detail}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
