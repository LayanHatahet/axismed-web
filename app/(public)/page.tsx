import { readJSON } from "@/lib/db.server";
import { courses as seed } from "@/lib/data/courses";
import type { Course } from "@/lib/types";
import { Hero } from "@/components/home/Hero";
import { WhoWeAre } from "@/components/home/WhoWeAre";
import { CorePillars } from "@/components/home/CorePillars";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";
import { WhyAxisMed } from "@/components/home/WhyAxisMed";
import { HomeMoments } from "@/components/home/HomeMoments";
import { PartnersStrip } from "@/components/home/PartnersStrip";
import { MediaInsights } from "@/components/home/MediaInsights";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const courses = await readJSON<Course[]>("courses.json", seed);
  const featured = courses
    .filter((c) => c.featured && c.status !== "draft" && c.status !== "archived")
    .slice(0, 4);

  return (
    <>
      <Hero />
      <PartnersStrip />
      <WhoWeAre />
      <CorePillars />
      <FeaturedCourses courses={featured} />
      <WhyAxisMed />
      <HomeMoments />
      <MediaInsights />
    </>
  );
}
