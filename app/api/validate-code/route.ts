import { NextRequest, NextResponse } from "next/server";
import { readJSON } from "@/lib/db.server";
import { courses as courseSeed } from "@/lib/data/courses";
import type { Course, DiscountCode } from "@/lib/types";
import { findValidCode, applyDiscount } from "@/lib/discount";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PUBLIC endpoint: checks a single code the customer typed and returns the
// resulting price. It never lists codes, so the code set is not exposed.
const PAYABLE = new Set(["open", "upcoming"]);

export async function POST(req: NextRequest) {
  let body: { code?: string; courseId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const codeInput = (body.code || "").trim();
  const courseId = body.courseId || "";
  if (!codeInput || !courseId) return NextResponse.json({ valid: false });

  const courses = await readJSON<Course[]>("courses.json", courseSeed);
  const course = courses.find((c) => c.id === courseId || c.slug === courseId);
  if (!course || !PAYABLE.has(course.status) || !course.price) {
    return NextResponse.json({ valid: false });
  }

  const codes = await readJSON<DiscountCode[]>("discount-codes.json", []);
  const code = findValidCode(codes, codeInput, course.id);
  if (!code) return NextResponse.json({ valid: false });

  // A code may only reduce the price, never raise it.
  const discounted = Math.min(course.price, applyDiscount(course.price, code));
  if (discounted >= course.price) return NextResponse.json({ valid: false });

  return NextResponse.json({
    valid: true,
    code: code.code,
    originalPrice: course.price,
    discountedPrice: discounted,
    currency: course.currency || "USD",
    label: code.label || "",
  });
}
