import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db.server";
import { mediaItems as seed } from "@/lib/data/media";
import type { MediaItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updates = await req.json();
  const data = await readJSON<MediaItem[]>("media.json", seed);
  const updated = data.map((m) => m.id === id ? { ...m, ...updates } : m);
  await writeJSON("media.json", updated);
  return NextResponse.json(updated.find((m) => m.id === id));
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await readJSON<MediaItem[]>("media.json", seed);
  await writeJSON("media.json", data.filter((m) => m.id !== id));
  return NextResponse.json({ ok: true });
}
