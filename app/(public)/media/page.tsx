import type { Metadata } from "next";
import { readJSON } from "@/lib/db.server";
import type { MediaItem } from "@/lib/types";
import { MediaHero } from "./MediaHero";
import { MediaServices } from "./MediaServices";
import { MediaGallery } from "./MediaGallery";
import { PodcastSection } from "./PodcastSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Media & Production",
  description:
    "Specialized healthcare media solutions — educational video production, surgical coverage, healthcare branding, professional interviews and podcasts.",
};

export default async function MediaPage() {
  const media = await readJSON<MediaItem[]>("media.json", []);
  const podcasts = media.filter((m) => m.type === "podcast");

  return (
    <>
      <MediaHero />
      <MediaServices />
      <MediaGallery />
      <PodcastSection podcasts={podcasts} />
    </>
  );
}
