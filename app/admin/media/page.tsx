"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Search, Grid, List, Trash2, Edit, Play, Mic, Image as ImageIcon,
  Plus, X, Save, Loader2, Tag, Calendar,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { formatDateShort } from "@/lib/utils/formatDate";
import type { MediaItem } from "@/lib/types";

const EMPTY: Omit<MediaItem, "id"> = {
  type: "video",
  title: "",
  description: "",
  thumbnail: "",
  url: "",
  duration: "",
  date: new Date().toISOString().split("T")[0],
  category: "",
  featured: false,
  tags: [],
};

function genId() { return `media-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

const typeIcon = { video: Play, podcast: Mic, interview: Mic, image: ImageIcon } as const;

export default function AdminMedia() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [dragging, setDragging] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<MediaItem, "id">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [thumbUploading, setThumbUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/media")
      .then((r) => r.json())
      .then((data) => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = items.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase()) ||
      m.type.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDropUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: MediaItem[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "uploads/media");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        const item: MediaItem = {
          id: genId(),
          type: "image",
          title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
          description: "",
          thumbnail: data.url,
          url: data.url,
          date: new Date().toISOString().split("T")[0],
          category: "",
          featured: false,
          tags: [],
        };
        await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        uploaded.push(item);
      }
    }
    setItems((prev) => [...uploaded, ...prev]);
    setUploading(false);
  }

  async function handleThumbUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "uploads/media");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setForm((f) => ({ ...f, thumbnail: data.url }));
    setThumbUploading(false);
    if (thumbRef.current) thumbRef.current.value = "";
  }

  function openCreate() {
    setForm({ ...EMPTY });
    setTagsInput("");
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(item: MediaItem) {
    const { id, ...rest } = item;
    setForm(rest);
    setTagsInput(rest.tags.join(", "));
    setEditingId(id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    const payload: MediaItem = {
      id: editingId ?? genId(),
      ...form,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    };
    if (editingId) {
      await fetch(`/api/media/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setItems((prev) => prev.map((m) => m.id === editingId ? payload : m));
    } else {
      await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setItems((prev) => [payload, ...prev]);
    }
    setSaving(false);
    setShowForm(false);
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((m) => m.id !== id));
    setDeleteId(null);
  }

  return (
    <>
      <AdminHeader
        title="Media Library"
        subtitle={`${items.length} item${items.length !== 1 ? "s" : ""}`}
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-[0_0_16px_rgba(164,158,207,0.4)]"
          >
            <Plus className="w-4 h-4" /> Add Media
          </button>
        }
      />

      <div className="p-6 space-y-5">
        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleDropUpload(e.dataTransfer.files); }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragging
              ? "border-purple-500 bg-purple-500/8"
              : "border-border hover:border-purple-500/40 hover:bg-purple-500/3"
          }`}
        >
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleDropUpload(e.target.files)} />
          {uploading
            ? <Loader2 className="w-7 h-7 text-purple-400 animate-spin mx-auto mb-2" />
            : <Upload className="w-7 h-7 text-text-muted mx-auto mb-2" />}
          <p className="text-white font-medium text-sm">
            {uploading ? "Uploading…" : "Drop images here or click to upload"}
          </p>
          <p className="text-text-muted text-xs mt-1">PNG, JPG, WebP · max 4 MB each · auto-added to library</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media..."
              className="w-full bg-bg-elevated border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-text-dim outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView("grid")}
              className={`p-3 rounded-xl border transition-all ${view === "grid" ? "bg-purple-500/15 border-purple-500/30 text-purple-400" : "border-border text-text-muted hover:text-white"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-3 rounded-xl border transition-all ${view === "list" ? "bg-purple-500/15 border-purple-500/30 text-purple-400" : "border-border text-text-muted hover:text-white"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-7 h-7 text-purple-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass glow-border rounded-2xl p-12 text-center">
            <ImageIcon className="w-10 h-10 text-purple-400/40 mx-auto mb-3" />
            <p className="text-text-muted text-sm">{search ? "No results found." : "No media yet. Add your first item."}</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((item, i) => {
              const Icon = typeIcon[item.type] ?? ImageIcon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="group relative glass glow-border rounded-xl overflow-hidden hover:border-purple-500/30 transition-all"
                >
                  <div className="h-32 bg-bg-elevated flex items-center justify-center overflow-hidden">
                    {item.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-500/15 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-purple-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-white font-medium truncate">{item.title}</p>
                    <p className="text-xs text-text-muted mt-0.5 capitalize">{item.type} · {formatDateShort(item.date)}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg bg-bg-dark/80 text-text-muted hover:text-purple-400 transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 rounded-lg bg-bg-dark/80 text-text-muted hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="glass glow-border rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-bg-elevated/50">
                  {["Media", "Type", "Category", "Date", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs text-text-dim font-semibold px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item) => {
                  const Icon = typeIcon[item.type] ?? ImageIcon;
                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] group transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-purple-400" />
                          </div>
                          <span className="text-sm text-white font-medium line-clamp-1">{item.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4"><span className="text-xs text-text-muted capitalize">{item.type}</span></td>
                      <td className="px-5 py-4"><span className="text-xs text-text-muted">{item.category}</span></td>
                      <td className="px-5 py-4"><span className="text-xs text-text-muted">{formatDateShort(item.date)}</span></td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-1.5 rounded-lg text-text-dim hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteId(item.id)}
                            className="p-1.5 rounded-lg text-text-dim hover:text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Create / Edit form modal ─────────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-end bg-bg-base/70 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="w-full max-w-lg h-full bg-bg-surface border-l border-border flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-display font-bold text-white text-lg">
                  {editingId ? "Edit Media Item" : "Add Media Item"}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Advanced Laparoscopic Techniques — Episode 3"
                    className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-1.5">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as MediaItem["type"] }))}
                      className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
                    >
                      {["video", "podcast", "interview", "image"].map((t) => (
                        <option key={t} value={t} className="bg-bg-elevated capitalize">{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1.5">Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                      className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Category</label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    placeholder="Surgical Education"
                    className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    placeholder="Brief description of this media item..."
                    className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Media URL</label>
                  <input
                    value={form.url ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Thumbnail</label>
                  <div
                    onClick={() => thumbRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-border hover:border-purple-500/50 rounded-xl overflow-hidden transition-colors"
                  >
                    {form.thumbnail ? (
                      <div className="relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={form.thumbnail} alt="thumb" className="w-full h-28 object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Upload className="w-4 h-4 text-white" />
                          <span className="text-white text-xs">Replace</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-20 flex flex-col items-center justify-center gap-1.5 bg-bg-elevated">
                        {thumbUploading
                          ? <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                          : <><ImageIcon className="w-5 h-5 text-text-dim" /><span className="text-xs text-text-muted">Upload thumbnail</span></>}
                      </div>
                    )}
                    {thumbUploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                      </div>
                    )}
                  </div>
                  <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={handleThumbUpload} />
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Duration</label>
                  <input
                    value={form.duration ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                    placeholder="42:18"
                    className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Tags (comma-separated)</label>
                  <input
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="surgery, education, innovation"
                    className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-bg-elevated border border-border">
                  <div>
                    <div className="text-white text-sm font-medium">Featured</div>
                    <div className="text-text-muted text-xs">Show in homepage media section</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                    className={`relative w-11 h-6 rounded-full transition-all ${form.featured ? "bg-purple-500" : "bg-white/10"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.featured ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-border flex gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl border border-border text-text-muted hover:text-white transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.title.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-white font-semibold transition-all shadow-[0_0_16px_rgba(164,158,207,0.4)] text-sm"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Add Media"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete confirm ───────────────────────────────────────── */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/80 backdrop-blur-sm px-4"
            onClick={(e) => e.target === e.currentTarget && setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="glass glow-border rounded-2xl p-8 max-w-sm w-full text-center"
            >
              <Trash2 className="w-10 h-10 text-red-400/60 mx-auto mb-4" />
              <h3 className="font-display font-bold text-white text-xl mb-2">Delete Media Item?</h3>
              <p className="text-text-muted text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-xl border border-border text-text-muted hover:text-white transition-all text-sm">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 rounded-xl bg-red-500/80 hover:bg-red-500 text-white font-semibold transition-all text-sm">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
