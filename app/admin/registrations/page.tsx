"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Download, RefreshCw, X, Trash2,
  CheckCircle, Clock, XCircle, RotateCcw,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import type { Registration } from "@/lib/types";

const STATUS_VARIANT: Record<string, "green" | "orange" | "gray"> = {
  paid: "green", pending: "orange", refunded: "gray", cancelled: "gray",
};

const STATUS_OPTIONS = ["pending", "paid", "refunded", "cancelled"] as const;
type Status = Registration["paymentStatus"];

function StatusIcon({ status }: { status: Status }) {
  if (status === "paid")      return <CheckCircle className="w-3.5 h-3.5 text-green-400" />;
  if (status === "pending")   return <Clock       className="w-3.5 h-3.5 text-orange-400" />;
  if (status === "refunded")  return <RotateCcw   className="w-3.5 h-3.5 text-text-muted" />;
  return <XCircle className="w-3.5 h-3.5 text-text-dim" />;
}

function DetailModal({ reg, onClose, onStatusChange, onDelete, onNotesChange }: {
  reg: Registration;
  onClose: () => void;
  onStatusChange: (id: string, status: Status) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onNotesChange: (id: string, notes: string) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notes, setNotes] = useState(reg.notes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  const changeStatus = async (status: Status) => {
    setSaving(true);
    await onStatusChange(reg.id, status);
    setSaving(false);
    onClose();
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    await onNotesChange(reg.id, notes);
    setSavingNotes(false);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 1500);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this registration permanently?")) return;
    setDeleting(true);
    await onDelete(reg.id);
    setDeleting(false);
    onClose();
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
        className="glass glow-border rounded-2xl p-8 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-bold text-white">Registration Details</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-text-dim hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {[
            ["Name",        `${reg.firstName} ${reg.lastName}`],
            ["Email",       reg.email],
            ["Phone",       reg.phone],
            ["Specialty",   reg.specialty],
            ["Institution", reg.institution],
            ["Course",      reg.courseName],
            ["Amount",      `${reg.currency} ${reg.amount.toLocaleString()}`],
            ["Registered",  new Date(reg.registeredAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-3">
              <span className="text-xs text-text-dim w-24 shrink-0 mt-0.5">{label}</span>
              <span className="text-sm text-white">{value || "—"}</span>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <p className="text-xs text-text-dim mb-2">Notes</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Internal notes about this registration…"
            className="w-full bg-bg-elevated border border-border focus:border-purple-500/70 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-text-dim outline-none transition-colors resize-none"
          />
          <button
            onClick={saveNotes}
            disabled={savingNotes || notes === (reg.notes ?? "")}
            className="mt-2 text-xs text-purple-400 hover:text-purple-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {notesSaved ? "Saved!" : savingNotes ? "Saving…" : "Save Notes"}
          </button>
        </div>

        <div className="mb-6">
          <p className="text-xs text-text-dim mb-2">Update Payment Status</p>
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => changeStatus(s)}
                disabled={saving || reg.paymentStatus === s}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all disabled:opacity-50 ${
                  reg.paymentStatus === s
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "glass text-text-muted hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm transition-all disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          {deleting ? "Deleting…" : "Delete Registration"}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | Status>("all");
  const [selected, setSelected] = useState<Registration | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/registrations")
      .then((r) => r.json())
      .then((d) => { setRegistrations(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const updateStatus = async (id: string, paymentStatus: Status) => {
    await fetch(`/api/registrations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus }),
    });
    setRegistrations((prev) => prev.map((r) => r.id === id ? { ...r, paymentStatus } : r));
  };

  const deleteReg = async (id: string) => {
    await fetch(`/api/registrations/${id}`, { method: "DELETE" });
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
  };

  const updateNotes = async (id: string, notes: string) => {
    await fetch(`/api/registrations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    setRegistrations((prev) => prev.map((r) => r.id === id ? { ...r, notes } : r));
  };

  const exportCSV = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Course", "Specialty", "Amount", "Currency", "Status", "Date"];
    const rows = registrations.map((r) => [
      r.id, `${r.firstName} ${r.lastName}`, r.email, r.phone,
      r.courseName, r.specialty, r.amount, r.currency,
      r.paymentStatus, r.registeredAt,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "registrations.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = registrations.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q || [r.firstName, r.lastName, r.email, r.courseName, r.id]
      .some((v) => v?.toLowerCase().includes(q));
    const matchStatus = filterStatus === "all" || r.paymentStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total:   registrations.length,
    paid:    registrations.filter((r) => r.paymentStatus === "paid").length,
    pending: registrations.filter((r) => r.paymentStatus === "pending").length,
    revenue: registrations.filter((r) => r.paymentStatus === "paid").reduce((s, r) => s + r.amount, 0),
  };

  return (
    <>
      <AdminHeader
        title="Registrations"
        subtitle={`${stats.total} total registration${stats.total !== 1 ? "s" : ""}`}
      />

      <div className="p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total",   value: stats.total,                    color: "text-white" },
            { label: "Paid",    value: stats.paid,                     color: "text-green-400" },
            { label: "Pending", value: stats.pending,                  color: "text-orange-400" },
            { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, color: "text-purple-400" },
          ].map((s) => (
            <div key={s.label} className="glass glow-border rounded-xl p-5 text-center">
              <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-text-muted text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, course…"
              className="w-full bg-bg-elevated border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-text-dim outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          <div className="flex gap-1.5 p-1 glass rounded-xl">
            {(["all", ...STATUS_OPTIONS] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  filterStatus === s
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "text-text-muted hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-3 glass rounded-xl text-sm text-text-muted hover:text-white transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-3 glass glow-border rounded-xl text-sm text-text-secondary hover:text-white transition-all"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center gap-3 text-text-muted py-12">
            <RefreshCw className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass glow-border rounded-2xl p-16 text-center">
            <p className="text-text-muted text-sm">
              {registrations.length === 0 ? "No registrations yet." : "No results match your search."}
            </p>
          </div>
        ) : (
          <div className="glass glow-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-bg-elevated/50">
                    {["Participant", "Course", "Amount", "Date", "Status", ""].map((h) => (
                      <th key={h} className="text-left text-xs text-text-dim font-semibold px-5 py-3.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <AnimatePresence>
                    {filtered.map((r) => (
                      <motion.tr
                        key={r.id}
                        layout
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-white/[0.02] group transition-colors cursor-pointer"
                        onClick={() => setSelected(r)}
                      >
                        <td className="px-5 py-4">
                          <div className="text-sm text-white font-medium">{r.firstName} {r.lastName}</div>
                          <div className="text-xs text-text-muted">{r.email}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs text-text-secondary line-clamp-1 max-w-[180px] block">{r.courseName}</span>
                        </td>
                        <td className="px-5 py-4 text-sm font-medium text-white">
                          {r.currency} {r.amount.toLocaleString()}
                        </td>
                        <td className="px-5 py-4 text-xs text-text-muted whitespace-nowrap">
                          {new Date(r.registeredAt).toLocaleDateString("en-GB", {
                            day: "2-digit", month: "short", year: "numeric",
                          })}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <StatusIcon status={r.paymentStatus} />
                            <Badge variant={STATUS_VARIANT[r.paymentStatus] ?? "gray"} className="capitalize text-[10px]">
                              {r.paymentStatus}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="opacity-0 group-hover:opacity-100 text-xs text-text-dim transition-opacity">
                            View →
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <DetailModal
            reg={selected}
            onClose={() => setSelected(null)}
            onStatusChange={updateStatus}
            onDelete={deleteReg}
            onNotesChange={updateNotes}
          />
        )}
      </AnimatePresence>
    </>
  );
}
