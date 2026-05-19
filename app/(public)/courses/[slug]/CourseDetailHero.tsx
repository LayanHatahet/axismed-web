"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin, Calendar, Clock, Users, Download } from "lucide-react";
import type { Course } from "@/lib/types";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { MotionBackground } from "@/components/ui/MotionBackground";
import { formatDateRange } from "@/lib/utils/formatDate";

interface Props { course: Course }

export function CourseDetailHero({ course }: Props) {
  return (
    <section className="relative pt-32 pb-0 bg-bg-base overflow-hidden min-h-[420px]">
      <MotionBackground variant="deep" particles={false} grid scanLine grain={false} />

      {/* Course cover image as wide cinematic band */}
      <div className="absolute inset-0 z-0">
        {/*
         * COURSE HERO BACKGROUND
         * Type: Full-bleed cinematic course cover photography
         * Mood: High-stakes, prestigious, aspirational
         * Composition: Ultra-wide hero crop — surgeons / conference scene, subject in lower third
         * Lighting: Dramatic chiaroscuro, deep shadows + single key light, cool-blue tones
         * Environment: Modern OR, cadaveric training lab, or premium conference stage
         * Direction: 16:9 minimum, 3000px+ resolution, safe text zone in upper 60% of frame
         */}
        <Image
          src={course.image || `/images/courses/${course.slug}.jpg`}
          alt={course.title}
          fill
          className="object-cover object-center"
          priority
          onError={() => {}}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base/85 via-bg-base/60 to-bg-base" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-base/70 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-text-muted mb-8 flex-wrap"
        >
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-text-secondary truncate max-w-xs">{course.title}</span>
        </motion.nav>

        <div className="max-w-3xl">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-5 flex-wrap"
          >
            <StatusBadge status={course.status} />
            <Badge variant="purple">{course.programType}</Badge>
            <Badge variant="gray">{course.category}</Badge>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-4"
          >
            {course.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="text-text-secondary text-xl leading-relaxed mb-8"
          >
            {course.subtitle}
          </motion.p>

          {/* Meta strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-5 mb-8"
          >
            {[
              { icon: Calendar, text: formatDateRange(course.startDate, course.endDate) },
              { icon: MapPin,   text: `${course.location}, ${course.city}` },
              { icon: Clock,    text: course.duration },
              { icon: Users,    text: `${course.seatsAvailable} seats remaining` },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-text-secondary">
                <Icon className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>

          {/* Instructor */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            className="flex items-center gap-4"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-bg-elevated border-2 border-purple-500/30">
              {course.instructorImage ? (
                <Image src={course.instructorImage} alt={course.instructor} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 to-bg-elevated flex items-center justify-center">
                  <span className="text-purple-300 text-lg font-bold">
                    {course.instructor.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div>
              <div className="text-white text-sm font-semibold">{course.instructor}</div>
              <div className="text-text-muted text-xs">{course.instructorTitle}</div>
            </div>
            {course.brochure && (
              <a
                href={course.brochure}
                className="ml-auto flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" /> Brochure
              </a>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/25 to-transparent" />
    </section>
  );
}
