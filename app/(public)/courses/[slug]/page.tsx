import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readJSON } from "@/lib/db.server";
import { courses as seed } from "@/lib/data/courses";
import type { Course } from "@/lib/types";
import { CourseDetailHero } from "./CourseDetailHero";
import { CourseContent } from "./CourseContent";
import { RegistrationSidebar } from "./RegistrationSidebar";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const courses = await readJSON<Course[]>("courses.json", seed);
  const course = courses.find((c) => c.slug === slug);
  if (!course) return {};
  return { title: course.title, description: course.description };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const courses = await readJSON<Course[]>("courses.json", seed);
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  return (
    <>
      <CourseDetailHero course={course} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <CourseContent course={course} />
          </div>
          <div className="lg:col-span-1">
            <RegistrationSidebar course={course} />
          </div>
        </div>
      </div>
    </>
  );
}
