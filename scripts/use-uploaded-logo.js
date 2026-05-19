const sharp = require("sharp");
const path = require("path");

const SRC = "C:\\Users\\layan\\Downloads\\ChatGPT Image May 16, 2026, 05_48_24 PM.png";
const OUT = path.join(__dirname, "../public/logo-symbol.png");

async function run() {
  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const buf = Buffer.from(data);

  // Remove any near-black background pixels
  for (let i = 0; i < buf.length; i += channels) {
    const r = buf[i], g = buf[i + 1], b = buf[i + 2];
    if (r < 40 && g < 40 && b < 40) {
      buf[i + 3] = 0;
    }
  }

  await sharp(buf, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .trim({ threshold: 10 })
    .toFile(OUT);

  console.log(`✓ Saved logo-symbol.png (${width}x${height})`);
}

run().catch(console.error);
