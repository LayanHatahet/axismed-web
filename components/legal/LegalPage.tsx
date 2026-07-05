import type { ReactNode } from "react";
import Link from "next/link";

/**
 * Shared layout for legal / policy pages so they all match the site's
 * light lavender theme and stay responsive on mobile.
 */
export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <>
      {/* Hero */}
      <section className="section-tonal pt-32 pb-14 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-purple-600 text-xs font-semibold tracking-[0.18em] uppercase mb-3">
            The AxisMed FZ LLC · Legal
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold" style={{ color: "#12082C" }}>
            {title}
          </h1>
          {intro && (
            <p className="mt-4 text-base leading-relaxed" style={{ color: "#484575" }}>
              {intro}
            </p>
          )}
          <p className="mt-4 text-sm" style={{ color: "#9a96aa" }}>
            Last updated: {updated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {children}

          <div className="pt-6 mt-4 border-t border-border">
            <p className="text-sm" style={{ color: "#484575" }}>
              Questions about this policy? Contact us at{" "}
              <a href="mailto:admin@theaxismed.com" className="text-purple-600 hover:text-purple-700 underline underline-offset-2">
                admin@theaxismed.com
              </a>{" "}
              or via our{" "}
              <Link href="/contact" className="text-purple-600 hover:text-purple-700 underline underline-offset-2">
                contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-3" style={{ color: "#12082C" }}>
        {heading}
      </h2>
      <div className="space-y-3 text-[15px] leading-relaxed" style={{ color: "#484575" }}>
        {children}
      </div>
    </div>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#a49ecf" }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
