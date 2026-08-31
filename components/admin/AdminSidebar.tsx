"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Calendar, Image as ImageIcon,
  Handshake, Settings, ChevronLeft, ChevronRight,
  ClipboardList, ExternalLink, Inbox, Bot, FileText, GalleryHorizontalEnd, Tag,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navGroups = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard",      href: "/admin" },
    ],
  },
  {
    label: "Website",
    items: [
      { icon: FileText,              label: "Content Editor", href: "/admin/content" },
      { icon: BookOpen,              label: "Courses",        href: "/admin/courses" },
      { icon: Calendar,              label: "Events",         href: "/admin/events" },
      { icon: GalleryHorizontalEnd,  label: "Site Gallery",   href: "/admin/gallery" },
      { icon: ImageIcon,             label: "Media Library",  href: "/admin/media" },
      { icon: Handshake,             label: "Partners",       href: "/admin/partners" },
      { icon: Tag,                   label: "Discount Codes", href: "/admin/discount-codes" },
    ],
  },
  {
    label: "Engagement",
    items: [
      { icon: Bot,           label: "AI Concierge",  href: "/admin/concierge" },
      { icon: Inbox,         label: "Contacts",      href: "/admin/contacts" },
      { icon: ClipboardList, label: "Registrations", href: "/admin/registrations" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: Settings, label: "Settings", href: "/admin/settings" },
    ],
  },
];

interface Props { collapsed: boolean; onToggle: () => void }

export function AdminSidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-bg-base border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border min-h-[64px]">
        <div className="w-9 h-9 shrink-0 relative">
          <Image src="/logo-symbol.png" alt="AxisMed" fill className="object-contain drop-shadow-[0_0_8px_rgba(164,158,207,0.5)]" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="overflow-hidden"
            >
              <div className="font-display font-bold text-base tracking-wider whitespace-nowrap">
                <span className="text-white/70">AXIS</span>
                <span className="text-purple-400">MED</span>
              </div>
              <div className="text-[9px] text-text-dim tracking-widest whitespace-nowrap">Admin Panel</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto admin-scroll py-3">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-1">
            {!collapsed && (
              <div className="px-4 pt-3 pb-1">
                <span className="text-[10px] text-text-dim font-semibold tracking-[0.14em] uppercase">
                  {group.label}
                </span>
              </div>
            )}
            {group.items.map(({ icon: Icon, label, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  title={collapsed ? label : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl text-sm transition-all duration-150",
                    active
                      ? "bg-purple-500/20 text-white border border-purple-500/25"
                      : "text-text-muted hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className={cn("shrink-0 w-4 h-4", active ? "text-purple-400" : "")} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="whitespace-nowrap flex-1"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {active && !collapsed && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-muted hover:text-white hover:bg-white/5 text-sm transition-all"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          {!collapsed && <span>View Website</span>}
        </Link>
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-dim hover:text-white hover:bg-white/5 text-sm transition-all"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
