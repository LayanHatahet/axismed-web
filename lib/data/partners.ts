import type { Partner } from "@/lib/types";

export const partners: Partner[] = [
  { id: "p1",  name: "DePuy Synthes",          logo: "/placeholders/partner-logo.svg", category: "Industry Partner",          featured: true },
  { id: "p2",  name: "Stryker CMF",             logo: "/placeholders/partner-logo.svg", category: "Industry Partner",          featured: true },
  { id: "p3",  name: "KLS Martin",              logo: "/placeholders/partner-logo.svg", category: "Industry Partner",          featured: true },
  { id: "p4",  name: "Materialise",             logo: "/placeholders/partner-logo.svg", category: "Industry Partner",          featured: true },
  { id: "p5",  name: "Straumann Group",         logo: "/placeholders/partner-logo.svg", category: "Industry Partner",          featured: true },
  { id: "p6",  name: "Nobel Biocare",           logo: "/placeholders/partner-logo.svg", category: "Industry Partner",          featured: false },
  { id: "p7",  name: "Dubai Health Authority",  logo: "/placeholders/partner-logo.svg", category: "Healthcare Institution",    featured: true },
  { id: "p8",  name: "Cleveland Clinic Abu Dhabi", logo: "/placeholders/partner-logo.svg", category: "Healthcare Institution", featured: true },
  { id: "p9",  name: "Mediclinic Middle East",  logo: "/placeholders/partner-logo.svg", category: "Healthcare Institution",    featured: true },
  { id: "p10", name: "King Faisal Specialist",  logo: "/placeholders/partner-logo.svg", category: "Healthcare Institution",    featured: false },
  { id: "p11", name: "Gulf CMF Society",        logo: "/placeholders/partner-logo.svg", category: "Scientific Collaborator",   featured: true },
  { id: "p12", name: "Arab Board OMFS",         logo: "/placeholders/partner-logo.svg", category: "Scientific Collaborator",   featured: false },
  { id: "p13", name: "Dubai Healthcare City",   logo: "/placeholders/partner-logo.svg", category: "Training Facility",         featured: true },
  { id: "p14", name: "Mohammed Bin Rashid University", logo: "/placeholders/partner-logo.svg", category: "Training Facility",  featured: true },
];

export function getFeaturedPartners(): Partner[] {
  return partners.filter((p) => p.featured);
}

export function getPartnersByCategory(category: string): Partner[] {
  return partners.filter((p) => p.category === category);
}
