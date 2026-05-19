import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Course } from "@/lib/types";
import { CourseCard } from "@/components/ui/CourseCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MotionBackground } from "@/components/ui/MotionBackground";

interface Props { courses: Course[] }

export function FeaturedCourses({ courses }: Props) {
  return (
    <section className="relative py-28 bg-bg-dark overflow-hidden">
      <MotionBackground variant="subtle" particles={false} grid />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <SectionHeader
            eyebrow="Featured Programs"
            title="Upcoming"
            titleHighlight="Courses & Events"
            subtitle="Premium medical education programs designed for healthcare professionals seeking advanced practical and scientific learning experiences."
            align="left"
            className="max-w-2xl"
          />
          <Link
            href="/courses"
            className="flex-shrink-0 inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            View All Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-text-muted">
            No featured courses yet. Add them from the{" "}
            <Link href="/admin/courses" className="text-purple-400 hover:text-purple-300">admin panel</Link>.
          </div>
        )}
      </div>
    </section>
  );
}
