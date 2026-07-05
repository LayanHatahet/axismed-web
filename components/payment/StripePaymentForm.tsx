"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Lock, AlertCircle } from "lucide-react";

/**
 * The publishable key is safe to expose in the browser by design.
 * It is read from NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, which is inlined at BUILD
 * time — so it must be set in Vercel before the production build runs.
 */
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function CheckoutForm({ amountLabel }: { amountLabel: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/status`,
      },
    });

    // If we get here, confirmation failed immediately (e.g. card declined or a
    // validation error) and no redirect happened. Otherwise the browser is
    // redirected to /payment/status, which reports the final result.
    if (submitError) {
      setError(
        submitError.message ||
          "Your payment could not be processed. Please check your details and try again."
      );
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Cards + Apple Pay + Google Pay (shown automatically when the device
          is eligible and the payment method is enabled in the Stripe dashboard). */}
      <PaymentElement
        options={{
          layout: "tabs",
          wallets: { applePay: "auto", googlePay: "auto" },
        }}
      />

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all shadow-[0_4px_24px_rgba(136,128,184,0.25)] flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing…
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay {amountLabel}
          </>
        )}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-xs" style={{ color: "#726da0" }}>
        <Lock className="w-3 h-3" />
        Secured by Stripe · Cards, Apple Pay &amp; Google Pay
      </p>
    </form>
  );
}

interface Props {
  clientSecret: string;
  amountLabel: string;
}

export function StripePaymentForm({ clientSecret, amountLabel }: Props) {
  if (!stripePromise) {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-3">
        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
        <p className="text-red-600 text-sm">
          Card payment is temporarily unavailable. Please use another option below
          or contact us to complete your registration.
        </p>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#8880b8",
            colorText: "#12082C",
            colorDanger: "#dc2626",
            fontFamily: "Inter, system-ui, sans-serif",
            borderRadius: "10px",
          },
        },
      }}
    >
      <CheckoutForm amountLabel={amountLabel} />
    </Elements>
  );
}
