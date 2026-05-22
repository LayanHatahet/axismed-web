import { readJSON } from "@/lib/db.server";
import { courses as seed } from "@/lib/data/courses";
import type { Course, Partner, MediaItem } from "@/lib/types";
import { Hero } from "@/components/home/Hero";
import { WhoWeAre } from "@/components/home/WhoWeAre";
import { CorePillars } from "@/components/home/CorePillars";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";
import { WhyAxisMed } from "@/components/home/WhyAxisMed";
import { HomeMoments } from "@/components/home/HomeMoments";
import { PartnersStrip } from "@/components/home/PartnersStrip";
import { MediaInsights } from "@/components/home/MediaInsights";
import { HomeStats } from "@/components/home/HomeStats";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { SponsorCTA } from "@/components/home/SponsorCTA";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [courses, partners, media] = await Promise.all([
    readJSON<Course[]>("courses.json", seed),
    readJSON<Partner[]>("partners.json", []),
    readJSON<MediaItem[]>("media.json", []),
  ]);

  const featured = courses
    .filter((c) => c.featured && c.status !== "draft" && c.status !== "archived")
    .slice(0, 4);

  const featuredPartners = partners.filter((p) => p.featured);
  const featuredMedia    = media.filter((m) => m.featured).slice(0, 3);

  return (
    <>
      <Hero />
      <PartnersStrip partners={featuredPartners} />
      <WhoWeAre />
      <HomeStats />
      <CorePillars />
      <FeaturedCourses courses={featured} />
      <WhyAxisMed />
      <SponsorCTA />
      <HomeMoments />
      <HomeFAQ />
      <MediaInsights items={featuredMedia} />
    </>
  );
}
