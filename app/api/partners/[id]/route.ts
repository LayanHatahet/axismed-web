import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db.server";
import { partners as seed } from "@/lib/data/partners";
import type { Partner } from "@/lib/types";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json() as Partial<Partner>;
  const data = await readJSON<Partner[]>("partners.json", seed);
  const updated = data.map((p) => p.id === id ? { ...p, ...body } : p);
  await writeJSON("partners.json", updated);
  return NextResponse.json(updated.find((p) => p.id === id));
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await readJSON<Partner[]>("partners.json", seed);
  const updated = data.filter((p) => p.id !== id);
  await writeJSON("partners.json", updated);
  return NextResponse.json({ success: true });
}
