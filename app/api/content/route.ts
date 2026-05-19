import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db.server";
import { defaultContent } from "@/lib/data/content";
import type { WebsiteContent } from "@/lib/types";

export async function GET() {
  const data = await readJSON<WebsiteContent>("content.json", defaultContent);
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const body = await req.json() as WebsiteContent;
  await writeJSON("content.json", body);
  return NextResponse.json(body);
}
