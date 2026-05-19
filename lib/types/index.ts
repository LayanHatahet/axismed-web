export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: CourseCategory;
  programType: ProgramType;
  image: string;
  instructor: string;
  instructorTitle: string;
  instructorImage?: string;
  location: string;
  city: string;
  startDate: string;
  endDate: string;
  duration: string;
  seats: number;
  seatsAvailable: number;
  price: number;
  currency: string;
  status: CourseStatus;
  featured: boolean;
  description: string;
  overview: string;
  agenda: AgendaItem[];
  faculty: FacultyMember[];
  sponsors: string[];
  tags: string[];
  gallery: string[];
  brochure?: string;
  createdAt: string;
  updatedAt: string;
}

export type CourseCategory =
  | "Oral & Maxillofacial Surgery"
  | "Orthopedic Surgery"
  | "Implantology"
  | "Digital Surgery"
  | "CMF Reconstruction"
  | "Neurosurgery"
  | "General Surgery"
  | "Healthcare Management";

export type ProgramType =
  | "Cadaveric Training"
  | "Hands-on Workshop"
  | "Digital Surgery Program"
  | "Industry Educational Event"
  | "Custom Private Training"
  | "Scientific Conference";

export type CourseStatus =
  | "upcoming"
  | "open"
  | "sold_out"
  | "completed"
  | "archived"
  | "draft";

export interface AgendaItem {
  day: string;
  sessions: { time: string; title: string; speaker?: string }[];
}

export interface FacultyMember {
  id: string;
  name: string;
  title: string;
  institution: string;
  specialty: string;
  image?: string;
  bio?: string;
}

export interface MediaItem {
  id: string;
  type: "video" | "image" | "podcast" | "interview";
  title: string;
  description: string;
  thumbnail: string;
  url?: string;
  duration?: string;
  date: string;
  category: string;
  featured: boolean;
  tags: string[];
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  category: PartnerCategory;
  website?: string;
  featured: boolean;
  description?: string;
}

export type PartnerCategory =
  | "Industry Partner"
  | "Healthcare Institution"
  | "Scientific Collaborator"
  | "Training Facility"
  | "Media Partner";

export interface Event {
  id: string;
  slug: string;
  title: string;
  type: "conference" | "workshop" | "webinar" | "symposium";
  date: string;
  endDate?: string;
  location: string;
  description: string;
  image: string;
  capacity: number;
  registrations: number;
  status: "upcoming" | "open" | "sold_out" | "completed";
  featured: boolean;
}

export interface Registration {
  id: string;
  courseId: string;
  courseName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  institution: string;
  paymentStatus: "pending" | "paid" | "refunded" | "cancelled";
  amount: number;
  currency: string;
  registeredAt: string;
  notes?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  institution: string;
  quote: string;
  image?: string;
  rating: number;
  courseId?: string;
  featured: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  authorImage?: string;
  publishedAt: string;
  category: string;
  tags: string[];
  featured: boolean;
  status: "published" | "draft" | "archived";
}

export interface ContactSubmission {
  id: string;
  type: "general" | "registration" | "partnership" | "media";
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  message: string;
  submittedAt: string;
  status: "new" | "read" | "replied" | "archived";
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  country: string;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    facebook?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  paymentConfig: {
    currency: string;
    gateway: string;
    stripePublishableKey?: string;
    testMode: boolean;
  };
}

export interface ConciergeSettings {
  enabled: boolean;
  whatsappNumber: string;
  greeting: string;
  systemPrompt: string;
  openaiModel: string;
  collectName: boolean;
  collectEmail: boolean;
  collectSpecialty: boolean;
}

export interface ConciergeLead {
  id: string;
  name?: string;
  email?: string;
  specialty?: string;
  interest?: string;
  summary?: string;
  capturedAt: string;
  source: "chat" | "contact" | "pathway";
}

export interface WebsiteContent {
  home: {
    hero: { badge: string; headline: string; subheadline: string; ctaText: string; ctaLink: string };
    whoWeAre: { tagline: string; headline: string; body1: string; body2: string; image: string; stat1: string; stat2: string; stat3: string };
    corePillars: { tagline: string; headline: string; body: string };
    whyAxisMed: { tagline: string; headline: string; body: string };
    mediaInsights: { tagline: string; headline: string; body: string };
  };
  about: {
    hero: { tagline: string; headline: string; body: string };
    story: { headline: string; body: string; image: string };
    vision: string;
    mission: string;
    differentiators: { title: string; body: string }[];
  };
  media: {
    hero: { tagline: string; headline: string; body: string };
    services: { title: string; body: string; icon: string }[];
  };
  contact: {
    hero: { tagline: string; headline: string; body: string };
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
  };
  partners: {
    hero: { tagline: string; headline: string; body: string };
  };
  courses: {
    hero: { tagline: string; headline: string; body: string };
  };
  footer: {
    tagline: string;
    description: string;
  };
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
  icon?: string;
}
