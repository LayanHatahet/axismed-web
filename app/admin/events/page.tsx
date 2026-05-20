"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Plus, Edit, Trash2, X, Save, Loader2, MapPin, Users, Eye, Upload, Image as ImageIcon } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import type { Event } from "@/lib/types";

const EMPTY: Omit<Event, "id"> = {
  slug: "",
  title: "",
  type: "conference",
  date: "",
  endDate: "",
  location: "",
  description: "",
  image: "",
  capacity: 200,
  registrations: 0,
  status: "upcoming",
  featured: false,
};

function genId() { return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }
function genSlug(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Event, "id">>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [imgUploading, setImgUploading] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => { setEvents(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "uploads/events");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setForm((f) => ({ ...f, image: data.url }));
    setImgUploading(false);
    if (imgRef.current) imgRef.current.value = "";
  }

  function openCreate() {
    setForm({ ...EMPTY });
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(ev: Event) {
    const { id, ...rest } = ev;
    setForm(rest);
    setEditingId(id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    const payload: Event = {
      id: editingId ?? genId(),
      ...form,
      slug: form.slug || genSlug(form.title),
    };
    if (editingId) {
      await fetch(`/api/events/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEvents((prev) => prev.map((e) => e.id === editingId ? payload : e));
    } else {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEvents((prev) => [payload, ...prev]);
    }
    setSaving(false);
    setShowForm(false);
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setDeleteId(null);
  }

  const statusColors: Record<Event["status"], string> = {
    upcoming: "bg-blue-500/15 text-blue-300 border-blue-500/25",
    open:     "bg-green-500/15 text-green-300 border-green-500/25",
    sold_out: "bg-red-500/15 text-red-300 border-red-500/25",
    completed:"bg-gray-500/15 text-gray-300 border-gray-500/25",
  };

  return (
    <>
      <AdminHeader
        title="Events"
        subtitle={`${events.length} event${events.length !== 1 ? "s" : ""}`}
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-[0_0_16px_rgba(164,158,207,0.4)]"
          >
            <Plus className="w-4 h-4" /> Create Event
          </button>
        }
      />

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass glow-border rounded-2xl p-14 text-center"
          >
            <Calendar className="w-12 h-12 text-purple-400/50 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-white mb-2">No Events Yet</h3>
            <p className="text-text-muted mb-6">Create your first scientific event or conference.</p>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-semibold px-6 py-3 rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" /> Create Event
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {events.map((ev, i) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass glow-border rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all group"
              >
                {/* Image area */}
                <div className="relative h-36 bg-bg-elevated flex items-center justify-center overflow-hidden">
                  {ev.image
                    ? <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" /> // eslint-disable-line @next/next/no-img-element
                    : <Calendar className="w-10 h-10 text-purple-400/30" />}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[ev.status]}`}>
                      {ev.status.replace("_", " ")}
                    </span>
                  </div>
                  {ev.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-purple-500/15 text-purple-300 border-purple-500/25">Featured</span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="text-purple-400 text-xs font-medium uppercase tracking-wider mb-2 capitalize">{ev.type}</div>
                  <h3 className="font-display font-bold text-white text-base mb-3 line-clamp-2">{ev.title}</h3>
                  <div className="space-y-1.5 mb-5">
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{ev.date}{ev.endDate ? ` – ${ev.endDate}` : ""}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{ev.registrations}/{ev.capacity} registered</span>
                    </div>
                  </div>

                  {/* Capacity bar */}
                  <div className="mb-4">
                    <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all"
                        style={{ width: `${Math.min((ev.registrations / ev.capacity) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(ev)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-medium transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(ev.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-text-dim hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
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
              className="w-full max-w-lg h-full bg-bg-surface border-l border-border flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-display font-bold text-white text-lg">
                  {editingId ? "Edit Event" : "Create Event"}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Event Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: genSlug(e.target.value) }))}
                    placeholder="International Surgical Innovation Congress"
                    className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors"
                  />
                </div>

                {/* Type + Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-1.5">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Event["type"] }))}
                      className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
                    >
                      {["conference", "workshop", "webinar", "symposium"].map((t) => (
                        <option key={t} value={t} className="bg-bg-elevated capitalize">{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1.5">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Event["status"] }))}
                      className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
                    >
                      {["upcoming", "open", "sold_out", "completed"].map((s) => (
                        <option key={s} value={s} className="bg-bg-elevated">{s.replace("_", " ")}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-1.5">Start Date *</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                      className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1.5">End Date</label>
                    <input
                      type="date"
                      value={form.endDate ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                      className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Location</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="Dubai Healthcare City, Dubai, UAE"
                    className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors"
                  />
                </div>

                {/* Capacity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-1.5">Capacity</label>
                    <input
                      type="number"
                      value={form.capacity}
                      onChange={(e) => setForm((f) => ({ ...f, capacity: Number(e.target.value) }))}
                      className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1.5">Current Registrations</label>
                    <input
                      type="number"
                      value={form.registrations}
                      onChange={(e) => setForm((f) => ({ ...f, registrations: Number(e.target.value) }))}
                      className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={4}
                    placeholder="A brief overview of the event..."
                    className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors resize-none"
                  />
                </div>

                {/* Cover image upload */}
                <div>
                  <label className="block text-sm text-text-secondary mb-1.5">Cover Image</label>
                  <div
                    onClick={() => imgRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-border hover:border-purple-500/50 rounded-xl overflow-hidden transition-colors"
                  >
                    {form.image ? (
                      <div className="relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={form.image} alt="cover" className="w-full h-36 object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Upload className="w-5 h-5 text-white" />
                          <span className="text-white text-sm">Replace photo</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-24 flex flex-col items-center justify-center gap-2 bg-bg-elevated">
                        {imgUploading
                          ? <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                          : <><ImageIcon className="w-6 h-6 text-text-dim" /><span className="text-xs text-text-muted">Click to upload cover photo</span></>}
                      </div>
                    )}
                    {imgUploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                      </div>
                    )}
                  </div>
                  <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>

                {/* Featured toggle */}
                <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-bg-elevated border border-border">
                  <div>
                    <div className="text-white text-sm font-medium">Featured Event</div>
                    <div className="text-text-muted text-xs">Show on homepage</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                    className={`relative w-11 h-6 rounded-full transition-all ${form.featured ? "bg-purple-500" : "bg-white/10"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.featured ? "left-5.5 left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-border flex gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl border border-border text-text-muted hover:text-white hover:border-border-strong transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.title.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-white font-semibold transition-all shadow-[0_0_16px_rgba(164,158,207,0.4)] text-sm"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Create Event"}
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
              <h3 className="font-display font-bold text-white text-xl mb-2">Delete Event?</h3>
              <p className="text-text-muted text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-xl border border-border text-text-muted hover:text-white transition-all text-sm font-medium">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 rounded-xl bg-red-500/80 hover:bg-red-500 text-white font-semibold transition-all text-sm">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
