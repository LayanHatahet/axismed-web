import type { Metadata } from "next";
import { MediaHero } from "./MediaHero";
import { MediaServices } from "./MediaServices";
import { MediaGallery } from "./MediaGallery";
import { PodcastSection } from "./PodcastSection";
export const metadata: Metadata = {
  title: "Media & Production",
  description:
    "Specialized healthcare media solutions — educational video production, surgical coverage, healthcare branding, professional interviews and podcasts.",
};

export default function MediaPage() {
  return (
    <>
      <MediaHero />
      <MediaServices />
      <MediaGallery />
      <PodcastSection />
    </>
  );
}
