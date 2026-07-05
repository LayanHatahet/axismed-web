import type { Metadata } from "next";
import { PaymentStatus } from "@/components/payment/PaymentStatus";

export const metadata: Metadata = {
  title: "Payment Status",
  description: "Your AxisMed course payment confirmation.",
  robots: { index: false, follow: false },
};

export default function PaymentStatusPage() {
  return <PaymentStatus />;
}
