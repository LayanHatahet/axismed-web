import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db.server";
import type { DiscountCode } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await readJSON<DiscountCode[]>("discount-codes.json", []);
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<DiscountCode>;
  const data = await readJSON<DiscountCode[]>("discount-codes.json", []);
  const code: DiscountCode = {
    id: `dc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    code: (body.code || "").trim(),
    label: body.label || "",
    type: body.type === "percent" ? "percent" : "fixed_price",
    value: Number(body.value) || 0,
    courseId: body.courseId || "",
    active: body.active !== false,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  await writeJSON("discount-codes.json", [code, ...data]);
  return NextResponse.json(code, { status: 201 });
}
