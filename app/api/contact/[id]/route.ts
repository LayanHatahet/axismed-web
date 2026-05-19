import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db.server";
import type { ContactSubmission } from "@/lib/types";

export const dynamic = "force-dynamic";

const SEED: ContactSubmission[] = [];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updates = await req.json();
  const data = await readJSON<ContactSubmission[]>("contacts.json", SEED);
  const updated = data.map((c) => c.id === id ? { ...c, ...updates } : c);
  await writeJSON("contacts.json", updated);
  return NextResponse.json(updated.find((c) => c.id === id));
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await readJSON<ContactSubmission[]>("contacts.json", SEED);
  await writeJSON("contacts.json", data.filter((c) => c.id !== id));
  return NextResponse.json({ ok: true });
}
