import type { Metadata } from "next";
import { AboutHero } from "./AboutHero";
import { OurStory } from "./OurStory";
import { VisionMission } from "./VisionMission";
import { WhatMakesUsDifferent } from "./WhatMakesUsDifferent";
import { AboutPhotos } from "./AboutPhotos";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about AxisMed — our story, vision, mission and what makes us the leading regional platform for medical education and healthcare communication in the Middle East.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurStory />
      <VisionMission />
      <AboutPhotos />
      <WhatMakesUsDifferent />
    </>
  );
}
