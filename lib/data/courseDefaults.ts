import type { PricingTier } from "@/lib/types";

/**
 * Fallbacks for the optional per-course content fields. A course that has
 * never been edited renders exactly as it did before these fields existed.
 */

export const DEFAULT_CONTACT_PHONE = "+971 50 189 7038";
export const DEFAULT_CONTACT_EMAIL = "admin@theaxismed.com";

export const DEFAULT_INCLUDED: string[] = [
  "Full program attendance for all sessions",
  "Official AxisMed certificate of completion",
  "Program materials and course handbook",
  "Catering and refreshments throughout",
  "Access to AxisMed digital resource library",
  "Networking events with faculty and peers",
];

export const DEFAULT_PRICING_TIERS: PricingTier[] = [
  { label: "Early Bird", percent: 85,  note: "Register 60+ days before", highlight: false },
  { label: "Standard",   percent: 100, note: "Standard registration",    highlight: true  },
  { label: "Group (3+)", percent: 90,  note: "3 or more participants",   highlight: false },
];

export const DEFAULT_TRAVEL_INFO =
  "AxisMed partners with premium hotels near the venue for participant accommodation. " +
  "Special rates are available for registered attendees. Contact us at {email} " +
  "for hotel recommendations and group booking arrangements.";

export const DEFAULT_PAYMENT_INFO =
  "Payment is accepted via bank transfer or credit card. An official invoice and registration " +
  "confirmation will be sent within 24 hours of registration. Group and institutional billing " +
  "available upon request — contact {email}.";

export const DEFAULT_SPONSORS_INTRO =
  "This program is made possible through the support of leading medical device and healthcare companies.";

export const DEFAULT_GALLERY_INTRO =
  "Photos and highlights from previous editions of this program.";
