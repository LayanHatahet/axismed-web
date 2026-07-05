import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe.server";
import { readJSON } from "@/lib/db.server";
import { courses as seed } from "@/lib/data/courses";
import type { Course } from "@/lib/types";
import { chargeAmountMinor, isSupportedCurrency, type Currency } from "@/lib/currency";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Only courses in these statuses can be paid for online.
const PAYABLE_STATUSES = new Set(["open", "upcoming"]);

interface Body {
  courseId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  specialty?: string;
  institution?: string;
  currency?: string;
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { courseId, firstName, lastName, email, phone, specialty, institution } = body;

  // Customer's chosen currency (USD or AED). Falls back to the course's base
  // currency, then USD. Validated here — never trusted for the amount.
  const chosenCurrency: Currency = isSupportedCurrency(body.currency)
    ? (body.currency!.toUpperCase() as Currency)
    : "USD";

  if (!courseId || !email || !firstName || !lastName) {
    return NextResponse.json(
      { error: "Please complete your details before paying." },
      { status: 400 }
    );
  }

  // Resolve the course SERVER-SIDE and use its real price.
  // The amount is never taken from the client — this prevents price tampering.
  const courses = await readJSON<Course[]>("courses.json", seed);
  const course = courses.find((c) => c.id === courseId || c.slug === courseId);

  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }
  if (!PAYABLE_STATUSES.has(course.status)) {
    return NextResponse.json(
      { error: "This course is not currently open for online payment." },
      { status: 400 }
    );
  }
  if (!course.price || course.price <= 0) {
    return NextResponse.json(
      { error: "This program is priced on request. Please contact us to register." },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripe();
    // Amount is always derived server-side from the course's real base price,
    // converted into the customer's chosen currency (USD or AED).
    const amount = chargeAmountMinor(course.price, course.currency, chosenCurrency);
    const currency = chosenCurrency.toLowerCase();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      // Enables cards, Apple Pay, Google Pay and other methods enabled in your
      // Stripe dashboard for the UAE, without any extra client-side wiring.
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      description: `Course registration — ${course.title}`,
      metadata: {
        courseId: course.id,
        courseSlug: course.slug,
        courseName: course.title,
        basePrice: String(course.price),
        baseCurrency: course.currency || "USD",
        chargedCurrency: chosenCurrency,
        firstName,
        lastName,
        email,
        phone: phone || "",
        specialty: specialty || "",
        institution: institution || "",
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount,
      currency: chosenCurrency,
    });
  } catch (err) {
    console.error("[stripe] create-payment-intent failed:", err);
    const notConfigured =
      err instanceof Error && err.message.includes("STRIPE_SECRET_KEY");
    return NextResponse.json(
      {
        error: notConfigured
          ? "Online payment is being set up. Please use another option or contact us to register."
          : "We couldn't start the payment. Please try again, or contact us to complete your registration.",
      },
      { status: notConfigured ? 503 : 500 }
    );
  }
}
