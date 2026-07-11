"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail, Phone, MapPin, Globe, Link2, Play,
  MessageSquare, BookOpen, Handshake, Video, CheckCircle2, MessageCircle,
} from "lucide-react";

const inquiryTypes = [
  { id: "general",      label: "General Inquiry",         icon: MessageSquare, desc: "Questions about AxisMed" },
  { id: "registration", label: "Course Registration",     icon: BookOpen,       desc: "Register for a program" },
  { id: "partnership",  label: "Partnership Inquiry",     icon: Handshake,      desc: "Collaborate with us" },
  { id: "media",        label: "Media Inquiry",           icon: Video,          desc: "Production services" },
] as const;

type InquiryType = typeof inquiryTypes[number]["id"];

const schema = z.object({
  name:         z.string().min(2, "Name is required"),
  email:        z.email("Invalid email address"),
  phone:        z.string().optional(),
  organization: z.string().optional(),
  message:      z.string().min(10, "Please provide more detail"),
});

type FormData = z.infer<typeof schema>;

export function ContactMain() {
  const [type, setType] = useState<InquiryType>("general");
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, type }),
    });
    setSent(true);
    reset();
  };

  return (
    <section className="py-16 section-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            {/* Inquiry type selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {inquiryTypes.map((t) => {
                const Icon = t.icon;
                const active = type === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-center ${
                      active
                        ? "bg-purple-500/15 border-purple-500/35 text-white"
                        : "glass border-border text-text-muted hover:text-white hover:border-purple-500/20"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? "text-purple-400" : ""}`} />
                    <span className="text-xs font-medium leading-tight">{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="glass glow-border rounded-2xl p-8 space-y-5"
                >
                  <h2 className="font-display text-xl font-bold text-white mb-6">
                    {inquiryTypes.find((t) => t.id === type)?.label}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-text-secondary mb-1.5">Full Name *</label>
                      <input
                        {...register("name")}
                        placeholder="Dr. Ahmed Al-Rashid"
                        className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors"
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1.5">Email Address *</label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="your@email.com"
                        className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors"
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1.5">Phone</label>
                      <input
                        {...register("phone")}
                        placeholder="+971 50 000 0000"
                        className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1.5">Organization</label>
                      <input
                        {...register("organization")}
                        placeholder="Hospital / Company"
                        className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary mb-1.5">Message *</label>
                    <textarea
                      {...register("message")}
                      rows={5}
                      placeholder="Tell us more about your inquiry..."
                      className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors resize-none"
                    />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-purple-500 hover:bg-purple-400 disabled:opacity-60 text-white font-semibold py-4 rounded-xl transition-all shadow-[0_0_24px_rgba(164,158,207,0.4)] hover:shadow-[0_0_36px_rgba(164,158,207,0.6)] flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass glow-border rounded-2xl p-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                    className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </motion.div>
                  <h3 className="font-display text-2xl font-bold text-white mb-3">Message Received!</h3>
                  <p className="text-text-secondary leading-relaxed mb-6">
                    Thank you for reaching out. Our team will respond to your inquiry
                    within 24â€“48 hours.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass glow-border rounded-2xl p-7">
              <h3 className="font-display text-lg font-bold text-white mb-5">Contact Information</h3>
              <div className="space-y-4">
                {[
                  { icon: Mail,   label: "Email",    value: "admin@theaxismed.com", href: "mailto:admin@theaxismed.com" },
                  { icon: Phone,  label: "Phone",    value: "+971 50 189 7038",    href: "tel:+971501897038" },
                  { icon: MapPin, label: "Location", value: "Dubai Science Park, South Tower, Dubai, United Arab Emirates", href: "#" },
                  { icon: MessageCircle, label: "WhatsApp", value: "Message us directly", href: "https://wa.me/971501897038" },
                ].map(({ icon: Icon, label, value, href }) => (
                  <a key={label} href={href} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/12 group-hover:bg-purple-500/20 flex items-center justify-center transition-colors shrink-0">
                      <Icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-text-muted text-xs mb-0.5">{label}</div>
                      <div className="text-white text-sm group-hover:text-purple-300 transition-colors">{value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="glass glow-border rounded-2xl p-7">
              <h3 className="font-display text-lg font-bold text-white mb-4">Follow AxisMed</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { Icon: Globe, href: "https://www.instagram.com/theaxismed",   label: "Instagram" },
                  { Icon: Link2, href: "https://linkedin.com/company/axismed",   label: "LinkedIn" },
                  { Icon: Play,  href: "https://youtube.com/@axismed",           label: "YouTube" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-bg-elevated hover:bg-purple-500/10 border border-border hover:border-purple-500/25 transition-all group"
                  >
                    <Icon className="w-5 h-5 text-text-muted group-hover:text-purple-400 transition-colors" />
                    <span className="text-xs text-text-dim">{label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="glass glow-border rounded-2xl p-7 bg-gradient-to-br from-purple-900/20 to-transparent">
              <h4 className="font-display font-bold text-white mb-2">Response Times</h4>
              <div className="space-y-2 text-sm text-text-secondary">
                <p>Â· General inquiries: 24â€“48 hours</p>
                <p>Â· Course registrations: Same day</p>
                <p>Â· Partnership proposals: 2â€“3 business days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
