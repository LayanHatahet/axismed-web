import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Course } from "@/lib/types";
import { CourseCard } from "@/components/ui/CourseCard";

interface Props { courses: Course[] }

export function FeaturedCourses({ courses }: Props) {
  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #edeaf8 0%, #e8e5f4 50%, #ede9f7 100%)" }}
    >
      {/* Radial glow at top-center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(164,158,207,0.12) 0%, transparent 70%)",
        }}
      />
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: "linear-gradient(rgba(104,96,168,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(104,96,168,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Top edge fade */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-300/40 to-transparent" />
      {/* Bottom edge fade */}
      <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-300/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p style={{ color: "#8880b8", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              Featured Programs
            </p>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
              style={{ color: "#383563" }}
            >
              Upcoming{" "}
              <span style={{ color: "#726da0" }}>Courses &amp; Events</span>
            </h2>
            <p style={{ color: "#5e5a88", lineHeight: 1.7, maxWidth: "36rem" }}>
              Premium medical education programs designed for healthcare professionals
              seeking advanced practical and scientific learning experiences.
            </p>
          </div>
          <Link
            href="/courses"
            className="flex-shrink-0 inline-flex items-center gap-2 font-medium transition-all hover:gap-3"
            style={{ color: "#8880b8" }}
          >
            View All Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16" style={{ color: "#726da0" }}>
            No featured courses yet. Add them from the{" "}
            <Link href="/admin/courses" style={{ color: "#383563", textDecoration: "underline" }}>
              admin panel
            </Link>.
          </div>
        )}
      </div>
    </section>
  );
}
