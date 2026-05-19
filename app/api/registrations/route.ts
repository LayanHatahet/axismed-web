import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db.server";
import type { Registration } from "@/lib/types";

export async function GET() {
  const data = await readJSON<Registration[]>("registrations.json", []);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Omit<Registration, "id" | "registeredAt">;
  const data = await readJSON<Registration[]>("registrations.json", []);
  const reg: Registration = {
    ...body,
    id: `reg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    registeredAt: new Date().toISOString(),
  };
  await writeJSON("registrations.json", [reg, ...data]);
  return NextResponse.json(reg, { status: 201 });
}
