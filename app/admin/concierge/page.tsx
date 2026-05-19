"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, MessageSquare, Phone, Zap, Trash2, Save,
  RefreshCw, User, Mail, Stethoscope, Tag, Clock,
  ToggleLeft, ToggleRight, ChevronDown,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import type { ConciergeSettings, ConciergeLead } from "@/lib/types";

const tabs = ["AI Settings", "Leads Inbox"] as const;
type Tab = typeof tabs[number];

const MODELS = [
  { value: "gpt-4o-mini",  label: "GPT-4o Mini  — Fast & affordable (recommended)" },
  { value: "gpt-4o",       label: "GPT-4o        — Most capable" },
  { value: "gpt-3.5-turbo",label: "GPT-3.5 Turbo — Economy" },
];

const INTEREST_COLORS: Record<string, "purple" | "green" | "orange" | "gray"> = {
  courses: "purple", events: "green", media: "orange",
  partners: "purple", registration: "green", general: "gray",
};

function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-text-secondary mb-1">{label}</label>
      {hint && <p className="text-xs text-text-dim mb-2">{hint}</p>}
      {children}
    </div>
  );
}

export default function AdminConcierge() {
  const [activeTab, setActiveTab] = useState<Tab>("AI Settings");
  const [settings, setSettings] = useState<ConciergeSettings | null>(null);
  const [leads, setLeads] = useState<ConciergeLead[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterInterest, setFilterInterest] = useState<string>("all");

  /* ── load settings ── */
  useEffect(() => {
    fetch("/api/concierge-settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(console.error);
  }, []);

  /* ── load leads ── */
  const loadLeads = useCallback(() => {
    setLoadingLeads(true);
    fetch("/api/concierge-leads")
      .then((r) => r.json())
      .then((d) => { setLeads(d); setLoadingLeads(false); })
      .catch(() => setLoadingLeads(false));
  }, []);

  useEffect(() => { if (activeTab === "Leads Inbox") loadLeads(); }, [activeTab, loadLeads]);

  /* ── save settings ── */
  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await fetch("/api/concierge-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  /* ── delete lead ── */
  const deleteLead = async (id: string) => {
    setDeletingId(id);
    await fetch("/api/concierge-leads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setDeletingId(null);
  };

  const patch = (key: keyof ConciergeSettings, value: unknown) =>
    setSettings((prev) => prev ? { ...prev, [key]: value } : prev);

  const filteredLeads = filterInterest === "all"
    ? leads
    : leads.filter((l) => l.interest === filterInterest);

  const interests = ["all", ...Array.from(new Set(leads.map((l) => l.interest).filter(Boolean)))];

  return (
    <>
      <AdminHeader
        title="AI Concierge"
        subtitle="Configure the chat assistant and manage captured leads"
      />

      <div className="p-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 glass rounded-xl mb-8 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab
                  ? "text-white bg-purple-500/20 border border-purple-500/25"
                  : "text-text-muted hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ────── AI SETTINGS ────── */}
        {activeTab === "AI Settings" && (
          <div className="max-w-2xl space-y-6">
            {!settings ? (
              <div className="flex items-center gap-3 text-text-muted py-12">
                <RefreshCw className="w-4 h-4 animate-spin" /> Loading settings…
              </div>
            ) : (
              <>
                {/* Enable / Disable */}
                <div className="glass glow-border rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold mb-0.5">Concierge AI</div>
                      <div className="text-text-muted text-xs">
                        {settings.enabled ? "Live — visitors see the chat widget" : "Disabled — chat widget is hidden"}
                      </div>
                    </div>
                    <button
                      onClick={() => patch("enabled", !settings.enabled)}
                      className="transition-all"
                    >
                      {settings.enabled
                        ? <ToggleRight className="w-10 h-10 text-purple-400" />
                        : <ToggleLeft  className="w-10 h-10 text-text-dim" />}
                    </button>
                  </div>
                </div>

                {/* WhatsApp + Model */}
                <div className="glass glow-border rounded-2xl p-6 space-y-5">
                  <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-400" /> Connection
                  </h3>

                  <FieldRow label="WhatsApp Number" hint="Used for handoff when the AI suggests connecting with the team. Include country code.">
                    <input
                      value={settings.whatsappNumber}
                      onChange={(e) => patch("whatsappNumber", e.target.value)}
                      placeholder="+971501234567"
                      className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
                    />
                  </FieldRow>

                  <FieldRow label="AI Model">
                    <div className="relative">
                      <select
                        value={settings.openaiModel}
                        onChange={(e) => patch("openaiModel", e.target.value)}
                        className="w-full appearance-none bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 pr-10 text-sm text-white outline-none transition-colors"
                      >
                        {MODELS.map((m) => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim pointer-events-none" />
                    </div>
                  </FieldRow>
                </div>

                {/* Greeting */}
                <div className="glass glow-border rounded-2xl p-6 space-y-5">
                  <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-400" /> Greeting Message
                  </h3>
                  <FieldRow label="Opening message" hint="First message the visitor sees when they open the chat.">
                    <textarea
                      value={settings.greeting}
                      onChange={(e) => patch("greeting", e.target.value)}
                      rows={3}
                      className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors resize-none"
                    />
                  </FieldRow>
                </div>

                {/* System Prompt */}
                <div className="glass glow-border rounded-2xl p-6 space-y-5">
                  <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-400" /> System Prompt
                  </h3>
                  <FieldRow label="AI instructions" hint="Full personality, tone, and rules for the AI. Changes take effect immediately.">
                    <textarea
                      value={settings.systemPrompt}
                      onChange={(e) => patch("systemPrompt", e.target.value)}
                      rows={14}
                      className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors resize-y font-mono text-xs leading-relaxed"
                    />
                  </FieldRow>
                </div>

                {/* Lead Collection Toggles */}
                <div className="glass glow-border rounded-2xl p-6 space-y-4">
                  <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" /> Lead Collection
                  </h3>
                  <p className="text-xs text-text-muted">Control what visitor data the AI tries to collect during conversation.</p>
                  {(
                    [
                      { key: "collectName",      label: "Collect Name",     icon: User },
                      { key: "collectEmail",     label: "Collect Email",    icon: Mail },
                      { key: "collectSpecialty", label: "Collect Specialty",icon: Stethoscope },
                    ] as const
                  ).map(({ key, label, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2.5 text-sm text-text-secondary">
                        <Icon className="w-4 h-4 text-text-dim" /> {label}
                      </div>
                      <button onClick={() => patch(key, !settings[key])}>
                        {settings[key]
                          ? <ToggleRight className="w-7 h-7 text-purple-400" />
                          : <ToggleLeft  className="w-7 h-7 text-text-dim" />}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Save */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving…" : saved ? "Saved!" : "Save Settings"}
                </button>
              </>
            )}
          </div>
        )}

        {/* ────── LEADS INBOX ────── */}
        {activeTab === "Leads Inbox" && (
          <div className="space-y-5">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2 flex-wrap">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => interest && setFilterInterest(interest)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                      filterInterest === interest
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "text-text-muted hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {interest === "all" ? `All (${leads.length})` : interest}
                  </button>
                ))}
              </div>
              <button
                onClick={loadLeads}
                disabled={loadingLeads}
                className="flex items-center gap-2 px-3 py-2 glass rounded-xl text-xs text-text-muted hover:text-white transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingLeads ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="glass glow-border rounded-2xl p-16 text-center">
                <MessageSquare className="w-10 h-10 text-text-dim mx-auto mb-3" />
                <p className="text-text-muted text-sm">
                  {loadingLeads ? "Loading leads…" : "No leads captured yet."}
                </p>
                <p className="text-text-dim text-xs mt-1">Leads are captured automatically from chat conversations.</p>
              </div>
            ) : (
              <div className="glass glow-border rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-bg-elevated/50">
                      {["Visitor", "Specialty", "Interest", "Source", "Captured", ""].map((h) => (
                        <th key={h} className="text-left text-xs text-text-dim font-semibold px-5 py-3.5">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <AnimatePresence>
                      {filteredLeads.map((lead) => (
                        <motion.tr
                          key={lead.id}
                          layout
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0, height: 0 }}
                          className="hover:bg-white/[0.02] group transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="text-sm text-white font-medium">{lead.name ?? <span className="text-text-dim italic">Unknown</span>}</div>
                            {lead.email && <div className="text-xs text-text-muted">{lead.email}</div>}
                          </td>
                          <td className="px-5 py-4 text-xs text-text-secondary">
                            {lead.specialty ?? <span className="text-text-dim">—</span>}
                          </td>
                          <td className="px-5 py-4">
                            {lead.interest
                              ? <Badge variant={INTEREST_COLORS[lead.interest] ?? "gray"} className="capitalize text-[10px]">{lead.interest}</Badge>
                              : <span className="text-text-dim text-xs">—</span>}
                          </td>
                          <td className="px-5 py-4 text-xs text-text-muted capitalize">{lead.source}</td>
                          <td className="px-5 py-4 text-xs text-text-muted">
                            {new Date(lead.capturedAt).toLocaleDateString("en-GB", {
                              day: "2-digit", month: "short", year: "numeric",
                            })}
                          </td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => deleteLead(lead.id)}
                              disabled={deletingId === lead.id}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-text-dim hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
