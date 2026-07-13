import { promises as fs } from "fs";
import path from "path";

/**
 * Server-only data layer. Never import from a client component.
 *
 * Storage strategy:
 *  - Production (Vercel): Vercel KV (Redis). Vercel's function filesystem is
 *    read-only, so file writes silently fail there — KV is what actually
 *    persists admin edits and inbound leads. KV is private, which matters
 *    because contacts/registrations/leads contain personal data.
 *  - Local dev / no KV: read+write the JSON files under /data.
 *
 * Reads fall back through: KV → committed /data file (the seed bundled in the
 * deployment) → the caller's `fallback`. So before anything is edited, the live
 * site shows the committed data; after an admin edit, KV becomes the source of
 * truth.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const KEY_PREFIX = "db:";

function kvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
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
  if (kvConfigured()) {
    try {
      const { kv } = await import("@vercel/kv");
      const value = await kv.get<T>(`${KEY_PREFIX}${file}`);
      if (value !== null && value !== undefined) return value;
    } catch (e) {
      console.warn(`[db] KV read failed for ${file}:`, e instanceof Error ? e.message : e);
    }
  }
  const fromFile = await readFile<T>(file);
  if (fromFile !== null) return fromFile;
  return fallback;
}

export async function writeJSON<T>(file: string, data: T): Promise<void> {
  if (kvConfigured()) {
    const { kv } = await import("@vercel/kv");
    await kv.set(`${KEY_PREFIX}${file}`, data);
    return;
  }
  // Local dev / no KV configured — write to the JSON file.
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

/**
 * One-time seed: copy the committed /data files into KV if a key is empty.
 * Called by the admin "sync/seed" action so the live site starts from the
 * current committed content instead of an empty store.
 */
export async function seedKVFromFiles(files: string[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  if (!kvConfigured()) return { error: "KV not configured" };
  const { kv } = await import("@vercel/kv");
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
