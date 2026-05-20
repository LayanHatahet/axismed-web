"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit2, Trash2, Copy, X, Check,
  Filter, Eye, ChevronDown, Upload, Image as ImageIcon, RefreshCw,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { courses as initialCourses } from "@/lib/data/courses";
import type { Course, CourseCategory, ProgramType, CourseStatus } from "@/lib/types";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDateShort } from "@/lib/utils/formatDate";
import Link from "next/link";
import { useEffect } from "react";

const CATEGORIES: CourseCategory[] = [
  "Oral & Maxillofacial Surgery", "Orthopedic Surgery", "Implantology",
  "Digital Surgery", "CMF Reconstruction", "Neurosurgery",
  "General Surgery", "Healthcare Management",
];
const PROGRAM_TYPES: ProgramType[] = [
  "Cadaveric Training", "Hands-on Workshop", "Digital Surgery Program",
  "Industry Educational Event", "Custom Private Training", "Scientific Conference",
];
const STATUSES: CourseStatus[] = ["upcoming", "open", "sold_out", "completed", "archived", "draft"];

const emptyForm = {
  title: "", subtitle: "", category: CATEGORIES[0], programType: PROGRAM_TYPES[0],
  location: "", city: "", startDate: "", endDate: "", duration: "",
  seats: "", seatsAvailable: "", price: "", currency: "USD",
  status: "draft" as CourseStatus, description: "", overview: "", featured: false,
  image: "",
};

type FormState = typeof emptyForm;

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);

  // Fetch from persistent store on mount
  useEffect(() => {
    fetch("/api/courses").then((r) => r.json()).then(setCourses).catch(() => {});
  }, []);

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  function openNew() {
    setForm(emptyForm);
    setEditingCourse(null);
    setShowModal(true);
  }

  function openEdit(course: Course) {
    setForm({
      title: course.title, subtitle: course.subtitle,
      category: course.category, programType: course.programType,
      location: course.location, city: course.city,
      startDate: course.startDate, endDate: course.endDate,
      duration: course.duration, seats: String(course.seats),
      seatsAvailable: String(course.seatsAvailable), price: String(course.price),
      currency: course.currency, status: course.status,
      description: course.description, overview: course.overview,
      featured: course.featured, image: course.image ?? "",
    });
    setEditingCourse(course);
    setShowModal(true);
  }

  function set(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "uploads/courses");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) set("image", data.url);
    setImgUploading(false);
    if (imgRef.current) imgRef.current.value = "";
  }

  async function handleSave() {
    if (!form.title.trim() || !form.startDate || !form.price) return;
    setLoading(true);

    if (editingCourse) {
      const payload = {
        ...form,
        seats: Number(form.seats) || editingCourse.seats,
        seatsAvailable: Number(form.seatsAvailable) || editingCourse.seatsAvailable,
        price: Number(form.price) || editingCourse.price,
      };
      const res = await fetch(`/api/courses/${editingCourse.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json();
        setCourses((prev) => prev.map((c) => (c.id === editingCourse.id ? updated : c)));
      }
    } else {
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        title: form.title, subtitle: form.subtitle,
        category: form.category, programType: form.programType,
        image: form.image || "", instructor: "", instructorTitle: "",
        location: form.location, city: form.city,
        startDate: form.startDate, endDate: form.endDate || form.startDate,
        duration: form.duration || "1 day",
        seats: Number(form.seats) || 20,
        seatsAvailable: Number(form.seatsAvailable) || Number(form.seats) || 20,
        price: Number(form.price) || 0, currency: form.currency,
        status: form.status, featured: form.featured,
        description: form.description, overview: form.overview,
        agenda: [], faculty: [], sponsors: [], tags: [], gallery: [],
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      });
      if (res.ok) setCourses((prev) => [newCourse, ...prev]);
    }

    setLoading(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowModal(false); }, 900);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this course?")) return;
    await fetch(`/api/courses/${id}`, { method: "DELETE" });
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleDuplicate(course: Course) {
    const dup: Course = {
      ...course,
      id: `course-${Date.now()}`,
      slug: `${course.slug}-copy`,
      title: `${course.title} (Copy)`,
      status: "draft", featured: false,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dup),
    });
    setCourses((prev) => [dup, ...prev]);
  }

  const inputCls = "w-full bg-bg-elevated border border-border focus:border-purple-500/70 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-text-dim outline-none transition-colors";
  const labelCls = "block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider";

  return (
    <>
      <AdminHeader title="Courses" subtitle={`${courses.length} programs`} />

      <div className="p-6 space-y-5">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, category, city..."
              className="w-full bg-bg-elevated border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-text-dim outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          <button
            onClick={openNew}
            className="flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-semibold px-5 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(164,158,207,0.4)] whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> New Course
          </button>
        </div>

        {/* Table */}
        <div className="glass glow-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-bg-elevated/50">
                  {["Course", "Category", "Date", "Seats", "Price", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs text-text-dim font-semibold tracking-wider px-5 py-3.5 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((course) => (
                  <tr key={course.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-4 min-w-[200px]">
                      <div className="font-medium text-sm text-white leading-snug">{course.title}</div>
                      <div className="text-text-dim text-xs mt-0.5">{course.programType}</div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-text-muted text-xs">{course.category}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-text-secondary text-xs">{formatDateShort(course.startDate)}</span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1 bg-white/8 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${((course.seats - course.seatsAvailable) / course.seats) * 100}%` }}
                          />
                        </div>
                        <span className="text-text-muted text-xs whitespace-nowrap">{course.seatsAvailable}/{course.seats}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-white text-sm font-medium">${course.price.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={course.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/courses/${course.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-text-dim hover:text-white hover:bg-white/8 transition-all"
                          title="Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => openEdit(course)}
                          className="p-1.5 rounded-lg text-text-dim hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(course)}
                          className="p-1.5 rounded-lg text-text-dim hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="p-1.5 rounded-lg text-text-dim hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete"
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
          {filtered.length === 0 && (
            <div className="text-center py-16 text-text-muted text-sm">
              No courses found. <button onClick={openNew} className="text-purple-400 hover:text-purple-300">Create one →</button>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-bg-dark border border-border rounded-2xl w-full max-w-2xl my-8"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-7 py-5 border-b border-border">
                <h2 className="font-display text-lg font-bold text-white">
                  {editingCourse ? "Edit Course" : "New Course"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-white hover:bg-white/8 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <div className="p-7 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Row 1: Title + Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Title *</label>
                    <input
                      value={form.title}
                      onChange={(e) => set("title", e.target.value)}
                      placeholder="Course title"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Status</label>
                    <div className="relative">
                      <select
                        value={form.status}
                        onChange={(e) => set("status", e.target.value)}
                        className={inputCls + " appearance-none pr-8 cursor-pointer"}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-dim pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Subtitle */}
                <div>
                  <label className={labelCls}>Subtitle</label>
                  <input
                    value={form.subtitle}
                    onChange={(e) => set("subtitle", e.target.value)}
                    placeholder="Short description for cards"
                    className={inputCls}
                  />
                </div>

                {/* Row 2: Category + Program Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Category</label>
                    <div className="relative">
                      <select
                        value={form.category}
                        onChange={(e) => set("category", e.target.value)}
                        className={inputCls + " appearance-none pr-8 cursor-pointer"}
                      >
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-dim pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Program Type</label>
                    <div className="relative">
                      <select
                        value={form.programType}
                        onChange={(e) => set("programType", e.target.value)}
                        className={inputCls + " appearance-none pr-8 cursor-pointer"}
                      >
                        {PROGRAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-dim pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Row 3: Location + City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Venue / Location</label>
                    <input
                      value={form.location}
                      onChange={(e) => set("location", e.target.value)}
                      placeholder="Hospital name, venue"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>City</label>
                    <input
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      placeholder="Dubai"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Row 4: Dates + Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Start Date *</label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => set("startDate", e.target.value)}
                      className={inputCls + " [color-scheme:dark]"}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>End Date</label>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => set("endDate", e.target.value)}
                      className={inputCls + " [color-scheme:dark]"}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Duration</label>
                    <input
                      value={form.duration}
                      onChange={(e) => set("duration", e.target.value)}
                      placeholder="2 days"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Row 5: Price + Seats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Price (USD) *</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => set("price", e.target.value)}
                      placeholder="3500"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Total Seats</label>
                    <input
                      type="number"
                      value={form.seats}
                      onChange={(e) => set("seats", e.target.value)}
                      placeholder="20"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Seats Left</label>
                    <input
                      type="number"
                      value={form.seatsAvailable}
                      onChange={(e) => set("seatsAvailable", e.target.value)}
                      placeholder="20"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Course Image */}
                <div>
                  <label className={labelCls}>Course Cover Photo</label>
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
                          <span className="text-white text-sm font-medium">Replace photo</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-24 flex flex-col items-center justify-center gap-2 bg-bg-elevated">
                        {imgUploading
                          ? <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
                          : <><ImageIcon className="w-6 h-6 text-text-dim" /><span className="text-xs text-text-muted">Click to upload cover photo</span></>}
                      </div>
                    )}
                    {imgUploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                        <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
                      </div>
                    )}
                  </div>
                  <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <input
                    value={form.image}
                    onChange={(e) => set("image", e.target.value)}
                    placeholder="or paste image URL"
                    className={inputCls + " mt-2 text-xs py-2"}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Full course description..."
                    className={inputCls + " resize-none"}
                  />
                </div>

                {/* Featured toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => set("featured", !form.featured)}
                    className={`w-11 h-6 rounded-full transition-colors ${form.featured ? "bg-purple-500" : "bg-white/10"}`}
                  >
                    <span className={`block w-4 h-4 bg-white rounded-full transition-transform mx-1 ${form.featured ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                  <span className="text-sm text-text-secondary">Featured course</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 px-7 py-5 border-t border-border">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-border text-white py-3 rounded-xl hover:bg-white/5 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || !form.title.trim() || !form.startDate || !form.price}
                  className="flex-1 bg-purple-500 hover:bg-purple-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                >
                  {saved ? (
                    <><Check className="w-4 h-4" /> Saved!</>
                  ) : loading ? (
                    <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Saving...</>
                  ) : (
                    editingCourse ? "Save Changes" : "Create Course"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
