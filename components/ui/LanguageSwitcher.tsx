"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Check, Loader2, X } from "lucide-react";
import { translatePage, resetPage, applyRTL } from "@/lib/dom-translator";

const LANGUAGES = [
  { code: "en",    name: "English",              flag: "🇬🇧", native: "English" },
  { code: "ar",    name: "Arabic",               flag: "🇸🇦", native: "العربية" },
  { code: "fr",    name: "French",               flag: "🇫🇷", native: "Français" },
  { code: "es",    name: "Spanish",              flag: "🇪🇸", native: "Español" },
  { code: "de",    name: "German",               flag: "🇩🇪", native: "Deutsch" },
  { code: "tr",    name: "Turkish",              flag: "🇹🇷", native: "Türkçe" },
  { code: "fa",    name: "Persian",              flag: "🇮🇷", native: "فارسی" },
  { code: "ru",    name: "Russian",              flag: "🇷🇺", native: "Русский" },
  { code: "zh",    name: "Chinese",              flag: "🇨🇳", native: "中文" },
  { code: "hi",    name: "Hindi",                flag: "🇮🇳", native: "हिन्दी" },
];

export function LanguageSwitcher() {
  const [open, setOpen]           = useState(false);
  const [current, setCurrent]     = useState("en");
  const [loading, setLoading]     = useState(false);
  const [progress, setProgress]   = useState(0);
  const [error, setError]         = useState<string | null>(null);
  const ref                       = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function switchLanguage(lang: typeof LANGUAGES[0]) {
    setOpen(false);
    setError(null);
    if (lang.code === current) return;

    setLoading(true);
    setProgress(0);

    try {
      if (lang.code === "en") {
        resetPage();
        document.documentElement.removeAttribute("dir");
        document.documentElement.setAttribute("lang", "en");
      } else {
        await translatePage(lang.code, lang.name, (pct) => setProgress(pct));
        applyRTL(lang.code);
      }
      setCurrent(lang.code);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const display = msg.includes("not configured")
        ? "Add OPENAI_API_KEY to environment variables"
        : "Translation failed — please try again";
      setError(display);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }

  const currentLang = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-text-secondary hover:text-white hover:border-white/20 text-sm transition-all disabled:opacity-60"
        aria-label="Switch language"
        title="Translate website"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Globe className="w-4 h-4" />
        )}
        <span className="text-xs hidden sm:inline">{currentLang.flag}</span>
      </button>

      {/* Progress bar */}
      {loading && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-400 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-900/90 text-red-200 text-xs px-3 py-2 rounded-lg border border-red-700/50 z-50">
          {error}
        </div>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full right-0 mt-2 w-52 glass-strong border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-white/8 flex items-center justify-between">
            <span className="text-xs font-semibold text-text-dim uppercase tracking-wider">Translate Page</span>
            <button onClick={() => setOpen(false)} className="text-text-dim hover:text-white transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-1 max-h-72 overflow-y-auto">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-white/6 transition-colors text-left"
              >
                <span className="text-base w-6 text-center">{lang.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white/90 font-medium text-sm leading-none mb-0.5">{lang.native}</div>
                  <div className="text-text-dim text-xs">{lang.name}</div>
                </div>
                {current === lang.code && (
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="px-3 py-2 border-t border-white/8">
            <p className="text-text-dim text-[10px] leading-relaxed">
              AI-powered translation. Medical terms preserved.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
