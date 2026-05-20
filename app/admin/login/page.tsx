"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Incorrect password. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="aurora-1 absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-700/15 rounded-full blur-[120px]" />
        <div className="aurora-2 absolute bottom-0 right-0 w-[400px] h-[300px] bg-purple-900/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="w-16 h-16 relative">
            <Image src="/logo-symbol.png" alt="AxisMed" fill className="object-contain drop-shadow-[0_0_16px_rgba(164,158,207,0.6)]" priority />
          </div>
        </div>

        <div className="glass glow-border rounded-2xl p-8">
          <div className="text-center mb-8">
            <Lock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h1 className="font-display text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-text-secondary text-sm mt-1">Enter your password to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white/5 border border-border-strong rounded-xl px-4 py-3 text-white placeholder:text-text-dim focus:outline-none focus:border-purple-500/60 focus:bg-white/8 transition-all pr-12"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-muted transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-purple-500 hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(164,158,207,0.4)]"
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-text-dim text-xs mt-6">
          This area is restricted to authorized personnel only.
        </p>
      </div>
    </div>
  );
}
