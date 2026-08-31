import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db.server";
import type { DiscountCode } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await req.json()) as Partial<DiscountCode>;
  const data = await readJSON<DiscountCode[]>("discount-codes.json", []);
  const updated = data.map((c) =>
    c.id === id
      ? {
          ...c,
          ...body,
          id: c.id,
          type: body.type === "percent" ? "percent" : body.type === "fixed_price" ? "fixed_price" : c.type,
          value: body.value !== undefined ? Number(body.value) : c.value,
        }
      : c
  );
  await writeJSON("discount-codes.json", updated);
  return NextResponse.json(updated.find((c) => c.id === id) ?? null);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await readJSON<DiscountCode[]>("discount-codes.json", []);
  await writeJSON("discount-codes.json", data.filter((c) => c.id !== id));
  return NextResponse.json({ ok: true });
}
