import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk, Syne } from "next/font/google";
import "./axismedia.css";
import { PulseEngine } from "@/components/axismedia/PulseEngine";
import { Cursor } from "@/components/axismedia/Cursor";
import { VitalsHUD } from "@/components/axismedia/VitalsHUD";
import { Preloader } from "@/components/axismedia/Preloader";
import { AxmNavbar } from "@/components/axismedia/AxmNavbar";

const syne = Syne({
  variable: "--font-axm-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const grotesk = Space_Grotesk({
  variable: "--font-axm-body",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-axm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AxisMedia — We Give Medical Brands a Pulse",
  description:
    "AxisMedia is a healthcare-only creative studio in Dubai: branding, websites, applications and marketing engineered for hospitals, clinics, pharma and health-tech across the UAE and the Gulf.",
  keywords: [
    "medical branding agency",
    "healthcare marketing UAE",
    "medical website design Dubai",
    "healthcare app development",
    "clinic branding",
    "pharma marketing",
    "AxisMedia",
  ],
  openGraph: {
    type: "website",
    siteName: "AxisMedia",
    title: "AxisMedia — We Give Medical Brands a Pulse",
    description:
      "Branding, websites, apps and marketing — engineered exclusively for the medical industry. Dubai, UAE.",
  },
};

export default function AxisMediaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`axm ${syne.variable} ${grotesk.variable} ${plexMono.variable}`}>
      <PulseEngine />
      <Preloader />
      <Cursor />
      <AxmNavbar />
      {children}
      <VitalsHUD />
      {/* atmosphere */}
      <div className="axm-scanlines" aria-hidden="true" />
      <div className="axm-grain" aria-hidden="true" />
    </div>
  );
}
