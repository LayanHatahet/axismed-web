"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, Building2, MessageSquare, BookOpen, Handshake, Video,
  Trash2, Eye, CheckCheck, Archive, RefreshCw, Loader2, X, Filter,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import type { ContactSubmission } from "@/lib/types";

const typeConfig = {
  general:      { icon: MessageSquare, label: "General",      color: "bg-blue-500/15 text-blue-300 border-blue-500/25" },
  registration: { icon: BookOpen,       label: "Registration", color: "bg-green-500/15 text-green-300 border-green-500/25" },
  partnership:  { icon: Handshake,      label: "Partnership",  color: "bg-purple-500/15 text-purple-300 border-purple-500/25" },
  media:        { icon: Video,          label: "Media",        color: "bg-orange-500/15 text-orange-300 border-orange-500/25" },
};

const statusConfig = {
  new:      { label: "New",      color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  read:     { label: "Read",     color: "bg-blue-500/15 text-blue-300 border-blue-500/25" },
  replied:  { label: "Replied",  color: "bg-green-500/15 text-green-300 border-green-500/25" },
  archived: { label: "Archived", color: "bg-gray-500/15 text-gray-400 border-gray-500/25" },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)    return "Just now";
  if (mins < 60)   return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  return `${days}d ago`;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/contact");
    const data = await r.json();
    setContacts(data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: ContactSubmission["status"]) {
    await fetch(`/api/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setContacts((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
    if (selected?.id === id) setSelected((s) => s ? { ...s, status } : s);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    setContacts((prev) => prev.filter((c) => c.id !== id));
    if (selected?.id === id) setSelected(null);
    setDeleteId(null);
  }

  function openDetail(c: ContactSubmission) {
    setSelected(c);
    if (c.status === "new") updateStatus(c.id, "read");
  }

  const filtered = contacts.filter((c) => {
    if (filterType !== "all" && c.type !== filterType) return false;
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    return true;
  });

  const newCount = contacts.filter((c) => c.status === "new").length;

  return (
    <>
      <AdminHeader
        title="Contact Submissions"
        subtitle={`${contacts.length} total${newCount > 0 ? ` · ${newCount} new` : ""}`}
        action={
          <button
            onClick={load}
            className="flex items-center gap-2 border border-border text-text-muted hover:text-white hover:border-purple-500/40 px-4 py-2.5 rounded-xl transition-all text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        }
      />

      <div className="p-6 flex gap-6 h-[calc(100vh-64px)] overflow-hidden">
        {/* ── Left: list ───────────────────────────────────────── */}
        <div className={`flex flex-col gap-4 transition-all ${selected ? "w-[380px] shrink-0" : "flex-1"}`}>
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50 transition-colors"
            >
              <option value="all">All Types</option>
              {Object.entries(typeConfig).map(([k, v]) => (
                <option key={k} value={k} className="bg-bg-elevated">{v.label}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50 transition-colors"
            >
              <option value="all">All Status</option>
              {Object.entries(statusConfig).map(([k, v]) => (
                <option key={k} value={k} className="bg-bg-elevated">{v.label}</option>
              ))}
            </select>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Total",    value: contacts.length, color: "text-white" },
              { label: "New",      value: contacts.filter((c) => c.status === "new").length,     color: "text-purple-400" },
              { label: "Replied",  value: contacts.filter((c) => c.status === "replied").length, color: "text-green-400" },
              { label: "Archived", value: contacts.filter((c) => c.status === "archived").length, color: "text-gray-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="glass glow-border rounded-xl p-3 text-center">
                <div className={`font-display text-2xl font-bold ${color}`}>{value}</div>
                <div className="text-text-dim text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-7 h-7 text-purple-400 animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="glass glow-border rounded-2xl p-10 text-center">
                <Mail className="w-10 h-10 text-purple-400/40 mx-auto mb-3" />
                <p className="text-text-muted text-sm">No submissions yet.</p>
                <p className="text-text-dim text-xs mt-1">Contact form submissions will appear here.</p>
              </div>
            ) : (
              filtered.map((c, i) => {
                const T = typeConfig[c.type] ?? typeConfig.general;
                const S = statusConfig[c.status] ?? statusConfig.new;
                const isSelected = selected?.id === c.id;
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => openDetail(c)}
                    className={`glass rounded-xl p-4 cursor-pointer transition-all hover:border-purple-500/30 ${
                      isSelected ? "border-purple-500/40 bg-purple-500/8" : "border-border"
                    } ${c.status === "new" ? "border-l-2 border-l-purple-500" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`text-xs font-medium px-2 py-0.5 rounded-full border ${T.color} shrink-0`}>
                          {T.label}
                        </div>
                        <span className="text-white text-sm font-semibold truncate">{c.name}</span>
                        {c.status === "new" && (
                          <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0 animate-pulse" />
                        )}
                      </div>
                      <span className="text-text-dim text-xs shrink-0">{timeAgo(c.submittedAt)}</span>
                    </div>
                    <p className="text-text-muted text-xs truncate mb-1">{c.email}</p>
                    <p className="text-text-secondary text-xs line-clamp-2 leading-relaxed">{c.message}</p>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right: detail pane ──────────────────────────────── */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
              className="flex-1 glass glow-border rounded-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  {(() => {
                    const T = typeConfig[selected.type] ?? typeConfig.general;
                    const Icon = T.icon;
                    return (
                      <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border ${T.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {T.label}
                      </div>
                    );
                  })()}
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusConfig[selected.status]?.color}`}>
                    {statusConfig[selected.status]?.label}
                  </span>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Contact info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Mail,      label: "Email",        value: selected.email,        href: `mailto:${selected.email}` },
                    { icon: Phone,     label: "Phone",        value: selected.phone || "—",  href: selected.phone ? `tel:${selected.phone}` : undefined },
                    { icon: Building2, label: "Organization", value: selected.organization || "—", href: undefined },
                    { icon: MessageSquare, label: "Submitted", value: new Date(selected.submittedAt).toLocaleString(), href: undefined },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/12 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-text-dim text-xs mb-0.5">{label}</div>
                        {href ? (
                          <a href={href} className="text-white text-sm font-medium hover:text-purple-300 transition-colors truncate block">
                            {value}
                          </a>
                        ) : (
                          <div className="text-white text-sm font-medium truncate">{value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Name */}
                <div>
                  <h2 className="font-display text-2xl font-bold text-white mb-1">{selected.name}</h2>
                </div>

                {/* Message */}
                <div className="glass rounded-xl p-5 border border-border">
                  <h4 className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">Message</h4>
                  <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                {/* Quick reply link */}
                <a
                  href={`mailto:${selected.email}?subject=Re: Your AxisMed Inquiry&body=Dear ${selected.name},%0A%0AThank you for reaching out to AxisMed.%0A%0A`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-semibold transition-all shadow-[0_0_20px_rgba(164,158,207,0.35)] text-sm"
                >
                  <Mail className="w-4 h-4" />
                  Reply via Email
                </a>
              </div>

              {/* Actions footer */}
              <div className="px-6 py-4 border-t border-border">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-text-dim text-xs mr-1">Mark as:</span>
                  {(["new", "read", "replied", "archived"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      disabled={selected.status === s}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all capitalize disabled:opacity-40 ${
                        selected.status === s
                          ? statusConfig[s].color
                          : "border-border text-text-muted hover:border-purple-500/30 hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                  <button
                    onClick={() => setDeleteId(selected.id)}
                    className="ml-auto p-2 rounded-lg text-text-dim hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
              <h3 className="font-display font-bold text-white text-xl mb-2">Delete Submission?</h3>
              <p className="text-text-muted text-sm mb-6">This message will be permanently deleted.</p>
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
