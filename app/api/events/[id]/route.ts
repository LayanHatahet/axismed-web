import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db.server";
import type { Event } from "@/lib/types";

export const dynamic = "force-dynamic";

const SEED: Event[] = [];

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updates = await req.json();
  const data = await readJSON<Event[]>("events.json", SEED);
  const updated = data.map((e) => e.id === id ? { ...e, ...updates } : e);
  await writeJSON("events.json", updated);
  return NextResponse.json(updated.find((e) => e.id === id));
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await readJSON<Event[]>("events.json", SEED);
  await writeJSON("events.json", data.filter((e) => e.id !== id));
  return NextResponse.json({ ok: true });
}
