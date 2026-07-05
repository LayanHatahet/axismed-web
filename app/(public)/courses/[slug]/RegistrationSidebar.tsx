"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Calendar, MapPin, Clock, Users, ArrowLeft, ChevronRight,
  Lock, ShieldCheck, AlertCircle,
} from "lucide-react";
import type { Course } from "@/lib/types";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDateRange } from "@/lib/utils/formatDate";
import { StripePaymentForm } from "@/components/payment/StripePaymentForm";

const schema = z.object({
  firstName:   z.string().min(2, "Required"),
  lastName:    z.string().min(2, "Required"),
  email:       z.email("Invalid email"),
  phone:       z.string().min(7, "Required"),
  specialty:   z.string().min(2, "Required"),
  institution: z.string().min(2, "Required"),
});
type FormData = z.infer<typeof schema>;

const PAYABLE = new Set(["open", "upcoming"]);

interface Props { course: Course }

export function RegistrationSidebar({ course }: Props) {
  const [step, setStep]                 = useState<"info" | "form" | "pay">("info");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [payError, setPayError]         = useState<string | null>(null);
  const [starting, setStarting]         = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const payable     = PAYABLE.has(course.status) && course.price > 0;
  const amountLabel = `$${course.price.toLocaleString()}`;
  const availPct    = course.seats > 0 ? (course.seatsAvailable / course.seats) * 100 : 100;

  const onSubmit = async (data: FormData) => {
    setStarting(true);
    setPayError(null);
    try {
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, courseId: course.id }),
      });
      const json = await res.json();
      if (!res.ok || !json.clientSecret) {
        setPayError(json.error || "We couldn't start the payment. Please try again.");
        setStarting(false);
        return;
      }
      setClientSecret(json.clientSecret);
      setStep("pay");
    } catch {
      setPayError("Network error. Please check your connection and try again.");
    }
    setStarting(false);
  };

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
          <div className="text-text-dim text-xs font-semibold tracking-widest uppercase mb-1.5">Registration Fee</div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-display text-4xl font-bold text-white">
              {course.price > 0 ? amountLabel : "Contact for Pricing"}
            </span>
            {course.price > 0 && <span className="text-text-muted">{course.currency} per Participant</span>}
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

            {payable ? (
              <>
                <button
                  onClick={() => setStep("form")}
                  className="w-full bg-purple-500 hover:bg-purple-400 text-white font-semibold py-4 rounded-xl transition-all shadow-[0_0_24px_rgba(164,158,207,0.4)] hover:shadow-[0_0_36px_rgba(164,158,207,0.6)] flex items-center justify-center gap-2"
                >
                  Enroll &amp; Pay by Card
                  <ChevronRight className="w-4 h-4" />
                </button>
                <p className="flex items-center justify-center gap-1.5 text-text-dim text-xs text-center mt-4">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Secure card payment · Visa, Mastercard, Apple&nbsp;Pay &amp; Google&nbsp;Pay
                </p>
              </>
            ) : (
              <div className="text-center py-3 text-text-muted bg-bg-elevated rounded-xl">
                {course.status === "sold_out" ? "Sold Out" : "Registration Closed"}
              </div>
            )}
          </div>
        )}

        {/* ── Details step ── */}
        {step === "form" && (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <button type="button" onClick={() => setStep("info")} className="p-1.5 rounded-lg text-text-dim hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="font-display font-bold text-white text-lg">Your Details</h3>
            </div>

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
                  <p className="text-red-500 text-xs mt-1">{errors[field.name]?.message}</p>
                )}
              </div>
            ))}

            {payError && (
              <div className="flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-red-600 text-sm">{payError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={starting}
              className="w-full bg-purple-500 hover:bg-purple-400 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {starting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Preparing secure payment…
                </>
              ) : (
                <>
                  Continue to Secure Payment
                  <Lock className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-text-dim text-xs text-center">
              You&apos;ll enter your card details on the next step.
            </p>
          </form>
        )}

        {/* ── Payment step ── */}
        {step === "pay" && clientSecret && (
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setStep("form")} className="p-1.5 rounded-lg text-text-dim hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="font-display font-bold text-white text-lg">Payment</h3>
            </div>

            {/* Order summary */}
            <div className="rounded-xl px-4 py-3 bg-bg-elevated space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary line-clamp-1 pr-2">{course.title}</span>
                <span className="font-semibold text-white whitespace-nowrap">{amountLabel}</span>
              </div>
              <div className="text-text-dim text-xs">{course.currency} · {course.duration}</div>
            </div>

            <StripePaymentForm clientSecret={clientSecret} amountLabel={amountLabel} />
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
            className="text-green-500 hover:text-green-400 transition-colors"
          >
            WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}
