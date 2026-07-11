import type { Metadata } from "next";
import { PartnersHero } from "./PartnersHero";
import { PartnersGrid } from "./PartnersGrid";
import { CollaborationOpportunities } from "./CollaborationOpportunities";
export const metadata: Metadata = {
  title: "Partners",
  description:
    "AxisMed collaborates with leading healthcare institutions, industry partners, and medical experts to deliver impactful educational experiences.",
};

export default function PartnersPage() {
  return (
    <>
      <PartnersHero />
      <PartnersGrid />
      <CollaborationOpportunities />
    </>
  );
}
