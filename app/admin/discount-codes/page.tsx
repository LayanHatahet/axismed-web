"use client";

import { useEffect, useState } from "react";
import type { DiscountCode, Course } from "@/lib/types";
import { Plus, Trash2, Tag, Pencil, X } from "lucide-react";

type Draft = Omit<DiscountCode, "id" | "createdAt"> & { id?: string };

const EMPTY: Draft = {
  code: "",
  label: "",
  type: "fixed_price",
  value: 0,
  courseId: "",
  active: true,
};

export default function DiscountCodesAdmin() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [c, co] = await Promise.all([
        fetch("/api/admin/discount-codes"),
        fetch("/api/courses"),
      ]);
      setCodes(c.ok ? await c.json() : []);
      setCourses(co.ok ? await co.json() : []);
    } catch {
      /* noop */
    }
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!draft || !draft.code.trim()) return;
    setSaving(true);
    const isEdit = Boolean(draft.id);
    const url = isEdit ? `/api/admin/discount-codes/${draft.id}` : "/api/admin/discount-codes";
    await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setSaving(false);
    setDraft(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this code?")) return;
    await fetch(`/api/admin/discount-codes/${id}`, { method: "DELETE" });
    load();
  }

  async function toggleActive(c: DiscountCode) {
    await fetch(`/api/admin/discount-codes/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    load();
  }

  const courseName = (id?: string) =>
    !id || id === "all" ? "All courses" : courses.find((c) => c.id === id)?.title ?? id;

  const inputCls =
    "w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-lg px-3 py-2 text-sm text-white placeholder:text-text-dim outline-none";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-purple-400" /> Discount Codes
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Private codes customers enter at checkout — never shown on the public site.
          </p>
        </div>
        {!draft && (
          <button
            onClick={() => setDraft({ ...EMPTY })}
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shrink-0"
          >
            <Plus className="w-4 h-4" /> New code
          </button>
        )}
      </div>

      {/* Editor */}
      {draft && (
        <div className="glass glow-border rounded-2xl p-5 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">{draft.id ? "Edit code" : "New code"}</h2>
            <button onClick={() => setDraft(null)} className="text-text-dim hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-muted mb-1">Code</label>
              <input
                value={draft.code}
                onChange={(e) => setDraft({ ...draft, code: e.target.value })}
                placeholder="DrAM2026"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Label (internal note)</label>
              <input
                value={draft.label ?? ""}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                placeholder="Dr. AM referral"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Type</label>
              <select
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value as DiscountCode["type"] })}
                className={inputCls}
              >
                <option value="fixed_price">Fixed price</option>
                <option value="percent">Percent off</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">
                {draft.type === "percent" ? "Percent off (%)" : "Discounted price (USD)"}
              </label>
              <input
                type="number"
                value={draft.value}
                onChange={(e) => setDraft({ ...draft, value: Number(e.target.value) })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Applies to</label>
              <select
                value={draft.courseId ?? ""}
                onChange={(e) => setDraft({ ...draft, courseId: e.target.value })}
                className={inputCls}
              >
                <option value="">All courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 mt-6 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
              />
              Active
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={saving || !draft.code.trim()}
              className="bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-xl"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={() => setDraft(null)} className="text-text-muted hover:text-white text-sm px-4 py-2">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="text-text-muted text-sm">Loading…</p>
      ) : codes.length === 0 ? (
        <p className="text-text-muted text-sm">No codes yet. Create one with “New code”.</p>
      ) : (
        <div className="space-y-2">
          {codes.map((c) => (
            <div
              key={c.id}
              className="glass rounded-xl px-4 py-3 flex items-center gap-4 flex-wrap"
            >
              <div className="flex-1 min-w-[140px]">
                <div className="text-white font-semibold">{c.code}</div>
                <div className="text-text-dim text-xs">
                  {c.label || "—"} · {courseName(c.courseId)}
                </div>
              </div>
              <div className="text-sm text-text-secondary whitespace-nowrap">
                {c.type === "percent" ? `${c.value}% off` : `→ $${c.value.toLocaleString()}`}
              </div>
              <button
                onClick={() => toggleActive(c)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  c.active
                    ? "border-green-400 text-green-600 bg-green-50"
                    : "border-border text-text-dim"
                }`}
              >
                {c.active ? "Active" : "Inactive"}
              </button>
              <button
                onClick={() => setDraft({ ...c })}
                className="text-text-dim hover:text-purple-400"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => remove(c.id)}
                className="text-text-dim hover:text-red-400"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
