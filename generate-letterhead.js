/**
 * generate-letterhead.js
 * Outputs:
 *   AxisMed_Letterhead.png   — A4 print-ready PNG (2481 × 3509 px, 300 DPI)
 *   AxisMed_Letterhead.docx  — Editable Word document (header/footer pixel-matched to PNG)
 */

const puppeteer = require("puppeteer");
const path      = require("path");
const fs        = require("fs");
const {
  Document, Packer, Paragraph, ImageRun,
  Header, Footer,
} = require("docx");

const SYMBOL_PATH  = path.resolve("C:/Users/layan/Downloads/axismed-web/public/logo-symbol-purple.png");
const symbolB64    = fs.readFileSync(SYMBOL_PATH).toString("base64");
const symbolSrc    = `data:image/png;base64,${symbolB64}`;
const OUT_DIR      = "C:/Users/layan/Desktop";

// ─── A4 at 96 dpi logical → 3.125× DPR = 300 DPI output ────────
const W   = 794;
const H   = 1123;
const DPR = 3.125;

// ─── SVG icons (inline, no external deps) ───────────────────────
const svg = {
  pin:   `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8570c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8570c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.2 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.29 6.29l1.28-.55a2 2 0 012.11.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
  mail:  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8570c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  globe: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8570c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
};

// ─── HTML ────────────────────────────────────────────────────────
const HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body {
    width:${W}px; height:${H}px;
    background:#fff;
    font-family:'Sora',system-ui,sans-serif;
    color:#12082C;
    overflow:hidden;
    position:relative;
  }

  /* top bar */
  .top-bar { height:5px; background:linear-gradient(90deg,#4a3aaa,#8570c7,#a898db); }

  /* header */
  .header { padding:36px 48px 28px; border-bottom:1px solid rgba(133,112,199,0.18); }
  .logo-block { display:inline-flex; flex-direction:column; align-items:stretch; }
  .wordmark { display:flex; align-items:flex-end; line-height:1; }
  .wordmark img { height:48px; width:auto; margin-right:12px; margin-bottom:4px; }
  .wordmark-text { font-weight:800; font-size:52px; letter-spacing:-1.5px; color:#8570c7; display:inline-block; line-height:1; }
  .tagline { display:flex; justify-content:space-between; align-items:center; font-size:8.5px; letter-spacing:0.12em; text-transform:uppercase; color:rgba(133,112,199,0.55); margin-top:8px; }

  /* watermark */
  .watermark { position:absolute; bottom:130px; right:44px; opacity:0.04; }
  .watermark img { width:180px; height:auto; }

  /* body */
  .body { margin:0 48px; height:860px; }

  /* footer */
  .footer { position:absolute; bottom:0; left:0; right:0; }
  .footer-divider { height:1px; background:rgba(133,112,199,0.2); margin:0 48px; }
  .footer-contacts {
    display:flex; align-items:center; justify-content:center;
    gap:36px; padding:16px 48px 14px;
  }
  .contact-item { display:flex; align-items:center; gap:7px; white-space:nowrap; }
  .contact-item span { font-size:10.5px; color:#484575; letter-spacing:0.03em; white-space:nowrap; }
  .footer-bottom { height:4px; background:linear-gradient(90deg,#4a3aaa,#8570c7,#a898db); }
</style>
</head>
<body>

<div class="top-bar"></div>

<div class="header">
  <div class="logo-block">
    <div class="wordmark">
      <img src="${symbolSrc}" alt="">
      <span class="wordmark-text">AxisMed</span>
    </div>
    <p class="tagline"><span>Education</span><span>·</span><span>Innovation</span><span>·</span><span>Global Healthcare</span></p>
  </div>
</div>

<div class="body"></div>

<div class="watermark"><img src="${symbolSrc}" alt=""></div>

<div class="footer">
  <div class="footer-divider"></div>
  <div class="footer-contacts">
    <div class="contact-item">${svg.pin}   <span>Dubai Healthcare City, Dubai, UAE</span></div>
    <div class="contact-item">${svg.phone} <span>+971&#8209;50&#8209;189&#8209;7038</span></div>
    <div class="contact-item">${svg.mail}  <span>info@theaxismed.com</span></div>
    <div class="contact-item">${svg.globe} <span>www.theaxismed.com</span></div>
  </div>
  <div class="footer-bottom"></div>
</div>

</body>
</html>`;

// ─── Shared render + capture (single page load) ─────────────────
async function renderAll() {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  const page    = await browser.newPage();

  // One load at 300-DPI resolution — used for both PNG export and DOCX crops
  await page.setViewport({ width: W, height: H, deviceScaleFactor: DPR });
  await page.setContent(HTML, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // Full-page PNG (300 DPI)
  const pngOut = path.join(OUT_DIR, "AxisMed_Letterhead.png");
  await page.screenshot({ path: pngOut, type: "png", clip: { x: 0, y: 0, width: W, height: H } });
  console.log(`  PNG  →  ${pngOut}  (${Math.round(fs.statSync(pngOut).size / 1024)} KB)`);

  // Measure header and footer bounds in CSS (logical) pixels
  const bounds = await page.evaluate(() => {
    const header = document.querySelector(".header");
    const footer = document.querySelector(".footer");
    const hRect  = header.getBoundingClientRect();
    const fRect  = footer.getBoundingClientRect();
    return {
      headerH: Math.ceil(hRect.bottom) + 1,
      footerY: Math.floor(fRect.top),
      footerH: Math.ceil(fRect.bottom) - Math.floor(fRect.top),
    };
  });

  // Crop header strip (clip is in CSS px; Puppeteer scales by DPR internally)
  const headerBuf = await page.screenshot({
    type: "png",
    clip: { x: 0, y: 0, width: W, height: bounds.headerH },
  });

  // Crop footer strip
  const footerBuf = await page.screenshot({
    type: "png",
    clip: { x: 0, y: bounds.footerY, width: W, height: bounds.footerH },
  });

  await browser.close();
  return { headerBuf, footerBuf, headerH: bounds.headerH, footerH: bounds.footerH };
}

// ─── Generate DOCX ───────────────────────────────────────────────
async function generateDOCX(headerBuf, headerH, footerBuf, footerH) {
  // A4 page: 11906 × 16838 DXA
  // Side margins: 720 DXA = 0.5 inch = 48 px (matches HTML padding)
  // Full-width images use indent: { left: -720, right: -720 } to bleed to page edge
  //
  // Top/bottom margins must accommodate the header/footer image heights:
  //   height_px / 96 dpi * 1440 DXA/inch = DXA
  const SIDE    = 720;                                           // 0.5 inch
  const TOP_DXA = Math.round((headerH / 96) * 1440);
  const BOT_DXA = Math.round((footerH / 96) * 1440);

  const fullWidth = {
    indent: { left: -SIDE, right: -SIDE },
    spacing: { before: 0, after: 0 },
  };

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },          // A4
          margin: { top: TOP_DXA, right: SIDE, bottom: BOT_DXA, left: SIDE },
        },
      },

      // ── HEADER: exact PNG crop ───────────────────────────────
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              ...fullWidth,
              children: [
                new ImageRun({
                  type: "png",
                  data: headerBuf,
                  transformation: { width: W, height: headerH },
                  altText: { title: "AxisMed Header", description: "Letterhead header", name: "Header" },
                }),
              ],
            }),
          ],
        }),
      },

      // ── FOOTER: exact PNG crop ───────────────────────────────
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              ...fullWidth,
              children: [
                new ImageRun({
                  type: "png",
                  data: footerBuf,
                  transformation: { width: W, height: footerH },
                  altText: { title: "AxisMed Footer", description: "Letterhead footer", name: "Footer" },
                }),
              ],
            }),
          ],
        }),
      },

      // ── BODY: blank, ready to type ───────────────────────────
      children: [
        new Paragraph({ children: [] }),
      ],
    }],
  });

  const out = path.join(OUT_DIR, "AxisMed_Letterhead.docx");
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(out, buf);
  console.log(`  DOCX →  ${out}  (${Math.round(buf.length / 1024)} KB)`);
}

// ─── Run ─────────────────────────────────────────────────────────
(async () => {
  console.log("Generating...");
  const { headerBuf, headerH, footerBuf, footerH } = await renderAll();
  await generateDOCX(headerBuf, headerH, footerBuf, footerH);
  console.log("Done. Both files saved to Desktop.");
})().catch(console.error);
