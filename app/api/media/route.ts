import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db.server";
import { mediaItems as seed } from "@/lib/data/media";
import type { MediaItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await readJSON<MediaItem[]>("media.json", seed);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const item: MediaItem = await req.json();
  const data = await readJSON<MediaItem[]>("media.json", seed);
  await writeJSON("media.json", [item, ...data]);
  return NextResponse.json(item, { status: 201 });
}
