import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db.server";
import { defaultConciergeSettings } from "@/lib/data/concierge-settings";
import type { ConciergeSettings, ConciergeLead } from "@/lib/types";

/* ──────────────────────────────────────────────────────────
   SYSTEM PROMPT
────────────────────────────────────────────────────────── */

const SYSTEM = `You are the AxisMed Concierge AI — an intelligent, warm, and premium healthcare concierge.

PERSONALITY:
Think of yourself as a trusted medical colleague who knows AxisMed deeply. You are genuinely curious, emotionally intelligent, and professionally warm. You care about each visitor's journey — not about closing a conversation quickly.

CRITICAL CONVERSATIONAL RULES — apply every single one:
1. ALWAYS end every response with a thoughtful follow-up question to continue the conversation
2. Never give fewer than 3 sentences — develop your answer fully, then ask
3. Within the first 2 exchanges, naturally ask for the visitor's name if not provided
4. Ask about their specialty, role, or professional goal before recommending anything
5. When someone shows interest, explore it before jumping to solutions
6. Reference earlier context — show you're listening and remembering
7. Vary your phrasing — never repeat the same sentence structure twice in a row
8. Be warm and professional — never corporate, never robotic, never overly enthusiastic
9. If they seem uncertain, ask what brought them to AxisMed today

CONVERSATION FLOW EXAMPLES:

If asked about courses →
  Introduce the breadth of what's available briefly
  Ask about their specialty
  Ask what they're hoping to develop or gain
  Then recommend specifically based on their answers

If someone mentions their role (surgeon, resident, educator) →
  Acknowledge it naturally and warmly ("That's a fascinating area of medicine...")
  Tailor everything that follows to that context

If someone says they want to register or book →
  Ask which program specifically
  Ask about their preferred timing
  Then offer to connect them with the team for confirmation

If asked something outside your knowledge →
  Acknowledge honestly: "That's something I'd want our team to answer properly for you"
  Offer WhatsApp transition naturally

ABOUT AXISMED:
AxisMed is a premium healthcare education and innovation platform based in the Middle East, with global reach. It offers:
- Surgical education: cadaveric training workshops, robotic surgery, CMF surgery, endoscopic techniques
- Digital medicine programs: AI in healthcare, digital surgery, telemedicine
- International medical events, conferences, and scientific summits
- Medical media production: surgical documentation, educational video, event coverage
- A global community of surgeons, educators, and healthcare leaders
Website pages: / (home), /courses, /about, /media, /partners, /contact

WHATSAPP HANDOFF — Set suggestWhatsApp: true ONLY when:
- They ask for specific pricing, availability, or scheduling
- They want to complete a booking or registration right now
- They explicitly ask to speak with a human team member
- Their inquiry needs personalized program design

LEAD EXTRACTION — extract carefully from what the visitor naturally shares:
- name: first or full name
- specialty: medical specialty, role, or profession
- email: any email address mentioned
- interest: their primary interest — exactly one of: "courses" | "events" | "media" | "partners" | "registration" | "general"

RESPONSE FORMAT — respond ONLY with valid JSON. No markdown, no extra text:
{
  "message": "your warm, conversational response, always ending with a thoughtful question",
  "leadData": {
    "name": null,
    "specialty": null,
    "email": null,
    "interest": null
  },
  "suggestWhatsApp": false,
  "whatsAppReason": null
}`;

/* ──────────────────────────────────────────────────────────
   CONVERSATIONAL FALLBACKS
────────────────────────────────────────────────────────── */

function fallback(last: string): string {
  const m = last.toLowerCase();

  if (m.includes("course") || m.includes("program") || m.includes("training") || m.includes("surgical") || m.includes("learn")) {
    return "AxisMed's surgical education programs are genuinely world-class — built for clinicians who want to stay ahead of where medicine is going. We cover everything from hands-on cadaveric workshops and robotic surgery training to AI in healthcare and digital surgical techniques.\n\nEach program is designed around real clinical application, not just theory. To help me point you toward what's most relevant — what's your specialty, and is there a particular skill or area you're looking to develop?";
  }
  if (m.includes("event") || m.includes("workshop") || m.includes("conference") || m.includes("summit") || m.includes("attend")) {
    return "Our events calendar is genuinely exciting — we organize international surgical conferences, hands-on intensive workshops, and scientific summits that bring together leaders from across the medical world. It's one of the best places to not only learn but also build real professional relationships.\n\nAre you looking for something locally based, or are you open to international events? And is there a particular medical focus area you'd most want to explore?";
  }
  if (m.includes("register") || m.includes("enroll") || m.includes("sign up") || m.includes("join") || m.includes("book")) {
    return "Registering is straightforward once you've chosen your program — each course page walks you through the process step by step. For some programs, our team also assists with direct registration to ensure everything goes smoothly.\n\nWhich program are you thinking about? If you tell me more about what you're interested in, I can walk you through what to expect and what to prepare for.";
  }
  if (m.includes("human") || m.includes("team") || m.includes("person") || m.includes("speak") || m.includes("contact") || m.includes("talk")) {
    return "Absolutely — connecting you with our team directly is something I can do right now. They're genuinely responsive and will be able to give you a much more personal level of guidance.\n\nBefore I hand you over, is there anything specific you'd like me to pass along to them so they have context when you connect?";
  }
  if (m.includes("about") || m.includes("what is axismed") || m.includes("who") || m.includes("tell me more")) {
    return "AxisMed is a premium healthcare education and innovation platform — created to bridge the gap between cutting-edge medical science and real clinical practice. We work with surgeons, educators, and healthcare institutions across the Middle East and internationally.\n\nWhat makes us different is the depth of the programs and the quality of the people involved — it's a genuine community, not just a course catalog. What drew you to AxisMed in the first place? I'd love to understand what you're looking for.";
  }
  if (m.includes("media") || m.includes("production") || m.includes("video") || m.includes("content") || m.includes("film")) {
    return "AxisMed's media division produces some genuinely impressive work — from surgical procedure documentation and educational video series to full event coverage and medical communication campaigns. It's designed for institutions and professionals who want high-quality healthcare content that actually resonates.\n\nAre you looking at this from a professional perspective — perhaps for your institution or practice — or more out of general interest? That would help me give you a much better picture of what's possible.";
  }
  if (m.includes("partner") || m.includes("sponsor") || m.includes("collaborat") || m.includes("institution")) {
    return "AxisMed's partnerships span medical device companies, academic institutions, hospitals, and international healthcare organizations. The collaboration model is quite flexible — from co-branded educational programs to event sponsorship and research partnerships.\n\nWhat kind of organization are you representing, and what kind of collaboration are you exploring? I want to make sure I connect you with the right conversation on our team.";
  }
  if (m.includes("price") || m.includes("cost") || m.includes("fee") || m.includes("how much") || m.includes("pricing")) {
    return "Pricing varies by program format, duration, and sometimes location — so I'd want to make sure you get accurate figures rather than a general estimate that might not apply to what you're interested in.\n\nThe best way to get exact pricing is through our team directly, and I can connect you right now. Which program or event are you asking about? That way I can also pass that context along when I connect you.";
  }
  if (m.includes("robotic") || m.includes("robot") || m.includes("laparoscop") || m.includes("minimally invasive")) {
    return "Robotic and minimally invasive surgery training is one of the strongest parts of our program offering. The courses are designed for surgeons who are either beginning their robotic journey or looking to refine advanced techniques — both are well served.\n\nAre you currently practicing with a robotic system, or is this more about building a foundation before your institution adopts one? That context would help me point you toward the right program.";
  }
  if (m.includes("ai") || m.includes("artificial intelligence") || m.includes("digital") || m.includes("technology")) {
    return "AI in healthcare is one of the most exciting areas we're building programs around right now. From surgical assistance and diagnostic imaging to clinical decision support, the field is moving incredibly fast — and AxisMed is deliberately designing programs that keep clinicians ahead of it.\n\nWhat's your current exposure to AI in your practice — is this something you're actively working with, or are you looking to understand where it's heading and what it means for your specialty?";
  }

  return "That's a great question, and I want to make sure I give you a genuinely useful answer rather than a generic one.\n\nCould you tell me a little more about what you're looking for? Even a few details about your specialty or what brought you to AxisMed today would help me point you in exactly the right direction.";
}

function fallbackWithLead(last: string) {
  return {
    content: fallback(last),
    leadData: null,
    suggestWhatsApp:
      last.toLowerCase().includes("human") ||
      last.toLowerCase().includes("team") ||
      last.toLowerCase().includes("speak") ||
      last.toLowerCase().includes("price") ||
      last.toLowerCase().includes("cost") ||
      last.toLowerCase().includes("book"),
    whatsAppReason: null,
  };
}

/* ──────────────────────────────────────────────────────────
   ROUTE HANDLER
────────────────────────────────────────────────────────── */

async function saveLead(leadData: Record<string, string | null> | null) {
  if (!leadData) return;
  const hasData = leadData.name || leadData.email || leadData.specialty;
  if (!hasData) return;
  try {
    const leads = await readJSON<ConciergeLead[]>("concierge-leads.json", []);
    const lead: ConciergeLead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: leadData.name ?? undefined,
      email: leadData.email ?? undefined,
      specialty: leadData.specialty ?? undefined,
      interest: leadData.interest ?? undefined,
      capturedAt: new Date().toISOString(),
      source: "chat",
    };
    await writeJSON("concierge-leads.json", [lead, ...leads]);
  } catch (_) {}
}

export async function POST(req: NextRequest) {
  const { messages } = (await req.json()) as {
    messages: { role: string; content: string }[];
  };

  const settings = await readJSON<ConciergeSettings>("concierge-settings.json", defaultConciergeSettings);
  const apiKey = process.env.OPENAI_API_KEY;
  const lastMsg = messages.findLast((m) => m.role === "user")?.content ?? "";

  if (!apiKey || !settings.enabled) {
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 700));
    const fb = fallbackWithLead(lastMsg);
    await saveLead(fb.leadData as Record<string, string | null> | null);
    return NextResponse.json(fb);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: settings.openaiModel || "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: settings.systemPrompt || SYSTEM }, ...messages],
        max_tokens: 420,
        temperature: 0.76,
        presence_penalty: 0.15,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(fallbackWithLead(lastMsg));
    }

    const data = await response.json();
    const raw: string = data.choices?.[0]?.message?.content ?? "{}";

    try {
      const parsed = JSON.parse(raw);
      await saveLead(parsed.leadData);
      return NextResponse.json({
        content: parsed.message ?? fallback(lastMsg),
        leadData: parsed.leadData ?? null,
        suggestWhatsApp: parsed.suggestWhatsApp ?? false,
        whatsAppReason: parsed.whatsAppReason ?? null,
      });
    } catch {
      return NextResponse.json({ content: raw, leadData: null, suggestWhatsApp: false });
    }
  } catch {
    return NextResponse.json(fallbackWithLead(lastMsg));
  }
}
