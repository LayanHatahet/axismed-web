"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Course } from "@/lib/types";
import { Clock, User, MapPin, Building2, Phone, Mail, DollarSign, Users, Tag, Image as ImageIcon, CalendarDays } from "lucide-react";
import {
  DEFAULT_CONTACT_PHONE, DEFAULT_CONTACT_EMAIL, DEFAULT_INCLUDED,
  DEFAULT_PRICING_TIERS, DEFAULT_TRAVEL_INFO, DEFAULT_PAYMENT_INFO,
  DEFAULT_SPONSORS_INTRO, DEFAULT_GALLERY_INTRO,
} from "@/lib/data/courseDefaults";

const tabs = ["Overview", "Agenda", "Faculty", "Sponsors", "Venue", "Fees", "Gallery"] as const;
type Tab = typeof tabs[number];

interface Props { course: Course }

/** Renders body copy that may contain the {email} token, linking the address. */
function CopyWithEmail({ text, email, className }: { text: string; email: string; className?: string }) {
  const parts = text.split("{email}");
  return (
    <p className={className}>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <a href={`mailto:${email}`} className="text-purple-400 hover:text-purple-300 transition-colors">
              {email}
            </a>
          )}
        </span>
      ))}
    </p>
  );
}

export function CourseContent({ course }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const contactPhone  = course.contactPhone  || DEFAULT_CONTACT_PHONE;
  const contactEmail  = course.contactEmail  || DEFAULT_CONTACT_EMAIL;
  const included      = course.included?.length      ? course.included      : DEFAULT_INCLUDED;
  const pricingTiers  = course.pricingTiers?.length  ? course.pricingTiers  : DEFAULT_PRICING_TIERS;
  const travelInfo    = course.travelInfo    || DEFAULT_TRAVEL_INFO;
  const paymentInfo   = course.paymentInfo   || DEFAULT_PAYMENT_INFO;
  const sponsorsIntro = course.sponsorsIntro || DEFAULT_SPONSORS_INTRO;
  const galleryIntro  = course.galleryIntro  || DEFAULT_GALLERY_INTRO;

  return (
    <div>
      {/* Tabs — scrollable on mobile */}
      <div className="overflow-x-auto -mx-4 px-4 mb-8">
        <div className="flex gap-1 p-1 glass rounded-xl w-fit min-w-full sm:min-w-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative whitespace-nowrap px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab ? "text-white" : "text-text-muted hover:text-white"
              }`}
            >
              {activeTab === tab && (
                <motion.span
                  layoutId="course-tab"
                  className="absolute inset-0 bg-purple-500/20 rounded-lg border border-purple-500/25"
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {/* ─── OVERVIEW ─────────────────────────────────────────────── */}
          {activeTab === "Overview" && (
            <div className="space-y-6">
              <div className="glass glow-border rounded-2xl p-8">
                <h2 className="font-display text-2xl font-bold text-white mb-4">Program Overview</h2>
                <p className="text-text-secondary leading-relaxed text-[15px]">{course.overview}</p>
              </div>

              <div className="glass glow-border rounded-2xl p-8">
                <h3 className="font-display text-xl font-bold text-white mb-4">About This Program</h3>
                <p className="text-text-secondary leading-relaxed text-[15px]">{course.description}</p>
              </div>

              {/* Key info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Duration",    value: course.duration,        icon: Clock },
                  { label: "Format",      value: course.programType,     icon: Tag },
                  { label: "Location",    value: course.city,            icon: MapPin },
                  { label: "Seats Left",  value: `${course.seatsAvailable} / ${course.seats}`, icon: Users },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="glass glow-border rounded-xl p-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/12 flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-text-muted text-xs mb-1">{label}</div>
                    <div className="text-white text-sm font-semibold">{value}</div>
                  </div>
                ))}
              </div>

              {course.tags.length > 0 && (
                <div className="glass glow-border rounded-2xl p-6">
                  <h4 className="text-text-secondary text-sm font-semibold mb-4 uppercase tracking-wider">Topics Covered</h4>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1.5 text-xs rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 capitalize">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── AGENDA ───────────────────────────────────────────────── */}
          {activeTab === "Agenda" && (
            <div className="space-y-6">
              {course.agenda.length === 0 ? (
                <AgendaPlaceholder />
              ) : (
                course.agenda.map((day, di) => (
                  <div key={day.day} className="glass glow-border rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500/15 to-transparent border-b border-border px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <CalendarDays className="w-4 h-4 text-purple-400" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-white">{day.day}</h3>
                    </div>
                    <div className="divide-y divide-border">
                      {day.sessions.map((session, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (di * 0.05) + (i * 0.04) }}
                          className="flex items-start gap-5 px-6 py-4 hover:bg-white/[0.02] transition-colors group"
                        >
                          <div className="shrink-0 w-20 text-purple-400 text-xs font-mono pt-0.5 font-medium">
                            {session.time}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-sm font-medium group-hover:text-purple-200 transition-colors">
                              {session.title}
                            </div>
                            {session.speaker && (
                              <div className="flex items-center gap-1.5 text-text-muted text-xs mt-1.5">
                                <User className="w-3 h-3 shrink-0" />
                                <span>{session.speaker}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ─── FACULTY ──────────────────────────────────────────────── */}
          {activeTab === "Faculty" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {course.faculty.length === 0 ? (
                <FacultyPlaceholder />
              ) : (
                course.faculty.map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="glass glow-border rounded-2xl p-6 hover:border-purple-500/30 transition-all group"
                  >
                    {/* Faculty portrait */}
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden mb-4 bg-bg-elevated">
                      {member.image ? (
                        <Image src={member.image} alt={member.name} fill className="object-cover" />
                      ) : (
                        <>
                          {/*
                           * FACULTY PORTRAIT PLACEHOLDER
                           * Type: Professional headshot / editorial portrait
                           * Mood: Authoritative, warm, clinically professional
                           * Composition: Shoulders-up, slight 3/4 angle, confident posture
                           * Lighting: Soft studio lighting, clean neutral background
                           * Environment: Medical office or premium photography studio
                           * Direction: Sharp focus on face, professional attire (scrubs or suit), natural expression
                           */}
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/40 to-bg-elevated">
                            <User className="w-7 h-7 text-purple-400/60" />
                          </div>
                        </>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-white text-lg mb-1 group-hover:text-purple-200 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-purple-400 text-sm font-medium mb-1">{member.title}</p>
                    <div className="flex items-center gap-1.5 text-text-muted text-sm mb-3">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{member.institution}</span>
                    </div>
                    {member.bio && (
                      <p className="text-text-secondary text-sm leading-relaxed mb-3 line-clamp-3">{member.bio}</p>
                    )}
                    <div className="pt-3 border-t border-border">
                      <span className="text-xs text-text-dim px-2.5 py-1 rounded-full bg-white/5 border border-border">
                        {member.specialty}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* ─── SPONSORS ─────────────────────────────────────────────── */}
          {activeTab === "Sponsors" && (
            <div className="glass glow-border rounded-2xl p-8">
              <h3 className="font-display text-xl font-bold text-white mb-2">Program Sponsors</h3>
              <p className="text-text-muted text-sm mb-8">{sponsorsIntro}</p>
              {course.sponsors.length === 0 ? (
                <SponsorsPlaceholder />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {course.sponsors.map((sponsor, i) => (
                    <motion.div
                      key={sponsor}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex flex-col items-center justify-center h-28 bg-bg-elevated rounded-2xl border border-border hover:border-purple-500/25 transition-all group cursor-pointer p-4"
                    >
                      {/*
                       * SPONSOR LOGO PLACEHOLDER
                       * Type: Medical device / pharma company brand mark
                       * Style: Clean vector logo, white or light-colored on dark background
                       * Format: SVG preferred, horizontal or square
                       * Direction: Centered, generous padding, professional brand presentation
                       */}
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-2 group-hover:bg-purple-500/20 transition-colors">
                        <Building2 className="w-5 h-5 text-purple-400/70" />
                      </div>
                      <span className="text-white text-sm font-semibold text-center">{sponsor}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── VENUE ────────────────────────────────────────────────── */}
          {activeTab === "Venue" && (
            <div className="space-y-6">
              <div className="glass glow-border rounded-2xl overflow-hidden">
                {/* Venue photo */}
                <div className="relative h-56 bg-bg-elevated overflow-hidden">
                  {course.venueImage ? (
                    <Image src={course.venueImage} alt={course.location || "Venue"} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-bg-base/30 to-bg-base/60 flex flex-col items-center justify-center gap-2">
                      <MapPin className="w-8 h-8 text-purple-400/50" />
                      <span className="text-white/30 text-xs font-medium tracking-wider uppercase">Venue Photo</span>
                      <span className="text-white/20 text-[11px] text-center px-8">Premium surgical training facility · conference hall interior photography</span>
                    </div>
                  )}
                </div>

                <div className="p-8">
                  <h3 className="font-display text-xl font-bold text-white mb-6">Venue Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { icon: Building2, label: "Facility",   value: course.location || "To be confirmed" },
                      { icon: MapPin,    label: "City",        value: course.city },
                      { icon: Phone,     label: "Inquiries",   value: contactPhone },
                      { icon: Mail,      label: "Email",       value: contactEmail },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/12 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <div className="text-text-muted text-xs mb-0.5">{label}</div>
                          <div className="text-white text-sm font-medium">{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Map placeholder */}
                  <div className="mt-6 h-48 bg-bg-elevated rounded-xl border border-border flex items-center justify-center overflow-hidden relative">
                    {course.venueMapEmbed ? (
                      <iframe
                        src={course.venueMapEmbed}
                        title={`Map · ${course.location || course.city}`}
                        className="absolute inset-0 w-full h-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                      />
                    ) : (
                      <>
                        <div className="text-center">
                          <MapPin className="w-8 h-8 text-purple-400/40 mx-auto mb-2" />
                          <p className="text-text-dim text-sm">Interactive map · {course.city}</p>
                          <p className="text-text-dim text-xs mt-1">Map will appear once venue is confirmed</p>
                        </div>
                        <div className="absolute inset-0 bg-grid opacity-30" />
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Travel info */}
              <div className="glass glow-border rounded-2xl p-6">
                <h4 className="font-display font-bold text-white mb-4">Travel & Accommodation</h4>
                <CopyWithEmail
                  text={travelInfo}
                  email={contactEmail}
                  className="text-text-secondary text-sm leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* ─── FEES ─────────────────────────────────────────────────── */}
          {activeTab === "Fees" && (
            <div className="space-y-6">
              {/* Main pricing card */}
              <div className="glass glow-border rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-900/40 via-purple-800/20 to-transparent p-8 border-b border-border">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-5xl font-bold text-white">
                      ${course.price.toLocaleString()}
                    </span>
                    <span className="text-text-muted text-lg">{course.currency}</span>
                  </div>
                  <p className="text-text-secondary mt-2">Full registration fee — {course.duration}</p>
                </div>

                <div className="p-8">
                  <h3 className="font-display text-lg font-bold text-white mb-5">What&apos;s Included</h3>
                  <div className="space-y-3">
                    {included.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-purple-400" />
                        </div>
                        <span className="text-text-secondary text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing tiers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {pricingTiers.map(({ label, percent, note, highlight }) => (
                  <div
                    key={label}
                    className={`rounded-2xl p-6 border transition-all ${
                      highlight
                        ? "bg-purple-500/12 border-purple-500/35 shadow-[0_0_24px_rgba(164,158,207,0.15)]"
                        : "glass border-border"
                    }`}
                  >
                    {highlight && (
                      <div className="text-xs text-purple-300 font-semibold uppercase tracking-wider mb-3">Most Common</div>
                    )}
                    <div className="font-display text-sm font-semibold text-text-muted mb-2">{label}</div>
                    <div className="font-display text-3xl font-bold text-white mb-1">
                      ${Math.round(course.price * (percent / 100)).toLocaleString()}
                    </div>
                    <div className="text-text-dim text-xs">{note}</div>
                  </div>
                ))}
              </div>

              {/* Payment info */}
              <div className="glass glow-border rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/12 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white mb-2">Payment & Invoicing</h4>
                    <CopyWithEmail
                      text={paymentInfo}
                      email={contactEmail}
                      className="text-text-secondary text-sm leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── GALLERY ──────────────────────────────────────────────── */}
          {activeTab === "Gallery" && (
            <div className="space-y-6">
              <div className="glass glow-border rounded-2xl p-6">
                <h3 className="font-display text-xl font-bold text-white mb-2">Media & Gallery</h3>
                <p className="text-text-muted text-sm mb-6">{galleryIntro}</p>

                {course.gallery.length === 0 ? (
                  <GalleryPlaceholder />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {course.gallery.map((img, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.06 }}
                        className="relative h-40 rounded-xl overflow-hidden bg-bg-elevated group cursor-pointer"
                      >
                        <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-bg-base/20 group-hover:bg-transparent transition-colors" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Placeholder components ─────────────────────────────────────────────────

function AgendaPlaceholder() {
  return (
    <div className="glass glow-border rounded-2xl p-8 text-center">
      <CalendarDays className="w-10 h-10 text-purple-400/40 mx-auto mb-3" />
      <h4 className="font-display font-bold text-white mb-2">Agenda Coming Soon</h4>
      <p className="text-text-muted text-sm">
        The detailed program schedule will be published closer to the event date.
        <br />Contact us to receive the agenda as soon as it&apos;s available.
      </p>
    </div>
  );
}

function FacultyPlaceholder() {
  return (
    <div className="col-span-2 glass glow-border rounded-2xl p-8 text-center">
      <User className="w-10 h-10 text-purple-400/40 mx-auto mb-3" />
      <h4 className="font-display font-bold text-white mb-2">Faculty to be Announced</h4>
      <p className="text-text-muted text-sm">
        The program faculty will be confirmed and published shortly.
        All faculty members are leading specialists in their respective fields.
      </p>
    </div>
  );
}

function SponsorsPlaceholder() {
  return (
    <div className="text-center py-8">
      {/*
       * SPONSOR LOGOS PLACEHOLDER
       * Type: Grid of industry partner brand marks
       * Style: White/monochrome logos on dark cards with hover glow
       * Direction: 2-3 columns, equal-sized cards, generous whitespace
       * Partners typically include: medical device companies, pharma companies, simulation centers
       */}
      <Building2 className="w-10 h-10 text-purple-400/40 mx-auto mb-3" />
      <p className="text-text-muted text-sm">
        Sponsor information for this program will be announced soon.
      </p>
    </div>
  );
}

function GalleryPlaceholder() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="relative h-40 rounded-xl overflow-hidden bg-bg-elevated border border-border flex flex-col items-center justify-center gap-1.5 text-center p-3"
        >
          {/*
           * GALLERY PHOTO PLACEHOLDER {i+1}
           * Type: Event photography from previous program editions
           * Mood: Dynamic, engaged, professional — capturing the energy of live training
           * Composition: Mix of wide shots (full room) + close-ups (hands-on technique, instrument detail)
           * Lighting: Natural event lighting, possibly enhanced by photo editing for clarity
           * Environment: Surgical simulation lab, cadaveric training facility, or conference hall
           * Direction: Candid moments of learning — surgeons collaborating, faculty demonstrating technique
           */}
          <ImageIcon className="w-5 h-5 text-purple-400/30" />
          <span className="text-white/20 text-[10px] leading-tight">
            {i === 0 && "Wide shot · training session · full team"}
            {i === 1 && "Close-up · surgical technique · hands + instruments"}
            {i === 2 && "Faculty demonstration · OR environment"}
            {i === 3 && "Participants networking · premium venue"}
            {i === 4 && "Cadaveric lab · focused training moment"}
            {i === 5 && "Certificate ceremony · professional atmosphere"}
          </span>
        </div>
      ))}
    </div>
  );
}
