"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock, ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import type { Event } from "@/lib/types";
import { formatDateShort } from "@/lib/utils/formatDate";

const TYPE_LABELS: Record<Event["type"], string> = {
  conference: "Conference",
  workshop: "Workshop",
  webinar: "Webinar",
  symposium: "Symposium",
};

const TYPE_COLORS: Record<Event["type"], string> = {
  conference: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  workshop:   "bg-blue-500/20 text-blue-300 border-blue-500/30",
  webinar:    "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  symposium:  "bg-violet-500/20 text-violet-300 border-violet-500/30",
};

const STATUS_CONFIG: Record<Event["status"], { label: string; color: string }> = {
  upcoming:  { label: "Upcoming",  color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  open:      { label: "Open",      color: "bg-green-500/20 text-green-300 border-green-500/30" },
  sold_out:  { label: "Sold Out",  color: "bg-red-500/20 text-red-300 border-red-500/30" },
  completed: { label: "Completed", color: "bg-white/8 text-text-muted border-border" },
};

const FILTERS = ["All", "Conference", "Workshop", "Webinar", "Symposium"] as const;

interface Props { events: Event[] }

export function EventsGrid({ events }: Props) {
  const [filter, setFilter] = useState<typeof FILTERS[number]>("All");

  const active = events.filter((e) =>
    filter === "All" ? true : e.type === filter.toLowerCase()
  );

  const upcoming = active.filter((e) => e.status !== "completed");
  const past     = active.filter((e) => e.status === "completed");

  if (events.length === 0) {
    return (
      <section className="py-32 section-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <CalendarDays className="w-12 h-12 text-text-dim mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-white mb-2">No events yet</h2>
          <p className="text-text-muted">Check back soon â€” upcoming events will appear here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 section-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filter === f
                  ? "bg-purple-500/20 text-white border-purple-500/40"
                  : "text-text-muted border-border hover:text-white hover:border-white/20"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Upcoming events */}
        {upcoming.length > 0 && (
          <div className="mb-14">
            <h2 className="font-display text-xl font-bold text-white mb-6">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcoming.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Past events */}
        {past.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-bold text-white mb-6 opacity-60">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 opacity-60">
              {past.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          </div>
        )}

        {active.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-text-muted">No events in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function EventCard({ event, index }: { event: Event; index: number }) {
  const statusCfg = STATUS_CONFIG[event.status];
  const fill = event.capacity > 0 ? Math.min(100, Math.round((event.registrations / event.capacity) * 100)) : 0;
  const isCompleted = event.status === "completed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group glass glow-border rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all hover:shadow-[0_8px_32px_rgba(124,58,237,0.12)]"
    >
      {/* Cover image */}
      <div className="relative h-44 bg-bg-elevated overflow-hidden">
        {event.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900/30 to-bg-base/70 flex items-center justify-center">
            <Calendar className="w-10 h-10 text-purple-500/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Type + status badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${TYPE_COLORS[event.type]}`}>
            {TYPE_LABELS[event.type]}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusCfg.color}`}>
            {statusCfg.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-base font-bold text-white leading-snug mb-3 line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-text-muted text-xs">
            <Clock className="w-3.5 h-3.5 shrink-0 text-purple-400" />
            <span>
              {formatDateShort(event.date)}
              {event.endDate && event.endDate !== event.date && ` â€“ ${formatDateShort(event.endDate)}`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-text-muted text-xs">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-purple-400" />
            <span className="truncate">{event.location}</span>
          </div>
          {event.capacity > 0 && (
            <div className="flex items-center gap-2 text-text-muted text-xs">
              <Users className="w-3.5 h-3.5 shrink-0 text-purple-400" />
              <span>{event.registrations} / {event.capacity} registered</span>
            </div>
          )}
        </div>

        {/* Capacity bar */}
        {event.capacity > 0 && (
          <div className="mb-4">
            <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  fill >= 90 ? "bg-red-400" : fill >= 70 ? "bg-amber-400" : "bg-purple-500"
                }`}
                style={{ width: `${fill}%` }}
              />
            </div>
            <p className="text-[10px] text-text-dim mt-1">{fill}% capacity filled</p>
          </div>
        )}

        {/* CTA */}
        {!isCompleted && event.status !== "sold_out" ? (
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-sm font-medium hover:bg-purple-500/30 transition-colors group/btn"
          >
            Register Now
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <div className="flex items-center justify-center w-full py-2.5 rounded-xl bg-white/5 text-text-dim border border-border text-sm">
            {event.status === "sold_out" ? "Sold Out" : "Event Ended"}
          </div>
        )}
      </div>
    </motion.div>
  );
}
