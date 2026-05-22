"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "What types of programs does AxisMed offer?",
    a: "AxisMed offers hands-on surgical training workshops, cadaveric labs, scientific conferences, CME-accredited courses, simulation training, and medical media production — all designed for practicing healthcare professionals.",
  },
  {
    q: "Are AxisMed courses CME / CPD accredited?",
    a: "Yes. Our programs are developed to meet CME and CPD accreditation standards. Specific credit hours are listed on each course page. Certificates are issued upon successful completion.",
  },
  {
    q: "How do I register for a course or event?",
    a: "Click 'Register' on any course page, complete the registration form, and proceed to payment. You will receive a confirmation email with all event details and pre-course materials.",
  },
  {
    q: "What is the typical group size for hands-on workshops?",
    a: "To ensure quality learning, hands-on workshops are limited to small groups — usually 6 to 20 participants depending on the format. This guarantees direct faculty access and meaningful practice time.",
  },
  {
    q: "Do you offer accommodation or travel assistance?",
    a: "We can recommend partner hotels near the venue and assist with group bookings. Contact our team after registration and we will provide options based on your travel dates.",
  },
  {
    q: "What is the cancellation and refund policy?",
    a: "Cancellations made 30+ days before the event receive a full refund. Within 14–29 days, a 50% credit is issued. Less than 14 days prior, no refund is available but your registration may be transferred to a colleague or a future event.",
  },
  {
    q: "Can my organization host a private course or workshop?",
    a: "Yes. AxisMed offers fully customized in-house programs for hospitals, medical societies, and device companies — including curriculum design, faculty sourcing, venue logistics, and media production.",
  },
  {
    q: "How can a pharmaceutical or medical device company partner with AxisMed?",
    a: "We welcome industry partnerships for sponsorship, co-development, and exhibition. Visit our Sponsor page or contact us directly to discuss packages tailored to your commercial and scientific objectives.",
  },
];

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-purple-200/60 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span
          className="font-semibold text-base leading-snug transition-colors duration-200"
          style={{ color: isOpen ? "#383563" : "#1e1b35" }}
        >
          {q}
        </span>
        <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center border transition-colors duration-200"
          style={{
            borderColor: isOpen ? "#8880b8" : "#cac6e6",
            background: isOpen ? "#8880b8" : "transparent",
          }}
        >
          {isOpen
            ? <Minus className="w-3 h-3 text-white" />
            : <Plus className="w-3 h-3" style={{ color: "#8880b8" }} />
          }
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed" style={{ color: "#4a4570" }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #edeaf8 0%, #e8e5f4 50%, #ede9f7 100%)" }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(104,96,168,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(104,96,168,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 items-start">
          {/* Left — header */}
          <div className="lg:sticky lg:top-28">
            <p style={{ color: "#8880b8", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              FAQ
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-5" style={{ color: "#383563" }}>
              Frequently Asked{" "}
              <span style={{ color: "#726da0" }}>Questions</span>
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: "#5e5a88" }}>
              Everything you need to know before registering for an AxisMed course or event.
              Can't find your answer?
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
              style={{
                background: "#8880b8",
                color: "#fff",
                boxShadow: "0 0 20px rgba(136,128,184,0.35)",
              }}
            >
              Contact Us
            </a>
          </div>

          {/* Right — accordion */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl px-8 py-4 border border-purple-200/50"
          >
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                q={faq.q}
                a={faq.a}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
