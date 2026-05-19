"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen, Users, DollarSign, Eye, ArrowUp,
  Calendar, Plus, Edit, Trash2,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import type { Course, Registration } from "@/lib/types";
import { formatDateShort } from "@/lib/utils/formatDate";
import { StatusBadge } from "@/components/ui/Badge";

interface Props {
  courses: Course[];
  totalCourses: number;
  totalRegistrations: number;
  totalRevenue: number;
  recentRegistrations: Registration[];
}

function fmt(n: number) {
  if (n >= 1000) return "$" + (n / 1000).toFixed(1) + "k";
  return "$" + n.toLocaleString();
}

export function AdminDashboardClient({
  courses,
  totalCourses,
  totalRegistrations,
  totalRevenue,
  recentRegistrations,
}: Props) {
  const stats = [
    { icon: BookOpen,   label: "Total Courses",   value: String(totalCourses),          color: "text-purple-400", bg: "bg-purple-500/12" },
    { icon: Users,      label: "Registrations",   value: String(totalRegistrations),    color: "text-blue-400",   bg: "bg-blue-500/12"   },
    { icon: DollarSign, label: "Revenue (USD)",   value: fmt(totalRevenue),             color: "text-green-400",  bg: "bg-green-500/12"  },
    { icon: Eye,        label: "Website Visits",  value: "—",                           color: "text-amber-400",  bg: "bg-amber-500/12"  },
  ];

  return (
    <>
      <AdminHeader
        title="Dashboard"
        subtitle={`Welcome back — ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`}
      />

      <div className="p-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="glass glow-border rounded-2xl p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  {stat.value !== "—" && (
                    <span className="flex items-center gap-1 text-green-400 text-xs font-medium">
                      <ArrowUp className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <div className="font-display text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-text-muted text-xs mt-0.5">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Courses table */}
          <div className="xl:col-span-2 glass glow-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-display font-bold text-white">Courses</h2>
              <Link
                href="/admin/courses"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Course
              </Link>
            </div>
            {courses.length === 0 ? (
              <div className="px-6 py-10 text-center text-text-muted text-sm">
                No courses yet.{" "}
                <Link href="/admin/courses" className="text-purple-400 hover:text-purple-300">Add one →</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs text-text-dim font-medium px-6 py-3">Course</th>
                      <th className="text-left text-xs text-text-dim font-medium px-4 py-3 hidden md:table-cell">Date</th>
                      <th className="text-left text-xs text-text-dim font-medium px-4 py-3 hidden lg:table-cell">Seats</th>
                      <th className="text-left text-xs text-text-dim font-medium px-4 py-3">Status</th>
                      <th className="text-left text-xs text-text-dim font-medium px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {courses.slice(0, 8).map((course) => (
                      <tr key={course.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-sm text-white leading-snug">{course.title}</div>
                          <div className="text-text-dim text-xs mt-0.5">{course.category}</div>
                        </td>
                        <td className="px-4 py-4 text-text-muted text-xs hidden md:table-cell">
                          {formatDateShort(course.startDate)}
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1 bg-white/8 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-500 rounded-full"
                                style={{ width: `${((course.seats - course.seatsAvailable) / course.seats) * 100}%` }}
                              />
                            </div>
                            <span className="text-text-muted text-xs">{course.seatsAvailable}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={course.status} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            <Link
                              href="/admin/courses"
                              className="p-1.5 rounded-lg text-text-dim hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent registrations */}
          <div className="glass glow-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-display font-bold text-white">Recent Registrations</h2>
              <Link href="/admin/registrations" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                View all
              </Link>
            </div>
            {recentRegistrations.length === 0 ? (
              <div className="px-6 py-10 text-center text-text-muted text-sm">No registrations yet.</div>
            ) : (
              <div className="divide-y divide-border">
                {recentRegistrations.map((reg) => (
                  <div key={reg.id} className="px-6 py-4">
                    <div className="text-white text-sm font-medium leading-snug">
                      {reg.firstName} {reg.lastName}
                    </div>
                    <div className="text-text-dim text-xs mt-0.5 line-clamp-1">{reg.courseName}</div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className={`text-xs font-medium ${
                        reg.paymentStatus === "paid"      ? "text-green-400" :
                        reg.paymentStatus === "pending"   ? "text-amber-400" :
                        reg.paymentStatus === "cancelled" ? "text-red-400"   : "text-text-dim"
                      }`}>
                        {reg.paymentStatus}
                      </span>
                      <span className="text-text-dim text-xs">{formatDateShort(reg.registeredAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="glass glow-border rounded-2xl p-6">
          <h2 className="font-display font-bold text-white mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { href: "/admin/courses",       icon: BookOpen,  label: "New Course"          },
              { href: "/admin/events",        icon: Calendar,  label: "New Event"           },
              { href: "/admin/media",         icon: Plus,      label: "Upload Media"        },
              { href: "/admin/registrations", icon: Users,     label: "View Registrations"  },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 p-4 bg-bg-elevated rounded-xl border border-border hover:border-purple-500/25 hover:bg-purple-500/8 transition-all group"
              >
                <Icon className="w-5 h-5 text-text-muted group-hover:text-purple-400 transition-colors" />
                <span className="text-sm font-medium text-text-secondary group-hover:text-white transition-colors">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
