"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Trash2, RefreshCw, X, ImageIcon, Edit2,
  Home, Info, Calendar, ExternalLink, Check, TriangleAlert,
  ArrowRight, ChevronDown,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import type { GalleryPhoto } from "@/app/api/gallery/route";

const SECTIONS = [
  {
    id: "Home",
    label: "Home — Moments Strip",
    icon: Home,
    description: "Photos in the 'Moments from AxisMed' grid on the homepage.",
    hint: "Landscape, min 800×600. Up to 8 shown.",
    page: "/",
  },
  {
    id: "Team",
    label: "About — Team & Moments",
    icon: Info,
    description: "Photos in the masonry grid on the About page.",
    hint: "Any orientation. All photos are shown.",
    page: "/about",
  },
  {
    id: "About",
    label: "About — Extra Photos",
    icon: Info,
    description: "Extra photos mixed alongside Team photos on the About page.",
    hint: "Mixed with Team category photos.",
    page: "/about",
  },
  {
    id: "Events",
    label: "Events — Atmosphere",
    icon: Calendar,
    description: "General atmosphere photos for the Events page.",
    hint: "Landscape recommended.",
    page: "/events",
  },
  {
    id: "Other",
    label: "Other / Archive",
    icon: ImageIcon,
    description: "Stored but not shown on any specific page.",
    hint: "Archive only.",
    page: null,
  },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

interface EditState {
  id: string;
  caption: string;
  category: SectionId;
}

interface ConfirmDelete {
  id: string;
  title: string;
}

export default function AdminGallery() {
  const [photos, setPhotos]             = useState<GalleryPhoto[]>([]);
  const [loading, setLoading]           = useState(true);
  const [activeSection, setActiveSection] = useState<SectionId>("Home");
  const [uploading, setUploading]       = useState(false);
  const [dragging, setDragging]         = useState(false);
  const [editState, setEditState]       = useState<EditState | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDelete | null>(null);
  const [saving, setSaving]             = useState(false);
  const [lightbox, setLightbox]         = useState<GalleryPhoto | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((d) => { setPhotos(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  /* ── Upload ── */
  const uploadFile = async (file: File, category: string): Promise<GalleryPhoto | null> => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "uploads/gallery");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const { url, error } = await res.json();
    if (!url || error) return null;
    const saveRes = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        caption: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        category,
      }),
    });
    return saveRes.ok ? saveRes.json() : null;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const fileArr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const added: GalleryPhoto[] = [];
    for (const file of fileArr) {
      setUploadProgress((p) => [...p, file.name]);
      const photo = await uploadFile(file, activeSection);
      if (photo) added.push(photo);
      setUploadProgress((p) => p.filter((n) => n !== file.name));
    }
    setPhotos((prev) => [...added, ...prev]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ── Delete ── */
  const deletePhoto = async (id: string) => {
    await fetch("/api/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    setConfirmDelete(null);
    if (lightbox?.id === id) setLightbox(null);
  };

  /* ── Edit / Save ── */
  const openEdit = (photo: GalleryPhoto) => {
    setEditState({ id: photo.id, caption: photo.caption, category: photo.category as SectionId });
  };

  const saveEdit = async () => {
    if (!editState) return;
    setSaving(true);
    const res = await fetch("/api/gallery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editState.id, caption: editState.caption, category: editState.category }),
    });
    if (res.ok) {
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === editState.id
            ? { ...p, caption: editState.caption, category: editState.category }
            : p
        )
      );
    }
    setSaving(false);
    setEditState(null);
  };

  const section        = SECTIONS.find((s) => s.id === activeSection)!;
  const sectionPhotos  = photos.filter((p) => p.category === activeSection);
  const countOf        = (id: string) => photos.filter((p) => p.category === id).length;

  return (
    <>
      <AdminHeader
        title="Site Gallery"
        subtitle={`${photos.length} photo${photos.length !== 1 ? "s" : ""} across all sections`}
      />

      <div className="flex h-[calc(100vh-64px)]">

        {/* ── Sidebar ── */}
        <div className="w-56 shrink-0 border-r border-border bg-bg-base overflow-y-auto">
          <div className="p-3 space-y-0.5 pt-4">
            <p className="text-[10px] text-text-dim font-semibold tracking-[0.14em] uppercase px-3 pb-2">
              Sections
            </p>
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                  activeSection === id
                    ? "bg-purple-500/20 text-white border border-purple-500/25"
                    : "text-text-muted hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${activeSection === id ? "text-purple-400" : ""}`} />
                <span className="flex-1 text-xs leading-tight truncate">{label}</span>
                {countOf(id) > 0 && (
                  <span className="text-[10px] bg-white/8 text-text-dim px-1.5 py-0.5 rounded-md shrink-0">
                    {countOf(id)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-6xl space-y-6">

            {/* Section header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-white font-display font-bold text-lg">{section.label}</h2>
                <p className="text-text-muted text-sm mt-0.5">{section.description}</p>
                <p className="text-text-dim text-xs mt-1 italic">{section.hint}</p>
              </div>
              {section.page && (
                <a
                  href={section.page}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 shrink-0 mt-1 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Preview on site
                </a>
              )}
            </div>

            {/* Upload zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all select-none ${
                dragging
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-border hover:border-purple-500/40 hover:bg-white/[0.02]"
              }`}
            >
              <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
                onChange={(e) => handleFiles(e.target.files)} />
              {uploading
                ? <RefreshCw className="w-7 h-7 text-purple-400 animate-spin mx-auto mb-2" />
                : <Upload className="w-7 h-7 text-text-dim mx-auto mb-2" />}
              <p className="text-white font-medium text-sm">
                {uploading
                  ? `Uploading ${uploadProgress.length} file${uploadProgress.length !== 1 ? "s" : ""}…`
                  : "Drop images here or click to upload"}
              </p>
              <p className="text-text-dim text-xs mt-1">
                PNG · JPG · WebP · max 4 MB · multiple files OK
              </p>
              {uploading && uploadProgress.length > 0 && (
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {uploadProgress.map((name) => (
                    <span key={name} className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full truncate max-w-[160px]">
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Grid */}
            {loading ? (
              <div className="flex items-center gap-3 text-text-muted py-16 justify-center">
                <RefreshCw className="w-4 h-4 animate-spin" /> Loading…
              </div>
            ) : sectionPhotos.length === 0 ? (
              <div className="glass glow-border rounded-2xl p-16 text-center">
                <ImageIcon className="w-10 h-10 text-text-dim mx-auto mb-3" />
                <p className="text-text-muted text-sm font-medium">No photos here yet</p>
                <p className="text-text-dim text-xs mt-1">Upload images above — they appear on the site automatically.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence>
                  {sectionPhotos.map((photo, i) => (
                    <motion.div
                      key={photo.id}
                      layout
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.88 }}
                      transition={{ delay: i * 0.02 }}
                      className="group rounded-xl overflow-hidden bg-bg-elevated border border-border hover:border-purple-500/30 transition-all flex flex-col"
                    >
                      {/* Thumbnail */}
                      <div
                        className="relative aspect-[4/3] cursor-zoom-in overflow-hidden"
                        onClick={() => setLightbox(photo)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Footer bar */}
                      <div className="flex items-center gap-1.5 px-2.5 py-2 border-t border-border">
                        <p className="flex-1 text-xs text-text-secondary truncate min-w-0">
                          {photo.caption || <span className="text-text-dim italic">No caption</span>}
                        </p>
                        <button
                          onClick={() => openEdit(photo)}
                          className="p-1.5 rounded-lg text-text-dim hover:text-purple-400 hover:bg-purple-500/10 transition-colors shrink-0"
                          title="Edit"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete({ id: photo.id, title: photo.caption || "this photo" })}
                          className="p-1.5 rounded-lg text-text-dim hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      <AnimatePresence>
        {editState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setEditState(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              className="glass glow-border rounded-2xl p-6 w-full max-w-sm space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-white">Edit Photo</h3>
                <button onClick={() => setEditState(null)} className="p-1.5 text-text-dim hover:text-white rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Preview */}
              <div className="rounded-xl overflow-hidden aspect-video bg-bg-elevated">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photos.find((p) => p.id === editState.id)?.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="text-xs text-text-muted font-medium mb-1.5 block">Caption</label>
                <input
                  autoFocus
                  value={editState.caption}
                  onChange={(e) => setEditState((s) => s && { ...s, caption: e.target.value })}
                  className="w-full bg-bg-dark border border-border rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-purple-500 transition-colors"
                  placeholder="Describe this photo…"
                />
              </div>

              {/* Section */}
              <div>
                <label className="text-xs text-text-muted font-medium mb-1.5 block">
                  <span className="flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3" /> Move to section
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={editState.category}
                    onChange={(e) => setEditState((s) => s && { ...s, category: e.target.value as SectionId })}
                    className="w-full bg-bg-dark border border-border rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-purple-500 transition-colors appearance-none pr-8"
                  >
                    {SECTIONS.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-dim pointer-events-none" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setEditState(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-text-muted hover:text-white text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation ── */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass glow-border rounded-2xl p-6 w-full max-w-sm space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
                  <TriangleAlert className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white">Delete photo?</h3>
                  <p className="text-text-muted text-sm mt-0.5 truncate max-w-[220px]">
                    "{confirmDelete.title}"
                  </p>
                </div>
              </div>
              <p className="text-text-muted text-sm">
                This will permanently remove the photo from the site. This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-text-muted hover:text-white text-sm transition-colors"
                >
                  Keep it
                </button>
                <button
                  onClick={() => deletePhoto(confirmDelete.id)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 text-sm font-medium transition-colors"
                >
                  Delete permanently
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightbox.url}
                alt={lightbox.caption}
                className="w-full max-h-[80vh] object-contain rounded-xl"
              />
              {lightbox.caption && (
                <p className="mt-3 text-center text-sm text-white/70">{lightbox.caption}</p>
              )}
              {/* Top toolbar */}
              <div className="absolute -top-12 left-0 right-0 flex items-center justify-between">
                <button
                  onClick={() => {
                    setConfirmDelete({ id: lightbox.id, title: lightbox.caption || "this photo" });
                    setLightbox(null);
                  }}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 p-2 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
                <button
                  onClick={() => setLightbox(null)}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
