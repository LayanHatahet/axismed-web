import type { Metadata } from "next";
import { readJSON } from "@/lib/db.server";
import { courses as seed } from "@/lib/data/courses";
import type { Course } from "@/lib/types";
import { CoursesHero } from "./CoursesHero";
import { CoursesGrid } from "./CoursesGrid";
import { ProgramTypes } from "./ProgramTypes";
import { OrganizeCourse } from "./OrganizeCourse";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Courses & Events",
  description:
    "Browse premium medical education programs — cadaveric workshops, digital surgery training, industry events and custom programs for healthcare professionals.",
};

export default async function CoursesPage() {
  const courses = await readJSON<Course[]>("courses.json", seed);
  const published = courses.filter((c) => c.status !== "draft" && c.status !== "archived");

  return (
    <>
      <CoursesHero />
      <ProgramTypes />
      <CoursesGrid courses={published} />
      <OrganizeCourse />
    </>
  );
}
