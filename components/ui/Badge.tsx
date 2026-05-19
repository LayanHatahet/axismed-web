import { cn } from "@/lib/utils/cn";

type Variant = "purple" | "green" | "orange" | "red" | "blue" | "gray";

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

const variants: Record<Variant, string> = {
  purple: "bg-purple-500/15 text-purple-300 border border-purple-500/25",
  green:  "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25",
  orange: "bg-orange-500/15 text-orange-300 border border-orange-500/25",
  red:    "bg-red-500/15 text-red-300 border border-red-500/25",
  blue:   "bg-blue-500/15 text-blue-300 border border-blue-500/25",
  gray:   "bg-white/8 text-text-muted border border-white/10",
};

export function Badge({ children, variant = "purple", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide uppercase",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: Variant }> = {
    open:      { label: "Open",      variant: "green" },
    upcoming:  { label: "Upcoming",  variant: "blue" },
    sold_out:  { label: "Sold Out",  variant: "red" },
    completed: { label: "Completed", variant: "gray" },
    draft:     { label: "Draft",     variant: "orange" },
    archived:  { label: "Archived",  variant: "gray" },
  };
  const cfg = map[status] ?? { label: status, variant: "gray" as Variant };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
