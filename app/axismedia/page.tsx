import { HeroSection } from "@/components/axismedia/HeroSection";
import { ManifestoSection } from "@/components/axismedia/ManifestoSection";
import { ServicesSection } from "@/components/axismedia/ServicesSection";
import { VitalSignsSection } from "@/components/axismedia/VitalSignsSection";
import { ProcessSection } from "@/components/axismedia/ProcessSection";
import { SectorsSection } from "@/components/axismedia/SectorsSection";
import { UAESection } from "@/components/axismedia/UAESection";
import { DiagnosisSection } from "@/components/axismedia/DiagnosisSection";
import { MarqueeStrip } from "@/components/axismedia/MarqueeStrip";
import { ContactSection } from "@/components/axismedia/ContactSection";

export default function AxisMediaPage() {
  return (
    <main>
      {/* 1. Hero — live ECG that races with your scrolling */}
      <HeroSection />

      {/* 2. Diagnosis — scroll-scrubbed manifesto ending on a defib flash */}
      <ManifestoSection />

      {/* 3. Treatment plan — horizontal-scroll tour of the four services */}
      <ServicesSection />

      <MarqueeStrip />

      {/* 4. Vital signs — monitor-styled proof points */}
      <VitalSignsSection />

      {/* 5. SOP — consultation → follow-up, drawn as a filling rhythm strip */}
      <ProcessSection />

      {/* 6. Admissions — every ward of the med industry */}
      <SectorsSection />

      {/* 7. Home turf — UAE skyline with a pulse */}
      <UAESection />

      {/* 8. Free triage — interactive brand check-up ending in a prescription */}
      <DiagnosisSection />

      {/* 9. Begin treatment — CTA + footer */}
      <ContactSection />
    </main>
  );
}
