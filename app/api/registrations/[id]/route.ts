import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db.server";
import type { Registration } from "@/lib/types";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json() as Partial<Registration>;
  const data = await readJSON<Registration[]>("registrations.json", []);
  const updated = data.map((r) => r.id === id ? { ...r, ...body } : r);
  await writeJSON("registrations.json", updated);
  return NextResponse.json(updated.find((r) => r.id === id));
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await readJSON<Registration[]>("registrations.json", []);
  await writeJSON("registrations.json", data.filter((r) => r.id !== id));
  return NextResponse.json({ success: true });
}
