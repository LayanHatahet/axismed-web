import { readJSON } from "@/lib/db.server";
import { courses as seed } from "@/lib/data/courses";
import type { Course, Partner, MediaItem } from "@/lib/types";
import { Hero } from "@/components/home/Hero";
import { WhoWeAre } from "@/components/home/WhoWeAre";
import { CorePillars } from "@/components/home/CorePillars";
import { WhoWeServe } from "@/components/home/WhoWeServe";
import { WhyAxisMed } from "@/components/home/WhyAxisMed";
import { ActivitiesShowcase } from "@/components/home/ActivitiesShowcase";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";
import { HomeMoments } from "@/components/home/HomeMoments";
import { PartnersStrip } from "@/components/home/PartnersStrip";
import { MediaInsights } from "@/components/home/MediaInsights";
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
      {/* 1. Hero — animated knot + 3 service nav links */}
      <Hero />

      {/* 2. Partners strip — logos of companies we've worked with */}
      <PartnersStrip partners={featuredPartners} />

      {/* 3. Who We Are — clear value proposition within seconds */}
      <WhoWeAre />

      {/* 4. What We Do — 4 practical services: Education · Events · Media · Partnerships */}
      <CorePillars />

      {/* 5. Who We Serve — 6 client types (MedTech, Pharma, Societies, Hospitals, HCPs, Academic) */}
      <WhoWeServe />

      {/* 6. Why AxisMed — real differentiators from GalMed/MedLab background */}
      <WhyAxisMed />

      {/* 7. Examples of activities — concrete program types, not aspirational metrics */}
      <ActivitiesShowcase />

      {/* 8. Featured courses — live programs available to register */}
      <FeaturedCourses courses={featured} />

      {/* 9. Partner with us — sponsor/co-develop CTA */}
      <SponsorCTA />

      {/* 10. Moments — photo gallery (admin-managed) */}
      <HomeMoments />

      {/* 11. FAQ */}
      <HomeFAQ />

      {/* 12. Media insights */}
      <MediaInsights items={featuredMedia} />
    </>
  );
}
