export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMonth(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
}

export function formatDay(dateString: string): string {
  const date = new Date(dateString);
  return date.getDate().toString().padStart(2, "0");
}

export function formatYear(dateString: string): string {
  const date = new Date(dateString);
  return date.getFullYear().toString();
}

export function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (s.getFullYear() === e.getFullYear()) {
    return `${s.toLocaleDateString("en-US", opts)} – ${e.toLocaleDateString("en-US", { ...opts, year: "numeric" })}`;
  }
  return `${formatDateShort(start)} – ${formatDateShort(end)}`;
}
