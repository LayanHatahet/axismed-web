const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const SYMBOL_PATH = path.resolve("C:/Users/layan/Downloads/axismed-web/public/logo-symbol-purple.png");
const symbolSrc = `data:image/png;base64,${fs.readFileSync(SYMBOL_PATH).toString("base64")}`;

// Render at 4x DPR for high-res output
const DPR = 4;

const HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@800&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body {
    background: transparent;
    display: inline-block;
    padding: 40px 48px;
  }
  .logo {
    display: inline-flex;
    align-items: flex-end;
    gap: 20px;
    line-height: 1;
    white-space: nowrap;
  }
  .logo img {
    height: 80px;
    width: auto;
    display: block;
    margin-bottom: 6px;
  }
  .logo-text {
    font-family: 'Sora', sans-serif;
    font-weight: 800;
    font-size: 88px;
    letter-spacing: -3.5px;
    color: #8570c7;
    line-height: 1;
    display: inline-block;
  }
</style>
</head>
<body>
  <div class="logo">
    <img src="${symbolSrc}" alt="">
    <span class="logo-text">AxisMed</span>
  </div>
</body>
</html>`;

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 400, deviceScaleFactor: DPR });
  await page.setContent(HTML, { waitUntil: "networkidle0", timeout: 30000 });
  await page.evaluateHandle("document.fonts.ready");
  await new Promise(r => setTimeout(r, 1000));

  // Measure the exact bounds of the logo element
  const bounds = await page.evaluate(() => {
    const el = document.querySelector(".logo");
    const body = document.body;
    const br = body.getBoundingClientRect();
    return { w: Math.ceil(br.width), h: Math.ceil(br.height) };
  });

  const out = "C:/Users/layan/Desktop/AxisMed_Logo_Full_HighRes.png";
  await page.screenshot({
    path: out,
    type: "png",
    omitBackground: true,
    clip: { x: 0, y: 0, width: bounds.w, height: bounds.h }
  });

  await browser.close();
  const sz = Math.round(fs.statSync(out).size / 1024);
  const realW = bounds.w * DPR;
  const realH = bounds.h * DPR;
  console.log(`Saved: ${out}`);
  console.log(`Size: ${realW}x${realH}px @ ~300 DPI (${sz} KB)`);
})().catch(console.error);
