import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db.server";
import type { ConciergeLead } from "@/lib/types";

export async function GET() {
  const data = await readJSON<ConciergeLead[]>("concierge-leads.json", []);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Omit<ConciergeLead, "id" | "capturedAt">;
  const data = await readJSON<ConciergeLead[]>("concierge-leads.json", []);
  const lead: ConciergeLead = {
    ...body,
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    capturedAt: new Date().toISOString(),
  };
  await writeJSON("concierge-leads.json", [lead, ...data]);
  return NextResponse.json(lead, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json() as { id: string };
  const data = await readJSON<ConciergeLead[]>("concierge-leads.json", []);
  await writeJSON("concierge-leads.json", data.filter((l) => l.id !== id));
  return NextResponse.json({ success: true });
}
