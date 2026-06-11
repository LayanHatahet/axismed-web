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
  /** Use on light-background sections — switches text from white to dark purple */
  light?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  align = "center",
  className,
  light = false,
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
          <p className="text-purple-500 text-xs font-semibold tracking-[0.18em] uppercase mb-4">
            {eyebrow}
          </p>
        </SectionReveal>
      )}
      <SectionReveal delay={0.05}>
        <h2
          className={cn(
            "font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4",
            light ? "" : "text-white"
          )}
          style={light ? { color: "#2d2a52" } : undefined}
        >
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
          <p
            className={cn("text-lg leading-relaxed", light ? "" : "text-text-secondary")}
            style={light ? { color: "#5a5680" } : undefined}
          >
            {subtitle}
          </p>
        </SectionReveal>
      )}
    </div>
  );
}
