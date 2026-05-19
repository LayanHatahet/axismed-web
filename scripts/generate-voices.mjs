/**
 * Generates ultra-realistic hero voiceover files using OpenAI TTS.
 * Run once: npm run generate:voices
 *
 * Voice: "onyx" (deep, cinematic, film-narrator quality)
 * Model: tts-1-hd (highest quality, 24kHz)
 * Speed: 0.88 (deliberate, dramatic pacing)
 *
 * Outputs: public/audio/hero-01.mp3 … hero-08.mp3
 * These are static files served with zero latency at runtime.
 */

import OpenAI from "openai";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dir, "../public/audio");

if (!process.env.OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY environment variable is not set.");
  console.error("Set it with: set OPENAI_API_KEY=sk-... (Windows) or export OPENAI_API_KEY=sk-... (Mac/Linux)");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/*
 * Available voices (all extremely realistic):
 *   onyx    — deep, authoritative, cinematic male  ← recommended for AxisMed
 *   nova    — warm, natural, expressive female
 *   shimmer — soft, gentle female
 *   echo    — warm male, conversational
 *   alloy   — neutral, clear, professional
 *   fable   — British accent, expressive
 */
const VOICE = "onyx";
const SPEED = 0.88;  // 0.88 = slightly slower than natural for dramatic effect

const LINES = [
  { id: "hero-01", text: "Three pillars."                                                                     },
  { id: "hero-02", text: "One connected ecosystem."                                                           },
  { id: "hero-03", text: "Education."                                                                         },
  { id: "hero-04", text: "Media."                                                                             },
  { id: "hero-05", text: "Experiences."                                                                       },
  { id: "hero-06", text: "Connected through innovation."                                                      },
  { id: "hero-07", text: "AxisMed."                                                                           },
  { id: "hero-08", text: "Connecting education, media, and experiences into the future of healthcare."        },
];

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

console.log(`\nGenerating ${LINES.length} voice files  (voice: ${VOICE}, speed: ${SPEED})\n`);

for (const line of LINES) {
  const out = join(outDir, `${line.id}.mp3`);
  if (existsSync(out)) {
    console.log(`  skip  ${line.id}.mp3  (already exists — delete to regenerate)`);
    continue;
  }
  process.stdout.write(`  gen   ${line.id}  "${line.text}" …`);
  const response = await openai.audio.speech.create({
    model:           "tts-1-hd",
    voice:           VOICE,
    input:           line.text,
    speed:           SPEED,
    response_format: "mp3",
  });
  writeFileSync(out, Buffer.from(await response.arrayBuffer()));
  console.log(" ✓");
}

console.log(`\n✓ All files saved to public/audio/\n`);
