import type { Metadata } from "next";
import { LegalPage, Section, Bullets } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How The AxisMed FZ LLC collects, uses, and protects your personal data when you use theaxismed.com and register for our medical education courses.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="July 2026"
      intro="The AxisMed FZ LLC (“AxisMed”, “we”, “us”) is committed to protecting your privacy. This policy explains what personal data we collect through theaxismed.com, how we use it, and the choices you have."
    >
      <Section heading="1. Who we are">
        <p>
          The AxisMed FZ LLC is a medical education and life-science services
          company based in Dubai, United Arab Emirates, operating the website{" "}
          <span style={{ color: "#12082C" }}>theaxismed.com</span>. We provide
          professional medical education courses and related services.
        </p>
      </Section>

      <Section heading="2. Information we collect">
        <p>We collect the following information when you interact with us:</p>
        <Bullets
          items={[
            "Registration details you provide: first and last name, email address, phone number, professional specialty, and institution.",
            "Enquiry details submitted through our contact form.",
            "Payment information required to process course fees. Card details are entered directly into our payment provider (Stripe) and are never seen or stored on our servers.",
            "Technical data such as your IP address, browser type, and basic usage information collected automatically to keep the site secure and functioning.",
          ]}
        />
      </Section>

      <Section heading="3. How we use your information">
        <Bullets
          items={[
            "To process your course registration and payment, and to send you confirmations and receipts.",
            "To communicate with you about your enrolment, course logistics, and support requests.",
            "To respond to enquiries you submit to us.",
            "To meet our legal, accounting, and regulatory obligations.",
            "To maintain the security and integrity of our website.",
          ]}
        />
      </Section>

      <Section heading="4. Payment processing">
        <p>
          Card payments are processed securely by{" "}
          <span style={{ color: "#12082C" }}>Stripe</span>, a PCI-DSS Level 1
          certified payment provider. When you pay, your card information is sent
          directly to Stripe over an encrypted connection. AxisMed does not
          receive, process, or store your full card number, CVC, or expiry date.
          Stripe processes your data in accordance with its own privacy policy.
        </p>
      </Section>

      <Section heading="5. Sharing your information">
        <p>
          We do not sell your personal data. We share it only with trusted
          service providers who help us operate, such as our payment processor
          (Stripe) and email/hosting providers, and only to the extent necessary.
          We may also disclose information where required by law or to protect our
          legal rights.
        </p>
      </Section>

      <Section heading="6. Data retention">
        <p>
          We keep your personal data only for as long as necessary to fulfil the
          purposes described in this policy, including to satisfy any legal,
          accounting, or reporting requirements applicable in the UAE.
        </p>
      </Section>

      <Section heading="7. Your rights">
        <p>
          Subject to applicable UAE data protection law, you may request access
          to, correction of, or deletion of your personal data, and you may object
          to certain uses. To exercise these rights, contact us using the details
          below.
        </p>
      </Section>

      <Section heading="8. Data security">
        <p>
          We use appropriate technical and organisational measures to protect your
          data, including encrypted connections (HTTPS) across the website and
          tokenised payment handling through Stripe. No method of transmission
          over the internet is completely secure, but we work to protect your
          information at all times.
        </p>
      </Section>

      <Section heading="9. Cookies">
        <p>
          Our website uses only the cookies necessary for it to function and to
          keep it secure. We do not use cookies to build advertising profiles.
        </p>
      </Section>

      <Section heading="10. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. The “Last updated”
          date above reflects the most recent revision.
        </p>
      </Section>
    </LegalPage>
  );
}
