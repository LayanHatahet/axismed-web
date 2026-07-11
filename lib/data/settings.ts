import type { SiteSettings } from "@/lib/types";

export const siteSettings: SiteSettings = {
  siteName: "AxisMed",
  tagline: "Education · Innovation · Global Healthcare",
  email: "admin@theaxismed.com",
  phone: "+971 50 189 7038",
  whatsapp: "+971 50 189 7038",
  address: "Dubai Science Park, South Tower",
  city: "Dubai",
  country: "United Arab Emirates",
  socialLinks: {
    instagram: "https://instagram.com/axismed",
    linkedin: "https://linkedin.com/company/axismed",
    twitter: "https://twitter.com/axismed",
    youtube: "https://youtube.com/@axismed",
  },
  seo: {
    metaTitle: "AxisMed — Medical Education, Surgical Innovation & Healthcare Media",
    metaDescription:
      "AxisMed is a regional healthcare education and medical media platform focused on advanced surgical training, healthcare innovation, and professional medical engagement across the Middle East.",
    keywords: [
      "medical education Middle East",
      "surgical training Dubai",
      "cadaveric workshop",
      "CMF surgery course",
      "digital surgery workflow",
      "healthcare media production",
    ],
  },
  paymentConfig: {
    currency: "USD",
    gateway: "stripe",
    testMode: false,
  },
};
