"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Calendar, MapPin, Clock, Users, CheckCircle2,
  FileText, Banknote, MessageCircle, ChevronRight, ArrowLeft,
} from "lucide-react";
import type { Course } from "@/lib/types";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDateRange } from "@/lib/utils/formatDate";

const schema = z.object({
  firstName:   z.string().min(2, "Required"),
  lastName:    z.string().min(2, "Required"),
  email:       z.email("Invalid email"),
  phone:       z.string().min(7, "Required"),
  specialty:   z.string().min(2, "Required"),
  institution: z.string().min(2, "Required"),
  paymentMethod: z.enum(["invoice", "bank_transfer", "whatsapp"]),
});
type FormData = z.infer<typeof schema>;

const PAYMENT_OPTIONS = [
  {
    id: "invoice" as const,
    icon: FileText,
    label: "Invoice",
    description: "Submit registration, we email you a formal invoice within 24 hrs.",
  },
  {
    id: "bank_transfer" as const,
    icon: Banknote,
    label: "Bank Transfer",
    description: "Register and receive our bank details for a direct transfer.",
  },
  {
    id: "whatsapp" as const,
    icon: MessageCircle,
    label: "Speak to the Team",
    description: "Prefer to sort it out directly? We'll guide you through on WhatsApp.",
  },
] as const;

interface Props { course: Course }

export function RegistrationSidebar({ course }: Props) {
  const [step, setStep]                     = useState<"info" | "method" | "form" | "success">("info");
  const [method, setMethod]                 = useState<FormData["paymentMethod"]>("invoice");
  const [referenceId, setReferenceId]       = useState("");

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: { paymentMethod: "invoice" },
    });

  const selectedMethod = watch("paymentMethod");

  const onSubmit = async (data: FormData) => {
    if (data.paymentMethod === "whatsapp") {
      const text = encodeURIComponent(
        `Hello AxisMed Team,\n\nI'd like to register for:\n"${course.title}"\n\nName: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nPhone: ${data.phone}\nSpecialty: ${data.specialty}\nInstitution: ${data.institution}\n\nPlease guide me through the registration process. Thank you.`
      );
      window.open(`https://wa.me/971501897038?text=${text}`, "_blank");
      return;
    }
    await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, courseId: course.id, courseName: course.title }),
    }).catch(() => {});
    const ref = `AXM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setReferenceId(ref);
    setStep("success");
  };

  const availPct = course.seats > 0 ? (course.seatsAvailable / course.seats) * 100 : 100;

  return (
    <div className="sticky top-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass glow-border rounded-2xl overflow-hidden"
      >
        {/* Price header */}
        <div className="p-6 border-b border-border bg-bg-elevated">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-display text-4xl font-bold text-white">
              {course.price > 0 ? `$${course.price.toLocaleString()}` : "Contact for Pricing"}
            </span>
            {course.price > 0 && <span className="text-text-muted">{course.currency}</span>}
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={course.status} />
            <span className="text-text-muted text-sm">{course.duration}</span>
          </div>
        </div>

        {/* ── Info step ── */}
        {step === "info" && (
          <div className="p-6">
            <div className="space-y-3 mb-6">
              {[
                { icon: Calendar, text: formatDateRange(course.startDate, course.endDate) },
                { icon: MapPin,   text: course.location },
                { icon: Clock,    text: course.duration },
                { icon: Users,    text: `${course.seatsAvailable} of ${course.seats} seats available` },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 text-sm">
                  <Icon className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                  <span className="text-text-secondary">{text}</span>
                </div>
              ))}
            </div>

            {/* Seat bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-text-muted mb-1.5">
                <span>{course.seatsAvailable} seats left</span>
                <span>{Math.round(100 - availPct)}% filled</span>
              </div>
              <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - availPct}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="h-full bg-purple-500 rounded-full"
                />
              </div>
            </div>

            {course.status !== "sold_out" && course.status !== "completed" ? (
              <button
                onClick={() => setStep("method")}
                className="w-full bg-purple-500 hover:bg-purple-400 text-white font-semibold py-4 rounded-xl transition-all shadow-[0_0_24px_rgba(164,158,207,0.4)] hover:shadow-[0_0_36px_rgba(164,158,207,0.6)] flex items-center justify-center gap-2"
              >
                Register for this Program
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-center py-3 text-text-muted bg-bg-elevated rounded-xl">
                {course.status === "sold_out" ? "Sold Out" : "Program Completed"}
              </div>
            )}

            <p className="text-text-dim text-xs text-center mt-4">
              No card required · Invoice or bank transfer
            </p>
          </div>
        )}

        {/* ── Payment method step ── */}
        {step === "method" && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => setStep("info")} className="p-1.5 rounded-lg text-text-dim hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="font-display font-bold text-white">How would you like to pay?</h3>
            </div>

            <div className="space-y-2">
              {PAYMENT_OPTIONS.map(({ id, icon: Icon, label, description }) => (
                <button
                  key={id}
                  onClick={() => { setMethod(id); setValue("paymentMethod", id); }}
                  className={`w-full text-left flex items-start gap-3.5 p-4 rounded-xl border transition-all ${
                    method === id
                      ? "border-purple-500/50 bg-purple-500/10"
                      : "border-border hover:border-purple-500/25 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    method === id ? "bg-purple-500/25" : "bg-white/5"
                  }`}>
                    <Icon className={`w-4 h-4 ${method === id ? "text-purple-300" : "text-text-muted"}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${method === id ? "text-white" : "text-text-secondary"}`}>
                      {label}
                    </p>
                    <p className="text-xs text-text-dim mt-0.5 leading-relaxed">{description}</p>
                  </div>
                  {method === id && (
                    <div className="ml-auto mt-0.5 w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep("form")}
              className="w-full bg-purple-500 hover:bg-purple-400 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Details form step ── */}
        {step === "form" && (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <button type="button" onClick={() => setStep("method")} className="p-1.5 rounded-lg text-text-dim hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="font-display font-bold text-white text-lg">Your Details</h3>
            </div>

            {/* Selected method badge */}
            <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              {selectedMethod === "invoice"       && <FileText className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
              {selectedMethod === "bank_transfer" && <Banknote className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
              {selectedMethod === "whatsapp"      && <MessageCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
              <span className="text-xs text-purple-300">
                {selectedMethod === "invoice"       && "You'll receive an invoice within 24 hrs"}
                {selectedMethod === "bank_transfer" && "Bank details will be emailed to you"}
                {selectedMethod === "whatsapp"      && "We'll open WhatsApp with your details pre-filled"}
              </span>
            </div>

            <input type="hidden" {...register("paymentMethod")} />

            {[
              { name: "firstName"   as const, label: "First Name",   placeholder: "Ahmed" },
              { name: "lastName"    as const, label: "Last Name",    placeholder: "Al-Rashid" },
              { name: "email"       as const, label: "Email",        placeholder: "your@email.com" },
              { name: "phone"       as const, label: "Phone",        placeholder: "+971 50 000 0000" },
              { name: "specialty"   as const, label: "Specialty",    placeholder: "Oral & Maxillofacial Surgery" },
              { name: "institution" as const, label: "Institution",  placeholder: "Hospital / Clinic" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm text-text-secondary mb-1.5">{field.label}</label>
                <input
                  {...register(field.name)}
                  placeholder={field.placeholder}
                  className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-text-dim outline-none transition-colors"
                />
                {errors[field.name] && (
                  <p className="text-red-400 text-xs mt-1">{errors[field.name]?.message}</p>
                )}
              </div>
            ))}

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-500 hover:bg-purple-400 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Submitting…
                  </span>
                ) : selectedMethod === "whatsapp" ? (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    Open WhatsApp
                  </>
                ) : (
                  <>Submit Registration</>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ── Success ── */}
        {step === "success" && (
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-5"
            >
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </motion.div>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Registration Received!
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-2">
              Thank you for registering. Our team will reach out within 24 hours with your{" "}
              {selectedMethod === "bank_transfer" ? "bank transfer details and invoice" : "invoice and confirmation"}.
            </p>
            <p className="text-text-dim text-xs mb-5">
              Check your email — a copy of your registration has been noted.
            </p>
            <div className="text-text-dim text-xs px-4 py-3 bg-bg-elevated rounded-xl font-mono tracking-widest">
              {referenceId}
            </div>
          </div>
        )}
      </motion.div>

      {/* Help */}
      <div className="mt-4 text-center">
        <p className="text-text-dim text-sm">
          Questions?{" "}
          <a href="/contact" className="text-purple-400 hover:text-purple-300 transition-colors">
            Contact us
          </a>
          {" "}or{" "}
          <a
            href="https://wa.me/971501897038"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}
