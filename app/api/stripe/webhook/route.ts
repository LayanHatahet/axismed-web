import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe.server";
import { readJSON, writeJSON } from "@/lib/db.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe webhook endpoint.
 *
 * ⚠️ REGISTER THIS IN STRIPE WITH THE CANONICAL (www) HOST:
 *
 *     https://www.theaxismed.com/api/stripe/webhook
 *
 * The apex host https://theaxismed.com/* 307-redirects to www at the Vercel
 * edge, and Stripe does NOT follow redirects — so an apex URL fails every time.
 *
 * Events handled:
 *   - payment_intent.succeeded              (our card flow uses PaymentIntents)
 *   - payment_intent.payment_failed
 *   - checkout.session.completed            (defensive — only if Checkout is ever used)
 *   - checkout.session.async_payment_succeeded
 *   - checkout.session.async_payment_failed
 *   - charge.refunded                       (keep local status in sync with refunds)
 *
 * Signature is verified against STRIPE_WEBHOOK_SECRET using the RAW request body.
 */

interface PaymentRecord {
  eventId: string;
  eventType: string;
  objectId: string;
  status: "paid" | "failed" | "refunded";
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
 * Idempotency: remember which Stripe event IDs we've already handled so a retry
 * of the same event is a no-op (no duplicate records / emails / registrations).
 *
 * NOTE: this uses a JSON file, which is NOT durable on Vercel's ephemeral
 * filesystem, so in production it is best-effort only. Stripe already retries
 * safely and we return 200 quickly; for GUARANTEED idempotency across instances,
 * back hasProcessed()/markProcessed() with a real database (see below).
 */
async function hasProcessed(eventId: string): Promise<boolean> {
  try {
    const ids = await readJSON<string[]>("stripe-events.json", []);
    return ids.includes(eventId);
  } catch {
    return false; // on read failure, prefer processing over silently dropping
  }
}

async function markProcessed(eventId: string): Promise<void> {
  try {
    const ids = await readJSON<string[]>("stripe-events.json", []);
    if (!ids.includes(eventId)) {
      await writeJSON("stripe-events.json", [eventId, ...ids].slice(0, 2000));
    }
  } catch (e) {
    console.warn(
      "[stripe:webhook] could not persist processed event id (ephemeral fs):",
      e instanceof Error ? e.message : e
    );
  }
}

/**
 * Best-effort local log of payments. Never throws (a failed write can't cause
 * Stripe to retry). The authoritative record is always the Stripe Dashboard
 * plus the metadata we attach to each PaymentIntent.
 */
async function recordPayment(record: PaymentRecord): Promise<void> {
  try {
    const list = await readJSON<PaymentRecord[]>("payments.json", []);
    await writeJSON("payments.json", [record, ...list].slice(0, 500));
  } catch (e) {
    console.warn(
      "[stripe:webhook] payments.json write skipped (ephemeral fs):",
      e instanceof Error ? e.message : e
    );
  }
}

function fromPaymentIntent(
  event: Stripe.Event,
  pi: Stripe.PaymentIntent,
  status: "paid" | "failed"
): PaymentRecord {
  return {
    eventId: event.id,
    eventType: event.type,
    objectId: pi.id,
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
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");

  // Missing server configuration → 500 (an infrastructure problem, not a bad request).
  if (!secret) {
    console.error("[stripe:webhook] STRIPE_WEBHOOK_SECRET is not set in this environment");
    return NextResponse.json({ error: "Webhook secret not configured." }, { status: 500 });
  }
  // Genuinely malformed request (Stripe always sends this header) → 400.
  if (!signature) {
    console.warn("[stripe:webhook] request rejected: missing stripe-signature header");
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  // RAW body — must NOT be parsed/modified before signature verification.
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error(
      "[stripe:webhook] signature verification FAILED:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  console.log(`[stripe:webhook] received type=${event.type} id=${event.id}`);

  // Idempotency guard — skip anything we've already handled.
  if (await hasProcessed(event.id)) {
    console.log(`[stripe:webhook] duplicate ignored id=${event.id} (already processed)`);
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await recordPayment(fromPaymentIntent(event, pi, "paid"));
        console.log(
          `[stripe:webhook] ✅ paid id=${event.id} pi=${pi.id} ${pi.currency.toUpperCase()} ${(
            pi.amount / 100
          ).toLocaleString()} course="${pi.metadata?.courseName || "-"}" email=${pi.metadata?.email || "-"}`
        );
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await recordPayment(fromPaymentIntent(event, pi, "failed"));
        console.warn(
          `[stripe:webhook] ❌ failed id=${event.id} pi=${pi.id} reason="${
            pi.last_payment_error?.message || "unknown"
          }" email=${pi.metadata?.email || "-"}`
        );
        break;
      }
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const s = event.data.object as Stripe.Checkout.Session;
        await recordPayment({
          eventId: event.id,
          eventType: event.type,
          objectId: s.id,
          status: "paid",
          amount: (s.amount_total ?? 0) / 100,
          currency: s.currency ?? "",
          courseId: s.metadata?.courseId,
          courseName: s.metadata?.courseName,
          email: s.customer_details?.email ?? s.metadata?.email,
          at: new Date().toISOString(),
        });
        console.log(
          `[stripe:webhook] ✅ checkout ${event.type} id=${event.id} session=${s.id} ${
            s.currency?.toUpperCase() || ""
          } ${((s.amount_total ?? 0) / 100).toLocaleString()}`
        );
        break;
      }
      case "checkout.session.async_payment_failed": {
        const s = event.data.object as Stripe.Checkout.Session;
        console.warn(`[stripe:webhook] ❌ checkout async payment failed id=${event.id} session=${s.id}`);
        break;
      }
      case "charge.refunded": {
        const ch = event.data.object as Stripe.Charge;
        await recordPayment({
          eventId: event.id,
          eventType: event.type,
          objectId: ch.payment_intent ? String(ch.payment_intent) : ch.id,
          status: "refunded",
          amount: ch.amount_refunded / 100,
          currency: ch.currency,
          email: ch.billing_details?.email ?? ch.metadata?.email,
          at: new Date().toISOString(),
        });
        console.log(
          `[stripe:webhook] ↩️ refund id=${event.id} charge=${ch.id} refunded=${ch.currency.toUpperCase()} ${(
            ch.amount_refunded / 100
          ).toLocaleString()}`
        );
        break;
      }
      default:
        console.log(`[stripe:webhook] unhandled type=${event.type} id=${event.id} (acknowledged)`);
        break;
    }

    // Mark processed only after successful handling, so a transient failure can be retried.
    await markProcessed(event.id);
  } catch (err) {
    // Our side effects are best-effort logging (they never throw), so reaching
    // here is unexpected; log it but still 200 so Stripe doesn't retry forever.
    // If you later add CRITICAL side effects (DB writes, emails), return a 500
    // here instead so Stripe retries delivery.
    console.error(
      `[stripe:webhook] handler error type=${event.type} id=${event.id}:`,
      err instanceof Error ? err.message : err
    );
  }

  // Always acknowledge a verified, processed event with 200.
  return NextResponse.json({ received: true });
}
