/**
 * Generates hero voiceover files using Microsoft Edge Neural TTS.
 * Free — no API key needed. Uses the same voice engine as Azure Cognitive Services.
 *
 * Voice: en-US-GuyNeural (deep, natural male narrator)
 * Rate: 0.86 (slightly slower for cinematic pacing)
 * Pitch: -4% (slightly lower for gravitas)
 *
 * Run: node scripts/generate-voices-edge.mjs
 * Output: public/audio/hero-01.mp3 … hero-08.mp3
 */

import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { createWriteStream, mkdirSync, existsSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dir, "../public/audio");

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const LINES = [
  { id: "hero-01", text: "Three pillars."                                                              },
  { id: "hero-02", text: "One connected ecosystem."                                                    },
  { id: "hero-03", text: "Education."                                                                  },
  { id: "hero-04", text: "Media."                                                                      },
  { id: "hero-05", text: "Experiences."                                                                },
  { id: "hero-06", text: "Connected through innovation."                                               },
  { id: "hero-07", text: "AxisMed."                                                                    },
  { id: "hero-08", text: "Connecting education, media, and experiences into the future of healthcare." },
];

const VOICE   = "en-US-GuyNeural";
const OPTIONS = { rate: 0.86, pitch: "-4%" };

console.log(`\nGenerating ${LINES.length} voice files  (voice: ${VOICE}, rate: ${OPTIONS.rate}, pitch: ${OPTIONS.pitch})\n`);

const tts = new MsEdgeTTS();
await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

for (const line of LINES) {
  const out = join(outDir, `${line.id}.mp3`);
  if (existsSync(out)) {
    console.log(`  skip  ${line.id}.mp3  (already exists — delete to regenerate)`);
    continue;
  }

  process.stdout.write(`  gen   ${line.id}  "${line.text}" …`);

  const { audioStream } = tts.toStream(line.text, OPTIONS);
  const fileStream      = createWriteStream(out);

  await new Promise((resolve, reject) => {
    audioStream.pipe(fileStream);
    fileStream.once("close", () => {
      if (fileStream.bytesWritten > 0) {
        console.log(` ✓  (${Math.round(fileStream.bytesWritten / 1024)} KB)`);
        resolve();
      } else {
        unlinkSync(out);
        reject(new Error("Empty audio file — no data received"));
      }
    });
    fileStream.once("error", reject);
    audioStream.once("error", reject);
  });
}

tts.close();
console.log(`\n✓ All files saved to public/audio/\n`);
