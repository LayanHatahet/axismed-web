"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Save, Image as ImageIcon, Type, FileText, Home, Info, Video, Phone, Handshake, BookOpen, Check, RefreshCw, Upload, X } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import type { WebsiteContent } from "@/lib/types";
import { defaultContent } from "@/lib/data/content";

const TABS = [
  { id: "home",     label: "Home",     icon: Home },
  { id: "about",    label: "About",    icon: Info },
  { id: "media",    label: "Media",    icon: Video },
  { id: "contact",  label: "Contact",  icon: Phone },
  { id: "partners", label: "Partners", icon: Handshake },
  { id: "courses",  label: "Courses",  icon: BookOpen },
  { id: "footer",   label: "Footer",   icon: FileText },
] as const;

type TabId = typeof TABS[number]["id"];

function Field({ label, value, onChange, area = false, placeholder, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  area?: boolean; placeholder?: string; hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-1.5">{label}</label>
      {hint && <p className="text-xs text-text-dim mb-2">{hint}</p>}
      {area ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder={placeholder}
          className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors resize-y"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-dim outline-none transition-colors"
        />
      )}
    </div>
  );
}

function ImageField({ label, value, onChange, hint, folder = "uploads/content" }: {
  label: string; value: string; onChange: (v: string) => void;
  hint?: string; folder?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) onChange(data.url);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-1.5 flex items-center gap-1.5">
        <ImageIcon className="w-3.5 h-3.5 text-purple-400" /> {label}
      </label>
      {hint && <p className="text-xs text-text-dim mb-2">{hint}</p>}

      {/* Preview / upload zone */}
      <div
        onClick={() => fileRef.current?.click()}
        className="relative cursor-pointer group border-2 border-dashed border-border hover:border-purple-500/50 rounded-xl overflow-hidden transition-colors"
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="preview" className="w-full h-36 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Upload className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium">Replace photo</span>
            </div>
          </>
        ) : (
          <div className="h-28 flex flex-col items-center justify-center gap-2 bg-bg-elevated">
            {uploading
              ? <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
              : <><Upload className="w-6 h-6 text-text-dim" /><span className="text-xs text-text-muted">Click to upload photo</span></>
            }
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
          </div>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {/* URL fallback */}
      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] text-text-dim">or paste URL</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="relative mt-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full bg-bg-elevated border border-border focus:border-purple-500 rounded-xl px-4 py-2.5 pr-9 text-sm text-white placeholder:text-text-dim outline-none transition-colors"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-dim hover:text-red-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="glass glow-border rounded-2xl p-6 space-y-4">
      <h3 className="flex items-center gap-2 font-display font-semibold text-white text-base border-b border-border pb-3">
        <Icon className="w-4 h-4 text-purple-400" />
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [content, setContent] = useState<WebsiteContent>(defaultContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content").then(r => r.json()).then(d => { setContent(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  function update(path: string, value: string) {
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as WebsiteContent;
      const keys = path.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: any = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }

  function updateDiff(path: string, idx: number, field: string, value: string) {
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as WebsiteContent;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const keys = path.split("."); let obj: any = next;
      for (const k of keys) obj = obj[k];
      obj[idx][field] = value;
      return next;
    });
  }

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }

  if (loading) return <div className="p-10 text-text-muted text-sm">Loading content...</div>;

  return (
    <>
      <AdminHeader
        title="Website Content"
        subtitle="Edit every section of the website — text, images, CTAs"
        action={
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)]"
          >
            {saved ? <Check className="w-4 h-4" /> : saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : saving ? "Saving…" : "Save All Changes"}
          </button>
        }
      />

      <div className="p-6">
        {/* Tab bar */}
        <div className="flex gap-1 p-1 glass rounded-xl mb-8 w-fit flex-wrap">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === id ? "text-white bg-purple-500/20 border border-purple-500/25" : "text-text-muted hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="max-w-3xl space-y-6">

          {/* ── HOME ── */}
          {activeTab === "home" && (
            <>
              <SectionCard title="Hero Section" icon={Home}>
                <Field label="Badge Text" value={content.home.hero.badge} onChange={v => update("home.hero.badge", v)} placeholder="Regional Healthcare Platform" />
                <Field label="Headline (use \n for line breaks)" value={content.home.hero.headline} onChange={v => update("home.hero.headline", v)} area placeholder="Where Clinical Excellence Meets Innovation" />
                <Field label="Subheadline" value={content.home.hero.subheadline} onChange={v => update("home.hero.subheadline", v)} area />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="CTA Button Text" value={content.home.hero.ctaText} onChange={v => update("home.hero.ctaText", v)} />
                  <Field label="CTA Button Link" value={content.home.hero.ctaLink} onChange={v => update("home.hero.ctaLink", v)} placeholder="/courses" />
                </div>
              </SectionCard>

              <SectionCard title="Who We Are Section" icon={Info}>
                <Field label="Section Tagline" value={content.home.whoWeAre.tagline} onChange={v => update("home.whoWeAre.tagline", v)} />
                <Field label="Headline" value={content.home.whoWeAre.headline} onChange={v => update("home.whoWeAre.headline", v)} />
                <Field label="Body Paragraph 1" value={content.home.whoWeAre.body1} onChange={v => update("home.whoWeAre.body1", v)} area />
                <Field label="Body Paragraph 2" value={content.home.whoWeAre.body2} onChange={v => update("home.whoWeAre.body2", v)} area />
                <ImageField label="Section Photo" value={content.home.whoWeAre.image} onChange={v => update("home.whoWeAre.image", v)} hint="Used in the Who We Are photo block. Landscape, min 1200px wide." />
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Stat 1" value={content.home.whoWeAre.stat1} onChange={v => update("home.whoWeAre.stat1", v)} placeholder="50+ Programs/year" />
                  <Field label="Stat 2" value={content.home.whoWeAre.stat2} onChange={v => update("home.whoWeAre.stat2", v)} placeholder="15+ Countries" />
                  <Field label="Stat 3" value={content.home.whoWeAre.stat3} onChange={v => update("home.whoWeAre.stat3", v)} placeholder="100% Healthcare-focused" />
                </div>
              </SectionCard>

              <SectionCard title="Core Pillars Section" icon={Type}>
                <Field label="Tagline" value={content.home.corePillars.tagline} onChange={v => update("home.corePillars.tagline", v)} />
                <Field label="Headline" value={content.home.corePillars.headline} onChange={v => update("home.corePillars.headline", v)} />
                <Field label="Body" value={content.home.corePillars.body} onChange={v => update("home.corePillars.body", v)} area />
              </SectionCard>

              <SectionCard title="Why AxisMed Section" icon={Type}>
                <Field label="Tagline" value={content.home.whyAxisMed.tagline} onChange={v => update("home.whyAxisMed.tagline", v)} />
                <Field label="Headline" value={content.home.whyAxisMed.headline} onChange={v => update("home.whyAxisMed.headline", v)} />
                <Field label="Body" value={content.home.whyAxisMed.body} onChange={v => update("home.whyAxisMed.body", v)} area />
              </SectionCard>

              <SectionCard title="Media Insights Section" icon={Video}>
                <Field label="Tagline" value={content.home.mediaInsights.tagline} onChange={v => update("home.mediaInsights.tagline", v)} />
                <Field label="Headline" value={content.home.mediaInsights.headline} onChange={v => update("home.mediaInsights.headline", v)} />
                <Field label="Body" value={content.home.mediaInsights.body} onChange={v => update("home.mediaInsights.body", v)} area />
              </SectionCard>
            </>
          )}

          {/* ── ABOUT ── */}
          {activeTab === "about" && (
            <>
              <SectionCard title="About Hero" icon={Info}>
                <Field label="Tagline" value={content.about.hero.tagline} onChange={v => update("about.hero.tagline", v)} />
                <Field label="Headline" value={content.about.hero.headline} onChange={v => update("about.hero.headline", v)} />
                <Field label="Body" value={content.about.hero.body} onChange={v => update("about.hero.body", v)} area />
              </SectionCard>

              <SectionCard title="Our Story" icon={FileText}>
                <Field label="Headline" value={content.about.story.headline} onChange={v => update("about.story.headline", v)} />
                <Field label="Body" value={content.about.story.body} onChange={v => update("about.story.body", v)} area />
                <ImageField label="Story Photo" value={content.about.story.image} onChange={v => update("about.story.image", v)} hint="Used in the Our Story section. Landscape orientation recommended." />
              </SectionCard>

              <SectionCard title="Vision & Mission" icon={Type}>
                <Field label="Vision Statement" value={content.about.vision} onChange={v => update("about.vision", v)} area />
                <Field label="Mission Statement" value={content.about.mission} onChange={v => update("about.mission", v)} area />
              </SectionCard>

              <SectionCard title="What Makes Us Different (4 cards)" icon={Type}>
                {content.about.differentiators.map((d, i) => (
                  <div key={i} className="p-4 rounded-xl bg-bg-elevated space-y-3">
                    <p className="text-xs text-text-dim font-semibold uppercase tracking-wide">Card {i + 1}</p>
                    <Field label="Title" value={d.title} onChange={v => updateDiff("about.differentiators", i, "title", v)} />
                    <Field label="Body" value={d.body} onChange={v => updateDiff("about.differentiators", i, "body", v)} area />
                  </div>
                ))}
              </SectionCard>

              <SectionCard title="Team & Moments Photos" icon={ImageIcon}>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-500/8 border border-purple-500/20">
                  <ImageIcon className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-white font-medium mb-1">Photos are managed in the Site Gallery</p>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Upload photos in <strong className="text-text-secondary">Admin → Site Gallery</strong> and set their category to <strong className="text-text-secondary">"Team"</strong> or <strong className="text-text-secondary">"About"</strong>. They will automatically appear in the photo section on the About page.
                    </p>
                    <a
                      href="/admin/gallery"
                      className="inline-flex items-center gap-1.5 mt-3 text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
                    >
                      Go to Site Gallery →
                    </a>
                  </div>
                </div>
              </SectionCard>
            </>
          )}

          {/* ── MEDIA ── */}
          {activeTab === "media" && (
            <>
              <SectionCard title="Media Page Hero" icon={Video}>
                <Field label="Tagline" value={content.media.hero.tagline} onChange={v => update("media.hero.tagline", v)} />
                <Field label="Headline" value={content.media.hero.headline} onChange={v => update("media.hero.headline", v)} />
                <Field label="Body" value={content.media.hero.body} onChange={v => update("media.hero.body", v)} area />
              </SectionCard>

              <SectionCard title="Services (4 cards)" icon={Type}>
                {content.media.services.map((s, i) => (
                  <div key={i} className="p-4 rounded-xl bg-bg-elevated space-y-3">
                    <p className="text-xs text-text-dim font-semibold uppercase tracking-wide">Service {i + 1}</p>
                    <Field label="Title" value={s.title} onChange={v => updateDiff("media.services", i, "title", v)} />
                    <Field label="Description" value={s.body} onChange={v => updateDiff("media.services", i, "body", v)} area />
                  </div>
                ))}
              </SectionCard>
            </>
          )}

          {/* ── CONTACT ── */}
          {activeTab === "contact" && (
            <>
              <SectionCard title="Contact Page Hero" icon={Phone}>
                <Field label="Tagline" value={content.contact.hero.tagline} onChange={v => update("contact.hero.tagline", v)} />
                <Field label="Headline" value={content.contact.hero.headline} onChange={v => update("contact.hero.headline", v)} />
                <Field label="Body" value={content.contact.hero.body} onChange={v => update("contact.hero.body", v)} area />
              </SectionCard>

              <SectionCard title="Contact Details" icon={Phone}>
                <Field label="Email" value={content.contact.email} onChange={v => update("contact.email", v)} placeholder="info@axismed.com" />
                <Field label="Phone" value={content.contact.phone} onChange={v => update("contact.phone", v)} placeholder="+971 50 000 0000" />
                <Field label="WhatsApp Number (digits only, with country code)" value={content.contact.whatsapp} onChange={v => update("contact.whatsapp", v)} placeholder="971501897038" />
                <Field label="Address" value={content.contact.address} onChange={v => update("contact.address", v)} />
              </SectionCard>
            </>
          )}

          {/* ── PARTNERS ── */}
          {activeTab === "partners" && (
            <SectionCard title="Partners Page Hero" icon={Handshake}>
              <Field label="Tagline" value={content.partners.hero.tagline} onChange={v => update("partners.hero.tagline", v)} />
              <Field label="Headline" value={content.partners.hero.headline} onChange={v => update("partners.hero.headline", v)} />
              <Field label="Body" value={content.partners.hero.body} onChange={v => update("partners.hero.body", v)} area />
            </SectionCard>
          )}

          {/* ── COURSES ── */}
          {activeTab === "courses" && (
            <SectionCard title="Courses Page Hero" icon={BookOpen}>
              <Field label="Tagline" value={content.courses.hero.tagline} onChange={v => update("courses.hero.tagline", v)} />
              <Field label="Headline" value={content.courses.hero.headline} onChange={v => update("courses.hero.headline", v)} />
              <Field label="Body" value={content.courses.hero.body} onChange={v => update("courses.hero.body", v)} area />
            </SectionCard>
          )}

          {/* ── FOOTER ── */}
          {activeTab === "footer" && (
            <SectionCard title="Footer Content" icon={FileText}>
              <Field label="Tagline (shown under logo)" value={content.footer.tagline} onChange={v => update("footer.tagline", v)} />
              <Field label="Description" value={content.footer.description} onChange={v => update("footer.description", v)} area />
            </SectionCard>
          )}
        </div>
      </div>
    </>
  );
}
