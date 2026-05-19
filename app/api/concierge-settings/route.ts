import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db.server";
import { defaultConciergeSettings } from "@/lib/data/concierge-settings";
import type { ConciergeSettings } from "@/lib/types";

export async function GET() {
  const data = await readJSON<ConciergeSettings>("concierge-settings.json", defaultConciergeSettings);
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const body = await req.json() as ConciergeSettings;
  await writeJSON("concierge-settings.json", body);
  return NextResponse.json(body);
}
