"use client";

import { Contrast, Monitor, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export type ThemeMode = "system" | "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("system");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("grumeup-theme") as ThemeMode | null) || "system";
    setTheme(savedTheme);
    applyTheme(savedTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const current = (localStorage.getItem("grumeup-theme") as ThemeMode | null) || "system";
      if (current === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleSelectTheme = (mode: ThemeMode) => {
    setTheme(mode);
    localStorage.setItem("grumeup-theme", mode);
    applyTheme(mode);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-full shadow-sm">
      <button
        type="button"
        onClick={() => handleSelectTheme("system")}
        title="System Theme"
        className={`p-2 rounded-full transition-all duration-200 ${
          theme === "system"
            ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs font-bold"
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
        aria-label="System Theme"
      >
        <Monitor className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => handleSelectTheme("dark")}
        title="Dark Mode"
        className={`p-2 rounded-full transition-all duration-200 ${
          theme === "dark"
            ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs font-bold"
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
        aria-label="Dark Mode"
      >
        <Contrast className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => handleSelectTheme("light")}
        title="Light Theme"
        className={`p-2 rounded-full transition-all duration-200 ${
          theme === "light"
            ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs font-bold"
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
        aria-label="Light Theme"
      >
        <Sun className="w-4 h-4" />
      </button>
    </div>
  );
}

function applyTheme(mode: ThemeMode): void {
  const root = document.documentElement;
  const body = document.body;

  const isDark =
    mode === "dark" ||
    (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (isDark) {
    root.classList.add("dark");
    body?.classList.add("dark");
    return;
  }

  root.classList.remove("dark");
  body?.classList.remove("dark");
}
