import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db.server";
import type { ContactSubmission } from "@/lib/types";

export const dynamic = "force-dynamic";

const SEED: ContactSubmission[] = [];

export async function GET() {
  const data = await readJSON<ContactSubmission[]>("contacts.json", SEED);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const submission: ContactSubmission = {
    id: `contact-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type:         body.type         ?? "general",
    name:         body.name         ?? "",
    email:        body.email        ?? "",
    phone:        body.phone        ?? "",
    organization: body.organization ?? "",
    message:      body.message      ?? "",
    submittedAt:  new Date().toISOString(),
    status:       "new",
  };
  const data = await readJSON<ContactSubmission[]>("contacts.json", SEED);
  await writeJSON("contacts.json", [submission, ...data]);
  return NextResponse.json(submission, { status: 201 });
}
