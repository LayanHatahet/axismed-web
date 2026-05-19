import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db.server";
import type { Event } from "@/lib/types";

export const dynamic = "force-dynamic";

const SEED: Event[] = [];

export async function GET() {
  const data = await readJSON<Event[]>("events.json", SEED);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const event: Event = await req.json();
  const data = await readJSON<Event[]>("events.json", SEED);
  await writeJSON("events.json", [event, ...data]);
  return NextResponse.json(event, { status: 201 });
}
