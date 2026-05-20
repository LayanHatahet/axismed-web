"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronLeft, Sparkles, Clock, Layers, MapPin, Calendar, Monitor, Star, RotateCcw } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import type { PathwayResult } from "@/app/api/pathway/route";

/* ──────────────────────────────────────────────────────────
   QUESTION DEFINITIONS
────────────────────────────────────────────────────────── */

interface Option {
  label: string;
  icon: string;
  sub?: string;
}

interface Question {
  id: string;
  step: number;
  headline: string;
  sub: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: "specialty",
    step: 0,
    headline: "What is your primary surgical specialty?",
    sub: "We'll match programs built for your exact discipline.",
    options: [
      { label: "Oral & Maxillofacial Surgery", icon: "🦷", sub: "OMFS" },
      { label: "CMF / Craniofacial Surgery", icon: "🧠", sub: "Reconstruction & trauma" },
      { label: "Implantology / Prosthodontics", icon: "⚙️", sub: "Guided & digital implant" },
      { label: "Robotic / MIS Surgery", icon: "🤖", sub: "Minimally invasive" },
      { label: "Digital Surgery", icon: "💡", sub: "Technology-first practice" },
      { label: "General Surgery", icon: "🔬", sub: "Broad surgical practice" },
    ],
  },
  {
    id: "level",
    step: 1,
    headline: "Where are you in your career journey?",
    sub: "Every stage has its own pathway to mastery.",
    options: [
      { label: "Medical Student", icon: "📖", sub: "Pre-clinical / clinical years" },
      { label: "Resident / Trainee", icon: "🎓", sub: "In specialty training" },
      { label: "Practicing Surgeon", icon: "🩺", sub: "Post-training, in practice" },
      { label: "Senior Consultant", icon: "⭐", sub: "Established specialist" },
      { label: "Educator / Faculty", icon: "🏛️", sub: "Teaching & leading" },
      { label: "Industry Professional", icon: "💼", sub: "Med-tech, pharma, device" },
    ],
  },
  {
    id: "goal",
    step: 2,
    headline: "What's your primary learning goal?",
    sub: "This is the most important signal in your pathway.",
    options: [
      { label: "Build foundational skills", icon: "🧱", sub: "Strong clinical foundation" },
      { label: "Advance existing expertise", icon: "🚀", sub: "From good to exceptional" },
      { label: "Learn digital & AI tools", icon: "🤖", sub: "Technology in practice" },
      { label: "Master a specific technique", icon: "🎯", sub: "Deep, precise skill" },
      { label: "Lead or design training programs", icon: "🏗️", sub: "Education & mentorship" },
      { label: "Network with global leaders", icon: "🌍", sub: "Community & collaboration" },
    ],
  },
  {
    id: "region",
    step: 3,
    headline: "Where are you based?",
    sub: "We'll prioritize programs accessible in your region.",
    options: [
      { label: "UAE", icon: "🇦🇪", sub: "Dubai, Abu Dhabi, etc." },
      { label: "Saudi Arabia", icon: "🇸🇦", sub: "KSA" },
      { label: "GCC (other)", icon: "🌊", sub: "Kuwait, Qatar, Bahrain, Oman" },
      { label: "North Africa", icon: "🌅", sub: "Egypt, Jordan, Libya, etc." },
      { label: "Europe", icon: "🌍", sub: "EU / UK" },
      { label: "Global / Other", icon: "🌐", sub: "Travelling for training" },
    ],
  },
  {
    id: "timeline",
    step: 4,
    headline: "When are you looking to train?",
    sub: "We'll factor in enrollment windows and availability.",
    options: [
      { label: "Next month", icon: "⚡", sub: "Urgent — register now" },
      { label: "In 1-3 months", icon: "📅", sub: "Near-term planning" },
      { label: "In 3-6 months", icon: "🗓️", sub: "Planning ahead" },
      { label: "Planning for next year", icon: "🎯", sub: "Long-range" },
      { label: "Just exploring", icon: "🔍", sub: "No rush" },
    ],
  },
  {
    id: "format",
    step: 5,
    headline: "What type of program fits you best?",
    sub: "Your ideal learning environment shapes your outcome.",
    options: [
      { label: "Hands-on cadaveric", icon: "🔬", sub: "Real specimen simulation" },
      { label: "Workshop with models", icon: "🧩", sub: "High-fidelity phantoms" },
      { label: "Live surgery observation", icon: "👁️", sub: "Watch expert surgeons live" },
      { label: "Hybrid digital + practical", icon: "🖥️", sub: "Digital meets hands-on" },
      { label: "Online / remote", icon: "📡", sub: "Flexible, self-paced" },
      { label: "Conference / summit", icon: "🏛️", sub: "Networking + learning" },
    ],
  },
];

/* ──────────────────────────────────────────────────────────
   LOADING MESSAGES
────────────────────────────────────────────────────────── */

const LOADING_MSGS = [
  "Analyzing your clinical profile…",
  "Mapping your specialty to our program library…",
  "Weighing your learning goals…",
  "Calibrating to your career stage…",
  "Scoring 8 programs against your pathway…",
  "Generating your personalized recommendations…",
  "Crafting your pathway narrative…",
  "Almost ready…",
];

/* ──────────────────────────────────────────────────────────
   TYPES
────────────────────────────────────────────────────────── */

type Answers = {
  specialty: string;
  level: string;
  goal: string;
  region: string;
  timeline: string;
  format: string;
};

type Phase = "questions" | "loading" | "results";

/* ──────────────────────────────────────────────────────────
   CINEMATIC RINGS ANIMATION
────────────────────────────────────────────────────────── */

function LoadingRings() {
  return (
    <div className="relative w-56 h-56 mx-auto mb-12">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-purple-500/30"
          style={{ margin: `${i * 14}px` }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.04, 1] }}
          transition={{
            rotate: { duration: 3 + i * 1.2, repeat: Infinity, ease: "linear" },
            scale: { duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      ))}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/40 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-purple-400" />
        </div>
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   PROGRESS DOTS
────────────────────────────────────────────────────────── */

function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-12">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className={`rounded-full transition-all duration-500 ${
            i < step
              ? "bg-purple-400 w-6 h-1.5"
              : i === step
              ? "bg-purple-500 w-8 h-2"
              : "bg-white/10 w-4 h-1.5"
          }`}
          layout
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   OPTION CARD
────────────────────────────────────────────────────────── */

function OptionCard({
  option,
  selected,
  onClick,
  index,
}: {
  option: Option;
  selected: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      onClick={onClick}
      className={`relative group w-full text-left px-5 py-4 rounded-xl border transition-all duration-250 ${
        selected
          ? "border-purple-500 bg-purple-500/12 shadow-[0_0_20px_rgba(164,158,207,0.25)]"
          : "border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/6"
      }`}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
    >
      {selected && (
        <motion.div
          layoutId="option-selected"
          className="absolute inset-0 rounded-xl bg-purple-500/8"
          transition={{ duration: 0.2 }}
        />
      )}
      <div className="relative flex items-center gap-4">
        <span className="text-2xl leading-none shrink-0">{option.icon}</span>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium leading-tight ${selected ? "text-white" : "text-text-secondary group-hover:text-white"} transition-colors`}>
            {option.label}
          </div>
          {option.sub && (
            <div className="text-xs text-white/35 mt-0.5">{option.sub}</div>
          )}
        </div>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center shrink-0"
          >
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

/* ──────────────────────────────────────────────────────────
   PROGRAM RESULT CARD
────────────────────────────────────────────────────────── */

interface ProgramRec {
  title: string;
  tag: string;
  description: string;
  duration: string;
  level: string;
  href: string;
  accent: string;
  reason: string;
}

function PrimaryCard({ program, index }: { program: ProgramRec; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="relative rounded-2xl border overflow-hidden"
      style={{ borderColor: program.accent + "40" }}
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{ background: `radial-gradient(ellipse at 30% 40%, ${program.accent}, transparent 65%)` }}
      />
      <div className="relative p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-3"
              style={{ backgroundColor: program.accent + "20", color: program.accent }}
            >
              <Star className="w-3 h-3" />
              {program.tag}
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{program.title}</h3>
            <p className="text-text-secondary text-sm">{program.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-1.5 text-xs text-white/50 bg-white/5 rounded-lg px-3 py-1.5">
            <Clock className="w-3 h-3" />
            {program.duration}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/50 bg-white/5 rounded-lg px-3 py-1.5">
            <Layers className="w-3 h-3" />
            {program.level}
          </div>
        </div>

        {program.reason && (
          <div
            className="rounded-xl px-4 py-3 mb-6 text-sm text-white/70 italic border-l-2"
            style={{ backgroundColor: program.accent + "10", borderColor: program.accent + "60" }}
          >
            {program.reason}
          </div>
        )}

        <Link
          href={program.href}
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200"
          style={{
            backgroundColor: program.accent,
            boxShadow: `0 0 20px ${program.accent}40`,
          }}
        >
          View Program
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

function SupportCard({ program, index }: { program: ProgramRec; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.12, duration: 0.5 }}
      className="relative rounded-xl border border-white/8 bg-white/3 p-6 hover:border-white/15 transition-all duration-200"
    >
      <div
        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full mb-3"
        style={{ backgroundColor: program.accent + "18", color: program.accent }}
      >
        {program.tag}
      </div>
      <h4 className="text-base font-semibold text-white mb-1">{program.title}</h4>
      <p className="text-xs text-white/45 mb-4 line-clamp-2">{program.description}</p>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-white/40 bg-white/5 rounded-lg px-2.5 py-1">{program.duration}</span>
        <span className="text-xs text-white/40 bg-white/5 rounded-lg px-2.5 py-1">{program.level}</span>
      </div>

      {program.reason && (
        <p className="text-xs text-white/50 italic mb-4 border-l border-white/15 pl-3">
          {program.reason}
        </p>
      )}

      <Link
        href={program.href}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-white/60 hover:text-white transition-colors group"
      >
        Explore
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────
   MAIN PAGE
────────────────────────────────────────────────────────── */

export default function PathwayPage() {
  const [phase, setPhase] = useState<Phase>("questions");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [result, setResult] = useState<PathwayResult | null>(null);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const loadingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const question = QUESTIONS[step];
  const answerKeys: (keyof Answers)[] = ["specialty", "level", "goal", "region", "timeline", "format"];
  const currentAnswer = answers[answerKeys[step]];

  function selectOption(label: string) {
    const key = answerKeys[step];
    const newAnswers = { ...answers, [key]: label };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (step < QUESTIONS.length - 1) {
        setStep((s) => s + 1);
      } else {
        startLoading(newAnswers as Answers);
      }
    }, 260);
  }

  function goBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  function restart() {
    setPhase("questions");
    setStep(0);
    setAnswers({});
    setResult(null);
    setLoadingMsg(0);
  }

  async function startLoading(finalAnswers: Answers) {
    setPhase("loading");
    setLoadingMsg(0);

    loadingInterval.current = setInterval(() => {
      setLoadingMsg((m) => Math.min(m + 1, LOADING_MSGS.length - 1));
    }, 320);

    try {
      const res = await fetch("/api/pathway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalAnswers),
      });
      const data: PathwayResult = await res.json();
      setResult(data);
    } catch {
      setResult(null);
    } finally {
      if (loadingInterval.current) clearInterval(loadingInterval.current);
      setPhase("results");
    }
  }

  useEffect(() => {
    return () => {
      if (loadingInterval.current) clearInterval(loadingInterval.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg-dark text-white">
      <Navbar />

      {/* Background ambiance */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-purple-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-purple-900/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {/* ── QUESTIONS PHASE ── */}
          {phase === "questions" && (
            <motion.div
              key="questions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="min-h-screen flex flex-col items-center px-4 pt-28 pb-16"
            >
              <div className="w-full max-w-xl">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-10"
                >
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-5">
                    <Sparkles className="w-3 h-3" />
                    AI Pathway Intelligence
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                    Find Your Pathway
                  </h1>
                  <p className="text-text-secondary text-sm">
                    6 questions. A precision-matched program recommendation, built for you.
                  </p>
                </motion.div>

                <ProgressDots step={step} total={QUESTIONS.length} />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.32, ease: [0.25, 0.4, 0.25, 1] }}
                  >
                    <div className="mb-8">
                      <div className="text-xs font-semibold text-purple-400 mb-2 tracking-wide uppercase">
                        Question {step + 1} of {QUESTIONS.length}
                      </div>
                      <h2 className="text-xl font-bold text-white mb-1.5">
                        {question.headline}
                      </h2>
                      <p className="text-sm text-white/45">{question.sub}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {question.options.map((opt, i) => (
                        <OptionCard
                          key={opt.label}
                          option={opt}
                          selected={currentAnswer === opt.label}
                          onClick={() => selectOption(opt.label)}
                          index={i}
                        />
                      ))}
                    </div>

                    {step > 0 && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={goBack}
                        className="mt-6 flex items-center gap-2 text-sm text-white/35 hover:text-white/70 transition-colors mx-auto"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </motion.button>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ── LOADING PHASE ── */}
          {phase === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen flex flex-col items-center justify-center px-4"
            >
              <LoadingRings />

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4">
                  Building Your Pathway
                </h2>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingMsg}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-white/45"
                  >
                    {LOADING_MSGS[loadingMsg]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>

              <motion.div
                className="mt-10 flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {LOADING_MSGS.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i <= loadingMsg ? "bg-purple-500" : "bg-white/10"
                    }`}
                    style={{ width: i <= loadingMsg ? "24px" : "8px" }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ── RESULTS PHASE ── */}
          {phase === "results" && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="min-h-screen px-4 pt-28 pb-20"
            >
              <div className="max-w-4xl mx-auto">
                {/* Profile badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3 mb-8"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold bg-purple-500/15 border border-purple-500/25 text-purple-300 px-4 py-2 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI-Generated Pathway
                  </div>
                  <div className="text-xs text-white/30 bg-white/5 px-3 py-2 rounded-full">
                    {result.profileLabel}
                  </div>
                  <div className="text-xs text-white/30 bg-white/5 px-3 py-2 rounded-full hidden sm:block">
                    {answers.specialty}
                  </div>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
                >
                  {result.headline}
                </motion.h1>

                {/* Intro */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-text-secondary text-base leading-relaxed max-w-2xl mb-12"
                >
                  {result.intro}
                </motion.p>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="origin-left h-px bg-gradient-to-r from-purple-500/40 via-white/10 to-transparent mb-12"
                />

                {/* Section: Primary recommendation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="mb-4"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 tracking-wide uppercase mb-4">
                    <Star className="w-3.5 h-3.5" />
                    Your Primary Program
                  </div>
                  <PrimaryCard program={result.primary} index={0} />
                </motion.div>

                {/* Section: Supporting programs */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="mt-10 mb-4"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-white/35 tracking-wide uppercase mb-4">
                    <Layers className="w-3.5 h-3.5" />
                    Supporting Your Pathway
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.supporting.map((p, i) => (
                      <SupportCard key={p.title} program={p} index={i} />
                    ))}
                  </div>
                </motion.div>

                {/* Timeline note */}
                {result.timelineNote && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-10 flex items-start gap-3 rounded-xl border border-white/8 bg-white/3 px-5 py-4"
                  >
                    <Calendar className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-white/60">{result.timelineNote}</p>
                  </motion.div>
                )}

                {/* CTA bar */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-12 flex flex-col sm:flex-row items-center gap-4 justify-between p-6 rounded-2xl border border-purple-500/20 bg-purple-500/5"
                >
                  <div>
                    <p className="text-white font-semibold mb-1">Ready to take the next step?</p>
                    <p className="text-xs text-white/45">Our team can answer questions and help you register.</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={restart}
                      className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors px-4 py-2 rounded-xl border border-white/8 hover:border-white/20"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restart
                    </button>
                    <a
                      href="https://wa.me/971501897038"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(164,158,207,0.3)]"
                    >
                      Talk to the Team
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ── RESULTS — no data fallback ── */}
          {phase === "results" && !result && (
            <motion.div
              key="results-error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
            >
              <p className="text-white/50 mb-6 text-sm">
                We couldn't generate your pathway. Please try again.
              </p>
              <button
                onClick={restart}
                className="flex items-center gap-2 bg-purple-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
