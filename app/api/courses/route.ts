import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db.server";
import { courses as seed } from "@/lib/data/courses";
import type { Course } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await readJSON<Course[]>("courses.json", seed);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const course: Course = await req.json();
  const data = await readJSON<Course[]>("courses.json", seed);
  const updated = [course, ...data];
  await writeJSON("courses.json", updated);
  return NextResponse.json(course, { status: 201 });
}
