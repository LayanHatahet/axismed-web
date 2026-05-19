import type { MediaItem } from "@/lib/types";

export const mediaItems: MediaItem[] = [
  {
    id: "m1",
    type: "video",
    title: "Inside the Cadaveric Lab: Orthognathic Simulation",
    description: "Behind-the-scenes footage from AxisMed's premier surgical training program at Dubai Healthcare City.",
    thumbnail: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=450&q=80&auto=format&fit=crop",
    url: "#",
    duration: "4:32",
    date: "2025-05-15",
    category: "Event Highlights",
    featured: true,
    tags: ["cadaveric", "orthognathic", "training"],
  },
  {
    id: "m2",
    type: "podcast",
    title: "The Future of Digital Surgery in the Middle East",
    description: "Prof. Ahmed Al-Rashid and Dr. Khalid Nasser discuss how AI and digital planning are transforming surgical practice in the region.",
    thumbnail: "https://images.unsplash.com/photo-1590402494756-fe3dc22aa9f8?w=800&h=450&q=80&auto=format&fit=crop",
    url: "#",
    duration: "42:10",
    date: "2025-04-28",
    category: "Podcast",
    featured: true,
    tags: ["digital surgery", "AI", "Middle East"],
  },
  {
    id: "m3",
    type: "interview",
    title: "Surgeon Profile: Dr. Sara Mansoor on PSI Planning",
    description: "An in-depth conversation with Dr. Sara Mansoor on the clinical benefits of patient-specific implants and the precision they bring to complex cases.",
    thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=450&q=80&auto=format&fit=crop",
    url: "#",
    duration: "18:45",
    date: "2025-04-10",
    category: "Interviews",
    featured: true,
    tags: ["PSI", "interview", "expert"],
  },
  {
    id: "m4",
    type: "image",
    title: "CMF Reconstruction Workshop — Riyadh 2025",
    description: "Photo gallery from the inaugural CMF Reconstruction Workshop hosted at King Faisal Specialist Hospital.",
    thumbnail: "/placeholders/media-4.jpg",
    date: "2025-03-20",
    category: "Gallery",
    featured: false,
    tags: ["CMF", "Riyadh", "gallery"],
  },
  {
    id: "m5",
    type: "video",
    title: "Digital Workflow from CBCT to Surgery — Full Tutorial",
    description: "Step-by-step educational video demonstrating the complete digital surgery workflow from imaging to intraoperative guide use.",
    thumbnail: "/placeholders/media-5.jpg",
    url: "#",
    duration: "28:15",
    date: "2025-03-05",
    category: "Educational",
    featured: false,
    tags: ["digital", "tutorial", "workflow"],
  },
  {
    id: "m6",
    type: "podcast",
    title: "Healthcare Innovation Roundtable — Episode 3",
    description: "A panel discussion on healthcare innovation hubs, medical education gaps, and the role of private platforms in the GCC region.",
    thumbnail: "/placeholders/media-6.jpg",
    url: "#",
    duration: "55:20",
    date: "2025-02-18",
    category: "Podcast",
    featured: false,
    tags: ["innovation", "GCC", "panel"],
  },
];

export function getFeaturedMedia(): MediaItem[] {
  return mediaItems.filter((m) => m.featured);
}

export function getMediaByType(type: string): MediaItem[] {
  return mediaItems.filter((m) => m.type === type);
}
