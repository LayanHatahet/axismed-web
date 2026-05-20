"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit, Trash2, X, Save, RefreshCw, ExternalLink,
  Star, StarOff, Upload, ImageIcon,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import type { Partner, PartnerCategory } from "@/lib/types";

const CATEGORIES: PartnerCategory[] = [
  "Industry Partner",
  "Healthcare Institution",
  "Scientific Collaborator",
  "Training Facility",
  "Media Partner",
];

const EMPTY: Omit<Partner, "id"> = {
  name: "", logo: "", category: "Industry Partner",
  website: "", featured: false, description: "",
};

function Modal({
  partner, onClose, onSave,
}: {
  partner: Partial<Partner>;
  onClose: () => void;
  onSave: (data: Omit<Partner, "id">) => Promise<void>;
}) {
  const [form, setForm] = useState<Omit<Partner, "id">>({
    name: partner.name ?? "",
    logo: partner.logo ?? "",
    category: partner.category ?? "Industry Partner",
    website: partner.website ?? "",
    featured: partner.featured ?? false,
    description: partner.description ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "uploads/partners");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) set("logo", data.url);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        className="glass glow-border rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-bold text-white">
            {partner.id ? "Edit Partner" : "Add Partner"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-text-dim hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Partner Name *</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Stryker"
              className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Partner Logo</label>

            {/* Upload zone */}
            <div
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-border hover:border-purple-500/50 rounded-xl p-5 flex flex-col items-center justify-center gap-2 transition-colors bg-bg-elevated hover:bg-white/[0.03]"
            >
              {uploading ? (
                <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
              ) : form.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.logo} alt="Logo preview" className="h-14 object-contain" />
              ) : (
                <>
                  <ImageIcon className="w-7 h-7 text-text-dim" />
                  <span className="text-xs text-text-muted">Click to upload logo</span>
                </>
              )}
              <span className="text-[10px] text-text-dim mt-1">
                {uploading ? "Uploading…" : "PNG, JPG, SVG, WebP · max 4 MB"}
              </span>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Or paste a URL */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] text-text-dim">or paste URL</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <input
              value={form.logo}
              onChange={(e) => set("logo", e.target.value)}
              placeholder="https://example.com/logo.png"
              className="mt-2 w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-text-dim outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value as PartnerCategory)}
              className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Website</label>
            <input
              value={form.website ?? ""}
              onChange={(e) => set("website", e.target.value)}
              placeholder="https://partner.com"
              className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Description</label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors resize-none"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="w-4 h-4 accent-purple-500"
            />
            <span className="text-sm text-text-secondary">Featured partner (shown prominently on site)</span>
          </label>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleSave}
            disabled={saving || !form.name.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving…" : "Save Partner"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 glass rounded-xl text-text-muted hover:text-white transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Partner> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/partners")
      .then((r) => r.json())
      .then((d) => { setPartners(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSave = async (data: Omit<Partner, "id">) => {
    if (modal?.id) {
      await fetch(`/api/partners/${modal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setModal(null);
    load();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await fetch(`/api/partners/${id}`, { method: "DELETE" });
    setPartners((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  };

  const toggleFeatured = async (p: Partner) => {
    await fetch(`/api/partners/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, featured: !p.featured }),
    });
    setPartners((prev) => prev.map((x) => x.id === p.id ? { ...x, featured: !x.featured } : x));
  };

  return (
    <>
      <AdminHeader
        title="Partners"
        subtitle={`${partners.length} partner${partners.length !== 1 ? "s" : ""}`}
      />

      <div className="p-6">
        <div className="flex justify-end mb-5">
          <button
            onClick={() => setModal({ ...EMPTY })}
            className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-semibold px-5 py-3 rounded-xl transition-all shadow-[0_0_16px_rgba(164,158,207,0.3)]"
          >
            <Plus className="w-4 h-4" /> Add Partner
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-text-muted py-12">
            <RefreshCw className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : partners.length === 0 ? (
          <div className="glass glow-border rounded-2xl p-16 text-center">
            <p className="text-text-muted text-sm">No partners yet. Add your first partner above.</p>
          </div>
        ) : (
          <div className="glass glow-border rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-bg-elevated/50">
                  {["Partner", "Category", "Website", "Featured", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs text-text-dim font-semibold px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {partners.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] group transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {p.logo && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.logo} alt={p.name} className="h-8 w-12 object-contain opacity-80" />
                        )}
                        <div>
                          <div className="text-sm text-white font-medium">{p.name}</div>
                          {p.description && (
                            <div className="text-xs text-text-dim line-clamp-1 max-w-[200px]">{p.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="purple" className="text-[10px]">{p.category}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      {p.website ? (
                        <a
                          href={p.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Visit
                        </a>
                      ) : <span className="text-text-dim text-xs">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleFeatured(p)} className="transition-colors">
                        {p.featured
                          ? <Star className="w-4 h-4 text-yellow-400 fill-yellow-400/40" />
                          : <StarOff className="w-4 h-4 text-text-dim hover:text-text-muted" />}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setModal(p)}
                          className="p-1.5 rounded-lg text-text-dim hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="p-1.5 rounded-lg text-text-dim hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <Modal
            partner={modal}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </>
  );
}
