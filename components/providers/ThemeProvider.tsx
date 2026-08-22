"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // deferred a frame: the pre-hydration head script has already stamped
    // data-theme, so this only syncs React state without cascading renders
    const id = requestAnimationFrame(() => {
      const stored = localStorage.getItem("axismed-theme") as Theme | null;
      const system = window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
      const initial = stored ?? system;
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("axismed-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  // Always render the Provider: swapping the wrapper type after mount (the old
  // `mounted` gate) remounted the entire app subtree once per page load.
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
