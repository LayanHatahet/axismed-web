"use client";

import { SectionReveal } from "./SectionReveal";
import { cn } from "@/lib/utils/cn";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <SectionReveal>
          <p className="text-purple-400 text-xs font-semibold tracking-[0.18em] uppercase mb-4">
            {eyebrow}
          </p>
        </SectionReveal>
      )}
      <SectionReveal delay={0.05}>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
          {titleHighlight ? (
            <>
              {title}{" "}
              <span className="text-gradient">{titleHighlight}</span>
            </>
          ) : (
            title
          )}
        </h2>
      </SectionReveal>
      {subtitle && (
        <SectionReveal delay={0.1}>
          <p className="text-text-secondary text-lg leading-relaxed">{subtitle}</p>
        </SectionReveal>
      )}
    </div>
  );
}
