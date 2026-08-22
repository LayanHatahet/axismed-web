import { HeroSection } from "@/components/axismedia/HeroSection";
import { EngineSection } from "@/components/axismedia/engine/EngineSection";
import { ManifestoSection } from "@/components/axismedia/ManifestoSection";
import { ServicesSection } from "@/components/axismedia/ServicesSection";
import { SectorsSection } from "@/components/axismedia/SectorsSection";
import { UAESection } from "@/components/axismedia/UAESection";
import { DiagnosisSection } from "@/components/axismedia/DiagnosisSection";
import { MarqueeStrip } from "@/components/axismedia/MarqueeStrip";
import { ContactSection } from "@/components/axismedia/ContactSection";

export default function AxisMediaPage() {
  return (
    <main>
      {/* Hero — live ECG that races with your scrolling */}
      <HeroSection />

      {/* The Studio — the heart of the site: visitors create their brand,
          website, live app and campaign, and hold the controls */}
      <EngineSection />

      {/* Ten-word diagnosis with a defib flash */}
      <ManifestoSection />

      {/* Treatment plan — horizontal visual tour, minimal words */}
      <ServicesSection />

      <MarqueeStrip />

      {/* Every ward of the med industry */}
      <SectorsSection />

      {/* Home turf — UAE skyline with a pulse */}
      <UAESection />

      {/* Interactive brand check-up */}
      <DiagnosisSection />

      {/* CTA + footer */}
      <ContactSection />
    </main>
  );
}
