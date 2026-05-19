"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Clock, Users, ArrowRight } from "lucide-react";
import type { Course } from "@/lib/types";
import { StatusBadge, Badge } from "./Badge";
import { TiltCard } from "./TiltCard";
import { formatDateRange } from "@/lib/utils/formatDate";

interface CourseCardProps {
  course: Course;
  index?: number;
}

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  const availabilityPct = (course.seatsAvailable / course.seats) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
      className="group"
    >
      <TiltCard intensity={6} glare className="h-full">
        <Link href={`/courses/${course.slug}`} className="block h-full">
          <div className="glass glow-border rounded-2xl overflow-hidden h-full transition-colors duration-300 group-hover:border-purple-500/40 group-hover:shadow-[0_8px_40px_rgba(124,58,237,0.2)]">
            {/* Image */}
            <div className="relative h-48 bg-bg-elevated overflow-hidden">
              {/*
               * PHOTO PLACEHOLDER — upload via Admin > Media Library
               * Type: Medical event / surgical training photography
               * Mood: Professional, focused, high-stakes
               * Composition: Surgeons at work in modern OR, or conference hall overhead shot
               * Lighting: Cool clinical white + dramatic accent lighting
               * Environment: Operating theatre, simulation lab, or medical conference setting
               * Direction: Sharp focus on hands/instruments in foreground, team blurred behind
               */}
              <Image
                src={course.image || `/images/courses/${course.slug}.jpg`}
                alt={course.title}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                onError={() => {}}
              />
              {/* Fallback gradient when no image */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-bg-base/40 to-bg-base/80" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-base/90 via-bg-base/20 to-transparent" />

              {/* No-image placeholder label */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-0 transition-opacity">
                <span className="text-white/50 text-xs text-center font-medium px-4 leading-relaxed">
                  Course cover photo · surgical / conference photography
                </span>
              </div>

              <div className="absolute bottom-3 left-4 z-10">
                <div className="text-purple-300 text-xs font-semibold tracking-widest uppercase">
                  {course.programType}
                </div>
              </div>
              <div className="absolute top-3 left-3 z-10">
                <StatusBadge status={course.status} />
              </div>
              {course.featured && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge variant="purple">Featured</Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-3">
                <span className="text-purple-400 text-xs font-medium tracking-wider uppercase">
                  {course.category}
                </span>
              </div>

              <h3 className="font-display text-xl font-bold text-white mb-1 group-hover:text-purple-200 transition-colors line-clamp-2">
                {course.title}
              </h3>
              <p className="text-text-muted text-sm mb-4 line-clamp-2">{course.subtitle}</p>

              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{formatDateRange(course.startDate, course.endDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="truncate">{course.city}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{course.duration}</span>
                </div>
              </div>

              {/* Seat availability */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-text-muted flex items-center gap-1">
                    <Users className="w-3 h-3" /> {course.seatsAvailable} seats left
                  </span>
                  <span className="text-text-muted">{course.seats} total</span>
                </div>
                <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${100 - availabilityPct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-purple-500 rounded-full"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-bold text-xl">${course.price.toLocaleString()}</span>
                  <span className="text-text-muted text-sm ml-1">{course.currency}</span>
                </div>
                <div className="flex items-center gap-1 text-purple-400 text-sm font-medium group-hover:gap-2 transition-all">
                  View Course <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </TiltCard>
    </motion.div>
  );
}
