import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/db.server";

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  category: string;
  uploadedAt: string;
}

export async function GET() {
  const data = await readJSON<GalleryPhoto[]>("gallery.json", []);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Omit<GalleryPhoto, "id" | "uploadedAt">;
  const data = await readJSON<GalleryPhoto[]>("gallery.json", []);
  const photo: GalleryPhoto = {
    ...body,
    id: `photo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    uploadedAt: new Date().toISOString(),
  };
  await writeJSON("gallery.json", [photo, ...data]);
  return NextResponse.json(photo, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, caption, category } = await req.json() as {
    id: string;
    caption?: string;
    category?: string;
  };
  const data    = await readJSON<GalleryPhoto[]>("gallery.json", []);
  const updated = data.map((p) =>
    p.id === id
      ? {
          ...p,
          ...(caption !== undefined  && { caption }),
          ...(category !== undefined && { category }),
        }
      : p
  );
  await writeJSON("gallery.json", updated);
  const photo = updated.find((p) => p.id === id);
  return photo
    ? NextResponse.json(photo)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json() as { id: string };
  const data = await readJSON<GalleryPhoto[]>("gallery.json", []);
  await writeJSON("gallery.json", data.filter((p) => p.id !== id));
  return NextResponse.json({ success: true });
}
