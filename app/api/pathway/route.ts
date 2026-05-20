import { NextRequest, NextResponse } from "next/server";
import { readJSON } from "@/lib/db.server";
import type { Course, Event } from "@/lib/types";

export interface PathwayInput {
  specialty: string;
  level: string;
  goal: string;
  region: string;
  timeline: string;
  format: string;
}

export interface PathwayResult {
  headline: string;
  intro: string;
  primary: ProgramRec;
  supporting: [ProgramRec, ProgramRec];
  timelineNote: string;
  profileLabel: string;
}

export interface ProgramRec {
  title: string;
  tag: string;
  description: string;
  duration: string;
  level: string;
  href: string;
  accent: string;
  reason: string;
}

/* ──────────────────────────────────────────────────────────
   PROGRAM LIBRARY
────────────────────────────────────────────────────────── */

const PROGRAMS: (ProgramRec & { scores: Record<string, number> })[] = [
  {
    title: "Orthognathic & PSI Course",
    tag: "Cadaveric Training",
    description: "Three-day intensive combining virtual surgical planning with live cadaveric simulation for orthognathic procedures and patient-specific implants.",
    duration: "3 Days",
    level: "Advanced",
    href: "/courses/orthognathic-psi-course",
    accent: "#a49ecf",
    reason: "",
    scores: {
      specialty_omfs: 3, specialty_cmf: 2,
      level_advanced: 3, level_consultant: 2,
      goal_technique: 3, goal_advance: 2,
      format_cadaveric: 3,
    },
  },
  {
    title: "Digital Surgery Workflow",
    tag: "Hands-on Workshop",
    description: "End-to-end digital surgery pipeline — from CBCT acquisition through 3D planning, guide fabrication, and intraoperative navigation.",
    duration: "2 Days",
    level: "Intermediate",
    href: "/courses/digital-surgery-workflow",
    accent: "#0EA5E9",
    reason: "",
    scores: {
      specialty_digital: 3, specialty_omfs: 1, specialty_implant: 1,
      level_intermediate: 3, level_practicing: 2,
      goal_digital: 3, goal_advance: 1,
      format_workshop: 2, format_hybrid: 2,
    },
  },
  {
    title: "CMF Reconstruction Workshop",
    tag: "Cadaveric Training",
    description: "Advanced orbital, mandibular, and mid-face reconstruction techniques using titanium mesh, custom implants, and modern fixation systems.",
    duration: "3 Days",
    level: "Advanced",
    href: "/courses/cmf-reconstruction-workshop",
    accent: "#F59E0B",
    reason: "",
    scores: {
      specialty_cmf: 3, specialty_omfs: 2,
      level_advanced: 3, level_consultant: 2,
      goal_technique: 3, goal_advance: 2,
      format_cadaveric: 3,
      region_gcc: 1, region_ksa: 1,
    },
  },
  {
    title: "Advanced Implant Planning",
    tag: "Hands-on Workshop",
    description: "Evidence-based digital implant planning, guided surgery protocols, and immediate loading strategies for complex multi-unit cases.",
    duration: "2 Days",
    level: "Intermediate–Advanced",
    href: "/courses/advanced-implant-planning",
    accent: "#10B981",
    reason: "",
    scores: {
      specialty_implant: 3, specialty_digital: 1,
      level_intermediate: 2, level_practicing: 2, level_advanced: 1,
      goal_technique: 2, goal_digital: 1,
      format_workshop: 3,
    },
  },
  {
    title: "Robotic Surgery Fundamentals",
    tag: "Simulation Workshop",
    description: "Structured entry into robotic-assisted surgery — from console theory to tissue handling and camera navigation on high-fidelity simulators.",
    duration: "2 Days",
    level: "Beginner–Intermediate",
    href: "/courses",
    accent: "#EC4899",
    reason: "",
    scores: {
      specialty_robotic: 3, specialty_general: 2,
      level_resident: 3, level_practicing: 2,
      goal_foundation: 3, goal_technique: 1,
      format_workshop: 2, format_hybrid: 1,
    },
  },
  {
    title: "AI in Clinical Practice",
    tag: "Digital Program",
    description: "How artificial intelligence is reshaping diagnostics, surgical assistance, and clinical decision-making — with hands-on tool sessions.",
    duration: "1 Day",
    level: "All Levels",
    href: "/courses",
    accent: "#6366F1",
    reason: "",
    scores: {
      specialty_digital: 3, specialty_robotic: 1,
      level_student: 2, level_resident: 2, level_practicing: 2,
      goal_digital: 3, goal_foundation: 1,
      format_hybrid: 2, format_online: 3,
    },
  },
  {
    title: "Surgical Leadership Program",
    tag: "Professional Development",
    description: "Designed for senior clinicians and educators — covers curriculum design, mentorship frameworks, and building high-performance surgical training ecosystems.",
    duration: "Modular",
    level: "Senior",
    href: "/courses",
    accent: "#F97316",
    reason: "",
    scores: {
      specialty_any: 1,
      level_consultant: 3, level_educator: 3,
      goal_lead: 3, goal_advance: 1,
      format_hybrid: 2,
    },
  },
  {
    title: "International Surgical Summit",
    tag: "Conference & Networking",
    description: "Annual gathering of surgeons, innovators, and healthcare leaders — featuring live surgery, masterclasses, and global partner exhibitions.",
    duration: "3 Days",
    level: "All Levels",
    href: "/courses",
    accent: "#14B8A6",
    reason: "",
    scores: {
      specialty_any: 1,
      level_any: 1,
      goal_network: 3, goal_advance: 1,
      format_conference: 3,
    },
  },
];

/* ──────────────────────────────────────────────────────────
   SCORING ENGINE
────────────────────────────────────────────────────────── */

function scoreKey(input: PathwayInput) {
  const keys: string[] = ["specialty_any", "level_any"];

  const specialtyMap: Record<string, string> = {
    "Oral & Maxillofacial Surgery": "specialty_omfs",
    "CMF / Craniofacial Surgery": "specialty_cmf",
    "Implantology / Prosthodontics": "specialty_implant",
    "Robotic / MIS Surgery": "specialty_robotic",
    "Digital Surgery": "specialty_digital",
    "General Surgery": "specialty_general",
  };
  if (specialtyMap[input.specialty]) keys.push(specialtyMap[input.specialty]);

  const levelMap: Record<string, string[]> = {
    "Medical Student": ["level_student"],
    "Resident / Trainee": ["level_resident"],
    "Practicing Surgeon": ["level_practicing", "level_intermediate"],
    "Senior Consultant": ["level_consultant", "level_advanced"],
    "Educator / Faculty": ["level_educator", "level_consultant"],
    "Industry Professional": ["level_practicing"],
  };
  if (levelMap[input.level]) keys.push(...levelMap[input.level]);

  const goalMap: Record<string, string> = {
    "Build foundational skills": "goal_foundation",
    "Advance existing expertise": "goal_advance",
    "Learn digital & AI tools": "goal_digital",
    "Master a specific technique": "goal_technique",
    "Lead or design training programs": "goal_lead",
    "Network with global leaders": "goal_network",
  };
  if (goalMap[input.goal]) keys.push(goalMap[input.goal]);

  const regionMap: Record<string, string> = {
    "UAE": "region_uae",
    "Saudi Arabia": "region_ksa",
    "GCC (other)": "region_gcc",
    "North Africa": "region_africa",
    "Europe": "region_europe",
    "Global / Other": "region_global",
  };
  if (regionMap[input.region]) keys.push(regionMap[input.region]);

  const formatMap: Record<string, string> = {
    "Hands-on cadaveric": "format_cadaveric",
    "Workshop with models": "format_workshop",
    "Live surgery observation": "format_cadaveric",
    "Hybrid digital + practical": "format_hybrid",
    "Online / remote": "format_online",
    "Conference / summit": "format_conference",
  };
  if (formatMap[input.format]) keys.push(formatMap[input.format]);

  return keys;
}

/* ──────────────────────────────────────────────────────────
   MAP LIVE COURSES/EVENTS TO PROGRAM RECS
────────────────────────────────────────────────────────── */

const CATEGORY_ACCENT: Record<string, string> = {
  "Oral & Maxillofacial Surgery": "#a49ecf",
  "CMF Reconstruction":           "#F59E0B",
  "Implantology":                 "#10B981",
  "Digital Surgery":              "#0EA5E9",
  "Robotic / MIS Surgery":        "#EC4899",
  "General Surgery":              "#6366F1",
  "Orthopedic Surgery":           "#F97316",
  "Neurosurgery":                 "#14B8A6",
  "Healthcare Management":        "#bcb8df",
};

const CATEGORY_SPECIALTY: Record<string, string> = {
  "Oral & Maxillofacial Surgery": "specialty_omfs",
  "CMF Reconstruction":           "specialty_cmf",
  "Implantology":                 "specialty_implant",
  "Digital Surgery":              "specialty_digital",
  "Robotic / MIS Surgery":        "specialty_robotic",
  "General Surgery":              "specialty_general",
  "Orthopedic Surgery":           "specialty_general",
};

const PROGRAM_TYPE_FORMAT: Record<string, string[]> = {
  "Cadaveric Training":         ["format_cadaveric"],
  "Hands-on Workshop":          ["format_workshop"],
  "Digital Surgery Program":    ["format_online", "format_hybrid"],
  "Scientific Conference":      ["format_conference"],
  "Industry Educational Event": ["format_hybrid"],
  "Custom Private Training":    ["format_workshop"],
};

function liveCoursesToPrograms(
  courses: Course[]
): (ProgramRec & { scores: Record<string, number> })[] {
  return courses
    .filter((c) => c.status !== "archived" && c.status !== "draft" && c.status !== "completed")
    .map((c) => {
      const scores: Record<string, number> = { specialty_any: 1, level_any: 1 };
      const specKey = CATEGORY_SPECIALTY[c.category];
      if (specKey) scores[specKey] = 3;
      const fmtKeys = PROGRAM_TYPE_FORMAT[c.programType] ?? [];
      fmtKeys.forEach((k) => (scores[k] = (scores[k] ?? 0) + 2));
      if (c.featured) scores["specialty_any"] = 2;
      return {
        title: c.title,
        tag: c.programType,
        description: c.subtitle || c.overview?.slice(0, 160) || c.description?.slice(0, 160) || "",
        duration: c.duration,
        level: "All Levels",
        href: `/courses/${c.slug}`,
        accent: CATEGORY_ACCENT[c.category] ?? "#a49ecf",
        reason: "",
        scores,
      };
    });
}

const EVENT_FORMAT: Record<string, string[]> = {
  conference: ["format_conference"],
  workshop:   ["format_workshop"],
  webinar:    ["format_online"],
  symposium:  ["format_conference", "format_hybrid"],
};

function liveEventsToPrograms(
  events: Event[]
): (ProgramRec & { scores: Record<string, number> })[] {
  return events
    .filter((e) => e.status !== "completed")
    .map((e) => {
      const scores: Record<string, number> = { specialty_any: 1, level_any: 1, goal_network: 2 };
      (EVENT_FORMAT[e.type] ?? []).forEach((k) => (scores[k] = 3));
      return {
        title: e.title,
        tag: e.type.charAt(0).toUpperCase() + e.type.slice(1),
        description: e.description?.slice(0, 160) || "",
        duration: e.endDate && e.endDate !== e.date ? "Multi-day" : "1 Day",
        level: "All Levels",
        href: `/events`,
        accent: "#14B8A6",
        reason: "",
        scores,
      };
    });
}

async function buildPool(): Promise<(ProgramRec & { scores: Record<string, number> })[]> {
  const [courses, events] = await Promise.all([
    readJSON<Course[]>("courses.json", []).catch(() => [] as Course[]),
    readJSON<Event[]>("events.json", []).catch(() => [] as Event[]),
  ]);

  const live = [
    ...liveCoursesToPrograms(courses),
    ...liveEventsToPrograms(events),
  ];

  // Deduplicate against static PROGRAMS by title; live entries take precedence
  const liveTitles = new Set(live.map((p) => p.title.toLowerCase()));
  const staticFiltered = PROGRAMS.filter(
    (p) => !liveTitles.has(p.title.toLowerCase())
  );

  return [...live, ...staticFiltered];
}

function rank(
  input: PathwayInput,
  pool: (ProgramRec & { scores: Record<string, number> })[]
): [ProgramRec, ProgramRec, ProgramRec] {
  const keys = scoreKey(input);

  const scored = pool
    .map((p) => {
      let s = 0;
      for (const k of keys) s += p.scores[k] ?? 0;
      return { p, s };
    })
    .sort((a, b) => b.s - a.s);

  // Ensure we always have 3 distinct entries
  const top = scored.slice(0, 3);
  while (top.length < 3) top.push(top[0]);
  return [top[0].p, top[1].p, top[2].p];
}

/* ──────────────────────────────────────────────────────────
   TEMPLATE FALLBACK GENERATION
────────────────────────────────────────────────────────── */

function templateResult(
  input: PathwayInput,
  pool: (ProgramRec & { scores: Record<string, number> })[]
): PathwayResult {
  const [primary, sup1, sup2] = rank(input, pool);

  const profileLabels: Record<string, string> = {
    "Medical Student": "Future Clinician",
    "Resident / Trainee": "Emerging Surgeon",
    "Practicing Surgeon": "Practicing Clinician",
    "Senior Consultant": "Senior Clinician",
    "Educator / Faculty": "Medical Educator",
    "Industry Professional": "Healthcare Professional",
  };

  const timelineNotes: Record<string, string> = {
    "Next month": "With your immediate timeline, we'd suggest registering this week to secure a seat.",
    "In 1-3 months": "Your 1–3 month window is ideal — most of our upcoming programs open enrollment 6–8 weeks in advance.",
    "In 3-6 months": "Planning 3–6 months ahead gives you the best choice of cohorts and sometimes early-registration pricing.",
    "Planning for next year": "Booking early for next year often means priority access to faculty and limited cadaveric seats.",
    "Just exploring": "No rush — explore the programs at your pace, and our team is happy to keep you informed when new dates open.",
  };

  const goalHeadlines: Record<string, string> = {
    "Build foundational skills": `Your Pathway to Surgical Excellence Starts Here`,
    "Advance existing expertise": `Elevate Your Clinical Practice to the Next Level`,
    "Learn digital & AI tools": `Your Digital Surgery Transformation Pathway`,
    "Master a specific technique": `A Precision Pathway for Technique Mastery`,
    "Lead or design training programs": `Shaping the Future of Surgical Education`,
    "Network with global leaders": `Connecting You to the Global Surgical Community`,
  };

  const headline =
    goalHeadlines[input.goal] ?? `Your Personalized AxisMed Pathway`;

  const intros: Record<string, string> = {
    "Build foundational skills": `Based on your profile as ${input.level === "Medical Student" ? "a medical student" : "an early-career clinician"} in ${input.specialty || "your specialty"}, we've mapped a pathway that builds clinical confidence through structured, hands-on exposure — placing you among peers at a similar stage and learning from world-class faculty.`,
    "Advance existing expertise": `Your experience in ${input.specialty || "your specialty"} puts you in an excellent position to take a significant leap forward. We've identified programs that go beyond the basics, designed specifically for practicing clinicians who want to move from competent to exceptional.`,
    "Learn digital & AI tools": `Digital medicine is reshaping ${input.specialty || "every surgical specialty"}, and the clinicians who engage with it now will define the next generation of practice. Your pathway focuses on practical digital exposure that you can integrate directly into your work.`,
    "Master a specific technique": `Technical mastery requires deliberate, immersive practice — and your pathway is designed around exactly that. These programs combine evidence-based curriculum with hands-on repetition, ensuring you leave with real capability, not just awareness.`,
    "Lead or design training programs": `Leading medical education is one of the most impactful roles in healthcare, and your pathway reflects that ambition. We've prioritized programs that develop both your depth of knowledge and your capacity to teach and inspire the next generation.`,
    "Network with global leaders": `The most transformative learning often happens between sessions — in conversations with surgical leaders from across the world. Your pathway is centered on programs where the peer community is as valuable as the curriculum itself.`,
  };

  const intro = intros[input.goal] ?? `Based on your profile — ${input.level} in ${input.specialty || "your specialty"} — we've designed a focused pathway that aligns precisely with where you are and where you want to go.`;

  const reasons: Record<string, string> = {
    "Build foundational skills": "recommended as the strongest foundation for your stage",
    "Advance existing expertise": "selected as the highest-impact program for advancing your expertise",
    "Learn digital & AI tools": "identified as the best entry point for your digital transformation",
    "Master a specific technique": "chosen for the depth and hands-on intensity of its technique work",
    "Lead or design training programs": "recommended for its focus on surgical education leadership",
    "Network with global leaders": "selected for its exceptional peer community and global faculty",
  };

  const r = reasons[input.goal] ?? "matched to your profile";

  const primaryWithReason: ProgramRec = {
    ...primary,
    reason: `This program is ${r}. Given your background as ${profileLabels[input.level] ?? input.level} in ${input.specialty || "your specialty"}, the curriculum maps directly to your current stage and goals.`,
  };

  const sup1WithReason: ProgramRec = {
    ...sup1,
    reason: `Complements your primary program by ${input.goal === "Learn digital & AI tools" ? "deepening your practical digital exposure" : input.goal === "Build foundational skills" ? "broadening your clinical foundation" : "expanding your technical range"}.`,
  };

  const sup2WithReason: ProgramRec = {
    ...sup2,
    reason: `Extends your pathway further — ideal once you've completed the foundational programs above.`,
  };

  return {
    headline,
    intro,
    primary: primaryWithReason,
    supporting: [sup1WithReason, sup2WithReason],
    timelineNote: timelineNotes[input.timeline] ?? "Our team can help you find the right timing.",
    profileLabel: profileLabels[input.level] ?? input.level,
  };
}

/* ──────────────────────────────────────────────────────────
   AI GENERATION
────────────────────────────────────────────────────────── */

const AI_SYSTEM = `You are the AxisMed Pathway Intelligence engine. Given a clinician's profile, generate a personalized program pathway recommendation.

IMPORTANT: Respond ONLY with valid JSON in this exact shape:
{
  "headline": "A cinematic, specific 6-10 word headline for this person's pathway",
  "intro": "2-3 sentence personalized introduction acknowledging their specialty and goal. Warm, precise, not generic.",
  "primaryReason": "2 sentences explaining why the primary program was chosen for THIS person specifically.",
  "support1Reason": "1 sentence on how supporting program 1 complements the primary.",
  "support2Reason": "1 sentence on how supporting program 2 extends the pathway.",
  "timelineNote": "1 sentence of advice about timing based on when they want to train.",
  "profileLabel": "A 2-3 word professional label for this person (e.g. 'Emerging Surgeon', 'Digital Pioneer')"
}

Be specific, warm, and intelligent. Reference their actual specialty and goal. Never be generic.`;

async function aiGenerate(
  input: PathwayInput,
  template: PathwayResult,
  apiKey: string
): Promise<PathwayResult> {
  const prompt = `Clinician profile:
- Specialty: ${input.specialty}
- Career level: ${input.level}
- Primary goal: ${input.goal}
- Region: ${input.region}
- Training timeline: ${input.timeline}
- Preferred format: ${input.format}

Recommended programs (already scored and selected from our live catalog):
- Primary: ${template.primary.title} (${template.primary.tag})
- Supporting 1: ${template.supporting[0].title}
- Supporting 2: ${template.supporting[1].title}

Generate personalized copy for this pathway. Reference the actual program titles by name.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: AI_SYSTEM },
        { role: "user", content: prompt },
      ],
      max_tokens: 600,
      temperature: 0.72,
    }),
  });

  if (!response.ok) return template;

  const data = await response.json();
  const raw: string = data.choices?.[0]?.message?.content ?? "{}";

  try {
    const parsed = JSON.parse(raw);
    return {
      ...template,
      headline: parsed.headline ?? template.headline,
      intro: parsed.intro ?? template.intro,
      profileLabel: parsed.profileLabel ?? template.profileLabel,
      timelineNote: parsed.timelineNote ?? template.timelineNote,
      primary: {
        ...template.primary,
        reason: parsed.primaryReason ?? template.primary.reason,
      },
      supporting: [
        { ...template.supporting[0], reason: parsed.support1Reason ?? template.supporting[0].reason },
        { ...template.supporting[1], reason: parsed.support2Reason ?? template.supporting[1].reason },
      ],
    };
  } catch {
    return template;
  }
}

/* ──────────────────────────────────────────────────────────
   ROUTE HANDLER
────────────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  const input = (await req.json()) as PathwayInput;

  const pool     = await buildPool();
  const template = templateResult(input, pool);
  const apiKey   = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const result = await aiGenerate(input, template, apiKey);
      return NextResponse.json(result);
    } catch {
      return NextResponse.json(template);
    }
  }

  await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
  return NextResponse.json(template);
}
