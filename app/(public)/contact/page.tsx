import type { Metadata } from "next";
import { ContactHero } from "./ContactHero";
import { ContactMain } from "./ContactMain";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with AxisMed for course registrations, partnerships, media inquiries, and general questions.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactMain />
    </>
  );
}
