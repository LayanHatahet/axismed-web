/**
 * capture-hero-reel.js
 * Records the AxisMed hero animation and exports a 1080×1920 Instagram Reel MP4.
 *
 * Usage:  node capture-hero-reel.js
 *
 * Requires:
 *   - npm install puppeteer  (already done)
 *   - ffmpeg in PATH         (already installed)
 *   - Dev server running on http://localhost:3000
 *     OR set URL env var:  URL=https://axismed-web.vercel.app node capture-hero-reel.js
 */

const puppeteer = require("puppeteer");
const fs        = require("fs");
const path      = require("path");
const { execSync } = require("child_process");

// ─── Config ────────────────────────────────────────────────────
const TARGET_URL   = process.env.URL || "http://localhost:3000";
const FPS          = 25;
const DURATION_S   = 14;          // 13 s animation + 1 s hold at the end
const FRAMES_TOTAL = FPS * DURATION_S;  // 350 frames
const WIDTH        = 1080;
const HEIGHT       = 1920;
const FRAMES_DIR   = path.join("C:/Users/layan/Desktop", "hero_frames_tmp");
const OUT_VIDEO    = path.join("C:/Users/layan/Desktop", "AxisMed_Hero_Reel_1080x1920.mp4");
// ───────────────────────────────────────────────────────────────

function clearFrames() {
  if (fs.existsSync(FRAMES_DIR)) fs.rmSync(FRAMES_DIR, { recursive: true });
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
}

function encode() {
  console.log("\n🎬 Encoding video with ffmpeg…");
  const ffmpegPath = "ffmpeg"; // in PATH after install
  const cmd = [
    ffmpegPath,
    "-y",
    `-framerate ${FPS}`,
    `-i "${FRAMES_DIR}/frame_%05d.png"`,
    "-vf", `"scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=decrease,pad=${WIDTH}:${HEIGHT}:(ow-iw)/2:(oh-ih)/2:color=black"`,
    "-vcodec libx264",
    "-pix_fmt yuv420p",
    "-crf 18",
    "-preset slow",
    `-movflags +faststart`,
    `"${OUT_VIDEO}"`,
  ].join(" ");
  execSync(cmd, { stdio: "inherit", shell: true });
}

async function capture() {
  clearFrames();

  console.log(`📷  Opening browser  →  ${TARGET_URL}`);
  console.log(`    Viewport : ${WIDTH}×${HEIGHT}  |  ${FPS} fps  |  ${DURATION_S}s  (${FRAMES_TOTAL} frames)`);

  const browser = await puppeteer.launch({
    headless: false,          // WebGL requires a real GPU context
    args: [
      `--window-size=${WIDTH},${HEIGHT}`,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--enable-webgl",
      "--use-gl=angle",
      "--enable-accelerated-2d-canvas",
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--disable-backgrounding-occluded-windows",
    ],
    defaultViewport: { width: WIDTH, height: HEIGHT },
  });

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT });

  // Navigate — wait until the network is idle so React has hydrated
  await page.goto(TARGET_URL, { waitUntil: "networkidle0", timeout: 60000 });

  // Hide everything below the hero so the reel is just the hero
  await page.evaluate(() => {
    // Suppress scroll bar and all non-hero sections
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow             = "hidden";

    // Keep only the first <section> (hero) and the <header>; hide the rest
    const allSections = document.querySelectorAll("main > *");
    allSections.forEach((el, i) => {
      if (i > 0) el.style.display = "none";
    });

    // Hide footer
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";
  });

  // Give Three.js ~1.5 s to start rendering before we record
  await new Promise((r) => setTimeout(r, 1500));

  console.log("🔴 Recording…");
  const FRAME_INTERVAL_MS = 1000 / FPS; // 40 ms between frames

  for (let i = 0; i < FRAMES_TOTAL; i++) {
    const t0        = Date.now();
    const framePath = path.join(FRAMES_DIR, `frame_${String(i).padStart(5, "0")}.png`);

    await page.screenshot({ path: framePath, type: "png", clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });

    // Print progress every 25 frames (every second)
    if (i % FPS === 0) {
      process.stdout.write(`\r    Frame ${i + 1}/${FRAMES_TOTAL}  (${Math.round((i / FRAMES_TOTAL) * 100)}%)`);
    }

    // Throttle so we hit ~25 fps wall-clock
    const elapsed = Date.now() - t0;
    const wait    = Math.max(0, FRAME_INTERVAL_MS - elapsed);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  }

  process.stdout.write(`\r    Frame ${FRAMES_TOTAL}/${FRAMES_TOTAL}  (100%)\n`);
  await browser.close();

  encode();

  // Clean up temp frames
  fs.rmSync(FRAMES_DIR, { recursive: true });

  console.log(`\n✅  Done!  →  ${OUT_VIDEO}`);
}

capture().catch((err) => {
  console.error("❌ Capture failed:", err.message);
  process.exit(1);
});
