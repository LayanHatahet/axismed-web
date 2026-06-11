import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Concierge } from "@/components/chat/Concierge";
import { PulseNetwork } from "@/components/ui/PulseNetwork";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "AxisMed — Medical Education, Surgical Innovation & Healthcare Media",
    template: "%s | AxisMed",
  },
  description:
    "AxisMed is a regional healthcare education and medical media platform focused on advanced surgical training, healthcare innovation, and professional medical engagement across the Middle East.",
  keywords: [
    "medical education",
    "surgical training",
    "cadaveric workshops",
    "healthcare media",
    "scientific events",
    "Middle East healthcare",
    "CMF surgery",
    "digital surgery",
    "medical conference",
  ],
  authors: [{ name: "AxisMed" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AxisMed",
    title: "AxisMed — Medical Education & Healthcare Innovation",
    description:
      "Regional platform for advanced surgical training, scientific events and professional healthcare communication.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AxisMed — Medical Education & Healthcare Innovation",
    description:
      "Regional platform for advanced surgical training, scientific events and professional healthcare communication.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      {/* Prevent flash of wrong theme */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('axismed-theme')||((window.matchMedia('(prefers-color-scheme: light)').matches)?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-bg-dark text-text-primary antialiased overflow-x-hidden">
        <ThemeProvider>
          <PulseNetwork />
          {children}
          <Concierge />
        </ThemeProvider>
      </body>
    </html>
  );
}
