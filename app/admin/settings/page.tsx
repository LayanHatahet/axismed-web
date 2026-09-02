"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import type { SiteSettings } from "@/lib/types";

const tabs = ["General", "Contact", "Social", "SEO", "Payment"] as const;
type Tab = typeof tabs[number];

function Field({
  label, value, onChange, placeholder, textarea, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; textarea?: boolean; type?: string;
}) {
  const cls = "w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors";
  return (
    <div>
      <label className="block text-sm text-text-secondary mb-1.5">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} rows={3} className={`${cls} resize-none`} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} type={type} className={cls} />
      )}
    </div>
  );
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<Tab>("General");
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(console.error);
  }, []);

  const patch = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setSettings((prev) => prev ? { ...prev, [key]: value } : prev);

  const patchSocial = (key: keyof SiteSettings["socialLinks"], value: string) =>
    setSettings((prev) => prev ? { ...prev, socialLinks: { ...prev.socialLinks, [key]: value } } : prev);

  const patchSEO = (key: keyof SiteSettings["seo"], value: string | string[]) =>
    setSettings((prev) => prev ? { ...prev, seo: { ...prev.seo, [key]: value } } : prev);

  const patchPayment = <K extends keyof SiteSettings["paymentConfig"]>(key: K, value: SiteSettings["paymentConfig"][K]) =>
    setSettings((prev) => prev ? { ...prev, paymentConfig: { ...prev.paymentConfig, [key]: value } } : prev);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!settings) {
    return (
      <>
        <AdminHeader title="Settings" subtitle="Configure your AxisMed platform" />
        <div className="p-6 flex items-center gap-3 text-text-muted">
          <RefreshCw className="w-4 h-4 animate-spin" /> Loading…
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Settings" subtitle="Configure your AxisMed platform" />

      <div className="p-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 glass rounded-xl mb-8 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab
                  ? "text-white bg-purple-500/20 border border-purple-500/25"
                  : "text-text-muted hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="max-w-2xl">
          {activeTab === "General" && (
            <div className="glass glow-border rounded-2xl p-8 space-y-5">
              <h2 className="font-display text-lg font-bold text-white mb-2">General Settings</h2>
              <Field label="Site Name"   value={settings.siteName} onChange={(v) => patch("siteName", v)} />
              <Field label="Tagline"     value={settings.tagline}  onChange={(v) => patch("tagline",  v)} />
              <Field label="City"        value={settings.city}     onChange={(v) => patch("city",     v)} />
              <Field label="Country"     value={settings.country}  onChange={(v) => patch("country",  v)} />
            </div>
          )}

          {activeTab === "Contact" && (
            <div className="glass glow-border rounded-2xl p-8 space-y-5">
              <h2 className="font-display text-lg font-bold text-white mb-2">Contact Information</h2>
              <Field label="Email"    value={settings.email}    onChange={(v) => patch("email",    v)} placeholder="info@axismed.com" />
              <Field label="Phone"    value={settings.phone}    onChange={(v) => patch("phone",    v)} placeholder="+971 50 000 0000" />
              <Field label="WhatsApp" value={settings.whatsapp} onChange={(v) => patch("whatsapp", v)} placeholder="+971 50 000 0000" />
              <Field label="Address"  value={settings.address}  onChange={(v) => patch("address",  v)} placeholder="Dubai Healthcare City" />
            </div>
          )}

          {activeTab === "Social" && (
            <div className="glass glow-border rounded-2xl p-8 space-y-5">
              <h2 className="font-display text-lg font-bold text-white mb-2">Social Media Links</h2>
              {(["instagram", "linkedin", "twitter", "youtube", "facebook"] as const).map((platform) => (
                <Field
                  key={platform}
                  label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                  value={settings.socialLinks[platform] ?? ""}
                  onChange={(v) => patchSocial(platform, v)}
                  placeholder={`https://${platform}.com/axismed`}
                />
              ))}
            </div>
          )}

          {activeTab === "SEO" && (
            <div className="glass glow-border rounded-2xl p-8 space-y-5">
              <h2 className="font-display text-lg font-bold text-white mb-2">SEO Settings</h2>
              <Field
                label="Meta Title"
                value={settings.seo.metaTitle}
                onChange={(v) => patchSEO("metaTitle", v)}
              />
              <Field
                label="Meta Description"
                value={settings.seo.metaDescription}
                onChange={(v) => patchSEO("metaDescription", v)}
                textarea
              />
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Keywords (comma-separated)</label>
                <textarea
                  value={settings.seo.keywords.join(", ")}
                  onChange={(e) =>
                    patchSEO("keywords", e.target.value.split(",").map((k) => k.trim()).filter(Boolean))
                  }
                  rows={3}
                  className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === "Payment" && (
            <div className="glass glow-border rounded-2xl p-8 space-y-5">
              <h2 className="font-display text-lg font-bold text-white mb-2">Payment Configuration</h2>
              <Field
                label="Currency"
                value={settings.paymentConfig.currency}
                onChange={(v) => patchPayment("currency", v)}
                placeholder="USD"
              />
              <Field
                label="Payment Gateway"
                value={settings.paymentConfig.gateway}
                onChange={(v) => patchPayment("gateway", v)}
                placeholder="stripe"
              />
              <Field
                label="Stripe Publishable Key"
                value={settings.paymentConfig.stripePublishableKey ?? ""}
                onChange={(v) => patchPayment("stripePublishableKey", v)}
                placeholder="pk_live_..."
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => patchPayment("testMode", !settings.paymentConfig.testMode)}
                  className={`w-11 h-6 rounded-full transition-colors ${settings.paymentConfig.testMode ? "bg-purple-500" : "bg-white/10"}`}
                >
                  <span className={`block w-4 h-4 bg-white rounded-full transition-transform mx-1 ${settings.paymentConfig.testMode ? "translate-x-5" : "translate-x-0"}`} />
                </button>
                <span className="text-sm text-text-secondary">Test mode</span>
              </div>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(164,158,207,0.4)]"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
