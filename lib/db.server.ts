import { promises as fs } from "fs";
import path from "path";

/**
 * Server-only data layer. Never import from a client component.
 *
 * Storage strategy:
 *  - Production (Vercel): Vercel KV / Redis. Vercel's function filesystem is
 *    read-only, so file writes silently fail there — Redis is what actually
 *    persists admin edits and inbound leads. It is private, which matters
 *    because contacts/registrations/leads contain personal data.
 *  - Local dev / no Redis: read+write the JSON files under /data.
 *
 * Reads fall back through: Redis → committed /data file (the seed bundled in
 * the deployment) → the caller's `fallback`. So before anything is edited, the
 * live site shows the committed data; after an admin edit, Redis is the source
 * of truth.
 *
 * Accepts either the Vercel-KV env names (KV_REST_API_URL/KV_REST_API_TOKEN)
 * or the Upstash names (UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN), so it
 * works with whichever Redis integration is connected in Vercel.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const KEY_PREFIX = "db:";

function kvEnv(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function getKV() {
  const env = kvEnv();
  if (!env) return null;
  const { createClient } = await import("@vercel/kv");
  return createClient({ url: env.url, token: env.token });
}

async function readFile<T>(file: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function readJSON<T>(file: string, fallback: T): Promise<T> {
  try {
    const kv = await getKV();
    if (kv) {
      const value = await kv.get<T>(`${KEY_PREFIX}${file}`);
      if (value !== null && value !== undefined) return value;
    }
  } catch (e) {
    console.warn(`[db] KV read failed for ${file}:`, e instanceof Error ? e.message : e);
  }
  const fromFile = await readFile<T>(file);
  if (fromFile !== null) return fromFile;
  return fallback;
}

export async function writeJSON<T>(file: string, data: T): Promise<void> {
  const kv = await getKV();
  if (kv) {
    await kv.set(`${KEY_PREFIX}${file}`, data);
    return;
  }
  // Local dev / no Redis configured — write to the JSON file.
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

/**
 * One-time seed: copy the committed /data files into KV for any key that is
 * still empty. Called by the admin "seed" action so the live site starts from
 * the current committed content instead of an empty store. Safe to re-run.
 */
export async function seedKVFromFiles(files: string[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  const kv = await getKV();
  if (!kv) return { error: "Redis is not configured (KV_REST_API_URL / KV_REST_API_TOKEN)" };
  for (const file of files) {
    try {
      const existing = await kv.get(`${KEY_PREFIX}${file}`);
      if (existing !== null && existing !== undefined) {
        result[file] = "already-present";
        continue;
      }
      const fromFile = await readFile(file);
      if (fromFile === null) {
        result[file] = "no-seed-file";
        continue;
      }
      await kv.set(`${KEY_PREFIX}${file}`, fromFile);
      result[file] = "seeded";
    } catch (e) {
      result[file] = `error: ${e instanceof Error ? e.message : e}`;
    }
  }
  return result;
}
