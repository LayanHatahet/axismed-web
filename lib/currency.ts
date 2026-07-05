// Shared currency helpers — safe to import on client and server (pure math, no secrets).

export const SUPPORTED_CURRENCIES = ["USD", "AED"] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

/**
 * The UAE dirham is pegged to the US dollar at a fixed rate of 3.6725
 * (UAE Central Bank, unchanged since 1997). Using the peg means the USD and
 * AED prices are always consistent without needing a live FX feed.
 */
export const USD_TO_AED = 3.6725;

export function isSupportedCurrency(value: unknown): value is Currency {
  return typeof value === "string" && (SUPPORTED_CURRENCIES as readonly string[]).includes(value.toUpperCase());
}

/** Convert a price from its base currency into the target currency (major units). */
export function convertPrice(baseAmount: number, baseCurrency: string, target: Currency): number {
  const from = (baseCurrency || "USD").toUpperCase();
  if (from === target) return baseAmount;
  if (from === "USD" && target === "AED") return baseAmount * USD_TO_AED;
  if (from === "AED" && target === "USD") return baseAmount / USD_TO_AED;
  return baseAmount; // unknown base currency → charge as-is
}

/** Major units (e.g. dollars) → smallest unit (cents / fils). Both USD and AED use 2 decimals. */
export function toMinorUnits(major: number): number {
  return Math.round(major * 100);
}

/** Format a minor-unit amount for display, e.g. 500000 USD → "$5,000", 1000 AED → "AED 10". */
export function formatAmount(minorUnits: number, currency: Currency): string {
  const major = minorUnits / 100;
  const hasFraction = minorUnits % 100 !== 0;
  const num = major.toLocaleString("en-US", {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return currency === "USD" ? `$${num}` : `AED ${num}`;
}

/** The amount that will actually be charged, in the chosen currency (minor units). */
export function chargeAmountMinor(basePrice: number, baseCurrency: string, target: Currency): number {
  return toMinorUnits(convertPrice(basePrice, baseCurrency, target));
}
