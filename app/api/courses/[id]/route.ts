import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db.server";
import { courses as seed } from "@/lib/data/courses";
import type { Course } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updates: Partial<Course> = await req.json();
  const data = await readJSON<Course[]>("courses.json", seed);
  const updated = data.map((c) =>
    c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
  );
  await writeJSON("courses.json", updated);
  return NextResponse.json(updated.find((c) => c.id === id));
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await readJSON<Course[]>("courses.json", seed);
  await writeJSON("courses.json", data.filter((c) => c.id !== id));
  return NextResponse.json({ ok: true });
}
