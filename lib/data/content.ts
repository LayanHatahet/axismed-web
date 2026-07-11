import type { WebsiteContent } from "@/lib/types";

export const defaultContent: WebsiteContent = {
  home: {
    hero: {
      badge: "Regional Healthcare Platform",
      headline: "Where Clinical\nExcellence Meets\nInnovation",
      subheadline: "Premium surgical education, scientific events and healthcare media — built for clinicians, by clinicians.",
      ctaText: "Explore Programs",
      ctaLink: "/courses",
    },
    whoWeAre: {
      tagline: "Who We Are",
      headline: "Where Knowledge, Innovation and People Converge",
      body1: "AxisMed bridges medical education, healthcare innovation, and professional communication through premium training programs, scientific events, and specialized healthcare media solutions.",
      body2: "We are being developed as the leading independent platform for medical education and healthcare media in the Middle East — built by healthcare professionals, for healthcare professionals.",
      image: "https://images.unsplash.com/photo-1576089172869-4f5f6f315620?w=1200&h=600&q=80&auto=format&fit=crop",
      stat1: "50+ Programs/year",
      stat2: "15+ Countries",
      stat3: "100% Healthcare-focused",
    },
    corePillars: {
      tagline: "What We Do",
      headline: "Three Pillars of Excellence",
      body: "Every program, event and production we deliver sits at the intersection of education, innovation and communication.",
    },
    whyAxisMed: {
      tagline: "Why AxisMed",
      headline: "Built for the Clinician Who Refuses to Stand Still",
      body: "In a region where medical education is rapidly evolving, AxisMed exists to set the standard — combining international faculty, hands-on immersive formats and a deep understanding of the Middle East healthcare landscape.",
    },
    mediaInsights: {
      tagline: "Media & Insights",
      headline: "Knowledge That Moves With You",
      body: "From surgical procedure documentaries to expert interviews and scientific event coverage — our media library keeps you connected to the frontier of medical knowledge.",
    },
  },
  about: {
    hero: {
      tagline: "About AxisMed",
      headline: "The Platform Built for Healthcare Excellence",
      body: "Learn about the vision, mission and people behind the region's premier medical education and healthcare media platform.",
    },
    story: {
      headline: "Our Story",
      body: "AxisMed was founded with a clear belief: that healthcare professionals in the Middle East deserve world-class education and resources that reflect their reality. We started as a small team of clinicians and educators who were frustrated by the gap between international medical standards and regional access.",
      image: "/images/about-our-story.jpg",
    },
    vision: "To be the defining platform for medical education and healthcare communication across the Middle East and beyond — where every clinician has access to the tools, knowledge and networks they need to advance their practice.",
    mission: "To design and deliver world-class surgical training, scientific events and healthcare media that elevate clinical standards, foster professional community and accelerate innovation in regional healthcare.",
    differentiators: [
      { title: "Cadaveric Excellence", body: "Real anatomy, real technique. Our cadaveric labs are equipped to international standards with the latest fixation systems and planning technology." },
      { title: "Regional Intelligence", body: "We understand the Middle East healthcare ecosystem deeply — its regulatory landscape, clinical culture and the pace at which it is evolving." },
      { title: "Faculty Network", body: "Our programs are led by internationally recognized surgeons and educators who are selected not just for expertise but for their ability to teach." },
      { title: "Full-Service Media", body: "From event documentation to surgical procedure films, we produce healthcare content that is cinematic in quality and clinical in accuracy." },
    ],
  },
  media: {
    hero: {
      tagline: "Healthcare Media",
      headline: "Content That Educates, Engages and Inspires",
      body: "We produce specialized healthcare media for institutions, medical device companies and individual clinicians who want to communicate their work at the highest level.",
    },
    services: [
      { title: "Surgical Documentation", body: "High-definition procedure filming with clinical commentary, designed for education and CME credit.", icon: "Video" },
      { title: "Event Coverage", body: "Full production for conferences, symposiums and workshops — live streaming, highlight reels and archival quality recordings.", icon: "Camera" },
      { title: "Educational Series", body: "Scripted and produced educational video series for institutions, societies and medical device companies.", icon: "BookOpen" },
      { title: "Surgeon Profiling", body: "Professional profiles and thought leadership content that positions clinicians as regional and global voices.", icon: "User" },
    ],
  },
  contact: {
    hero: {
      tagline: "Get in Touch",
      headline: "Let's Start a Conversation",
      body: "Whether you're looking to enroll in a program, partner with us or commission healthcare media — we're here to help.",
    },
    email: "admin@theaxismed.com",
    phone: "+971 50 189 7038",
    whatsapp: "971501897038",
    address: "Dubai Science Park, South Tower, Dubai, United Arab Emirates",
  },
  partners: {
    hero: {
      tagline: "Our Partners",
      headline: "Trusted by the Region's Leading Healthcare Organizations",
      body: "AxisMed collaborates with medical device manufacturers, academic institutions, hospitals and scientific societies to deliver programs that make a genuine clinical impact.",
    },
  },
  courses: {
    hero: {
      tagline: "Programs & Courses",
      headline: "Find Your Next Clinical Advancement",
      body: "From cadaveric surgical training to digital medicine workshops — every AxisMed program is designed to move your practice forward.",
    },
  },
  footer: {
    tagline: "Education · Innovation · Global Healthcare",
    description: "Premium medical education, scientific events and healthcare media — connecting clinicians across the Middle East and beyond.",
  },
};
