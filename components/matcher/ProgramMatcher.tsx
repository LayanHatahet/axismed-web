"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, RotateCcw, ExternalLink } from "lucide-react";
import Link from "next/link";

/* ──────────────────────────────────────────────────────────
   DATA
────────────────────────────────────────────────────────── */

const STEPS = [
  {
    id: "specialty",
    question: "What is your medical specialty?",
    sub: "We'll tailor your pathway to your clinical background.",
    options: [
      { label: "General & Laparoscopic Surgery", value: "surgery" },
      { label: "Orthopedics & Trauma",           value: "ortho"   },
      { label: "Cardiology & Vascular",          value: "cardio"  },
      { label: "Neurology & Neurosurgery",       value: "neuro"   },
      { label: "Radiology & Imaging",            value: "radio"   },
      { label: "Emergency & Critical Care",      value: "em"      },
    ],
  },
  {
    id: "goal",
    question: "What are you looking to develop?",
    sub: "Your goal shapes the depth and focus of your recommended programs.",
    options: [
      { label: "Advanced Clinical & Surgical Skills", value: "clinical"    },
      { label: "Digital Medicine & AI",               value: "digital"     },
      { label: "Robotic & Minimally Invasive Surgery", value: "robotic"   },
      { label: "Leadership & Healthcare Management",  value: "leadership"  },
      { label: "Research & Academic Publishing",      value: "research"    },
    ],
  },
  {
    id: "level",
    question: "What is your current experience level?",
    sub: "Your stage of career determines the right entry point into each program.",
    options: [
      { label: "Resident / Fellow",     value: "resident"    },
      { label: "Specialist",            value: "specialist"  },
      { label: "Consultant",            value: "consultant"  },
      { label: "Professor / Director",  value: "director"    },
    ],
  },
  {
    id: "region",
    question: "Where are you based?",
    sub: "Some programs have region-specific sessions or local partnerships.",
    options: [
      { label: "GCC & Arabian Peninsula",  value: "gcc"      },
      { label: "North Africa & Levant",    value: "levant"   },
      { label: "Europe & United Kingdom",  value: "europe"   },
      { label: "Asia Pacific",             value: "asia"     },
      { label: "Americas",                 value: "americas" },
    ],
  },
] as const;

interface Program {
  title: string;
  tag: string;
  desc: string;
  duration: string;
  level: string;
  href: string;
  accent: string;
}

const ALL_PROGRAMS: Program[] = [
  {
    title: "Advanced Cadaveric Surgical Workshop",
    tag: "Hands-On Surgery",
    desc: "Immersive anatomy-based training designed for surgeons seeking mastery of complex procedures in a real-tissue environment.",
    duration: "3–5 Days",
    level: "Specialist & above",
    href: "/courses",
    accent: "#bcb8df",
  },
  {
    title: "Robotic Surgery Fundamentals Program",
    tag: "Robotic Surgery",
    desc: "Structured simulation and cadaveric curriculum for surgeons entering or advancing their robotic surgical practice.",
    duration: "1 Week",
    level: "Resident to Consultant",
    href: "/courses",
    accent: "#a49ecf",
  },
  {
    title: "AI in Healthcare — Clinical Intelligence",
    tag: "Digital Medicine",
    desc: "An applied program at the intersection of artificial intelligence, clinical decision-making, and the future of surgical practice.",
    duration: "2 Days Intensive",
    level: "All Levels",
    href: "/courses",
    accent: "#6366F1",
  },
  {
    title: "Surgical Leadership Academy",
    tag: "Leadership",
    desc: "Designed for senior clinicians ready to lead departments, institutions, and systems — combining strategy with medical expertise.",
    duration: "Modular, 6 Weeks",
    level: "Consultant & Director",
    href: "/courses",
    accent: "#bcb8df",
  },
  {
    title: "International CMF Surgery Course",
    tag: "CMF Surgery",
    desc: "European-certified craniomaxillofacial surgery training in partnership with leading institutions across France and Germany.",
    duration: "4 Days",
    level: "Specialist & above",
    href: "/courses",
    accent: "#cac6e6",
  },
  {
    title: "Emergency Medicine Innovation Summit",
    tag: "Emergency Medicine",
    desc: "A scientific and practical event exploring the next generation of tools, protocols, and technologies in emergency care.",
    duration: "2 Days",
    level: "All Levels",
    href: "/courses",
    accent: "#a49ecf",
  },
  {
    title: "Digital Radiology & AI Imaging",
    tag: "Radiology & AI",
    desc: "Intensive program on AI-assisted diagnostic imaging, radiomics, and the evolving role of the radiologist in a digital-first world.",
    duration: "3 Days",
    level: "Specialist & above",
    href: "/courses",
    accent: "#8880b8",
  },
  {
    title: "Global Surgical Research Program",
    tag: "Research",
    desc: "A structured pathway for clinicians pursuing academic publication, systematic review methodology, and international research collaboration.",
    duration: "8 Weeks Online",
    level: "All Levels",
    href: "/courses",
    accent: "#bcb8df",
  },
];

/* ──────────────────────────────────────────────────────────
   RECOMMENDATION ENGINE
────────────────────────────────────────────────────────── */

function recommend(specialty: string, goal: string, level: string, region: string): Program[] {
  const scores: Record<string, number> = {};
  ALL_PROGRAMS.forEach((p) => (scores[p.title] = 0));

  const bump = (title: string, n = 1) => {
    if (scores[title] !== undefined) scores[title] += n;
  };

  // By goal
  if (goal === "clinical")   { bump("Advanced Cadaveric Surgical Workshop", 3); bump("International CMF Surgery Course", 2); }
  if (goal === "digital")    { bump("AI in Healthcare — Clinical Intelligence", 3); bump("Digital Radiology & AI Imaging", 2); }
  if (goal === "robotic")    { bump("Robotic Surgery Fundamentals Program", 3); bump("Advanced Cadaveric Surgical Workshop", 1); }
  if (goal === "leadership") { bump("Surgical Leadership Academy", 3); bump("Global Surgical Research Program", 1); }
  if (goal === "research")   { bump("Global Surgical Research Program", 3); bump("AI in Healthcare — Clinical Intelligence", 1); }

  // By specialty
  if (specialty === "surgery") { bump("Advanced Cadaveric Surgical Workshop", 2); bump("Robotic Surgery Fundamentals Program", 1); }
  if (specialty === "ortho")   { bump("Advanced Cadaveric Surgical Workshop", 2); bump("Robotic Surgery Fundamentals Program", 2); }
  if (specialty === "cardio")  { bump("AI in Healthcare — Clinical Intelligence", 1); bump("Global Surgical Research Program", 1); }
  if (specialty === "neuro")   { bump("Advanced Cadaveric Surgical Workshop", 1); bump("Robotic Surgery Fundamentals Program", 2); }
  if (specialty === "radio")   { bump("Digital Radiology & AI Imaging", 3); bump("AI in Healthcare — Clinical Intelligence", 1); }
  if (specialty === "em")      { bump("Emergency Medicine Innovation Summit", 3); bump("AI in Healthcare — Clinical Intelligence", 1); }

  // By level
  if (level === "resident")   { bump("Global Surgical Research Program", 1); bump("Robotic Surgery Fundamentals Program", 1); }
  if (level === "consultant") { bump("Surgical Leadership Academy", 2); bump("International CMF Surgery Course", 1); }
  if (level === "director")   { bump("Surgical Leadership Academy", 3); }

  // By region
  if (region === "europe")  { bump("International CMF Surgery Course", 2); }
  if (region === "gcc")     { bump("Emergency Medicine Innovation Summit", 1); }

  return ALL_PROGRAMS
    .slice()
    .sort((a, b) => scores[b.title] - scores[a.title])
    .slice(0, 3);
}

/* ──────────────────────────────────────────────────────────
   SUB-COMPONENTS
────────────────────────────────────────────────────────── */

function StepCard({
  option,
  selected,
  onSelect,
}: {
  option: { label: string; value: string };
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="w-full text-left px-5 py-4 rounded-2xl transition-all duration-200 text-[0.82rem] font-medium"
      style={
        selected
          ? {
              background: "linear-gradient(135deg, rgba(164,158,207,0.18), rgba(107,63,192,0.12))",
              border: "1px solid rgba(164,158,207,0.45)",
              color: "#3D2878",
              boxShadow: "0 0 24px rgba(164,158,207,0.10)",
            }
          : {
              background: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(164,158,207,0.12)",
              color: "#3D2878",
            }
      }
    >
      <div className="flex items-center justify-between">
        <span>{option.label}</span>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(164,158,207,0.5)", border: "1px solid rgba(196,181,253,0.4)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-purple-200" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

function ResultCard({ program, index }: { program: Program; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-5 flex flex-col"
      style={{
        background: "rgba(255,255,255,0.75)",
        border: `1px solid rgba(164,158,207,0.14)`,
        boxShadow: `0 4px 24px rgba(164,158,207,0.06)`,
      }}
    >
      <div
        className="inline-block self-start text-[0.58rem] font-semibold tracking-[0.22em] uppercase px-2.5 py-1 rounded-full mb-3"
        style={{ background: `${program.accent}18`, color: program.accent, border: `1px solid ${program.accent}30` }}
      >
        {program.tag}
      </div>
      <h4 className="text-[0.86rem] font-semibold leading-snug mb-2.5" style={{ color: "#12082C" }}>
        {program.title}
      </h4>
      <p className="text-[0.75rem] leading-relaxed flex-1 mb-4" style={{ color: "#6B58A2" }}>
        {program.desc}
      </p>
      <div className="flex items-center gap-3 mb-4">
        {[program.duration, program.level].map((tag) => (
          <span key={tag}
            className="text-[0.62rem] tracking-wide px-2.5 py-1 rounded-lg"
            style={{ background: "rgba(136,128,184,0.1)", color: "rgba(164,158,207,0.6)", border: "1px solid rgba(164,158,207,0.12)" }}>
            {tag}
          </span>
        ))}
      </div>
      <Link href={program.href}>
        <motion.div
          whileHover={{ x: 3 }}
          className="flex items-center gap-2 text-[0.73rem] font-semibold"
          style={{ color: "rgba(164,158,207,0.7)" }}
        >
          <span>View Program</span>
          <ExternalLink size={11} />
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────
   MAIN EXPORT
────────────────────────────────────────────────────────── */

export function ProgramMatcher() {
  const [stepIdx, setStepIdx]   = useState(0);
  const [answers, setAnswers]   = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(false);
  const [results, setResults]   = useState<Program[] | null>(null);

  const currentStep = STEPS[stepIdx];
  const selected    = answers[currentStep?.id];

  const handleSelect = useCallback((value: string) => {
    const step = STEPS[stepIdx];
    const next = { ...answers, [step.id]: value };
    setAnswers(next);

    if (stepIdx < STEPS.length - 1) {
      setTimeout(() => setStepIdx((i) => i + 1), 260);
    } else {
      // Final step — show loading then results
      setTimeout(() => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setResults(recommend(next.specialty, next.goal, next.level, next.region));
        }, 2200);
      }, 260);
    }
  }, [stepIdx, answers]);

  const reset = useCallback(() => {
    setStepIdx(0); setAnswers({}); setResults(null); setLoading(false);
  }, []);

  return (
    <section className="relative py-24 overflow-hidden" style={{ backgroundColor: "#F5F1FF" }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(164,158,207,0.06) 0%, transparent 70%)" }} />

      <div className="max-w-3xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 text-[0.62rem] font-semibold tracking-[0.28em] uppercase mb-5 px-4 py-1.5 rounded-full"
            style={{ background: "rgba(164,158,207,0.08)", border: "1px solid rgba(164,158,207,0.2)", color: "#6B3FC0" }}>
            <Sparkles size={10} />
            AI Program Matcher
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "#12082C", letterSpacing: "-0.02em" }}>
            Find Your Pathway
          </h2>
          <p className="max-w-md mx-auto text-[0.88rem] leading-relaxed"
            style={{ color: "#6B58A2" }}>
            Answer four questions and receive a personalized educational pathway curated for your specialty and goals.
          </p>
        </motion.div>

        {/* Panel */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.88)",
            border: "1px solid rgba(164,158,207,0.14)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            boxShadow: "0 0 80px rgba(164,158,207,0.06), 0 8px 40px rgba(164,158,207,0.05)",
          }}
        >
          {/* Progress bar */}
          {!results && !loading && (
            <div className="h-px w-full" style={{ background: "rgba(164,158,207,0.1)" }}>
              <motion.div
                className="h-full"
                style={{ background: "linear-gradient(90deg, rgba(136,128,184,0.8), rgba(164,158,207,0.6))" }}
                animate={{ width: `${((stepIdx) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          )}

          <div className="px-8 py-10">
            <AnimatePresence mode="wait">

              {/* Loading state */}
              {loading && (
                <motion.div key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-16 gap-6"
                >
                  <div className="relative w-16 h-16">
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ border: "1px solid rgba(164,158,207,0.3)" }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute inset-2 rounded-full"
                      style={{ border: "1px solid rgba(196,181,253,0.2)" }}
                      animate={{ rotate: -360 }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles size={16} color="#bcb8df" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[0.86rem] font-semibold mb-1.5" style={{ color: "#12082C" }}>
                      Analyzing your profile
                    </div>
                    <div className="text-[0.74rem]" style={{ color: "#6B58A2" }}>
                      Generating your recommended educational pathway…
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {[0,1,2].map(i => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "rgba(164,158,207,0.6)" }}
                        animate={{ y: [0,-5,0], opacity: [0.3,1,0.3] }}
                        transition={{ duration: 1.1, repeat: Infinity, delay: i*0.2 }} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Results */}
              {results && !loading && (
                <motion.div key="results"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="inline-flex items-center gap-2 text-[0.62rem] tracking-[0.2em] uppercase mb-1.5"
                        style={{ color: "#6B3FC0" }}>
                        <Sparkles size={9} /> Your Pathway
                      </div>
                      <h3 className="text-[1.1rem] font-bold" style={{ color: "#12082C" }}>
                        Recommended Programs
                      </h3>
                    </div>
                    <button onClick={reset}
                      className="flex items-center gap-1.5 text-[0.68rem] tracking-wide px-3 py-1.5 rounded-xl transition-all duration-200"
                      style={{ color: "rgba(164,158,207,0.5)", border: "1px solid rgba(164,158,207,0.12)" }}
                      onMouseEnter={e => { e.currentTarget.style.color = "rgba(196,181,253,0.8)"; e.currentTarget.style.borderColor = "rgba(164,158,207,0.3)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "rgba(164,158,207,0.5)"; e.currentTarget.style.borderColor = "rgba(164,158,207,0.12)"; }}>
                      <RotateCcw size={11} /> Restart
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    {results.map((p, i) => <ResultCard key={p.title} program={p} index={i} />)}
                  </div>
                  <div className="mt-6 text-center">
                    <Link href="/courses">
                      <motion.span whileHover={{ x: 3 }}
                        className="inline-flex items-center gap-2 text-[0.74rem] font-semibold"
                        style={{ color: "rgba(164,158,207,0.6)" }}>
                        Browse all programs <ArrowRight size={12} />
                      </motion.span>
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Active step */}
              {!results && !loading && (
                <motion.div key={`step-${stepIdx}`}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.36, ease: [0.22,1,0.36,1] }}
                >
                  <div className="mb-1 text-[0.62rem] tracking-[0.24em] uppercase"
                    style={{ color: "#6B3FC0" }}>
                    Step {stepIdx + 1} of {STEPS.length}
                  </div>
                  <h3 className="text-[1.2rem] font-bold mb-2" style={{ color: "#12082C" }}>
                    {currentStep.question}
                  </h3>
                  <p className="text-[0.77rem] mb-7" style={{ color: "#6B58A2" }}>
                    {currentStep.sub}
                  </p>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {currentStep.options.map((opt) => (
                      <StepCard key={opt.value} option={opt}
                        selected={selected === opt.value}
                        onSelect={() => handleSelect(opt.value)} />
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
