import { promises as fs } from "fs";
import path from "path";

// Server-only — never import from client components
const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readJSON<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJSON<T>(file: string, data: T): Promise<void> {
  await ensureDir();
  await fs.writeFile(
    path.join(DATA_DIR, file),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}
