/**
 * generate-logo.js
 * Renders all 4 AxisMed wordmark variants using the exact website color palette.
 *
 * Website palette (from globals.css):
 *   --color-purple-950: #383563  (darkest)
 *   --color-purple-800: #5e5a88
 *   --color-purple-600: #8880b8
 *   --color-purple-500: #a49ecf  (accent)
 *   --color-purple-400: #bcb8df
 *   --color-purple-300: #cac6e6
 *   --color-text-primary: #12082C
 *   bg-base: #fafaf8 / bg-dark: #efeef7
 *   dark section bg: #0a0914
 *
 * Usage:  node generate-logo.js
 */

const puppeteer = require("puppeteer");
const path      = require("path");
const fs        = require("fs");

// ─── Paths ──────────────────────────────────────────────────────
// Use the pre-recoloured knot (exact #8570c7, no CSS filter needed)
const SYMBOL_PATH = path.resolve("C:/Users/layan/Downloads/axismed-web/public/logo-symbol-purple.png");
const OUT_DIR     = "C:/Users/layan/Desktop";

const symbolB64 = fs.readFileSync(SYMBOL_PATH).toString("base64");
const symbolSrc = `data:image/png;base64,${symbolB64}`;

// ─── Canvas size ─────────────────────────────────────────────────
const W = 1100;   // logical px
const H =  320;
// Output = 4400 × 1280 px at 4× DPR

// ─── Exact website purple — sampled from live site pixels ────────
// Knot body on live site: #8570c7 (HSL 254°, 43%, 61%)
// This is produced by: hue-rotate(-13deg) saturate(0.45) brightness(1.15)
// applied to the original vivid logo-symbol.png
//
// Knot filters — same filter the live website applies
const KNOT_FILTER_DARK  = "hue-rotate(-13deg) saturate(0.45) brightness(1.15) drop-shadow(0 0 20px rgba(133,112,199,0.5))";
const KNOT_FILTER_LIGHT = "hue-rotate(-13deg) saturate(0.45) brightness(0.95)";
const KNOT_FILTER_MONO  = "grayscale(1) brightness(0.4) sepia(1) hue-rotate(230deg) saturate(3.5)";

// Text colour — solid #8570c7, the exact purple sampled from the live website knot.
// No gradient: knot and wordmark are the same colour throughout.
const TEXT_PURPLE   = "#8570c7";                       // exact website purple
const TEXT_DARK_BG  = "#9e8fd8";                       // slightly lighter for dark-bg contrast
const TAGLINE_DARK  = "rgba(133, 112, 199, 0.60)";
const TAGLINE_LIGHT = "rgba(99, 85, 190, 0.45)";

// ─── HTML builder ────────────────────────────────────────────────
function buildHTML({ bg, textGradient, textSolid, knopFilter, taglineColor, transparent }) {
  const textStyle = textGradient
    ? `background: ${textGradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;`
    : `color: ${textSolid};`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;700;800&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  html, body {
    width: ${W}px;
    height: ${H}px;
    background: ${bg};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* ── Wordmark row ── */
  .wordmark {
    display: flex;
    align-items: flex-end;
    line-height: 1;
  }

  /* ── Knot — replaces the 'A' ── */
  .knot {
    /*
      Sora ExtraBold 110px cap-height ≈ 74px.
      Knot PNG is 672×588px (ratio 1.143).
      At height 104px → width ≈ 119px.
      Letter 'A' in Sora 800 at 110px ≈ 82px wide.
      We size the knot to feel like a generous A, then use a
      small positive gap (margin-right) so it reads as a letter
      with natural wordmark spacing — not overlapping, not floating.
    */
    /* Exact cap height of Sora 800 at 110px = 81px (measured via canvas API).
       Knot matches the height of the letter M precisely. */
    height: 120px;
    width:  auto;
    display: block;
    /* Raise knot by exactly the font's invisible descender space (21px measured)
       so its bottom aligns with the visible bottom of the text glyphs */
    margin-bottom: 5px;
    margin-right: 8px;
    ${knopFilter ? `filter: ${knopFilter};` : ""}
  }

  /* ── Text ── */
  .text {
    font-family: 'Sora', system-ui, sans-serif;
    font-weight: 800;
    font-size: 110px;
    letter-spacing: -2.5px;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    ${textStyle}
  }

  /* ── Tagline ── */
  .tagline {
    font-family: 'Sora', system-ui, sans-serif;
    font-weight: 400;
    font-size: 13.5px;
    letter-spacing: 0.30em;
    text-transform: uppercase;
    color: ${taglineColor};
    margin-top: 16px;
  }
</style>
</head>
<body>
<div class="wrapper">
  <div class="wordmark">
    <img class="knot" src="${symbolSrc}" alt="">
    <span class="text">xisMed</span>
  </div>
  <p class="tagline">Education · Innovation · Global Healthcare</p>
</div>
</body>
</html>`;
}

// ─── 4 Variants ──────────────────────────────────────────────────
const VARIANTS = [
  {
    name: "AxisMed_Logo_Dark",
    html: buildHTML({
      bg:           "radial-gradient(ellipse 100% 140% at 50% 0%, #161230 0%, #0a0914 55%, #06050f 100%)",
      textGradient: null,
      textSolid:    TEXT_DARK_BG,
      taglineColor: TAGLINE_DARK,
      knopFilter:   null,
    }),
    transparent: false,
  },
  {
    name: "AxisMed_Logo_Light",
    html: buildHTML({
      bg:           "radial-gradient(ellipse 160% 120% at 50% 0%, #eeedf6 0%, #efeef7 45%, #fafaf8 100%)",
      textGradient: null,
      textSolid:    TEXT_PURPLE,
      taglineColor: TAGLINE_LIGHT,
      knopFilter:   null,
    }),
    transparent: false,
  },
  {
    name: "AxisMed_Logo_Transparent",
    html: buildHTML({
      bg:           "transparent",
      textGradient: null,
      textSolid:    TEXT_PURPLE,
      taglineColor: TAGLINE_DARK,
      knopFilter:   null,
    }),
    transparent: true,
  },
  {
    name: "AxisMed_Logo_Mono",
    html: buildHTML({
      bg:           "#fafaf8",
      textGradient: null,
      textSolid:    "#5a4fb0",
      taglineColor: "rgba(90, 79, 176, 0.40)",
      knopFilter:   "grayscale(1) brightness(0.4) sepia(1) hue-rotate(230deg) saturate(3.5)",
    }),
    transparent: false,
  },
];

// ─── Main ────────────────────────────────────────────────────────
async function run() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
  });

  for (const variant of VARIANTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 4 });
    await page.setContent(variant.html, { waitUntil: "networkidle0", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 900));

    const outPath = path.join(OUT_DIR, `${variant.name}.png`);
    await page.screenshot({
      path: outPath,
      type: "png",
      omitBackground: variant.transparent === true,
    });

    const kb = Math.round(fs.statSync(outPath).size / 1024);
    console.log(`  ${variant.name}.png  (${kb} KB)`);
    await page.close();
  }

  await browser.close();
  console.log("\nDone. All 4 files saved to Desktop.");
}

run().catch((err) => { console.error(err.message); process.exit(1); });
