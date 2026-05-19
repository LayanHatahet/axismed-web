import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db.server";
import { siteSettings as seed } from "@/lib/data/settings";
import type { SiteSettings } from "@/lib/types";

export async function GET() {
  const data = await readJSON<SiteSettings>("settings.json", seed);
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const body = await req.json() as SiteSettings;
  await writeJSON("settings.json", body);
  return NextResponse.json(body);
}
