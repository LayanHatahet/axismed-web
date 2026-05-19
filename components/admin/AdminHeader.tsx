"use client";

import React from "react";
import { Bell, Search, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props { title: string; subtitle?: string; action?: React.ReactNode }

export function AdminHeader({ title, subtitle, action }: Props) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <header className="h-16 border-b border-border bg-bg-base/80 backdrop-blur-sm flex items-center px-6 gap-4 sticky top-0 z-20">
      <div className="flex-1">
        <h1 className="font-display font-bold text-white text-lg leading-none">{title}</h1>
        {subtitle && <p className="text-text-muted text-xs mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {action && <div>{action}</div>}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-dim" />
          <input
            placeholder="Search..."
            className="bg-bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-text-dim outline-none focus:border-purple-500/50 transition-colors w-48"
          />
        </div>

        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-bg-surface border border-border text-text-muted hover:text-white hover:border-purple-500/30 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full" />
        </button>

        <button
          onClick={handleLogout}
          title="Sign out"
          className="w-9 h-9 rounded-lg bg-bg-surface border border-border flex items-center justify-center text-text-muted hover:text-red-400 hover:border-red-500/30 transition-all"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
