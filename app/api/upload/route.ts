import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "uploads";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File too large (max 4 MB)" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

  // Production: Vercel Blob (the deployment filesystem is read-only).
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(`${folder}/${filename}`, file, {
        access: "public",
        contentType: file.type,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return NextResponse.json({ url: blob.url });
    } catch (e) {
      console.error("[upload] Blob upload failed:", e instanceof Error ? e.message : e);
      return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
    }
  }

  // On Vercel without Blob configured, fail with a clear message — the
  // deployment filesystem is read-only, so the local write below would 500.
  if (process.env.VERCEL) {
    return NextResponse.json(
      {
        error:
          "Image storage isn't configured yet. Connect a Vercel Blob store and add BLOB_READ_WRITE_TOKEN, then redeploy.",
      },
      { status: 503 }
    );
  }

  // Local dev — write into /public.
  const dir = path.join(process.cwd(), "public", folder);
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);
  return NextResponse.json({ url: `/${folder}/${filename}` });
}
