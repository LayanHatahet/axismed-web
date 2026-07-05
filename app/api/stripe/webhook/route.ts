import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe.server";
import { readJSON, writeJSON } from "@/lib/db.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe webhook endpoint.
 *
 * Production URL:  https://theaxismed.com/api/stripe/webhook
 * Events to enable in the Stripe Dashboard:
 *   - payment_intent.succeeded
 *   - payment_intent.payment_failed
 *
 * The signing secret is read from STRIPE_WEBHOOK_SECRET (Vercel env var).
 * We verify every request's signature before trusting it.
 */

interface PaymentRecord {
  id: string;
  status: "paid" | "failed";
  amount: number;
  currency: string;
  courseId?: string;
  courseName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  specialty?: string;
  institution?: string;
  error?: string;
  at: string;
}

/**
 * Best-effort local log of payments.
 *
 * NOTE: Vercel's filesystem is read-only/ephemeral, so this JSON file does NOT
 * persist in production — it is only useful locally or on a persistent host.
 * The authoritative record of every payment is always the Stripe Dashboard
 * (Payments) plus the metadata we attach to each PaymentIntent. This function
 * never throws, so a failed write can never cause Stripe to retry the webhook.
 */
async function recordPayment(pi: Stripe.PaymentIntent, status: "paid" | "failed") {
  try {
    const list = await readJSON<PaymentRecord[]>("payments.json", []);
    const record: PaymentRecord = {
      id: pi.id,
      status,
      amount: pi.amount / 100,
      currency: pi.currency,
      courseId: pi.metadata?.courseId,
      courseName: pi.metadata?.courseName,
      firstName: pi.metadata?.firstName,
      lastName: pi.metadata?.lastName,
      email: pi.metadata?.email,
      phone: pi.metadata?.phone,
      specialty: pi.metadata?.specialty,
      institution: pi.metadata?.institution,
      error: pi.last_payment_error?.message,
      at: new Date().toISOString(),
    };
    await writeJSON("payments.json", [record, ...list].slice(0, 500));
  } catch (e) {
    console.warn(
      "[stripe] payments.json write skipped (ephemeral filesystem):",
      e instanceof Error ? e.message : e
    );
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");

  if (!secret || !signature) {
    return NextResponse.json(
      { error: "Webhook is not configured." },
      { status: 400 }
    );
  }

  // Raw body is required for signature verification — do NOT parse as JSON first.
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error(
      "[stripe] webhook signature verification failed:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent;
      await recordPayment(pi, "paid");
      console.log(
        `[stripe] ✅ payment succeeded — ${pi.id} · ${pi.currency.toUpperCase()} ${(
          pi.amount / 100
        ).toLocaleString()} · ${pi.metadata?.courseName || "course"} · ${
          pi.metadata?.email || "no-email"
        }`
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      await recordPayment(pi, "failed");
      console.warn(
        `[stripe] ❌ payment failed — ${pi.id} · ${
          pi.last_payment_error?.message || "unknown reason"
        } · ${pi.metadata?.email || "no-email"}`
      );
      break;
    }
    default:
      // Other events are acknowledged but not acted upon.
      break;
  }

  return NextResponse.json({ received: true });
}
