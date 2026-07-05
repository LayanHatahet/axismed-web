"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle2, XCircle, Clock, Loader2, AlertCircle } from "lucide-react";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

type Phase = "loading" | "succeeded" | "processing" | "failed" | "error";

interface Result {
  phase: Phase;
  reference?: string;
  amountLabel?: string;
  message?: string;
}

export function PaymentStatus() {
  const [result, setResult] = useState<Result>({ phase: "loading" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clientSecret = params.get("payment_intent_client_secret");
    const redirectStatus = params.get("redirect_status");

    if (!clientSecret) {
      setResult({
        phase: "error",
        message:
          "We couldn't find your payment details. If you were charged, please contact us and we'll confirm your registration right away.",
      });
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const stripe = stripePromise ? await stripePromise : null;
        if (!stripe) {
          // Fall back to the redirect_status Stripe appended to the URL.
          if (cancelled) return;
          setResult(mapStatus(redirectStatus || "unknown"));
          return;
        }

        const { paymentIntent, error } =
          await stripe.retrievePaymentIntent(clientSecret);
        if (cancelled) return;

        if (error || !paymentIntent) {
          setResult(mapStatus(redirectStatus || "unknown"));
          return;
        }

        const amountLabel = `${paymentIntent.currency.toUpperCase()} ${(
          paymentIntent.amount / 100
        ).toLocaleString()}`;

        setResult({
          ...mapStatus(paymentIntent.status),
          reference: paymentIntent.id,
          amountLabel,
        });
      } catch {
        if (!cancelled) {
          setResult(mapStatus(redirectStatus || "unknown"));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const config = VIEWS[result.phase];
  const Icon = config.icon;

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-20 px-4">
      <div className="glass glow-border rounded-2xl max-w-md w-full p-10 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: config.iconBg }}
        >
          <Icon
            className={`w-10 h-10 ${result.phase === "loading" ? "animate-spin" : ""}`}
            style={{ color: config.iconColor }}
          />
        </div>

        <h1 className="font-display text-2xl font-bold mb-3" style={{ color: "#12082C" }}>
          {config.title}
        </h1>

        <p className="text-sm leading-relaxed mb-6" style={{ color: "#484575" }}>
          {result.message || config.message}
        </p>

        {result.reference && result.phase === "succeeded" && (
          <div className="rounded-xl px-4 py-3 mb-6 text-left space-y-1" style={{ background: "rgba(136,128,184,0.08)" }}>
            {result.amountLabel && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "#726da0" }}>Amount paid</span>
                <span className="font-semibold" style={{ color: "#12082C" }}>{result.amountLabel}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span style={{ color: "#726da0" }}>Reference</span>
              <span className="font-mono text-xs" style={{ color: "#12082C" }}>{result.reference}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {result.phase === "failed" || result.phase === "error" ? (
            <>
              <Link
                href="/courses"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
              >
                Back to Courses
              </Link>
              <Link
                href="/contact"
                className="border font-medium px-6 py-3 rounded-xl transition-all"
                style={{ borderColor: "rgba(164,158,207,0.4)", color: "#8880b8" }}
              >
                Contact Us
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/courses"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
              >
                Browse Courses
              </Link>
              <Link
                href="/"
                className="border font-medium px-6 py-3 rounded-xl transition-all"
                style={{ borderColor: "rgba(164,158,207,0.4)", color: "#8880b8" }}
              >
                Return Home
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function mapStatus(status: string): Result {
  switch (status) {
    case "succeeded":
      return { phase: "succeeded" };
    case "processing":
      return { phase: "processing" };
    case "requires_payment_method":
    case "failed":
      return { phase: "failed" };
    default:
      return {
        phase: "error",
        message:
          "We couldn't confirm your payment status. If you were charged, please contact us with your reference and we'll sort it out immediately.",
      };
  }
}

const VIEWS: Record<
  Phase,
  { icon: typeof CheckCircle2; iconBg: string; iconColor: string; title: string; message: string }
> = {
  loading: {
    icon: Loader2,
    iconBg: "rgba(136,128,184,0.12)",
    iconColor: "#8880b8",
    title: "Confirming your payment…",
    message: "Please wait a moment while we confirm your transaction with Stripe.",
  },
  succeeded: {
    icon: CheckCircle2,
    iconBg: "rgba(34,197,94,0.14)",
    iconColor: "#16a34a",
    title: "Payment Successful!",
    message:
      "Thank you for enrolling. Your payment is confirmed and our team will email you with confirmation and full course details shortly.",
  },
  processing: {
    icon: Clock,
    iconBg: "rgba(234,179,8,0.14)",
    iconColor: "#ca8a04",
    title: "Payment Processing",
    message:
      "Your payment is being processed. You'll receive an email confirmation as soon as it clears — no further action is needed.",
  },
  failed: {
    icon: XCircle,
    iconBg: "rgba(220,38,38,0.12)",
    iconColor: "#dc2626",
    title: "Payment Not Completed",
    message:
      "Your payment was not completed and you have not been charged. You can try again or reach out and we'll help you register.",
  },
  error: {
    icon: AlertCircle,
    iconBg: "rgba(220,38,38,0.12)",
    iconColor: "#dc2626",
    title: "Something Went Wrong",
    message:
      "We couldn't confirm your payment status. If you were charged, please contact us and we'll confirm your registration.",
  },
};
