const sharp = require("sharp");
const path = require("path");

async function main() {
  const src = path.join(__dirname, "../public/logo.png");
  const dst = path.join(__dirname, "../public/logo-symbol.png");

  // Load as raw RGBA
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // Crop to top 62% — removes the AXISMED text & tagline
  // Also crop horizontally: knot is centered at ~55% of width, take 44% width around it
  const cropH = Math.floor(height * 0.62);
  const cropW = Math.floor(width * 0.44);
  const offsetX = Math.floor(width * 0.29); // start at ~29% from left
  const out = Buffer.alloc(cropW * cropH * 4);

  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
      const srcX = x + offsetX;
      const srcIdx = (y * width + srcX) * channels;
      const dstIdx = (y * cropW + x) * 4;
      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      // Near-white → transparent
      const isWhitish = r > 230 && g > 230 && b > 230;

      out[dstIdx]     = r;
      out[dstIdx + 1] = g;
      out[dstIdx + 2] = b;
      out[dstIdx + 3] = isWhitish ? 0 : 255;
    }
  }

  await sharp(out, { raw: { width: cropW, height: cropH, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(dst);

  console.log(`✓ Saved logo-symbol.png (${cropW}x${cropH})`);
}

main().catch((e) => { console.error(e); process.exit(1); });
