"use client";

import { usePathname } from "next/navigation";
import { PulseNetwork } from "@/components/ui/PulseNetwork";
import { Concierge } from "@/components/chat/Concierge";

/**
 * AxisMed's global chrome (background waves + concierge chat). The AxisMedia
 * experience at /axismedia is a separate brand world with its own atmosphere,
 * so the shared chrome stays off there.
 */
export function SiteChrome() {
  const pathname = usePathname();
  if (pathname?.startsWith("/axismedia")) return null;
  return (
    <>
      <PulseNetwork />
      <Concierge />
    </>
  );
}
