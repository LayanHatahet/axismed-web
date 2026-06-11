/**
 * generate-company-profile-docx.js
 * Generates AxisMed_Company_Profile.docx on the Desktop
 */

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, LevelFormat, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak,
  HeadingLevel, TabStopType, TabStopPosition,
} = require("docx");

const fs   = require("fs");
const path = require("path");

// ─── Assets ──────────────────────────────────────────────────────
const LOGO_PATH = "C:/Users/layan/Downloads/axismed-web/public/logo-symbol-purple.png";
const logoBuf   = fs.readFileSync(LOGO_PATH);
const OUT       = "C:/Users/layan/Desktop/AxisMed_Company_Profile.docx";

// ─── Brand palette (hex, no #) ───────────────────────────────────
const P = {
  purple:  "8570c7",
  deep:    "4a3aaa",
  light:   "a898db",
  navy:    "12082C",
  pale:    "efeef7",
  white:   "ffffff",
  grey:    "6a6080",
  border:  "d4cef0",
};

// ─── A4 page metrics (DXA) ───────────────────────────────────────
// A4: 11906 × 16838 DXA   margins: top/bottom 1134 (0.79"), left/right 1134
const PAGE_W    = 11906;
const PAGE_H    = 16838;
const MARGIN    = 1134;  // ~0.79 inch
const CONTENT_W = PAGE_W - MARGIN * 2;  // 9638 DXA

// ─── Helpers ─────────────────────────────────────────────────────

/** Thin purple rule using paragraph bottom border */
const rule = () => new Paragraph({
  spacing: { before: 0, after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: P.purple, space: 4 } },
  children: [],
});

/** Section label (small caps, purple, spaced) */
const sectionLabel = (text) => new Paragraph({
  spacing: { before: 0, after: 80 },
  children: [new TextRun({
    text,
    font: "Calibri",
    size: 16,        // 8pt
    color: P.purple,
    bold: true,
    characterSpacing: 120,
    allCaps: true,
  })],
});

/** Main section heading */
const heading = (text, size, color) => new Paragraph({
  spacing: { before: 80, after: 200 },
  children: [new TextRun({
    text,
    font: "Calibri",
    size: size || 48,   // 24pt default
    bold: true,
    color: color || P.navy,
  })],
});

/** Body paragraph */
const body = (text, opts) => new Paragraph({
  spacing: { before: 0, after: 160 },
  children: [new TextRun({
    text,
    font: "Calibri",
    size: 22,   // 11pt
    color: opts && opts.color ? opts.color : "3a3550",
  })],
});

/** Shaded callout box (single-row, single-cell table) */
const callout = (labelText, bodyText, fill, borderColor) => new Table({
  width: { size: CONTENT_W, type: WidthType.DXA },
  columnWidths: [CONTENT_W],
  margins: { top: 0, bottom: 200 },
  rows: [new TableRow({
    children: [new TableCell({
      width: { size: CONTENT_W, type: WidthType.DXA },
      shading: { fill: fill || P.pale, type: ShadingType.CLEAR },
      margins: { top: 160, bottom: 160, left: 240, right: 240 },
      borders: {
        top:    { style: BorderStyle.SINGLE, size: 12, color: borderColor || P.purple },
        bottom: { style: BorderStyle.NONE, size: 0, color: "ffffff" },
        left:   { style: BorderStyle.NONE, size: 0, color: "ffffff" },
        right:  { style: BorderStyle.NONE, size: 0, color: "ffffff" },
      },
      children: [
        new Paragraph({
          spacing: { before: 0, after: 80 },
          children: [new TextRun({ text: labelText, font: "Calibri", size: 16, bold: true, color: P.purple, allCaps: true, characterSpacing: 80 })],
        }),
        new Paragraph({
          spacing: { before: 0, after: 0 },
          children: [new TextRun({ text: bodyText, font: "Calibri", size: 22, color: P.navy })],
        }),
      ],
    })],
  })],
});

/** Spacer paragraph */
const spacer = (pts) => new Paragraph({
  spacing: { before: 0, after: 0 },
  children: [new TextRun({ text: "", size: pts ? pts * 2 : 24 })],
});

/** Page break */
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

/** Bold stat line */
const stat = (number, label) => new Paragraph({
  spacing: { before: 80, after: 80 },
  children: [
    new TextRun({ text: number + "  ", font: "Calibri", size: 52, bold: true, color: P.purple }),
    new TextRun({ text: label, font: "Calibri", size: 22, color: "3a3550" }),
  ],
});

/** Step item */
const step = (num, title, desc) => new Paragraph({
  spacing: { before: 120, after: 80 },
  children: [
    new TextRun({ text: num + "  ", font: "Calibri", size: 26, bold: true, color: P.purple }),
    new TextRun({ text: title + " — ", font: "Calibri", size: 22, bold: true, color: P.navy }),
    new TextRun({ text: desc, font: "Calibri", size: 22, color: "3a3550" }),
  ],
});

/** Two-column key-value table */
const kvTable = (rows, col1W, col2W) => {
  const c1 = col1W || Math.floor(CONTENT_W * 0.35);
  const c2 = col2W || (CONTENT_W - c1);
  const brd = { style: BorderStyle.SINGLE, size: 4, color: P.border };
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [c1, c2],
    rows: rows.map(([k, v], i) => new TableRow({
      children: [
        new TableCell({
          width: { size: c1, type: WidthType.DXA },
          shading: { fill: i % 2 === 0 ? P.pale : P.white, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 160, right: 160 },
          borders: { top: brd, bottom: brd, left: brd, right: brd },
          children: [new Paragraph({ children: [new TextRun({ text: k, font: "Calibri", size: 22, bold: true, color: P.navy })] })],
        }),
        new TableCell({
          width: { size: c2, type: WidthType.DXA },
          shading: { fill: i % 2 === 0 ? P.pale : P.white, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 160, right: 160 },
          borders: { top: brd, bottom: brd, left: brd, right: brd },
          children: [new Paragraph({ children: [new TextRun({ text: v, font: "Calibri", size: 22, color: "3a3550" })] })],
        }),
      ],
    })),
  });
};

/** Three-column stat table */
const threeColTable = (rows) => {
  const cw = Math.floor(CONTENT_W / 3);
  const brd = { style: BorderStyle.SINGLE, size: 4, color: P.border };
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [cw, cw, CONTENT_W - cw * 2],
    rows: rows.map(([a, b, c]) => new TableRow({
      children: [a, b, c].map((cell, ci) => new TableCell({
        width: { size: ci < 2 ? cw : CONTENT_W - cw * 2, type: WidthType.DXA },
        shading: { fill: P.pale, type: ShadingType.CLEAR },
        margins: { top: 140, bottom: 140, left: 180, right: 180 },
        borders: { top: brd, bottom: brd, left: brd, right: brd },
        children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Calibri", size: 22, color: P.navy })] })],
      })),
    })),
  });
};

/** Services overview table */
const servicesTable = (rows) => {
  const c0 = 700, c1 = 2200, c2 = CONTENT_W - c0 - c1;
  const brd = { style: BorderStyle.SINGLE, size: 4, color: P.border };
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [c0, c1, c2],
    rows: rows.map(([num, title, desc], i) => new TableRow({
      children: [
        new TableCell({
          width: { size: c0, type: WidthType.DXA },
          shading: { fill: P.deep, type: ShadingType.CLEAR },
          margins: { top: 140, bottom: 140, left: 160, right: 160 },
          borders: { top: brd, bottom: brd, left: brd, right: brd },
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: num, font: "Calibri", size: 20, bold: true, color: P.white })] })],
        }),
        new TableCell({
          width: { size: c1, type: WidthType.DXA },
          shading: { fill: i % 2 === 0 ? P.pale : P.white, type: ShadingType.CLEAR },
          margins: { top: 140, bottom: 140, left: 160, right: 160 },
          borders: { top: brd, bottom: brd, left: brd, right: brd },
          children: [new Paragraph({ children: [new TextRun({ text: title, font: "Calibri", size: 22, bold: true, color: P.navy })] })],
        }),
        new TableCell({
          width: { size: c2, type: WidthType.DXA },
          shading: { fill: i % 2 === 0 ? P.pale : P.white, type: ShadingType.CLEAR },
          margins: { top: 140, bottom: 140, left: 160, right: 160 },
          borders: { top: brd, bottom: brd, left: brd, right: brd },
          children: [new Paragraph({ children: [new TextRun({ text: desc, font: "Calibri", size: 20, color: "3a3550" })] })],
        }),
      ],
    })),
  });
};

// ─── Header (every page) ─────────────────────────────────────────
const docHeader = new Header({
  children: [
    new Paragraph({
      spacing: { before: 0, after: 80 },
      children: [
        new ImageRun({
          type: "png",
          data: logoBuf,
          transformation: { width: 28, height: 24 },
          altText: { title: "AxisMed Symbol", description: "Logo", name: "Logo" },
        }),
        new TextRun({ text: "  AxisMed", font: "Calibri", size: 28, bold: true, color: P.purple }),
        new TextRun({
          text: "\t",
          children: [],
        }),
        new TextRun({ text: "", children: [PageNumber.CURRENT], font: "Calibri", size: 18, color: P.grey }),
      ],
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: P.border, space: 4 } },
    }),
  ],
});

// ─── Footer (every page) ─────────────────────────────────────────
const docFooter = new Footer({
  children: [
    new Paragraph({
      spacing: { before: 80, after: 0 },
      border: { top: { style: BorderStyle.SINGLE, size: 6, color: P.border, space: 4 } },
      children: [
        new TextRun({ text: "Dubai Healthcare City, Dubai, UAE  ·  +971 50 189 7038  ·  info@theaxismed.com  ·  www.theaxismed.com", font: "Calibri", size: 16, color: P.grey }),
      ],
      alignment: AlignmentType.CENTER,
    }),
  ],
});

// ─── Numbering (bullets) ─────────────────────────────────────────
const numbering = {
  config: [
    {
      reference: "bullets",
      levels: [{
        level: 0,
        format: LevelFormat.BULLET,
        text: "•",
        alignment: AlignmentType.LEFT,
        style: {
          paragraph: { indent: { left: 560, hanging: 280 }, spacing: { after: 80 } },
          run: { font: "Calibri", size: 22, color: "3a3550" },
        },
      }],
    },
    {
      reference: "numbered",
      levels: [{
        level: 0,
        format: LevelFormat.DECIMAL,
        text: "%1.",
        alignment: AlignmentType.LEFT,
        style: {
          paragraph: { indent: { left: 560, hanging: 280 }, spacing: { after: 80 } },
          run: { font: "Calibri", size: 22, bold: true, color: P.purple },
        },
      }],
    },
  ],
};

const bullet = (text) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  children: [new TextRun({ text, font: "Calibri", size: 22, color: "3a3550" })],
});

// ─── Build document children ──────────────────────────────────────
const children = [

  // ── PAGE 1: COVER ───────────────────────────────────────────────
  spacer(60),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 200 },
    children: [new ImageRun({
      type: "png", data: logoBuf,
      transformation: { width: 80, height: 70 },
      altText: { title: "AxisMed", description: "Logo", name: "Logo" },
    })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 160 },
    children: [new TextRun({ text: "AxisMed", font: "Calibri", size: 120, bold: true, color: P.purple })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 120 },
    children: [new TextRun({ text: "Education · Innovation · Global Healthcare", font: "Calibri", size: 28, color: P.deep, characterSpacing: 60 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 120 },
    children: [new TextRun({ text: "Company Profile  2025", font: "Calibri", size: 24, color: P.grey, characterSpacing: 40 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 0 },
    children: [new TextRun({ text: "www.theaxismed.com", font: "Calibri", size: 20, color: P.purple })],
  }),

  pageBreak(),

  // ── PAGE 2: MANIFESTO ───────────────────────────────────────────
  spacer(20),
  sectionLabel("Our Manifesto"),
  rule(),
  spacer(12),
  new Paragraph({
    spacing: { before: 200, after: 240 },
    children: [new TextRun({
      text: "“Healthcare is not a product. It is a promise — to every patient, every clinician, every community that dares to imagine better.”",
      font: "Calibri",
      size: 40,
      bold: true,
      color: P.navy,
      italics: true,
    })],
  }),
  body("At AxisMed, we exist at the intersection of knowledge and impact. We build the systems, the programs, and the partnerships that turn that promise into practice — across borders, disciplines, and generations."),

  pageBreak(),

  // ── PAGE 3: WHO WE ARE ──────────────────────────────────────────
  spacer(10),
  sectionLabel("01 / About"),
  heading("Who We Are"),
  rule(),
  spacer(8),
  body("AxisMed is a premier medical education and healthcare innovation company headquartered in Dubai Healthcare City. We bridge the gap between clinical excellence and global healthcare advancement — delivering world-class educational programs, professional development solutions, and strategic partnerships for healthcare professionals and institutions worldwide."),
  spacer(12),
  callout("Mission", "To elevate healthcare standards globally through cutting-edge medical education, innovative training solutions, and meaningful collaboration with leading institutions.", P.pale, P.purple),
  spacer(8),
  callout("Vision", "To be the most trusted partner for healthcare professionals and institutions seeking excellence in medical education and global healthcare innovation.", "e8e4f5", P.deep),
  spacer(12),
  new Paragraph({
    spacing: { before: 0, after: 0 },
    children: [
      new TextRun({ text: "Our Values:  ", font: "Calibri", size: 20, bold: true, color: P.purple }),
      new TextRun({ text: "Innovation  ·  Integrity  ·  Excellence  ·  Collaboration  ·  Impact", font: "Calibri", size: 20, color: P.navy }),
    ],
  }),

  pageBreak(),

  // ── PAGE 4: ECOSYSTEM ───────────────────────────────────────────
  spacer(10),
  sectionLabel("The AxisMed Ecosystem"),
  heading("Four Pillars of Excellence"),
  rule(),
  spacer(12),
  kvTable([
    ["01  Education",    "Accredited programs and clinical training across 12+ specialties"],
    ["02  Global Reach", "Partnerships across 15+ countries worldwide"],
    ["03  Innovation",   "Digital platforms, simulation-based and blended learning"],
    ["04  Partnership",  "Institutional collaborations across healthcare and academia"],
  ], 2800, CONTENT_W - 2800),
  spacer(20),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 0 },
    children: [new TextRun({ text: "Connecting Excellence Across Every Axis", font: "Calibri", size: 24, bold: true, color: P.purple, characterSpacing: 40 })],
  }),

  pageBreak(),

  // ── PAGE 5: SERVICES OVERVIEW ───────────────────────────────────
  spacer(10),
  sectionLabel("02 / Services"),
  heading("What We Deliver"),
  rule(),
  body("Every service we offer is designed with one purpose: to raise the standard of healthcare knowledge and practice. From accredited education programs to digital-first learning platforms, AxisMed is the engine of progress for the healthcare professionals of tomorrow."),
  spacer(12),
  servicesTable([
    ["01", "Medical Education",     "Accredited CME programs, clinical workshops, simulation training"],
    ["02", "Healthcare Consulting", "Strategic advisory for hospitals and healthcare organizations"],
    ["03", "Global Partnerships",   "Academic alliances across the Middle East, Europe and beyond"],
    ["04", "Digital Learning",      "E-learning platforms, virtual simulations, digital curricula"],
  ]),

  pageBreak(),

  // ── PAGE 6: MEDICAL EDUCATION ───────────────────────────────────
  spacer(10),
  sectionLabel("Service 01"),
  heading("Medical Education Programs"),
  rule(),
  body("Our flagship offering: internationally accredited continuing medical education designed to meet the evolving demands of modern clinical practice. Each program is crafted by expert faculty and validated against the highest global standards in healthcare education."),
  spacer(8),
  bullet("Accredited CME programs across 12+ specialties"),
  bullet("Simulation-based clinical training centers"),
  bullet("Specialty-focused courses for all career stages"),
  bullet("Blended learning combining live and digital formats"),
  bullet("Internationally recognized certifications"),

  pageBreak(),

  // ── PAGE 7: CONSULTING ──────────────────────────────────────────
  spacer(10),
  sectionLabel("Service 02"),
  heading("Healthcare Consulting"),
  rule(),
  body("From JCI accreditation preparation to full operational transformation, our consulting practice works alongside healthcare leadership teams to build institutions of lasting quality. We bring global benchmarks to every engagement and leave behind the systems to sustain them."),
  spacer(12),
  kvTable([
    ["Accreditation Readiness",   "JCI, JCIA, and international standards preparation"],
    ["Operational Optimization",  "Workflows, capacity planning, and performance metrics"],
    ["Quality Transformation",    "Patient safety, clinical governance, culture change"],
  ], 3000, CONTENT_W - 3000),

  pageBreak(),

  // ── PAGE 8: GLOBAL PARTNERSHIPS ─────────────────────────────────
  spacer(10),
  sectionLabel("Service 03"),
  heading("Global Partnerships"),
  rule(),
  body("Knowledge has no borders. AxisMed actively builds institutional bridges between hospitals, universities, and research centers across the Middle East, Europe, Asia, and beyond — creating ecosystems where shared learning accelerates collective excellence."),
  spacer(12),
  threeColTable([
    ["Middle East", "12+  Partner institutions",   "Academic and hospital alliances"],
    ["Europe",      "5+  Academic alliances",       "Joint programs and research"],
    ["Global",      "15+  Countries reached",       "Healthcare professionals trained"],
  ]),

  pageBreak(),

  // ── PAGE 9: DIGITAL LEARNING ────────────────────────────────────
  spacer(10),
  sectionLabel("Service 04"),
  heading("Digital Learning Solutions"),
  rule(),
  body("The future of medical education is flexible, scalable, and deeply engaging. Our digital learning infrastructure gives healthcare organizations the power to train at scale without sacrificing quality or clinical relevance."),
  spacer(12),
  kvTable([
    ["LMS Platform",         "Custom-branded learning management systems"],
    ["Virtual Simulation",   "Clinical scenario simulations with real-time feedback"],
    ["Mobile Learning",      "On-demand access across all devices"],
    ["Analytics Dashboard",  "Track progress, outcomes, and competency"],
  ], 2800, CONTENT_W - 2800),

  pageBreak(),

  // ── PAGE 10: IMPACT IN NUMBERS ──────────────────────────────────
  spacer(10),
  sectionLabel("03 / Why AxisMed"),
  heading("Impact in Numbers"),
  rule(),
  spacer(12),
  stat("500+", "Healthcare Professionals Trained"),
  stat("20+",  "Partner Institutions Worldwide"),
  stat("15+",  "Countries Reached"),
  stat("98%",  "Participant Satisfaction Rate"),
  spacer(16),
  rule(),
  spacer(8),
  step("1.", "Dubai Healthcare City", "Operating from the region’s premier medical hub"),
  step("2.", "Accredited & Recognized", "Meeting international professional body requirements"),
  step("3.", "Expert Faculty", "Led by leading clinicians and educators"),

  pageBreak(),

  // ── PAGE 11: DUBAI HEALTHCARE CITY ──────────────────────────────
  spacer(10),
  sectionLabel("Our Home"),
  heading("Dubai Healthcare City"),
  rule(),
  body("AxisMed operates from the heart of Dubai Healthcare City — the world’s largest dedicated healthcare free zone and the MENA region’s premier hub for medical excellence, research, and innovation."),
  spacer(12),
  kvTable([
    ["Established",       "2002"],
    ["Zone Area",         "4.1M sq ft"],
    ["Licensed entities", "400+"],
    ["Nationalities",     "170+"],
  ], 3200, CONTENT_W - 3200),

  pageBreak(),

  // ── PAGE 12: LEADERSHIP ─────────────────────────────────────────
  spacer(10),
  sectionLabel("04 / Leadership"),
  heading("Our Leadership"),
  rule(),
  spacer(8),

  // CEO
  callout("Chief Executive Officer & Founder", "MBA · Healthcare Strategy · MENA Regional Expert\n\nA strategic visionary with 15+ years leading healthcare and medical education initiatives across the MENA region. A proven builder of institutions that bridge clinical knowledge with systemic transformation.", P.pale, P.purple),
  spacer(6),

  // Medical Director
  callout("Medical Director", "MD, FRCS · Clinical Excellence · Academic Leadership\n\nBoard-certified physician and internationally recognized educator with extensive clinical, academic, and research experience spanning three continents and multiple healthcare systems.", "ede9f5", P.deep),
  spacer(6),

  // Head of Partnerships
  callout("Head of Global Partnerships", "MSc · International Relations · Global Business Development\n\nInternational relations expert with deep expertise in building sustainable cross-border academic and institutional collaborations in healthcare, education, and innovation ecosystems.", P.pale, P.purple),

  pageBreak(),

  // ── PAGE 13: ACCREDITATIONS ─────────────────────────────────────
  spacer(10),
  sectionLabel("Standards & Quality"),
  heading("Accredited. Recognized. Trusted."),
  rule(),
  body("Every program we offer meets or exceeds the standards set by leading international professional bodies. Our commitment to quality is not a marketing message — it is a structural principle embedded in every course we design and every partnership we form."),
  spacer(12),
  kvTable([
    ["CME Accredited",          "Continuing Medical Education programs meeting CPD requirements"],
    ["International Standards", "Aligned with JCI, WHO, and regional healthcare frameworks"],
    ["Regulatory Compliant",    "Fully licensed and compliant with UAE MoH and DHCC regulations"],
    ["Expert Reviewed",         "All curricula reviewed by practicing clinicians and specialists"],
    ["Outcome Focused",         "Programs measured against clear clinical competency outcomes"],
    ["Globally Recognized",     "Certifications respected by healthcare employers worldwide"],
  ], 2800, CONTENT_W - 2800),

  pageBreak(),

  // ── PAGE 14: HOW WE WORK ────────────────────────────────────────
  spacer(10),
  sectionLabel("Our Approach"),
  heading("How We Work"),
  rule(),
  spacer(8),
  step("01", "Discovery",   "We begin every engagement with deep listening — understanding your goals, your context, and the specific challenges your institution or team faces."),
  step("02", "Design",      "Our expert faculty and curriculum designers build a bespoke program or solution mapped precisely to your objectives and your learners."),
  step("03", "Delivery",    "Programs are delivered through our network of expert facilitators, either on-site, at our Dubai facilities, or through our digital platform."),
  step("04", "Evaluation",  "Post-program assessments, competency tracking, and feedback loops ensure every investment in learning delivers measurable impact."),
  step("05", "Partnership", "The best relationships don’t end at graduation. We work with our partners on a continuous basis to grow, iterate, and evolve together."),

  pageBreak(),

  // ── PAGE 15: VISION 2030 ────────────────────────────────────────
  spacer(20),
  sectionLabel("Our Vision for 2030"),
  rule(),
  spacer(12),
  new Paragraph({
    spacing: { before: 0, after: 360 },
    children: [new TextRun({
      text: "By 2030, AxisMed will be the defining institution of medical education and healthcare innovation across the Middle East — and a respected global voice for what excellent healthcare education can be.",
      font: "Calibri",
      size: 44,
      bold: true,
      color: P.navy,
    })],
  }),
  rule(),
  spacer(16),
  stat("1,000+", "Healthcare Professionals Trained Annually"),
  stat("30+",    "Partner Countries"),
  stat("#1",     "Medical Education Institution in MENA"),

  pageBreak(),

  // ── PAGE 16: CONTACT ────────────────────────────────────────────
  spacer(20),
  heading("Let’s Shape the Future of Healthcare Together.", 52, P.purple),
  rule(),
  body("Whether you’re a healthcare institution, a professional seeking to grow, or an organization looking for a strategic partner — we want to hear from you."),
  spacer(16),
  kvTable([
    ["Address", "Dubai Healthcare City, Dubai, UAE"],
    ["Phone",   "+971 50 189 7038"],
    ["Email",   "info@theaxismed.com"],
    ["Website", "www.theaxismed.com"],
  ], 2000, CONTENT_W - 2000),
  spacer(20),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 0 },
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: P.border, space: 8 } },
    children: [new TextRun({ text: "Education  ·  Innovation  ·  Global Healthcare", font: "Calibri", size: 20, color: P.purple, characterSpacing: 80 })],
  }),
];

// ─── Assemble document ────────────────────────────────────────────
const doc = new Document({
  numbering,
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 22, color: "3a3550" } },
    },
  },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE_W, height: PAGE_H },
        margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
      },
    },
    headers: { default: docHeader },
    footers: { default: docFooter },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT, buf);
  console.log(`Saved: ${OUT}  (${Math.round(buf.length / 1024)} KB)`);
}).catch(console.error);
