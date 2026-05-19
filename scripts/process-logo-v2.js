// Removes black background from brand-identity.png → logo-symbol.png
const sharp = require("sharp");
const path = require("path");

const SRC = path.join(__dirname, "../public/brand-identity.png");
const OUT = path.join(__dirname, "../public/logo-symbol.png");

async function run() {
  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const buf = Buffer.from(data);

  for (let i = 0; i < buf.length; i += channels) {
    const r = buf[i], g = buf[i + 1], b = buf[i + 2];
    // Remove near-black background (pure black or very dark)
    if (r < 35 && g < 35 && b < 35) {
      buf[i + 3] = 0; // transparent
    }
  }

  await sharp(buf, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .trim({ threshold: 5 }) // auto-crop transparent edges
    .toFile(OUT);

  console.log(`✓ Saved ${OUT}`);
}

run().catch(console.error);
