"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div
        style={{
          width:        34,
          height:       34,
          borderRadius: 100,
          background:   "rgba(var(--border-rgb), 0.04)",
          border:       "1px solid rgba(var(--border-rgb), 0.08)",
          flexShrink:   0,
        }}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      style={{
        width:          34,
        height:         34,
        borderRadius:   100,
        background:     "rgba(var(--border-rgb), 0.04)",
        border:         "1px solid rgba(var(--border-rgb), 0.08)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        cursor:         "pointer",
        color:          "rgba(var(--text-rgb), 0.5)",
        transition:     "all 0.2s",
        flexShrink:     0,
        padding:        0,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = "rgba(245,166,35,0.08)";
        el.style.borderColor = "rgba(245,166,35,0.18)";
        el.style.color = "rgba(245,166,35,0.8)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = "rgba(var(--border-rgb), 0.04)";
        el.style.borderColor = "rgba(var(--border-rgb), 0.08)";
        el.style.color = "rgba(var(--text-rgb), 0.5)";
      }}
    >
      {isDark
        ? <Sun size={15} strokeWidth={2} />
        : <Moon size={15} strokeWidth={2} />
      }
    </button>
  );
}
