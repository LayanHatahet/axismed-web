import { StatCard } from "@/components/ui/AnimatedCounter";

const stats = [
  { value: 14,  suffix: "+", label: "Active Partners", description: "Across industry and institutions" },
  { value: 8,   suffix: "+", label: "Countries",        description: "Regional presence" },
  { value: 25,  suffix: "+", label: "Joint Programs",   description: "Delivered annually" },
  { value: 100, suffix: "%", label: "Healthcare Focus", description: "Every engagement" },
];

export function PartnerStats() {
  return (
    <section className="py-16 bg-bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
