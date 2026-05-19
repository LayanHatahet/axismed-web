"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, BookOpen, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Course, Event } from "@/lib/types";

interface Result {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  type: "course" | "event";
}

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery]     = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents]   = useState<Event[]>([]);
  const [loaded, setLoaded]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    if (loaded) return;
    Promise.all([
      fetch("/api/courses").then((r) => r.json()).catch(() => []),
      fetch("/api/events").then((r)  => r.json()).catch(() => []),
    ]).then(([c, e]) => {
      setCourses(Array.isArray(c) ? c : []);
      setEvents(Array.isArray(e) ? e : []);
      setLoaded(true);
    });
  }, [loaded]);

  useEffect(() => {
    if (open) { load(); setQuery(""); setTimeout(() => inputRef.current?.focus(), 80); }
  }, [open, load]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); onClose(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const q = query.toLowerCase().trim();

  const courseResults: Result[] = (
    q
      ? courses.filter((c) =>
          c.title.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.city?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
        )
      : courses.filter((c) => c.status !== "completed" && c.status !== "archived").slice(0, 5)
  ).map((c) => ({
    id: c.id,
    title: c.title,
    subtitle: `${c.programType} · ${c.city || c.location}`,
    href: `/courses/${c.slug}`,
    type: "course",
  }));

  const eventResults: Result[] = (
    q
      ? events.filter((e) =>
          e.title.toLowerCase().includes(q) ||
          e.type.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
        )
      : events.filter((e) => e.status !== "completed").slice(0, 4)
  ).map((e) => ({
    id: e.id,
    title: e.title,
    subtitle: `${e.type.charAt(0).toUpperCase() + e.type.slice(1)} · ${e.location}`,
    href: `/events`,
    type: "event",
  }));

  const empty = courseResults.length === 0 && eventResults.length === 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[60] flex flex-col items-center pt-[10vh] px-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-bg-base/95 backdrop-blur-md" />

          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass glow-border rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.6)]">

              {/* Input row */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                <Search className="w-5 h-5 text-purple-400 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses, events…"
                  className="flex-1 bg-transparent text-white placeholder:text-text-dim text-base outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 rounded-lg text-text-dim hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Results */}
              <div className="max-h-[55vh] overflow-y-auto">
                {!loaded ? (
                  <p className="py-10 text-center text-text-muted text-sm">Loading…</p>
                ) : empty ? (
                  <p className="py-10 text-center text-text-muted text-sm">
                    {q ? `No results for "${query}"` : "No programs available yet."}
                  </p>
                ) : (
                  <div className="p-2 space-y-3">
                    {courseResults.length > 0 && (
                      <Group label="Courses" items={courseResults} onClose={onClose} />
                    )}
                    {eventResults.length > 0 && (
                      <Group label="Events" items={eventResults} onClose={onClose} />
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-2.5 border-t border-border bg-white/[0.02]">
                <span className="text-[10px] text-text-dim">
                  Press{" "}
                  <kbd className="bg-white/8 rounded px-1 py-0.5 font-mono text-[9px]">Esc</kbd>
                  {" "}to close
                </span>
                <Link
                  href="/courses"
                  onClick={onClose}
                  className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                >
                  Browse all programs <ArrowRight className="w-2.5 h-2.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Group({
  label,
  items,
  onClose,
}: {
  label: string;
  items: Result[];
  onClose: () => void;
}) {
  return (
    <div>
      <p className="text-[10px] text-text-dim font-semibold tracking-[0.14em] uppercase px-3 pt-2 pb-1">
        {label}
      </p>
      {items.map((item) => {
        const Icon = item.type === "course" ? BookOpen : Calendar;
        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-500/10 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate leading-tight">{item.title}</p>
              <p className="text-text-dim text-xs truncate capitalize mt-0.5">{item.subtitle}</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-text-dim group-hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
          </Link>
        );
      })}
    </div>
  );
}
