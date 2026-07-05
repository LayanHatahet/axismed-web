import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section, Bullets } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  description:
    "How to cancel your registration for a medical education course with The AxisMed FZ LLC before the course starts.",
};

export default function CancellationPolicyPage() {
  return (
    <LegalPage
      title="Cancellation Policy"
      updated="July 2026"
      intro="This policy explains how to cancel your registration for a course with The AxisMed FZ LLC. It should be read together with our Refund Policy."
    >
      <Section heading="1. Cancelling before a course starts">
        <p>
          You may request to cancel your registration at any time before the course
          start date. We encourage you to let us know as early as possible, as
          earlier cancellations are more likely to qualify for a refund and allow
          us to offer your seat to another applicant.
        </p>
      </Section>

      <Section heading="2. How to request a cancellation">
        <p>Cancellation requests must be submitted through one of the official channels below:</p>
        <Bullets
          items={[
            <>
              By email to{" "}
              <a href="mailto:admin@theaxismed.com" className="text-purple-600 hover:text-purple-700 underline underline-offset-2">
                admin@theaxismed.com
              </a>
              , or
            </>,
            <>
              Through our{" "}
              <Link href="/contact" className="text-purple-600 hover:text-purple-700 underline underline-offset-2">
                official contact form
              </Link>
              .
            </>,
          ]}
        />
        <p>
          Please include your full name, the course name, and your payment
          reference so we can locate your registration quickly. A cancellation is
          only effective once we have received your request through one of these
          channels and confirmed it in writing.
        </p>
      </Section>

      <Section heading="3. Refunds on cancellation">
        <p>
          Whether a cancellation qualifies for a full, partial, or no refund
          depends on the timing of your request and the type of course, as set out
          in our{" "}
          <Link href="/refund" className="text-purple-600 hover:text-purple-700 underline underline-offset-2">
            Refund Policy
          </Link>
          . In many cases we can also offer to transfer your seat to a future
          course instead of a refund.
        </p>
      </Section>

      <Section heading="4. Transfers & substitutions">
        <p>
          If you are unable to attend, you may ask us about transferring your
          registration to a future course, or nominating an eligible colleague to
          attend in your place. Transfers are subject to availability and our
          confirmation.
        </p>
      </Section>

      <Section heading="5. Cancellations by AxisMed">
        <p>
          In the unlikely event that we cancel a course, we will notify registered
          participants as soon as possible and offer either a transfer to a future
          course or a full refund, in line with our Refund Policy.
        </p>
      </Section>
    </LegalPage>
  );
}
