import Stripe from "stripe";

/**
 * Server-only Stripe client.
 * NEVER import this from a client component.
 *
 * The secret key is read ONLY from the STRIPE_SECRET_KEY environment variable
 * (set in Vercel → Project → Settings → Environment Variables). It is never
 * hardcoded and never sent to the browser.
 *
 * The client is created lazily so that a missing key does not break the build
 * or unrelated pages — it only throws when a payment operation is actually
 * attempted, and the API routes turn that into a friendly error message.
 */
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it in Vercel → Settings → Environment Variables."
    );
  }

  _stripe = new Stripe(key);
  return _stripe;
}

/** True when the server has a Stripe secret key configured. */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
