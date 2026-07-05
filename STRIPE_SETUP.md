# Stripe Live Payments — Setup

Live card payments (Stripe Payment Element + Payment Intents) are integrated into
the course registration flow. Card details are entered on-site; no bank transfer,
invoice, or interest form. Currency: **USD**.

## 1. Environment variables (Vercel → Project → Settings → Environment Variables)

Add all three to the **Production** environment (and Preview if you test there).
Never commit these; `.env*` is git-ignored.

| Name | Where it's used | Value |
|------|-----------------|-------|
| `STRIPE_SECRET_KEY` | Server only | your **live** secret key (`sk_live_…`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client (browser) | your **live** publishable key (`pk_live_…`) |
| `STRIPE_WEBHOOK_SECRET` | Server only | signing secret from the webhook you create below (`whsec_…`) |

> `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is inlined at **build time** — set it in
> Vercel *before* the build/deploy, then redeploy if you add it later.

## 2. Webhook (Stripe Dashboard → Developers → Webhooks → Add endpoint)

- **Endpoint URL:** `https://theaxismed.com/api/stripe/webhook`
- **Events to send:**
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
- After creating it, copy the **Signing secret** (`whsec_…`) into
  `STRIPE_WEBHOOK_SECRET` in Vercel, then redeploy.

## 3. Apple Pay / Google Pay

`automatic_payment_methods` is enabled, so cards, Apple Pay and Google Pay appear
automatically when eligible. For Apple Pay on Safari, verify the domain in
**Stripe → Settings → Payments → Payment methods → Apple Pay** (add `theaxismed.com`).

## 4. Where payments are recorded

There is no database. The **source of truth is the Stripe Dashboard** (Payments),
and every PaymentIntent carries metadata: course id/slug/name and the customer's
name, email, phone, specialty, and institution. The webhook also logs each event
to the server logs and best-effort appends to `data/payments.json` — note this
file is **not durable on Vercel** (read-only/ephemeral filesystem); it's only for
local/self-hosted use. To persist registrations, connect a database later and
write to it from the webhook handler.

## 5. Flow summary

Course page → "Enroll & Pay by Card" → enter details → Stripe Payment Element →
redirect to `/payment/status` (success / processing / failed / error states).
The amount is always computed server-side from the course record, never from the
client, so prices can't be tampered with.
