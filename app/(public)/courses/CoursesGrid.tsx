import type { Course } from "@/lib/types";
import { CourseCard } from "@/components/ui/CourseCard";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { MotionBackground } from "@/components/ui/MotionBackground";

interface Props { courses: Course[] }

export function CoursesGrid({ courses }: Props) {
  return (
    <section className="relative py-20 section-white overflow-hidden">
      <MotionBackground variant="subtle" particles={false} grid />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal className="mb-10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-white">
              All Programs{" "}
              <span className="text-text-muted font-normal text-lg ml-2">({courses.length})</span>
            </h2>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-20 text-text-muted">
            No courses available at the moment. Check back soon.
          </div>
        )}
      </div>
    </section>
  );
}
