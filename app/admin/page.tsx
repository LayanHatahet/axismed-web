import { readJSON } from "@/lib/db.server";
import { courses as coursesSeed } from "@/lib/data/courses";
import type { Course, Registration } from "@/lib/types";
import { AdminDashboardClient } from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [courses, registrations] = await Promise.all([
    readJSON<Course[]>("courses.json", coursesSeed),
    readJSON<Registration[]>("registrations.json", []),
  ]);

  const totalRevenue = registrations
    .filter((r) => r.paymentStatus === "paid")
    .reduce((sum, r) => sum + r.amount, 0);

  const recentRegistrations = [...registrations]
    .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
    .slice(0, 4);

  return (
    <AdminDashboardClient
      courses={courses}
      totalCourses={courses.length}
      totalRegistrations={registrations.length}
      totalRevenue={totalRevenue}
      recentRegistrations={recentRegistrations}
    />
  );
}
