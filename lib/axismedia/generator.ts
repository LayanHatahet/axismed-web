/**
 * The Axis Engine's "AI" — a deterministic brand generator.
 *
 * Everything is seeded from the visitor's input (name + sector + vibe), so the
 * output feels generated yet needs no backend, no keys and no latency. The
 * page presents it as a 30-second sketch of what the studio builds for real.
 */

export type SectorKey = "clinic" | "hospital" | "dental" | "aesthetics" | "pharma" | "digital";
export type VibeKey = "premium" | "warm" | "clinical" | "bold";

export interface BrandKit {
  name: string;
  initials: string;
  sector: SectorKey;
  sectorLabel: string;
  vibe: VibeKey;
  vibeLabel: string;
  tagline: string;
  subline: string;
  /* preview palette (used to skin the generated site + app) */
  accent: string;
  accentSoft: string;
  paper: string;
  ink: string;
  inkSoft: string;
  darkPreview: boolean;
  monogramVariant: number;
  doctors: { name: string; spec: string; rating: string }[];
  slots: string[];
  hooks: string[];
  channels: { label: string; pct: number }[];
  phases: { label: string; weeks: number }[];
}

export const SECTORS: { key: SectorKey; label: string }[] = [
  { key: "clinic", label: "Clinic" },
  { key: "hospital", label: "Hospital" },
  { key: "dental", label: "Dental" },
  { key: "aesthetics", label: "Aesthetics" },
  { key: "pharma", label: "Pharma" },
  { key: "digital", label: "Digital health" },
];

export const VIBES: { key: VibeKey; label: string; swatch: string }[] = [
  { key: "premium", label: "Premium", swatch: "#d8b56a" },
  { key: "warm", label: "Warm", swatch: "#ff8a7a" },
  { key: "clinical", label: "Clinical", swatch: "#6fbdff" },
  { key: "bold", label: "Bold", swatch: "#7c5cff" },
];

const TAGLINES: Record<SectorKey, string[]> = {
  clinic: [
    "Care that knows your name.",
    "Walk in worried. Walk out well.",
    "Your neighbourhood, healthier.",
  ],
  hospital: [
    "Where the region comes to heal.",
    "Serious medicine. Human touch.",
    "Built for the hardest cases.",
  ],
  dental: [
    "Smiles, engineered.",
    "The last dentist you'll ever switch from.",
    "Confidence, one visit away.",
  ],
  aesthetics: [
    "Science you can see.",
    "Subtle. Safe. Stunning.",
    "The art of looking like yourself.",
  ],
  pharma: [
    "Molecules that move medicine.",
    "From lab bench to bedside.",
    "Tomorrow's treatments, today.",
  ],
  digital: [
    "Healthcare, in your pocket.",
    "See a doctor before your coffee cools.",
    "The clinic that never closes.",
  ],
};

const SUBLINES: Record<SectorKey, string> = {
  clinic: "Book in seconds, be seen the same day, and leave with a plan you understand.",
  hospital: "World-class specialists, JCI-grade processes and outcomes we publish.",
  dental: "From routine cleanings to full-arch transformation — gently, transparently.",
  aesthetics: "Board-certified specialists, honest consultations, natural results.",
  pharma: "Partnering with clinicians and regulators to bring therapies to the Gulf.",
  digital: "Video consults, e-prescriptions and lab results — one tap each.",
};

const DOCTOR_POOLS: Record<SectorKey, { name: string; spec: string }[]> = {
  clinic: [
    { name: "Dr. Sara Haddad", spec: "Family medicine" },
    { name: "Dr. Omar Khalil", spec: "Internal medicine" },
    { name: "Dr. Lina Aziz", spec: "Pediatrics" },
  ],
  hospital: [
    { name: "Dr. Yusuf Rahman", spec: "Cardiology" },
    { name: "Dr. Mariam Saleh", spec: "Neurology" },
    { name: "Dr. Adam Nasser", spec: "Orthopedics" },
  ],
  dental: [
    { name: "Dr. Hala Mansour", spec: "Orthodontics" },
    { name: "Dr. Karim Fares", spec: "Implantology" },
    { name: "Dr. Noor Zaki", spec: "Cosmetic dentistry" },
  ],
  aesthetics: [
    { name: "Dr. Layla Amin", spec: "Dermatology" },
    { name: "Dr. Ziad Hamdan", spec: "Plastic surgery" },
    { name: "Dr. Rania Kassem", spec: "Laser medicine" },
  ],
  pharma: [
    { name: "Dr. Samir Attar", spec: "Medical affairs" },
    { name: "Dr. Dana Yousef", spec: "Clinical research" },
    { name: "Dr. Fadi Najm", spec: "Pharmacovigilance" },
  ],
  digital: [
    { name: "Dr. Aisha Malik", spec: "Telemedicine" },
    { name: "Dr. Hassan Qadi", spec: "General practice" },
    { name: "Dr. Maya Salem", spec: "Mental health" },
  ],
};

const HOOKS: Record<SectorKey, string[]> = {
  clinic: [
    "\"The 8-minute wait\" — a campaign built on your real average waiting time",
    "{name} Family Passport — one membership, the whole household covered",
    "Symptom-search takeover: own every \"doctor near me\" query in your district",
  ],
  hospital: [
    "Outcomes, published — a transparency campaign competitors can't copy",
    "\"The second opinion\" — positioning {name} as the region's referee",
    "Physician-led reels: your surgeons become the Gulf's medical voices",
  ],
  dental: [
    "The {name} Smile Gallery — verified before/afters as a booking engine",
    "\"Scared of dentists?\" — a comfort-first campaign for the 40% who avoid us",
    "Invisible-aligner launch bundle with influencer smile diaries",
  ],
  aesthetics: [
    "\"Still you\" — an anti-overfilled campaign that owns the natural look",
    "Treatment transparency index — publish real prices, win real trust",
    "Practitioner-first content: the faces behind the results",
  ],
  pharma: [
    "HCP micro-academy — CME-style content that earns prescriber attention",
    "Patient-journey storytelling cleared for MOHAP compliance",
    "Congress domination kit: booth, satellite symposium, digital follow-up",
  ],
  digital: [
    "\"Before your coffee cools\" — speed-to-doctor as the hero metric",
    "App-store conquest: reviews engine + ASO for the {name} app",
    "Corporate wellness pilots — land B2B2C contracts with UAE employers",
  ],
};

const CHANNELS: Record<SectorKey, { label: string; pct: number }[]> = {
  clinic: [
    { label: "Local search & maps", pct: 34 },
    { label: "Social & reels", pct: 26 },
    { label: "Content & SEO", pct: 22 },
    { label: "Community & offline", pct: 18 },
  ],
  hospital: [
    { label: "Physician branding", pct: 30 },
    { label: "Search & referrals", pct: 28 },
    { label: "PR & thought leadership", pct: 24 },
    { label: "Medical tourism", pct: 18 },
  ],
  dental: [
    { label: "Social & before/afters", pct: 34 },
    { label: "Local search", pct: 28 },
    { label: "Influencer smiles", pct: 20 },
    { label: "Retention & recall", pct: 18 },
  ],
  aesthetics: [
    { label: "Instagram & TikTok", pct: 38 },
    { label: "KOL practitioners", pct: 24 },
    { label: "Search & landing pages", pct: 22 },
    { label: "VIP referral program", pct: 16 },
  ],
  pharma: [
    { label: "HCP engagement", pct: 36 },
    { label: "Congress & events", pct: 26 },
    { label: "Medical content", pct: 22 },
    { label: "Digital detailing", pct: 16 },
  ],
  digital: [
    { label: "Performance & ASO", pct: 36 },
    { label: "B2B partnerships", pct: 26 },
    { label: "Content & community", pct: 22 },
    { label: "Lifecycle & CRM", pct: 16 },
  ],
};

const VIBE_PALETTES: Record<
  VibeKey,
  { accent: string; accentSoft: string; paper: string; ink: string; inkSoft: string; dark: boolean; label: string }
> = {
  premium: {
    label: "Premium",
    accent: "#b98e3f",
    accentSoft: "#ecdcb8",
    paper: "#f8f5ee",
    ink: "#231d33",
    inkSoft: "#6f6884",
    dark: false,
  },
  warm: {
    label: "Warm",
    accent: "#e86a56",
    accentSoft: "#ffd9d1",
    paper: "#fdf7f3",
    ink: "#332223",
    inkSoft: "#8a7376",
    dark: false,
  },
  clinical: {
    label: "Clinical",
    accent: "#2f7fd4",
    accentSoft: "#cde4fa",
    paper: "#f5f9fd",
    ink: "#16283a",
    inkSoft: "#5f7690",
    dark: false,
  },
  bold: {
    label: "Bold",
    accent: "#8b6bff",
    accentSoft: "#c9bbff",
    paper: "#131022",
    ink: "#f4f1ff",
    inkSoft: "#9d95c0",
    dark: true,
  },
};

export const SLOT_TIMES = ["09:00", "10:30", "12:00", "14:30", "16:00", "17:30"];

function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return h;
}

export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "AX";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function generateKit(rawName: string, sector: SectorKey, vibe: VibeKey): BrandKit {
  const name = rawName.trim() || "Nova Health";
  const seed = hash(`${name.toLowerCase()}|${sector}|${vibe}`);
  const pal = VIBE_PALETTES[vibe];
  const taglines = TAGLINES[sector];
  const doctors = DOCTOR_POOLS[sector].map((d, i) => ({
    ...d,
    rating: (4.7 + (((seed >> (i * 3)) % 3) / 10)).toFixed(1),
  }));

  return {
    name,
    initials: initialsOf(name),
    sector,
    sectorLabel: SECTORS.find((s) => s.key === sector)?.label ?? sector,
    vibe,
    vibeLabel: pal.label,
    tagline: taglines[seed % taglines.length],
    subline: SUBLINES[sector],
    accent: pal.accent,
    accentSoft: pal.accentSoft,
    paper: pal.paper,
    ink: pal.ink,
    inkSoft: pal.inkSoft,
    darkPreview: pal.dark,
    monogramVariant: (seed >> 4) % 4,
    doctors,
    slots: SLOT_TIMES,
    hooks: HOOKS[sector].map((h) => h.replaceAll("{name}", name)),
    channels: CHANNELS[sector],
    phases: [
      { label: "Diagnose", weeks: 2 },
      { label: "Brand", weeks: 4 },
      { label: "Build", weeks: 4 },
      { label: "Launch", weeks: 2 },
    ],
  };
}
