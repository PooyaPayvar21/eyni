"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = theme ?? resolvedTheme;

  if (!mounted) return (
    <button
      className="px-3 py-2 rounded-md border"
      aria-label="Toggle theme"
      disabled
    >
      Theme
    </button>
  );

  const isDark = current === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="px-3 py-2 rounded-md border hover:bg-accent"
      aria-label="Toggle theme"
    >
      {isDark ? "🌙" : "🌞"}
    </button>
  );
}
