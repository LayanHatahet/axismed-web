"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { X, Send, Sparkles, ArrowRight, Users } from "lucide-react";

/* ──────────────────────────────────────────────────────────
   TYPES
────────────────────────────────────────────────────────── */

interface Msg {
  id: string;
  role: "ai" | "user";
  content: string;
}

interface Lead {
  name: string | null;
  specialty: string | null;
  email: string | null;
  interest: string | null;
}

/* ──────────────────────────────────────────────────────────
   CONSTANTS
────────────────────────────────────────────────────────── */

// Replace with your actual WhatsApp number (digits only, with country code)
const WHATSAPP = "971501897038";

const GREETING =
  `Welcome to AxisMed.\n\nI'm your personal healthcare concierge — here to guide you through our programs, answer your questions, and connect you with the right team.\n\nWhat brings you to AxisMed today?`;

const QUICK = [
  { label: "Explore Programs",    msg: "I'd like to learn about the surgical education programs." },
  { label: "Upcoming Events",     msg: "What medical events and workshops are coming up?" },
  { label: "Course Registration", msg: "I'm interested in registering for a course." },
  { label: "Speak with the Team", msg: "I'd like to speak with a member of the AxisMed team." },
] as const;

const uid = () => Math.random().toString(36).slice(2, 10);

function buildWhatsAppURL(messages: Msg[], lead: Lead): string {
  const userLines = messages
    .filter((m) => m.role === "user")
    .slice(0, 4)
    .map((m) => `"${m.content}"`)
    .join("\n");

  let text = "Hello AxisMed Team,\n\nI was just chatting with your AI Concierge and would like to continue this conversation with your team.\n\n";

  if (lead.name || lead.specialty || lead.interest) {
    text += "About me:\n";
    if (lead.name)      text += `• Name: ${lead.name}\n`;
    if (lead.specialty) text += `• Specialty: ${lead.specialty}\n`;
    if (lead.interest)  text += `• Interest: ${lead.interest}\n`;
    text += "\n";
  }

  if (userLines) {
    text += `My questions:\n${userLines}\n\n`;
  }

  text += "Looking forward to hearing from you. Thank you.";
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

/* ──────────────────────────────────────────────────────────
   TYPING DOTS
────────────────────────────────────────────────────────── */

function TypingDots() {
  return (
    <div className="flex items-start gap-2.5 mb-5">
      <div
        className="w-6 h-6 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5"
        style={{ background: "rgba(75,29,255,0.18)", border: "1px solid rgba(139,92,246,0.28)" }}
      >
        <Sparkles size={10} color="#9B5CF6" />
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5"
        style={{ background: "rgba(18,14,32,0.9)", border: "1px solid rgba(139,92,246,0.12)" }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{ width: 6, height: 6, background: "rgba(139,92,246,0.65)" }}
            animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   MESSAGE BUBBLE
────────────────────────────────────────────────────────── */

function Bubble({ msg }: { msg: Msg }) {
  const isAI = msg.role === "ai";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-start gap-2.5 mb-5 ${isAI ? "" : "flex-row-reverse"}`}
    >
      {isAI && (
        <div
          className="w-6 h-6 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5"
          style={{ background: "rgba(75,29,255,0.18)", border: "1px solid rgba(139,92,246,0.28)" }}
        >
          <Sparkles size={10} color="#9B5CF6" />
        </div>
      )}
      <div
        className={`max-w-[84%] px-4 py-3.5 text-[0.79rem] leading-[1.72] ${
          isAI ? "rounded-2xl rounded-tl-sm" : "rounded-2xl rounded-tr-sm"
        }`}
        style={
          isAI
            ? {
                background: "rgba(16,12,30,0.95)",
                border: "1px solid rgba(139,92,246,0.13)",
                color: "rgba(214,204,255,0.9)",
              }
            : {
                background: "linear-gradient(140deg, rgba(75,29,255,0.52), rgba(124,58,237,0.4))",
                border: "1px solid rgba(139,92,246,0.32)",
                color: "rgba(240,235,255,0.97)",
              }
        }
      >
        {msg.content.split("\n").map((line, i) =>
          line.trim() ? (
            <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
          ) : (
            <div key={i} className="h-1.5" />
          )
        )}
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────
   WHATSAPP HANDOFF CARD
────────────────────────────────────────────────────────── */

function HandoffCard({ waUrl }: { waUrl: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      className="mb-5 rounded-2xl overflow-hidden"
      style={{
        background: "rgba(14,10,28,0.96)",
        border: "1px solid rgba(139,92,246,0.22)",
        boxShadow: "0 0 40px rgba(75,29,255,0.10)",
      }}
    >
      {/* Top accent line */}
      <div
        className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)" }}
      />
      <div className="p-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(75,29,255,0.18)", border: "1px solid rgba(139,92,246,0.3)" }}
          >
            <Users size={12} color="#9B5CF6" />
          </div>
          <div>
            <div className="text-[0.75rem] font-semibold" style={{ color: "rgba(218,208,255,0.95)" }}>
              Connecting to our Team
            </div>
            <div className="text-[0.62rem] tracking-widest uppercase mt-0.5" style={{ color: "rgba(139,92,246,0.55)" }}>
              Seamless Handover
            </div>
          </div>
        </div>

        <p className="text-[0.75rem] leading-relaxed mb-4" style={{ color: "rgba(196,181,253,0.72)" }}>
          Our concierge team can continue assisting you directly. Your conversation and context have been preserved for a seamless handover.
        </p>

        <motion.a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-between px-4 py-3 rounded-xl text-[0.75rem] font-semibold tracking-wide"
          style={{
            background: "linear-gradient(135deg, rgba(75,29,255,0.45), rgba(124,58,237,0.35))",
            border: "1px solid rgba(139,92,246,0.38)",
            color: "rgba(224,214,255,0.96)",
          }}
        >
          <span>Continue with the Team</span>
          <ArrowRight size={13} />
        </motion.a>

        <p className="text-center text-[0.60rem] mt-2.5 tracking-wide" style={{ color: "rgba(139,92,246,0.35)" }}>
          Opens WhatsApp · Your context is included
        </p>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────
   LEAD BADGE  (subtle strip under header)
────────────────────────────────────────────────────────── */

function LeadBadge({ lead }: { lead: Lead }) {
  const parts: string[] = [];
  if (lead.name)      parts.push(lead.name);
  if (lead.specialty) parts.push(lead.specialty);
  if (!parts.length)  return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.4 }}
      className="px-5 py-2 flex items-center gap-2"
      style={{ borderBottom: "1px solid rgba(139,92,246,0.07)", background: "rgba(75,29,255,0.04)" }}
    >
      <motion.div
        className="w-1 h-1 rounded-full"
        style={{ background: "rgba(139,92,246,0.5)" }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      <span className="text-[0.60rem] tracking-widest uppercase" style={{ color: "rgba(139,92,246,0.5)" }}>
        Concierge remembers:
      </span>
      <span className="text-[0.63rem] font-medium" style={{ color: "rgba(196,181,253,0.65)" }}>
        {parts.join(" · ")}
      </span>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────
   CHAT PANEL
────────────────────────────────────────────────────────── */

function Panel({
  messages, isTyping, input, onInput, onSend, onClose,
  showQuick, onQuick, lead, handoff, waUrl, onRequestHandoff,
}: {
  messages: Msg[];
  isTyping: boolean;
  input: string;
  onInput: (v: string) => void;
  onSend: () => void;
  onClose: () => void;
  showQuick: boolean;
  onQuick: (msg: string) => void;
  lead: Lead;
  handoff: boolean;
  waUrl: string;
  onRequestHandoff: () => void;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, handoff]);

  const hasLead = !!(lead.name || lead.specialty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 22, scale: 0.96 }}
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      className="fixed z-50 flex flex-col overflow-hidden"
      style={{
        bottom: 88,
        right: 24,
        width: "min(400px, calc(100vw - 48px))",
        height: "min(620px, calc(100dvh - 140px))",
        background: "rgba(5,5,8,0.95)",
        border: "1px solid rgba(139,92,246,0.17)",
        borderRadius: 24,
        backdropFilter: "blur(56px)",
        WebkitBackdropFilter: "blur(56px)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.02), 0 32px 100px rgba(0,0,0,0.75), 0 0 80px rgba(75,29,255,0.09)",
      }}
    >
      {/* Top ambient glow */}
      <div
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% -8%, rgba(75,29,255,0.15) 0%, transparent 100%)",
        }}
      />
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* ── Header ── */}
      <div
        className="relative z-10 flex items-center justify-between px-5 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(139,92,246,0.09)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(75,29,255,0.16)",
              border: "1px solid rgba(139,92,246,0.28)",
              boxShadow: "0 0 18px rgba(75,29,255,0.16)",
            }}
          >
            <Sparkles size={15} color="#9B5CF6" />
          </div>
          <div>
            <div className="text-[0.8rem] font-semibold tracking-wide" style={{ color: "rgba(218,208,255,0.97)" }}>
              AxisMed Concierge AI
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#34d399" }}
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-[0.62rem] tracking-widest uppercase" style={{ color: "rgba(139,92,246,0.55)" }}>
                Healthcare Intelligence
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Speak with Team CTA */}
          <button
            onClick={onRequestHandoff}
            className="text-[0.62rem] tracking-widest uppercase px-2.5 py-1.5 rounded-lg transition-all duration-200"
            style={{ color: "rgba(139,92,246,0.45)", border: "1px solid rgba(139,92,246,0.12)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(196,181,253,0.8)";
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)";
              e.currentTarget.style.background = "rgba(75,29,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(139,92,246,0.45)";
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.12)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Team
          </button>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{ color: "rgba(139,92,246,0.4)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(196,181,253,0.9)";
              e.currentTarget.style.background = "rgba(139,92,246,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(139,92,246,0.4)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Lead memory strip */}
      <AnimatePresence>{hasLead && <LeadBadge lead={lead} />}</AnimatePresence>

      {/* ── Messages ── */}
      <div
        className="relative z-10 flex-1 overflow-y-auto px-4 py-5"
        style={{ scrollbarWidth: "none" }}
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <Bubble key={m.id} msg={m} />
          ))}
        </AnimatePresence>

        {isTyping && <TypingDots />}

        {/* Handoff card */}
        {handoff && <HandoffCard waUrl={waUrl} />}

        {/* Quick action chips — shown only on initial state */}
        {showQuick && !isTyping && !handoff && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.42, ease: "easeOut" }}
            className="flex flex-col gap-2 pl-8"
          >
            {QUICK.map((q) => (
              <button
                key={q.label}
                onClick={() => onQuick(q.msg)}
                className="text-left px-4 py-3 rounded-xl text-[0.74rem] font-medium tracking-wide flex items-center justify-between gap-3 transition-all duration-200"
                style={{
                  background: "rgba(75,29,255,0.05)",
                  border: "1px solid rgba(139,92,246,0.13)",
                  color: "rgba(196,181,253,0.68)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(75,29,255,0.13)";
                  e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)";
                  e.currentTarget.style.color = "rgba(218,208,255,0.96)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(75,29,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(139,92,246,0.13)";
                  e.currentTarget.style.color = "rgba(196,181,253,0.68)";
                }}
              >
                <span>{q.label}</span>
                <ArrowRight size={11} className="opacity-35 flex-shrink-0" />
              </button>
            ))}
          </motion.div>
        )}

        <div ref={endRef} />
      </div>

      {/* ── Footer divider ── */}
      <div
        className="relative z-10 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(139,92,246,0.07)" }}
      >
        {/* WhatsApp subtle link */}
        {!handoff && (
          <div className="flex justify-center pt-2.5 pb-1">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[0.60rem] tracking-widest uppercase transition-colors duration-300"
              style={{ color: "rgba(139,92,246,0.28)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(196,181,253,0.55)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(139,92,246,0.28)")}
            >
              Continue on WhatsApp →
            </a>
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-4 pt-1.5">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200"
            style={{
              background: "rgba(10,7,22,0.88)",
              border: "1px solid rgba(139,92,246,0.15)",
            }}
          >
            <input
              value={input}
              onChange={(e) => onInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
              placeholder="Message the concierge…"
              className="flex-1 bg-transparent outline-none text-[0.79rem] placeholder:text-purple-900/40 caret-purple-400"
              style={{ color: "rgba(210,200,255,0.92)" }}
            />
            <motion.button
              onClick={onSend}
              disabled={!input.trim()}
              whileTap={{ scale: 0.88 }}
              className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:opacity-20"
              style={{
                background: input.trim()
                  ? "rgba(75,29,255,0.7)"
                  : "rgba(75,29,255,0.12)",
                border: "1px solid rgba(139,92,246,0.35)",
              }}
            >
              <Send size={11} color="#C4B5FD" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────
   FLOATING BUTTON
────────────────────────────────────────────────────────── */

function FloatButton({
  isOpen,
  unread,
  onClick,
}: {
  isOpen: boolean;
  unread: number;
  onClick: () => void;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 24 });
  const sy = useSpring(my, { stiffness: 260, damping: 24 });

  return (
    <div className="fixed bottom-6 right-6 z-50" style={{ width: 56, height: 56 }}>
      {/* Pulse rings */}
      {!isOpen && (
        <>
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: i === 0 ? "rgba(75,29,255,0.13)" : "rgba(139,92,246,0.07)" }}
              animate={{ scale: [1, 2.1 + i * 0.5, 1], opacity: [0.5 - i * 0.1, 0, 0.5 - i * 0.1] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: i * 1.0 }}
            />
          ))}
          {/* Orbiting particles */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{ width: 3, height: 3, background: "rgba(139,92,246,0.5)", top: "50%", left: "50%" }}
              animate={{
                x: [0, Math.cos((i / 4) * Math.PI * 2) * 30],
                y: [0, Math.sin((i / 4) * Math.PI * 2) * 30],
                opacity: [0, 0.65, 0],
                scale: [0.4, 1.1, 0],
              }}
              transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.65, ease: "easeOut" }}
            />
          ))}
        </>
      )}

      <motion.button
        onClick={onClick}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left - r.width / 2) * 0.4);
          my.set((e.clientY - r.top - r.height / 2) * 0.4);
        }}
        onMouseLeave={() => { mx.set(0); my.set(0); }}
        whileTap={{ scale: 0.9 }}
        style={{
          x: sx,
          y: sy,
          background: "rgba(9,7,20,0.93)",
          border: isOpen
            ? "1px solid rgba(139,92,246,0.52)"
            : "1px solid rgba(139,92,246,0.3)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          boxShadow: isOpen
            ? "0 0 44px rgba(75,29,255,0.38), 0 8px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.07)"
            : "0 0 26px rgba(75,29,255,0.20), 0 8px 28px rgba(0,0,0,0.62), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
        className="relative w-14 h-14 rounded-full flex items-center justify-center"
      >
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle at 38% 32%, rgba(139,92,246,0.2) 0%, transparent 60%)" }}
        />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="x"
              initial={{ rotate: -45, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 45, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative z-10"
            >
              <X size={18} color="#9B5CF6" />
            </motion.div>
          ) : (
            <motion.div
              key="spark"
              initial={{ rotate: 45, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -45, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative z-10"
            >
              <Sparkles size={18} color="#9B5CF6" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {unread > 0 && !isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 440, damping: 22 }}
              className="absolute -top-1 -right-1 rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{ width: 18, height: 18, background: "#7C3AED", color: "#fff", boxShadow: "0 0 12px rgba(124,58,237,0.7)" }}
            >
              {unread}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   MAIN EXPORT
────────────────────────────────────────────────────────── */

export function Concierge() {
  const [isOpen, setIsOpen]     = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput]       = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread]     = useState(0);
  const [handoff, setHandoff]   = useState(false);
  const [lead, setLead]         = useState<Lead>({ name: null, specialty: null, email: null, interest: null });

  const msgsRef   = useRef<Msg[]>([]);
  const leadRef   = useRef<Lead>({ name: null, specialty: null, email: null, interest: null });
  const isOpenRef = useRef(false);
  const greeted   = useRef(false);

  useEffect(() => { msgsRef.current   = messages; }, [messages]);
  useEffect(() => { leadRef.current   = lead; }, [lead]);
  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

  // Restore session
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("axm-concierge");
      if (saved) {
        const { msgs, ld } = JSON.parse(saved);
        if (msgs?.length) {
          setMessages(msgs);
          if (ld) setLead(ld);
          greeted.current = true;
        }
      }
    } catch {}
  }, []);

  // Persist session
  useEffect(() => {
    if (!messages.length) return;
    try {
      sessionStorage.setItem("axm-concierge", JSON.stringify({ msgs: messages, ld: lead }));
    } catch {}
  }, [messages, lead]);

  // Initial greeting
  useEffect(() => {
    if (greeted.current) return;
    const t = setTimeout(() => {
      greeted.current = true;
      setMessages([{ id: uid(), role: "ai", content: GREETING }]);
      setUnread(1);
    }, 4200);
    return () => clearTimeout(t);
  }, []);

  const send = useCallback(async (content: string) => {
    if (!content.trim()) return;
    const trimmed = content.trim();

    setMessages((prev) => [...prev, { id: uid(), role: "user", content: trimmed }]);
    setInput("");
    setIsTyping(true);

    const history = [
      ...msgsRef.current.map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.content,
      })),
      { role: "user", content: trimmed },
    ];

    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();

      setIsTyping(false);
      setMessages((prev) => [...prev, { id: uid(), role: "ai", content: data.content }]);

      if (data.leadData) {
        setLead((prev) => {
          const next = {
            name:      data.leadData.name      ?? prev.name,
            specialty: data.leadData.specialty ?? prev.specialty,
            email:     data.leadData.email     ?? prev.email,
            interest:  data.leadData.interest  ?? prev.interest,
          };
          leadRef.current = next;
          return next;
        });
      }

      if (data.suggestWhatsApp) {
        setTimeout(() => setHandoff(true), 600);
      }

      if (!isOpenRef.current) setUnread((n) => n + 1);
    } catch {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "ai",
          content:
            "I'm momentarily pausing — please try again in a moment, or our team can assist you directly on WhatsApp.",
        },
      ]);
    }
  }, []);

  const requestHandoff = useCallback(() => {
    setHandoff(true);
    if (!handoff) {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "ai",
          content:
            "Of course. Our concierge team is ready to assist you directly. I've prepared a summary of our conversation to ensure a seamless handover — simply continue on WhatsApp and they'll have full context.",
        },
      ]);
    }
  }, [handoff]);

  // External trigger — placed after `send` to avoid temporal dead zone
  useEffect(() => {
    const handler = (e: Event) => {
      const msg = (e as CustomEvent<{ message?: string }>).detail?.message;
      setIsOpen(true);
      setUnread(0);
      if (msg) setTimeout(() => send(msg), 320);
    };
    window.addEventListener("open-concierge", handler);
    return () => window.removeEventListener("open-concierge", handler);
  }, [send]);

  const waUrl = buildWhatsAppURL(msgsRef.current, leadRef.current);
  const showQuick = messages.length <= 1 && !isTyping;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Panel
            messages={messages}
            isTyping={isTyping}
            input={input}
            onInput={setInput}
            onSend={() => send(input)}
            onClose={() => setIsOpen(false)}
            showQuick={showQuick}
            onQuick={send}
            lead={lead}
            handoff={handoff}
            waUrl={waUrl}
            onRequestHandoff={requestHandoff}
          />
        )}
      </AnimatePresence>

      <FloatButton
        isOpen={isOpen}
        unread={unread}
        onClick={() => {
          setIsOpen((o) => !o);
          setUnread(0);
        }}
      />
    </>
  );
}
