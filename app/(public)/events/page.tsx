import type { Metadata } from "next";
import { readJSON } from "@/lib/db.server";
import type { Event } from "@/lib/types";
import { EventsHero } from "./EventsHero";
import { EventsGrid } from "./EventsGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Discover upcoming AxisMed events — conferences, workshops, webinars, and symposiums designed for healthcare professionals.",
};

export default async function EventsPage() {
  const events = await readJSON<Event[]>("events.json", []);

  return (
    <>
      <EventsHero />
      <EventsGrid events={events} />
    </>
  );
}
