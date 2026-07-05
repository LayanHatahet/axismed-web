import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section, Bullets } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Refund policy for paid medical education courses offered by The AxisMed FZ LLC. Refund eligibility depends on the course type and timing.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="July 2026"
      intro="We want you to feel confident enrolling with The AxisMed FZ LLC. This policy explains when a refund may be available for our paid medical education courses. Refund eligibility depends on the type of course and the timing of your request."
    >
      <Section heading="1. General principle">
        <p>
          Our courses are specialised, seat-limited programmes, and preparing them
          involves faculty, venue, laboratory, and material commitments made well
          in advance. Because of this, refund eligibility depends on how far ahead
          of the course you request a refund and on the nature of the course.
        </p>
      </Section>

      <Section heading="2. Requests before a course begins">
        <p>
          If you request a refund <span style={{ color: "#12082C" }}>before</span>{" "}
          the course start date, we will do our best to accommodate you. As a
          general guideline:
        </p>
        <Bullets
          items={[
            "Requests made well in advance of the start date are typically eligible for a full or substantial refund, subject to any non-recoverable processing fees.",
            "Requests made close to the start date may be eligible for a partial refund, or for a transfer of your seat to a future course, because commitments will already have been made on your behalf.",
          ]}
        />
        <p>
          Exact eligibility depends on the specific course and how close the
          request is to the start date. We will always confirm the applicable
          terms with you in writing.
        </p>
      </Section>

      <Section heading="3. After a course has started or materials delivered">
        <p>
          Once a course has started, or once course access, digital materials, or
          downloadable resources have been delivered to you, the payment is
          generally <span style={{ color: "#12082C" }}>non-refundable</span>,
          unless a refund is approved by AxisMed at its discretion (for example, in
          documented exceptional circumstances).
        </p>
      </Section>

      <Section heading="4. Courses cancelled or rescheduled by AxisMed">
        <p>
          If we cancel a course, you are entitled to a full refund of the fees you
          paid, or the option to transfer to a future course. If we materially
          reschedule a course and the new arrangement does not suit you, you may
          request a full refund.
        </p>
      </Section>

      <Section heading="5. How to request a refund">
        <p>
          To request a refund, please contact us at{" "}
          <a href="mailto:admin@theaxismed.com" className="text-purple-600 hover:text-purple-700 underline underline-offset-2">
            admin@theaxismed.com
          </a>{" "}
          or through our{" "}
          <Link href="/contact" className="text-purple-600 hover:text-purple-700 underline underline-offset-2">
            contact page
          </Link>
          , including your name, the course name, and your payment reference. See
          also our{" "}
          <Link href="/cancellation" className="text-purple-600 hover:text-purple-700 underline underline-offset-2">
            Cancellation Policy
          </Link>
          .
        </p>
      </Section>

      <Section heading="6. How refunds are issued">
        <p>
          Approved refunds are issued in US Dollars (USD) to the original payment
          method used at checkout, via our payment provider, Stripe. Please allow a
          reasonable period for the refund to appear on your statement, as
          processing times are determined by Stripe and your card issuer.
        </p>
      </Section>

      <Section heading="7. Questions">
        <p>
          We aim to be fair and reasonable in all refund matters. If you have any
          questions or believe your circumstances are exceptional, please reach out
          and we will review your request individually.
        </p>
      </Section>
    </LegalPage>
  );
}
