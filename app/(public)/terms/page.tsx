import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section, Bullets } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms and conditions governing use of theaxismed.com and registration for medical education courses offered by The AxisMed FZ LLC.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="July 2026"
      intro="These Terms & Conditions govern your use of theaxismed.com and your registration for courses offered by The AxisMed FZ LLC. By using our website or registering for a course, you agree to these terms."
    >
      <Section heading="1. About us">
        <p>
          The AxisMed FZ LLC (“AxisMed”, “we”, “us”) is a medical education and
          life-science services company registered in Dubai, United Arab Emirates,
          operating the website theaxismed.com.
        </p>
      </Section>

      <Section heading="2. Our services">
        <p>
          We provide professional medical education courses, workshops, and
          related life-science services. Course content, faculty, dates, venues,
          and availability are described on the relevant course page and may be
          updated from time to time.
        </p>
      </Section>

      <Section heading="3. Eligibility">
        <p>
          Our courses are intended for qualified healthcare and life-science
          professionals and appropriately qualified trainees. By registering, you
          confirm that the information you provide is accurate and that you meet
          any stated eligibility requirements for the course.
        </p>
      </Section>

      <Section heading="4. Registration & payment">
        <Bullets
          items={[
            "Course fees are displayed on each course page in US Dollars (USD) and are charged per participant.",
            "Payment is made securely online by card through our payment provider, Stripe. Your place is confirmed once payment is successfully completed.",
            "You are responsible for providing accurate registration and contact details so we can confirm your enrolment and send course information.",
            "We reserve the right to decline or cancel a registration where eligibility requirements are not met or where a course cannot proceed.",
          ]}
        />
      </Section>

      <Section heading="5. Pricing & availability">
        <p>
          We make every effort to ensure pricing and course information are
          accurate. In the rare event of an obvious error, we reserve the right to
          correct it and, where necessary, cancel an affected registration and
          issue a full refund. Seats are limited and allocated on a first-paid
          basis.
        </p>
      </Section>

      <Section heading="6. Refunds & cancellations">
        <p>
          Refunds and cancellations are governed by our{" "}
          <Link href="/refund" className="text-purple-600 hover:text-purple-700 underline underline-offset-2">
            Refund Policy
          </Link>{" "}
          and{" "}
          <Link href="/cancellation" className="text-purple-600 hover:text-purple-700 underline underline-offset-2">
            Cancellation Policy
          </Link>
          , which form part of these Terms.
        </p>
      </Section>

      <Section heading="7. Intellectual property">
        <p>
          All course materials, content, branding, and materials provided by
          AxisMed are the intellectual property of The AxisMed FZ LLC or its
          licensors and are provided for your personal, professional development
          only. They may not be copied, recorded, redistributed, or used
          commercially without our prior written consent.
        </p>
      </Section>

      <Section heading="8. Participant conduct">
        <p>
          Participants are expected to act professionally and to comply with the
          rules of any host venue, training facility, or laboratory. We may remove
          a participant who behaves inappropriately or unsafely, without refund.
        </p>
      </Section>

      <Section heading="9. Educational purpose & disclaimer">
        <p>
          Our courses are provided for professional education and training
          purposes. They do not constitute medical advice for any specific patient
          and do not replace a practitioner’s own clinical judgement, licensing,
          or regulatory obligations. Participants remain solely responsible for
          their own clinical practice.
        </p>
      </Section>

      <Section heading="10. Limitation of liability">
        <p>
          To the maximum extent permitted by law, AxisMed’s total liability
          arising out of or in connection with a course or your use of the website
          shall not exceed the fees you paid for the relevant course. We are not
          liable for indirect or consequential losses.
        </p>
      </Section>

      <Section heading="11. Changes to a course">
        <p>
          Occasionally we may need to change faculty, dates, venue, or format for
          reasons beyond our control. Where a change is material, we will notify
          registered participants and, where a course is cancelled by us, offer a
          transfer or a full refund.
        </p>
      </Section>

      <Section heading="12. Governing law">
        <p>
          These Terms are governed by the laws of the United Arab Emirates and,
          where applicable, the Emirate of Dubai. Any disputes shall be subject to
          the jurisdiction of the competent courts of Dubai, UAE.
        </p>
      </Section>
    </LegalPage>
  );
}
