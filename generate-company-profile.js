/**
 * generate-company-profile.js
 * World-class 16-page company profile for AxisMed
 * Output: C:\Users\layan\Desktop\AxisMed_Company_Profile.pdf
 */

const puppeteer = require("puppeteer");
const path      = require("path");
const fs        = require("fs");

const SYMBOL_PATH = path.resolve("C:/Users/layan/Downloads/axismed-web/public/logo-symbol-purple.png");
// file:// URL — same image referenced many times, but Chrome deduplicates in PDF
const symbolSrc   = `file:///${SYMBOL_PATH.replace(/\\/g,"/")}`;
const symbolB64   = null;
const OUT_PATH    = "C:/Users/layan/Desktop/AxisMed_Company_Profile.pdf";

// ─── Brand ───────────────────────────────────────────────────────
const C = {
  ink:    "#0a0914",
  dark:   "#12082C",
  deep:   "#4a3aaa",
  mid:    "#8570c7",
  light:  "#a898db",
  pale:   "#efeef7",
  paper:  "#fafaf8",
  white:  "#ffffff",
};

// ─── Helpers ─────────────────────────────────────────────────────
// noise() removed — SVG fractalNoise creates huge PDFs when rasterized by Chrome
const noise = () => ``;

const glow = (x, y, r, color, opacity = 0.18) =>
  `<div style="position:absolute;left:${x}px;top:${y}px;width:${r * 2}px;height:${r * 2}px;
    background:radial-gradient(circle,${color} 0%,transparent 70%);
    opacity:${opacity};pointer-events:none;transform:translate(-50%,-50%);border-radius:50%;"></div>`;

const logo = (color, size) => {
  const c = color || C.white;
  const s = size || 32;
  return `<div style="display:inline-flex;align-items:flex-end;gap:10px;line-height:1;">
    <img src="${symbolSrc}" style="height:${s}px;width:auto;opacity:0.92;">
    <span style="font-family:'Sora',sans-serif;font-weight:800;font-size:${s * 1.05}px;
      letter-spacing:-0.04em;color:${c};line-height:1;padding-bottom:1px;">AxisMed</span>
  </div>`;
};

const topBar = (h) => {
  const height = h || 4;
  return `<div style="position:absolute;top:0;left:0;right:0;height:${height}px;
    background:linear-gradient(90deg,${C.deep},${C.mid},${C.light});"></div>`;
};

const bottomBar = (h) => {
  const height = h || 4;
  return `<div style="position:absolute;bottom:0;left:0;right:0;height:${height}px;
    background:linear-gradient(90deg,${C.deep},${C.mid},${C.light});"></div>`;
};

const pg = (bg, content) =>
  `<div class="page" style="background:${bg};position:relative;overflow:hidden;">
    ${noise()}
    ${content}
  </div>`;

const pageNum = (n, color) => {
  const c = color || C.mid;
  return `<div style="position:absolute;bottom:36px;right:52px;font-family:'Sora',sans-serif;
    font-size:9px;letter-spacing:0.18em;color:${c};opacity:0.45;text-transform:uppercase;">
    ${String(n).padStart(2,"0")} / 16
  </div>`;
};

const watermarkLogo = (opacity) => {
  const op = opacity || 0.03;
  return `<img src="${symbolSrc}" style="position:absolute;bottom:60px;right:48px;
    height:140px;width:auto;opacity:${op};">`;
};

// ─── PAGE 01 — COVER ─────────────────────────────────────────────
const p01 = pg(C.ink, `
  ${glow(100, 200, 400, C.deep, 0.55)}
  ${glow(700, 900, 350, C.mid, 0.25)}
  ${glow(400, 560, 300, C.deep, 0.3)}

  <div style="position:absolute;top:0;left:0;right:0;height:3px;
    background:linear-gradient(90deg,${C.deep},${C.mid},${C.light});"></div>

  <div style="position:absolute;inset:0;opacity:0.04;
    background-image:linear-gradient(${C.mid} 1px,transparent 1px),linear-gradient(90deg,${C.mid} 1px,transparent 1px);
    background-size:40px 40px;"></div>

  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;width:600px;">
    <div style="margin-bottom:32px;">
      <img src="${symbolSrc}" style="height:96px;width:auto;filter:brightness(1.15);opacity:0.95;">
    </div>
    <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:72px;
      letter-spacing:-3px;color:${C.white};line-height:0.9;margin-bottom:20px;">
      AxisMed
    </div>
    <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,${C.light},transparent);
      margin:0 auto 20px;"></div>
    <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:11px;
      letter-spacing:0.35em;text-transform:uppercase;color:${C.light};margin-bottom:8px;">
      Education &nbsp;&middot;&nbsp; Innovation &nbsp;&middot;&nbsp; Global Healthcare
    </div>
    <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:9.5px;
      letter-spacing:0.25em;text-transform:uppercase;color:rgba(168,152,219,0.45);">
      Company Profile &nbsp;&nbsp;2025
    </div>
  </div>

  <div style="position:absolute;bottom:52px;left:0;right:0;text-align:center;">
    <div style="font-family:'Sora',sans-serif;font-size:9px;letter-spacing:0.2em;
      text-transform:uppercase;color:rgba(168,152,219,0.35);">www.theaxismed.com</div>
  </div>

  <div style="position:absolute;top:28px;left:28px;width:20px;height:20px;
    border-top:1px solid rgba(168,152,219,0.25);border-left:1px solid rgba(168,152,219,0.25);"></div>
  <div style="position:absolute;top:28px;right:28px;width:20px;height:20px;
    border-top:1px solid rgba(168,152,219,0.25);border-right:1px solid rgba(168,152,219,0.25);"></div>
  <div style="position:absolute;bottom:28px;left:28px;width:20px;height:20px;
    border-bottom:1px solid rgba(168,152,219,0.25);border-left:1px solid rgba(168,152,219,0.25);"></div>
  <div style="position:absolute;bottom:28px;right:28px;width:20px;height:20px;
    border-bottom:1px solid rgba(168,152,219,0.25);border-right:1px solid rgba(168,152,219,0.25);"></div>

  ${bottomBar(3)}
`);

// ─── PAGE 02 — MANIFESTO ─────────────────────────────────────────
const p02 = pg(C.ink, `
  ${glow(650, 300, 500, C.deep, 0.35)}
  ${topBar(3)}
  <div style="position:absolute;top:0;left:52px;bottom:0;width:1px;
    background:linear-gradient(180deg,transparent,${C.mid},transparent);opacity:0.12;"></div>
  <div style="position:absolute;top:120px;left:80px;right:80px;">
    <div style="font-family:'Sora',sans-serif;font-size:8.5px;letter-spacing:0.3em;
      text-transform:uppercase;color:${C.mid};opacity:0.6;margin-bottom:48px;">
      Our Manifesto
    </div>
    <div style="font-family:Georgia,serif;font-size:180px;line-height:0.6;
      color:${C.deep};opacity:0.2;margin-bottom:0;position:relative;top:20px;">
      &ldquo;
    </div>
    <div style="font-family:'Sora',sans-serif;font-weight:600;font-size:26px;
      line-height:1.45;color:${C.white};letter-spacing:-0.3px;margin-bottom:52px;
      position:relative;z-index:1;">
      Healthcare is not a product.<br>
      It is a promise &mdash; to every patient,<br>
      every clinician, every community<br>
      that dares to imagine better.
    </div>
    <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:13.5px;
      line-height:1.8;color:rgba(255,255,255,0.5);max-width:520px;">
      At AxisMed, we exist at the intersection of knowledge and impact.
      We build the systems, the programs, and the partnerships that turn
      that promise into practice &mdash; across borders, disciplines, and generations.
    </div>
  </div>
  ${pageNum(2, C.light)}
  ${bottomBar(3)}
`);

// ─── PAGE 03 — WHO WE ARE ─────────────────────────────────────────
const p03 = pg(C.paper, `
  ${topBar(4)}
  ${watermarkLogo(0.035)}
  <div style="padding:72px 64px 60px;">
    <div style="font-family:'Sora',sans-serif;font-size:8px;letter-spacing:0.3em;
      text-transform:uppercase;color:${C.mid};margin-bottom:16px;">
      01 &nbsp;/&nbsp; About
    </div>
    <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:44px;
      letter-spacing:-1.5px;color:${C.dark};line-height:1;margin-bottom:32px;">
      Who We Are
    </div>
    <div style="height:3px;width:60px;background:linear-gradient(90deg,${C.deep},${C.light});
      border-radius:2px;margin-bottom:36px;"></div>
    <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:14.5px;
      line-height:1.85;color:#3a3550;max-width:560px;margin-bottom:44px;">
      AxisMed is a premier medical education and healthcare innovation company
      headquartered in Dubai Healthcare City. We bridge the gap between clinical
      excellence and global healthcare advancement &mdash; delivering world-class
      educational programs, professional development solutions, and strategic
      partnerships for healthcare professionals and institutions worldwide.
    </div>
    <div style="display:flex;gap:40px;">
      <div style="flex:1;background:${C.white};border-radius:12px;padding:32px;
        border:1px solid rgba(133,112,199,0.12);border-top:3px solid ${C.mid};">
        <div style="font-family:'Sora',sans-serif;font-size:8px;letter-spacing:0.25em;
          text-transform:uppercase;color:${C.mid};margin-bottom:16px;">Mission</div>
        <div style="font-family:'Sora',sans-serif;font-weight:500;font-size:13px;
          line-height:1.75;color:${C.dark};">
          To elevate healthcare standards globally through cutting-edge medical education,
          innovative training solutions, and meaningful collaboration with leading institutions.
        </div>
      </div>
      <div style="flex:1;background:${C.dark};border-radius:12px;padding:32px;
        border-top:3px solid ${C.light};">
        <div style="font-family:'Sora',sans-serif;font-size:8px;letter-spacing:0.25em;
          text-transform:uppercase;color:${C.light};margin-bottom:16px;">Vision</div>
        <div style="font-family:'Sora',sans-serif;font-weight:500;font-size:13px;
          line-height:1.75;color:rgba(255,255,255,0.8);">
          To be the most trusted partner for healthcare professionals and institutions
          seeking excellence in medical education and global healthcare innovation.
        </div>
      </div>
    </div>
    <div style="margin-top:36px;display:flex;gap:12px;flex-wrap:wrap;">
      <div style="padding:8px 20px;border-radius:100px;border:1px solid rgba(133,112,199,0.3);
        font-family:'Sora',sans-serif;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:${C.mid};">Innovation</div>
      <div style="padding:8px 20px;border-radius:100px;border:1px solid rgba(133,112,199,0.3);
        font-family:'Sora',sans-serif;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:${C.mid};">Integrity</div>
      <div style="padding:8px 20px;border-radius:100px;border:1px solid rgba(133,112,199,0.3);
        font-family:'Sora',sans-serif;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:${C.mid};">Excellence</div>
      <div style="padding:8px 20px;border-radius:100px;border:1px solid rgba(133,112,199,0.3);
        font-family:'Sora',sans-serif;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:${C.mid};">Collaboration</div>
      <div style="padding:8px 20px;border-radius:100px;border:1px solid rgba(133,112,199,0.3);
        font-family:'Sora',sans-serif;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:${C.mid};">Impact</div>
    </div>
  </div>
  ${pageNum(3)}
  ${bottomBar(4)}
`);

// ─── PAGE 04 — ECOSYSTEM ─────────────────────────────────────────
const p04 = pg(`linear-gradient(135deg,${C.dark} 0%,#1a0f3a 100%)`, `
  ${glow(397, 561, 380, C.deep, 0.45)}
  ${topBar(4)}
  <div style="position:absolute;top:70px;left:64px;right:64px;text-align:center;">
    <div style="font-family:'Sora',sans-serif;font-size:8px;letter-spacing:0.3em;
      text-transform:uppercase;color:${C.light};opacity:0.5;margin-bottom:12px;">
      The AxisMed Ecosystem
    </div>
    <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:30px;
      letter-spacing:-0.5px;color:${C.white};margin-bottom:48px;">
      Four Pillars of Excellence
    </div>
    <div style="position:relative;width:340px;height:340px;margin:0 auto 40px;">
      <div style="position:absolute;inset:0;border-radius:50%;border:1px solid rgba(133,112,199,0.2);"></div>
      <div style="position:absolute;inset:40px;border-radius:50%;border:1px solid rgba(133,112,199,0.1);"></div>
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
        width:120px;height:120px;border-radius:50%;
        background:radial-gradient(circle,${C.deep},${C.ink});
        border:2px solid rgba(133,112,199,0.3);
        display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <img src="${symbolSrc}" style="height:36px;width:auto;opacity:0.9;margin-bottom:4px;">
        <div style="font-family:'Sora',sans-serif;font-size:9px;font-weight:700;color:${C.light};letter-spacing:0.05em;">AxisMed</div>
      </div>
      <div style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);text-align:center;width:130px;">
        <div style="width:44px;height:44px;border-radius:50%;background:${C.deep};border:1px solid ${C.mid};margin:0 auto 8px;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:18px;">&#127891;</span>
        </div>
        <div style="font-family:'Sora',sans-serif;font-size:9px;font-weight:600;color:${C.white};letter-spacing:0.05em;">Education</div>
      </div>
      <div style="position:absolute;right:-8px;top:50%;transform:translateY(-50%);text-align:center;width:100px;">
        <div style="width:44px;height:44px;border-radius:50%;background:${C.deep};border:1px solid ${C.mid};margin:0 auto 8px;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:18px;">&#127760;</span>
        </div>
        <div style="font-family:'Sora',sans-serif;font-size:9px;font-weight:600;color:${C.white};letter-spacing:0.05em;">Global Reach</div>
      </div>
      <div style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);text-align:center;width:130px;">
        <div style="width:44px;height:44px;border-radius:50%;background:${C.deep};border:1px solid ${C.mid};margin:0 auto 8px;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:18px;">&#128161;</span>
        </div>
        <div style="font-family:'Sora',sans-serif;font-size:9px;font-weight:600;color:${C.white};letter-spacing:0.05em;">Innovation</div>
      </div>
      <div style="position:absolute;left:-8px;top:50%;transform:translateY(-50%);text-align:center;width:100px;">
        <div style="width:44px;height:44px;border-radius:50%;background:${C.deep};border:1px solid ${C.mid};margin:0 auto 8px;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:18px;">&#129309;</span>
        </div>
        <div style="font-family:'Sora',sans-serif;font-size:9px;font-weight:600;color:${C.white};letter-spacing:0.05em;">Partnership</div>
      </div>
    </div>
    <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:11px;
      color:rgba(168,152,219,0.5);letter-spacing:0.12em;text-transform:uppercase;">
      Connecting Excellence Across Every Axis
    </div>
  </div>
  ${pageNum(4, C.light)}
  ${bottomBar(4)}
`);

// ─── PAGE 05 — SERVICES STATEMENT ────────────────────────────────
const p05 = pg(C.paper, `
  ${topBar(4)}
  ${watermarkLogo()}
  <div style="padding:72px 64px 0;">
    <div style="font-family:'Sora',sans-serif;font-size:8px;letter-spacing:0.3em;
      text-transform:uppercase;color:${C.mid};margin-bottom:16px;">
      02 &nbsp;/&nbsp; Services
    </div>
    <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:52px;
      letter-spacing:-2px;color:${C.dark};line-height:0.95;margin-bottom:36px;">
      What We<br>
      <span style="color:${C.mid};">Deliver</span>
    </div>
    <div style="height:3px;width:60px;background:linear-gradient(90deg,${C.deep},${C.light});
      border-radius:2px;margin-bottom:36px;"></div>
    <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:14.5px;
      line-height:1.85;color:#3a3550;max-width:480px;">
      Every service we offer is designed with one purpose: to raise the standard
      of healthcare knowledge and practice. From accredited education programs
      to digital-first learning platforms, AxisMed is the engine of progress
      for the healthcare professionals of tomorrow.
    </div>
  </div>
  <div style="position:absolute;bottom:0;left:0;right:0;height:340px;
    background:${C.dark};padding:44px 64px;">
    <div style="display:flex;gap:28px;height:100%;">
      <div style="flex:1;border-top:2px solid rgba(133,112,199,0.3);padding-top:20px;">
        <div style="font-family:'Sora',sans-serif;font-size:9px;color:${C.mid};letter-spacing:0.2em;margin-bottom:12px;">01</div>
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:13px;color:${C.white};margin-bottom:10px;">Medical Education</div>
        <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:11px;line-height:1.6;color:rgba(255,255,255,0.4);">Accredited CME programs, clinical workshops, simulation training</div>
      </div>
      <div style="flex:1;border-top:2px solid rgba(133,112,199,0.3);padding-top:20px;">
        <div style="font-family:'Sora',sans-serif;font-size:9px;color:${C.mid};letter-spacing:0.2em;margin-bottom:12px;">02</div>
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:13px;color:${C.white};margin-bottom:10px;">Healthcare Consulting</div>
        <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:11px;line-height:1.6;color:rgba(255,255,255,0.4);">Strategic advisory for hospitals and healthcare organizations</div>
      </div>
      <div style="flex:1;border-top:2px solid rgba(133,112,199,0.3);padding-top:20px;">
        <div style="font-family:'Sora',sans-serif;font-size:9px;color:${C.mid};letter-spacing:0.2em;margin-bottom:12px;">03</div>
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:13px;color:${C.white};margin-bottom:10px;">Global Partnerships</div>
        <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:11px;line-height:1.6;color:rgba(255,255,255,0.4);">Academic alliances across the Middle East, Europe and beyond</div>
      </div>
      <div style="flex:1;border-top:2px solid rgba(133,112,199,0.3);padding-top:20px;">
        <div style="font-family:'Sora',sans-serif;font-size:9px;color:${C.mid};letter-spacing:0.2em;margin-bottom:12px;">04</div>
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:13px;color:${C.white};margin-bottom:10px;">Digital Learning</div>
        <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:11px;line-height:1.6;color:rgba(255,255,255,0.4);">E-learning platforms, virtual simulations, digital curricula</div>
      </div>
    </div>
  </div>
  ${pageNum(5)}
  ${bottomBar(4)}
`);

// ─── PAGE 06 — MEDICAL EDUCATION DETAIL ──────────────────────────
const p06 = pg(`linear-gradient(135deg,#0f0a28 0%,${C.dark} 100%)`, `
  ${glow(100, 400, 400, C.deep, 0.4)}
  ${topBar(4)}
  <div style="padding:72px 64px 60px;position:relative;z-index:1;">
    <div style="font-family:'Sora',sans-serif;font-size:100px;font-weight:800;
      color:${C.deep};opacity:0.2;line-height:1;position:absolute;top:40px;right:52px;">01</div>
    <div style="font-family:'Sora',sans-serif;font-size:8px;letter-spacing:0.3em;
      text-transform:uppercase;color:${C.mid};opacity:0.6;margin-bottom:16px;">Service 01</div>
    <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:38px;
      letter-spacing:-1px;color:${C.white};line-height:1.1;margin-bottom:32px;">
      Medical Education<br>Programs
    </div>
    <div style="height:2px;width:48px;background:linear-gradient(90deg,${C.mid},${C.light});margin-bottom:32px;border-radius:2px;"></div>
    <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:13.5px;
      line-height:1.85;color:rgba(255,255,255,0.6);max-width:520px;margin-bottom:40px;">
      Our flagship offering: internationally accredited continuing medical education
      designed to meet the evolving demands of modern clinical practice. Each
      program is crafted by expert faculty and validated against the highest
      global standards in healthcare education.
    </div>
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div style="display:flex;align-items:flex-start;gap:16px;">
        <div style="width:6px;height:6px;border-radius:50%;background:${C.mid};margin-top:5px;flex-shrink:0;"></div>
        <div style="font-family:'Sora',sans-serif;font-size:12.5px;color:rgba(255,255,255,0.7);line-height:1.5;">Accredited CME programs across 12+ specialties</div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:16px;">
        <div style="width:6px;height:6px;border-radius:50%;background:${C.mid};margin-top:5px;flex-shrink:0;"></div>
        <div style="font-family:'Sora',sans-serif;font-size:12.5px;color:rgba(255,255,255,0.7);line-height:1.5;">Simulation-based clinical training centers</div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:16px;">
        <div style="width:6px;height:6px;border-radius:50%;background:${C.mid};margin-top:5px;flex-shrink:0;"></div>
        <div style="font-family:'Sora',sans-serif;font-size:12.5px;color:rgba(255,255,255,0.7);line-height:1.5;">Specialty-focused courses for all career stages</div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:16px;">
        <div style="width:6px;height:6px;border-radius:50%;background:${C.mid};margin-top:5px;flex-shrink:0;"></div>
        <div style="font-family:'Sora',sans-serif;font-size:12.5px;color:rgba(255,255,255,0.7);line-height:1.5;">Blended learning combining live and digital formats</div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:16px;">
        <div style="width:6px;height:6px;border-radius:50%;background:${C.mid};margin-top:5px;flex-shrink:0;"></div>
        <div style="font-family:'Sora',sans-serif;font-size:12.5px;color:rgba(255,255,255,0.7);line-height:1.5;">Internationally recognized certifications</div>
      </div>
    </div>
  </div>
  ${pageNum(6, C.light)}
  ${bottomBar(4)}
`);

// ─── PAGE 07 — CONSULTING ─────────────────────────────────────────
const p07 = pg(C.white, `
  ${topBar(4)}
  ${watermarkLogo(0.03)}
  <div style="position:absolute;top:-10px;right:48px;font-family:'Sora',sans-serif;
    font-size:180px;font-weight:800;color:${C.pale};line-height:1;z-index:0;">02</div>
  <div style="padding:72px 64px 60px;position:relative;z-index:1;">
    <div style="font-family:'Sora',sans-serif;font-size:8px;letter-spacing:0.3em;
      text-transform:uppercase;color:${C.mid};margin-bottom:16px;">Service 02</div>
    <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:38px;
      letter-spacing:-1px;color:${C.dark};line-height:1.1;margin-bottom:32px;">
      Healthcare<br>Consulting
    </div>
    <div style="height:2px;width:48px;background:linear-gradient(90deg,${C.deep},${C.light});margin-bottom:32px;border-radius:2px;"></div>
    <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:13.5px;
      line-height:1.85;color:#3a3550;max-width:520px;margin-bottom:44px;">
      From JCI accreditation preparation to full operational transformation,
      our consulting practice works alongside healthcare leadership teams to
      build institutions of lasting quality. We bring global benchmarks to
      every engagement and leave behind the systems to sustain them.
    </div>
    <div style="display:flex;gap:20px;">
      <div style="flex:1;padding:24px;background:${C.pale};border-radius:10px;border-bottom:3px solid ${C.mid};">
        <div style="font-size:24px;margin-bottom:12px;">&#128203;</div>
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:12px;color:${C.dark};margin-bottom:8px;">Accreditation Readiness</div>
        <div style="font-family:'Sora',sans-serif;font-size:11px;font-weight:300;line-height:1.6;color:#5a5070;">JCI, JCIA, and international standards preparation</div>
      </div>
      <div style="flex:1;padding:24px;background:${C.pale};border-radius:10px;border-bottom:3px solid ${C.mid};">
        <div style="font-size:24px;margin-bottom:12px;">&#128200;</div>
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:12px;color:${C.dark};margin-bottom:8px;">Operational Optimization</div>
        <div style="font-family:'Sora',sans-serif;font-size:11px;font-weight:300;line-height:1.6;color:#5a5070;">Workflows, capacity planning, and performance metrics</div>
      </div>
      <div style="flex:1;padding:24px;background:${C.pale};border-radius:10px;border-bottom:3px solid ${C.mid};">
        <div style="font-size:24px;margin-bottom:12px;">&#127942;</div>
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:12px;color:${C.dark};margin-bottom:8px;">Quality Transformation</div>
        <div style="font-family:'Sora',sans-serif;font-size:11px;font-weight:300;line-height:1.6;color:#5a5070;">Patient safety, clinical governance, culture change</div>
      </div>
    </div>
  </div>
  ${pageNum(7)}
  ${bottomBar(4)}
`);

// ─── PAGE 08 — GLOBAL PARTNERSHIPS ───────────────────────────────
const p08 = pg(`linear-gradient(160deg,${C.ink} 0%,#1c0f3a 100%)`, `
  ${glow(700, 200, 500, C.deep, 0.35)}
  ${topBar(4)}
  <svg style="position:absolute;inset:0;opacity:0.05;width:794px;height:1123px;" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="397" cy="561" rx="340" ry="230" stroke="${C.light}" stroke-width="0.5"/>
    <ellipse cx="397" cy="561" rx="240" ry="230" stroke="${C.light}" stroke-width="0.5"/>
    <ellipse cx="397" cy="561" rx="140" ry="230" stroke="${C.light}" stroke-width="0.5"/>
    <line x1="57" y1="561" x2="737" y2="561" stroke="${C.light}" stroke-width="0.5"/>
    <line x1="397" y1="331" x2="397" y2="791" stroke="${C.light}" stroke-width="0.5"/>
  </svg>
  <div style="padding:72px 64px 60px;position:relative;z-index:1;">
    <div style="font-family:'Sora',sans-serif;font-size:8px;letter-spacing:0.3em;
      text-transform:uppercase;color:${C.light};opacity:0.5;margin-bottom:16px;">Service 03</div>
    <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:38px;
      letter-spacing:-1px;color:${C.white};line-height:1.1;margin-bottom:32px;">
      Global<br>Partnerships
    </div>
    <div style="height:2px;width:48px;background:linear-gradient(90deg,${C.mid},${C.light});margin-bottom:32px;border-radius:2px;"></div>
    <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:13.5px;
      line-height:1.85;color:rgba(255,255,255,0.55);max-width:500px;margin-bottom:48px;">
      Knowledge has no borders. AxisMed actively builds institutional bridges
      between hospitals, universities, and research centers across the Middle East,
      Europe, Asia, and beyond &mdash; creating ecosystems where shared learning
      accelerates collective excellence.
    </div>
    <div style="display:flex;gap:0;">
      <div style="flex:1;padding:28px;border-right:1px solid rgba(133,112,199,0.15);">
        <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:36px;color:${C.mid};letter-spacing:-1px;margin-bottom:4px;">12+</div>
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:11px;color:${C.white};margin-bottom:4px;">Middle East</div>
        <div style="font-family:'Sora',sans-serif;font-size:10px;font-weight:300;color:rgba(255,255,255,0.35);">Partner institutions</div>
      </div>
      <div style="flex:1;padding:28px;border-right:1px solid rgba(133,112,199,0.15);">
        <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:36px;color:${C.mid};letter-spacing:-1px;margin-bottom:4px;">5+</div>
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:11px;color:${C.white};margin-bottom:4px;">Europe</div>
        <div style="font-family:'Sora',sans-serif;font-size:10px;font-weight:300;color:rgba(255,255,255,0.35);">Academic alliances</div>
      </div>
      <div style="flex:1;padding:28px;">
        <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:36px;color:${C.mid};letter-spacing:-1px;margin-bottom:4px;">15+</div>
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:11px;color:${C.white};margin-bottom:4px;">Global</div>
        <div style="font-family:'Sora',sans-serif;font-size:10px;font-weight:300;color:rgba(255,255,255,0.35);">Countries reached</div>
      </div>
    </div>
  </div>
  ${pageNum(8, C.light)}
  ${bottomBar(4)}
`);

// ─── PAGE 09 — DIGITAL LEARNING ──────────────────────────────────
const p09 = pg(C.pale, `
  ${topBar(4)}
  <div style="position:absolute;bottom:-20px;right:32px;font-family:'Sora',sans-serif;
    font-size:220px;font-weight:800;color:${C.white};line-height:1;z-index:0;">04</div>
  <div style="padding:72px 64px 60px;position:relative;z-index:1;">
    <div style="font-family:'Sora',sans-serif;font-size:8px;letter-spacing:0.3em;
      text-transform:uppercase;color:${C.mid};margin-bottom:16px;">Service 04</div>
    <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:38px;
      letter-spacing:-1px;color:${C.dark};line-height:1.1;margin-bottom:32px;">
      Digital Learning<br>Solutions
    </div>
    <div style="height:2px;width:48px;background:linear-gradient(90deg,${C.deep},${C.light});margin-bottom:32px;border-radius:2px;"></div>
    <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:13.5px;
      line-height:1.85;color:#3a3550;max-width:500px;margin-bottom:44px;">
      The future of medical education is flexible, scalable, and deeply engaging.
      Our digital learning infrastructure gives healthcare organizations the power
      to train at scale without sacrificing quality or clinical relevance.
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div style="background:${C.white};padding:24px;border-radius:10px;border-left:3px solid ${C.mid};">
        <div style="font-size:22px;margin-bottom:10px;">&#128187;</div>
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:12px;color:${C.dark};margin-bottom:6px;">LMS Platform</div>
        <div style="font-family:'Sora',sans-serif;font-size:11px;font-weight:300;line-height:1.6;color:#6a6080;">Custom-branded learning management systems</div>
      </div>
      <div style="background:${C.white};padding:24px;border-radius:10px;border-left:3px solid ${C.mid};">
        <div style="font-size:22px;margin-bottom:10px;">&#128300;</div>
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:12px;color:${C.dark};margin-bottom:6px;">Virtual Simulation</div>
        <div style="font-family:'Sora',sans-serif;font-size:11px;font-weight:300;line-height:1.6;color:#6a6080;">Clinical scenario simulations with real-time feedback</div>
      </div>
      <div style="background:${C.white};padding:24px;border-radius:10px;border-left:3px solid ${C.mid};">
        <div style="font-size:22px;margin-bottom:10px;">&#128241;</div>
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:12px;color:${C.dark};margin-bottom:6px;">Mobile Learning</div>
        <div style="font-family:'Sora',sans-serif;font-size:11px;font-weight:300;line-height:1.6;color:#6a6080;">On-demand access across all devices</div>
      </div>
      <div style="background:${C.white};padding:24px;border-radius:10px;border-left:3px solid ${C.mid};">
        <div style="font-size:22px;margin-bottom:10px;">&#128202;</div>
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:12px;color:${C.dark};margin-bottom:6px;">Analytics Dashboard</div>
        <div style="font-family:'Sora',sans-serif;font-size:11px;font-weight:300;line-height:1.6;color:#6a6080;">Track progress, outcomes, and competency</div>
      </div>
    </div>
  </div>
  ${pageNum(9)}
  ${bottomBar(4)}
`);

// ─── PAGE 10 — IMPACT IN NUMBERS ─────────────────────────────────
const p10 = pg(`linear-gradient(135deg,${C.dark} 0%,#0f082a 100%)`, `
  ${glow(397, 561, 500, C.deep, 0.4)}
  ${topBar(4)}
  <div style="position:absolute;top:70px;left:64px;right:64px;">
    <div style="font-family:'Sora',sans-serif;font-size:8px;letter-spacing:0.3em;
      text-transform:uppercase;color:${C.light};opacity:0.5;margin-bottom:12px;">
      03 &nbsp;/&nbsp; Why AxisMed
    </div>
    <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:36px;
      letter-spacing:-1px;color:${C.white};margin-bottom:48px;">
      Impact in Numbers
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-bottom:48px;">
      <div style="background:rgba(133,112,199,0.07);padding:36px 32px;border:1px solid rgba(133,112,199,0.1);">
        <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:52px;letter-spacing:-2px;color:${C.mid};line-height:1;margin-bottom:8px;">500+</div>
        <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:11.5px;color:rgba(255,255,255,0.45);">Healthcare Professionals Trained</div>
      </div>
      <div style="background:rgba(133,112,199,0.07);padding:36px 32px;border:1px solid rgba(133,112,199,0.1);">
        <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:52px;letter-spacing:-2px;color:${C.mid};line-height:1;margin-bottom:8px;">20+</div>
        <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:11.5px;color:rgba(255,255,255,0.45);">Partner Institutions Worldwide</div>
      </div>
      <div style="background:rgba(133,112,199,0.07);padding:36px 32px;border:1px solid rgba(133,112,199,0.1);">
        <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:52px;letter-spacing:-2px;color:${C.mid};line-height:1;margin-bottom:8px;">15+</div>
        <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:11.5px;color:rgba(255,255,255,0.45);">Countries Reached</div>
      </div>
      <div style="background:rgba(133,112,199,0.07);padding:36px 32px;border:1px solid rgba(133,112,199,0.1);">
        <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:52px;letter-spacing:-2px;color:${C.mid};line-height:1;margin-bottom:8px;">98%</div>
        <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:11.5px;color:rgba(255,255,255,0.45);">Participant Satisfaction Rate</div>
      </div>
    </div>
    <div style="border-top:1px solid rgba(133,112,199,0.15);padding-top:32px;display:flex;gap:40px;">
      <div style="flex:1;">
        <div style="font-size:20px;margin-bottom:10px;">&#127961;&#65039;</div>
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:11.5px;color:${C.white};margin-bottom:6px;">Dubai Healthcare City</div>
        <div style="font-family:'Sora',sans-serif;font-size:10.5px;font-weight:300;line-height:1.6;color:rgba(255,255,255,0.35);">Operating from the region's premier medical hub</div>
      </div>
      <div style="flex:1;">
        <div style="font-size:20px;margin-bottom:10px;">&#9989;</div>
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:11.5px;color:${C.white};margin-bottom:6px;">Accredited &amp; Recognized</div>
        <div style="font-family:'Sora',sans-serif;font-size:10.5px;font-weight:300;line-height:1.6;color:rgba(255,255,255,0.35);">Meeting international professional body requirements</div>
      </div>
      <div style="flex:1;">
        <div style="font-size:20px;margin-bottom:10px;">&#128104;&#8205;&#9877;&#65039;</div>
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:11.5px;color:${C.white};margin-bottom:6px;">Expert Faculty</div>
        <div style="font-family:'Sora',sans-serif;font-size:10.5px;font-weight:300;line-height:1.6;color:rgba(255,255,255,0.35);">Led by leading clinicians and educators</div>
      </div>
    </div>
  </div>
  ${pageNum(10, C.light)}
  ${bottomBar(4)}
`);

// ─── PAGE 11 — DUBAI HEALTHCARE CITY ─────────────────────────────
const p11 = pg(C.white, `
  ${topBar(4)}
  <div style="display:flex;height:1123px;">
    <div style="flex:0 0 420px;padding:72px 52px 72px 64px;display:flex;flex-direction:column;justify-content:center;">
      <div style="font-family:'Sora',sans-serif;font-size:8px;letter-spacing:0.3em;
        text-transform:uppercase;color:${C.mid};margin-bottom:20px;">Our Home</div>
      <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:34px;
        letter-spacing:-1px;color:${C.dark};line-height:1.15;margin-bottom:28px;">
        Dubai<br>Healthcare<br>City
      </div>
      <div style="height:2px;width:40px;background:linear-gradient(90deg,${C.deep},${C.light});border-radius:2px;margin-bottom:28px;"></div>
      <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:12.5px;
        line-height:1.85;color:#3a3550;margin-bottom:36px;">
        AxisMed operates from the heart of Dubai Healthcare City &mdash;
        the world's largest dedicated healthcare free zone and the
        MENA region's premier hub for medical excellence, research,
        and innovation.
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:1px solid ${C.pale};">
          <div style="font-family:'Sora',sans-serif;font-size:10.5px;color:#6a6080;">Established</div>
          <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:12px;color:${C.dark};">2002</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:1px solid ${C.pale};">
          <div style="font-family:'Sora',sans-serif;font-size:10.5px;color:#6a6080;">Zone Area</div>
          <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:12px;color:${C.dark};">4.1M sq ft</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:1px solid ${C.pale};">
          <div style="font-family:'Sora',sans-serif;font-size:10.5px;color:#6a6080;">Licensed entities</div>
          <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:12px;color:${C.dark};">400+</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:1px solid ${C.pale};">
          <div style="font-family:'Sora',sans-serif;font-size:10.5px;color:#6a6080;">Nationalities</div>
          <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:12px;color:${C.dark};">170+</div>
        </div>
      </div>
    </div>
    <div style="flex:1;background:${C.dark};position:relative;overflow:hidden;">
      ${glow(200, 400, 400, C.deep, 0.5)}
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;
        align-items:center;justify-content:center;padding:40px;">
        <img src="${symbolSrc}" style="height:120px;width:auto;opacity:0.15;margin-bottom:24px;">
        <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:12px;
          color:rgba(255,255,255,0.3);text-align:center;line-height:2;letter-spacing:0.15em;text-transform:uppercase;">
          Dubai, UAE<br>
          <span style="font-size:10px;opacity:0.6;">25.2285&deg; N, 55.3273&deg; E</span>
        </div>
      </div>
    </div>
  </div>
  ${pageNum(11)}
  ${bottomBar(4)}
`);

// ─── PAGE 12 — LEADERSHIP ─────────────────────────────────────────
const p12 = pg(C.paper, `
  ${topBar(4)}
  ${watermarkLogo()}
  <div style="padding:72px 64px 60px;">
    <div style="font-family:'Sora',sans-serif;font-size:8px;letter-spacing:0.3em;
      text-transform:uppercase;color:${C.mid};margin-bottom:16px;">04 &nbsp;/&nbsp; Leadership</div>
    <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:40px;
      letter-spacing:-1.5px;color:${C.dark};margin-bottom:12px;">Our Leadership</div>
    <div style="height:3px;width:60px;background:linear-gradient(90deg,${C.deep},${C.light});border-radius:2px;margin-bottom:44px;"></div>
    <div style="display:flex;flex-direction:column;gap:24px;">
      <div style="background:${C.white};border-radius:12px;padding:28px 32px;display:flex;gap:28px;align-items:flex-start;border:1px solid rgba(133,112,199,0.1);">
        <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,${C.deep},${C.light});flex-shrink:0;display:flex;align-items:center;justify-content:center;">
          <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:20px;color:${C.white};">CE</div>
        </div>
        <div style="flex:1;">
          <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:13px;color:${C.dark};margin-bottom:4px;">Chief Executive Officer &amp; Founder</div>
          <div style="font-family:'Sora',sans-serif;font-size:8.5px;letter-spacing:0.15em;text-transform:uppercase;color:${C.mid};margin-bottom:10px;">MBA &middot; Healthcare Strategy &middot; MENA Regional Expert</div>
          <div style="font-family:'Sora',sans-serif;font-size:11.5px;font-weight:300;line-height:1.7;color:#5a5070;">A strategic visionary with 15+ years leading healthcare and medical education initiatives across the MENA region. A proven builder of institutions that bridge clinical knowledge with systemic transformation.</div>
        </div>
      </div>
      <div style="background:${C.white};border-radius:12px;padding:28px 32px;display:flex;gap:28px;align-items:flex-start;border:1px solid rgba(133,112,199,0.1);">
        <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,${C.deep},${C.light});flex-shrink:0;display:flex;align-items:center;justify-content:center;">
          <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:20px;color:${C.white};">MD</div>
        </div>
        <div style="flex:1;">
          <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:13px;color:${C.dark};margin-bottom:4px;">Medical Director</div>
          <div style="font-family:'Sora',sans-serif;font-size:8.5px;letter-spacing:0.15em;text-transform:uppercase;color:${C.mid};margin-bottom:10px;">MD, FRCS &middot; Clinical Excellence &middot; Academic Leadership</div>
          <div style="font-family:'Sora',sans-serif;font-size:11.5px;font-weight:300;line-height:1.7;color:#5a5070;">Board-certified physician and internationally recognized educator with extensive clinical, academic, and research experience spanning three continents and multiple healthcare systems.</div>
        </div>
      </div>
      <div style="background:${C.white};border-radius:12px;padding:28px 32px;display:flex;gap:28px;align-items:flex-start;border:1px solid rgba(133,112,199,0.1);">
        <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,${C.deep},${C.light});flex-shrink:0;display:flex;align-items:center;justify-content:center;">
          <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:20px;color:${C.white};">HP</div>
        </div>
        <div style="flex:1;">
          <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:13px;color:${C.dark};margin-bottom:4px;">Head of Global Partnerships</div>
          <div style="font-family:'Sora',sans-serif;font-size:8.5px;letter-spacing:0.15em;text-transform:uppercase;color:${C.mid};margin-bottom:10px;">MSc &middot; International Relations &middot; Global Business Development</div>
          <div style="font-family:'Sora',sans-serif;font-size:11.5px;font-weight:300;line-height:1.7;color:#5a5070;">International relations expert with deep expertise in building sustainable cross-border academic and institutional collaborations in healthcare, education, and innovation ecosystems.</div>
        </div>
      </div>
    </div>
  </div>
  ${pageNum(12)}
  ${bottomBar(4)}
`);

// ─── PAGE 13 — ACCREDITATIONS ────────────────────────────────────
const p13 = pg(`linear-gradient(160deg,#0d0b24 0%,${C.dark} 100%)`, `
  ${glow(100, 600, 400, C.deep, 0.35)}
  ${topBar(4)}
  <div style="padding:72px 64px 60px;position:relative;z-index:1;">
    <div style="font-family:'Sora',sans-serif;font-size:8px;letter-spacing:0.3em;
      text-transform:uppercase;color:${C.light};opacity:0.5;margin-bottom:16px;">Standards &amp; Quality</div>
    <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:40px;
      letter-spacing:-1.5px;color:${C.white};margin-bottom:12px;">
      Accredited.<br>Recognized.<br>Trusted.
    </div>
    <div style="height:2px;width:60px;background:linear-gradient(90deg,${C.mid},${C.light});border-radius:2px;margin-bottom:36px;"></div>
    <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:13px;
      line-height:1.85;color:rgba(255,255,255,0.5);max-width:480px;margin-bottom:48px;">
      Every program we offer meets or exceeds the standards set by leading
      international professional bodies. Our commitment to quality is not
      a marketing message &mdash; it is a structural principle embedded in every
      course we design and every partnership we form.
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;">
      <div style="background:rgba(133,112,199,0.07);border:1px solid rgba(133,112,199,0.12);border-radius:8px;padding:24px;">
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:11px;color:${C.light};margin-bottom:8px;">CME Accredited</div>
        <div style="font-family:'Sora',sans-serif;font-size:10px;font-weight:300;line-height:1.6;color:rgba(255,255,255,0.35);">Continuing Medical Education programs meeting CPD requirements</div>
      </div>
      <div style="background:rgba(133,112,199,0.07);border:1px solid rgba(133,112,199,0.12);border-radius:8px;padding:24px;">
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:11px;color:${C.light};margin-bottom:8px;">International Standards</div>
        <div style="font-family:'Sora',sans-serif;font-size:10px;font-weight:300;line-height:1.6;color:rgba(255,255,255,0.35);">Aligned with JCI, WHO, and regional healthcare frameworks</div>
      </div>
      <div style="background:rgba(133,112,199,0.07);border:1px solid rgba(133,112,199,0.12);border-radius:8px;padding:24px;">
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:11px;color:${C.light};margin-bottom:8px;">Regulatory Compliant</div>
        <div style="font-family:'Sora',sans-serif;font-size:10px;font-weight:300;line-height:1.6;color:rgba(255,255,255,0.35);">Fully licensed and compliant with UAE MoH and DHCC regulations</div>
      </div>
      <div style="background:rgba(133,112,199,0.07);border:1px solid rgba(133,112,199,0.12);border-radius:8px;padding:24px;">
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:11px;color:${C.light};margin-bottom:8px;">Expert Reviewed</div>
        <div style="font-family:'Sora',sans-serif;font-size:10px;font-weight:300;line-height:1.6;color:rgba(255,255,255,0.35);">All curricula reviewed by practicing clinicians and specialists</div>
      </div>
      <div style="background:rgba(133,112,199,0.07);border:1px solid rgba(133,112,199,0.12);border-radius:8px;padding:24px;">
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:11px;color:${C.light};margin-bottom:8px;">Outcome Focused</div>
        <div style="font-family:'Sora',sans-serif;font-size:10px;font-weight:300;line-height:1.6;color:rgba(255,255,255,0.35);">Programs measured against clear clinical competency outcomes</div>
      </div>
      <div style="background:rgba(133,112,199,0.07);border:1px solid rgba(133,112,199,0.12);border-radius:8px;padding:24px;">
        <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:11px;color:${C.light};margin-bottom:8px;">Globally Recognized</div>
        <div style="font-family:'Sora',sans-serif;font-size:10px;font-weight:300;line-height:1.6;color:rgba(255,255,255,0.35);">Certifications respected by healthcare employers worldwide</div>
      </div>
    </div>
  </div>
  ${pageNum(13, C.light)}
  ${bottomBar(4)}
`);

// ─── PAGE 14 — HOW WE WORK ────────────────────────────────────────
const p14 = pg(C.white, `
  ${topBar(4)}
  ${watermarkLogo(0.03)}
  <div style="padding:72px 64px 60px;">
    <div style="font-family:'Sora',sans-serif;font-size:8px;letter-spacing:0.3em;
      text-transform:uppercase;color:${C.mid};margin-bottom:16px;">Our Approach</div>
    <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:40px;
      letter-spacing:-1.5px;color:${C.dark};margin-bottom:12px;">How We Work</div>
    <div style="height:3px;width:60px;background:linear-gradient(90deg,${C.deep},${C.light});border-radius:2px;margin-bottom:44px;"></div>
    <div style="position:relative;">
      <div style="position:absolute;left:23px;top:0;bottom:0;width:1px;
        background:linear-gradient(180deg,${C.mid},transparent);opacity:0.2;"></div>
      <div style="display:flex;flex-direction:column;gap:0;">

        <div style="display:flex;gap:32px;align-items:flex-start;padding:0 0 28px;">
          <div style="width:48px;height:48px;border-radius:50%;background:${C.deep};border:2px solid ${C.mid};flex-shrink:0;display:flex;align-items:center;justify-content:center;position:relative;z-index:1;">
            <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:11px;color:${C.white};">01</div>
          </div>
          <div style="flex:1;padding-top:10px;">
            <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:14px;color:${C.dark};margin-bottom:6px;">Discovery</div>
            <div style="font-family:'Sora',sans-serif;font-size:11.5px;font-weight:300;line-height:1.7;color:#6a6080;">We begin every engagement with deep listening &mdash; understanding your goals, your context, and the specific challenges your institution or team faces.</div>
          </div>
        </div>
        <div style="height:1px;background:${C.pale};margin-left:80px;"></div>

        <div style="display:flex;gap:32px;align-items:flex-start;padding:28px 0;">
          <div style="width:48px;height:48px;border-radius:50%;background:${C.pale};flex-shrink:0;display:flex;align-items:center;justify-content:center;position:relative;z-index:1;">
            <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:11px;color:${C.mid};">02</div>
          </div>
          <div style="flex:1;padding-top:10px;">
            <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:14px;color:${C.dark};margin-bottom:6px;">Design</div>
            <div style="font-family:'Sora',sans-serif;font-size:11.5px;font-weight:300;line-height:1.7;color:#6a6080;">Our expert faculty and curriculum designers build a bespoke program or solution mapped precisely to your objectives and your learners.</div>
          </div>
        </div>
        <div style="height:1px;background:${C.pale};margin-left:80px;"></div>

        <div style="display:flex;gap:32px;align-items:flex-start;padding:28px 0;">
          <div style="width:48px;height:48px;border-radius:50%;background:${C.pale};flex-shrink:0;display:flex;align-items:center;justify-content:center;position:relative;z-index:1;">
            <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:11px;color:${C.mid};">03</div>
          </div>
          <div style="flex:1;padding-top:10px;">
            <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:14px;color:${C.dark};margin-bottom:6px;">Delivery</div>
            <div style="font-family:'Sora',sans-serif;font-size:11.5px;font-weight:300;line-height:1.7;color:#6a6080;">Programs are delivered through our network of expert facilitators, either on-site, at our Dubai facilities, or through our digital platform.</div>
          </div>
        </div>
        <div style="height:1px;background:${C.pale};margin-left:80px;"></div>

        <div style="display:flex;gap:32px;align-items:flex-start;padding:28px 0;">
          <div style="width:48px;height:48px;border-radius:50%;background:${C.pale};flex-shrink:0;display:flex;align-items:center;justify-content:center;position:relative;z-index:1;">
            <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:11px;color:${C.mid};">04</div>
          </div>
          <div style="flex:1;padding-top:10px;">
            <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:14px;color:${C.dark};margin-bottom:6px;">Evaluation</div>
            <div style="font-family:'Sora',sans-serif;font-size:11.5px;font-weight:300;line-height:1.7;color:#6a6080;">Post-program assessments, competency tracking, and feedback loops ensure every investment in learning delivers measurable impact.</div>
          </div>
        </div>
        <div style="height:1px;background:${C.pale};margin-left:80px;"></div>

        <div style="display:flex;gap:32px;align-items:flex-start;padding:28px 0 0;">
          <div style="width:48px;height:48px;border-radius:50%;background:${C.pale};flex-shrink:0;display:flex;align-items:center;justify-content:center;position:relative;z-index:1;">
            <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:11px;color:${C.mid};">05</div>
          </div>
          <div style="flex:1;padding-top:10px;">
            <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:14px;color:${C.dark};margin-bottom:6px;">Partnership</div>
            <div style="font-family:'Sora',sans-serif;font-size:11.5px;font-weight:300;line-height:1.7;color:#6a6080;">The best relationships don&rsquo;t end at graduation. We work with our partners on a continuous basis to grow, iterate, and evolve together.</div>
          </div>
        </div>

      </div>
    </div>
  </div>
  ${pageNum(14)}
  ${bottomBar(4)}
`);

// ─── PAGE 15 — VISION 2030 ────────────────────────────────────────
const p15 = pg(C.ink, `
  ${glow(397, 400, 500, C.deep, 0.5)}
  ${glow(650, 200, 250, C.mid, 0.2)}
  ${topBar(4)}
  <div style="position:absolute;inset:0;opacity:0.06;
    background-image:radial-gradient(circle,${C.mid} 1px,transparent 1px);
    background-size:32px 32px;"></div>
  <div style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;">
    <div style="text-align:center;width:620px;position:relative;z-index:1;">
      <div style="font-family:'Sora',sans-serif;font-size:8px;letter-spacing:0.35em;
        text-transform:uppercase;color:${C.light};opacity:0.4;margin-bottom:28px;">
        Our Vision for 2030
      </div>
      <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:28px;
        line-height:1.5;color:${C.white};margin-bottom:36px;letter-spacing:-0.3px;">
        By 2030, AxisMed will be the defining institution of medical education and
        healthcare innovation across the Middle East &mdash; and a respected global voice
        for what excellent healthcare education can be.
      </div>
      <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,${C.mid},transparent);margin:0 auto 32px;"></div>
      <div style="display:flex;justify-content:center;gap:48px;">
        <div>
          <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:40px;letter-spacing:-1.5px;color:${C.mid};line-height:1;margin-bottom:8px;">1,000+</div>
          <div style="font-family:'Sora',sans-serif;font-size:9.5px;font-weight:300;color:rgba(255,255,255,0.4);letter-spacing:0.05em;line-height:1.5;">Professionals<br>Annually</div>
        </div>
        <div>
          <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:40px;letter-spacing:-1.5px;color:${C.mid};line-height:1;margin-bottom:8px;">30+</div>
          <div style="font-family:'Sora',sans-serif;font-size:9.5px;font-weight:300;color:rgba(255,255,255,0.4);letter-spacing:0.05em;line-height:1.5;">Partner<br>Countries</div>
        </div>
        <div>
          <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:40px;letter-spacing:-1.5px;color:${C.mid};line-height:1;margin-bottom:8px;">#1</div>
          <div style="font-family:'Sora',sans-serif;font-size:9.5px;font-weight:300;color:rgba(255,255,255,0.4);letter-spacing:0.05em;line-height:1.5;">Medical Education<br>in MENA</div>
        </div>
      </div>
    </div>
  </div>
  ${pageNum(15, C.light)}
  ${bottomBar(4)}
`);

// ─── PAGE 16 — CONTACT ────────────────────────────────────────────
const p16 = pg(C.dark, `
  ${glow(100, 300, 450, C.deep, 0.45)}
  ${glow(700, 800, 350, C.mid, 0.2)}
  ${topBar(4)}
  <div style="padding:80px 64px 60px;position:relative;z-index:1;">
    <div style="margin-bottom:60px;">${logo(C.white, 28)}</div>
    <div style="font-family:'Sora',sans-serif;font-weight:800;font-size:46px;
      letter-spacing:-1.5px;color:${C.white};line-height:1.05;margin-bottom:20px;max-width:520px;">
      Let&rsquo;s Shape the<br>Future of Healthcare<br>
      <span style="color:${C.mid};">Together.</span>
    </div>
    <div style="height:2px;width:60px;background:linear-gradient(90deg,${C.mid},${C.light});border-radius:2px;margin-bottom:36px;"></div>
    <div style="font-family:'Sora',sans-serif;font-weight:300;font-size:13px;
      line-height:1.85;color:rgba(255,255,255,0.45);max-width:460px;margin-bottom:52px;">
      Whether you&rsquo;re a healthcare institution, a professional seeking to grow,
      or an organization looking for a strategic partner &mdash; we want to hear from you.
    </div>
    <div style="display:flex;flex-direction:column;gap:20px;margin-bottom:60px;">
      <div style="display:flex;gap:24px;align-items:baseline;">
        <div style="font-family:'Sora',sans-serif;font-size:8.5px;letter-spacing:0.2em;text-transform:uppercase;color:${C.mid};width:72px;flex-shrink:0;opacity:0.7;">Address</div>
        <div style="font-family:'Sora',sans-serif;font-size:14px;font-weight:500;color:${C.white};">Dubai Healthcare City, Dubai, UAE</div>
      </div>
      <div style="display:flex;gap:24px;align-items:baseline;">
        <div style="font-family:'Sora',sans-serif;font-size:8.5px;letter-spacing:0.2em;text-transform:uppercase;color:${C.mid};width:72px;flex-shrink:0;opacity:0.7;">Phone</div>
        <div style="font-family:'Sora',sans-serif;font-size:14px;font-weight:500;color:${C.white};">+971 50 189 7038</div>
      </div>
      <div style="display:flex;gap:24px;align-items:baseline;">
        <div style="font-family:'Sora',sans-serif;font-size:8.5px;letter-spacing:0.2em;text-transform:uppercase;color:${C.mid};width:72px;flex-shrink:0;opacity:0.7;">Email</div>
        <div style="font-family:'Sora',sans-serif;font-size:14px;font-weight:500;color:${C.white};">info@theaxismed.com</div>
      </div>
      <div style="display:flex;gap:24px;align-items:baseline;">
        <div style="font-family:'Sora',sans-serif;font-size:8.5px;letter-spacing:0.2em;text-transform:uppercase;color:${C.mid};width:72px;flex-shrink:0;opacity:0.7;">Website</div>
        <div style="font-family:'Sora',sans-serif;font-size:14px;font-weight:500;color:${C.white};">www.theaxismed.com</div>
      </div>
    </div>
    <div style="border-top:1px solid rgba(133,112,199,0.15);padding-top:24px;">
      <div style="font-family:'Sora',sans-serif;font-size:9px;letter-spacing:0.25em;
        text-transform:uppercase;color:rgba(168,152,219,0.3);">
        Education &nbsp;&middot;&nbsp; Innovation &nbsp;&middot;&nbsp; Global Healthcare
      </div>
    </div>
  </div>
  ${bottomBar(4)}
`);

// ─── Assemble HTML ───────────────────────────────────────────────
const HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>/* fallback if Sora doesn't load */ body { font-family: 'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }</style>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { background:#000; }
  .page {
    width: 794px;
    height: 1123px;
    overflow: hidden;
    page-break-after: always;
    position: relative;
  }
  .noise {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 999;
  }
  @page { size: A4; margin: 0; }
</style>
</head>
<body>
${[p01,p02,p03,p04,p05,p06,p07,p08,p09,p10,p11,p12,p13,p14,p15,p16].join("\n")}
</body>
</html>`;

// ─── Run ─────────────────────────────────────────────────────────
(async () => {
  // Write HTML to a temp file so the browser loads it via file:// (avoids setContent
  // memory issues with very large HTML containing embedded base64 images)
  const tmpHtml = path.join(__dirname, "_profile_tmp.html");
  fs.writeFileSync(tmpHtml, HTML, "utf8");

  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--js-flags=--max-old-space-size=4096",
    ]
  });
  const page = await browser.newPage();

  // Allow file:// access
  await page.setBypassCSP(true);

  console.log("Loading content...");
  await page.goto(`file:///${tmpHtml.replace(/\\/g,"/")}`, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });
  await new Promise(r => setTimeout(r, 2000));

  console.log("Generating PDF...");
  await page.pdf({
    path: OUT_PATH,
    format: "A4",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    timeout: 120000,
  });

  await browser.close();
  fs.unlinkSync(tmpHtml);
  const size = Math.round(fs.statSync(OUT_PATH).size / 1024);
  console.log(`Done! PDF saved to: ${OUT_PATH} (${size} KB)`);
})().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
