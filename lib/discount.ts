import type { DiscountCode } from "@/lib/types";

// Shared discount-code helpers — pure, safe on client and server.

export function normalizeCode(s: string): string {
  return (s || "").trim().toUpperCase();
}

/** Find an active code that matches the input and applies to the given course. */
export function findValidCode(
  codes: DiscountCode[],
  input: string,
  courseId: string
): DiscountCode | null {
  const norm = normalizeCode(input);
  if (!norm) return null;
  return (
    codes.find(
      (c) =>
        c.active &&
        normalizeCode(c.code) === norm &&
        (!c.courseId || c.courseId === "all" || c.courseId === courseId)
    ) ?? null
  );
}

/** Effective price (in the course's base currency) after applying a code. */
export function applyDiscount(basePrice: number, code: DiscountCode | null): number {
  if (!code) return basePrice;
  if (code.type === "fixed_price") return Math.max(0, code.value);
  if (code.type === "percent") {
    return Math.max(0, Math.round(basePrice * (1 - code.value / 100) * 100) / 100);
  }
  return basePrice;
}
