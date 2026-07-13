import { NextResponse } from "next/server";
import { seedKVFromFiles } from "@/lib/db.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Pushes the committed /data seed files into KV for any key that is still empty.
// Admin-only (gated by proxy.ts /api/admin/*). Safe to run repeatedly.
const FILES = [
  "courses.json",
  "events.json",
  "media.json",
  "partners.json",
  "content.json",
  "settings.json",
  "gallery.json",
  "contacts.json",
  "registrations.json",
  "concierge-settings.json",
  "concierge-leads.json",
];

export async function POST() {
  const result = await seedKVFromFiles(FILES);
  return NextResponse.json({ ok: true, result });
}
