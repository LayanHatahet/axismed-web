import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db.server";
import { partners as seed } from "@/lib/data/partners";
import type { Partner } from "@/lib/types";

export async function GET() {
  const data = await readJSON<Partner[]>("partners.json", seed);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Omit<Partner, "id">;
  const data = await readJSON<Partner[]>("partners.json", seed);
  const newPartner: Partner = {
    ...body,
    id: `p${Date.now()}`,
  };
  const updated = [...data, newPartner];
  await writeJSON("partners.json", updated);
  return NextResponse.json(newPartner, { status: 201 });
}
