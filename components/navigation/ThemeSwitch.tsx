"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const THEME_OPTIONS = [
  { value: "light", label: "浅色" },
  { value: "dark", label: "深色" },
  { value: "system", label: "跟随系统" },
] as const;

export function ThemeSwitch({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  if (!mounted) {
    return <div aria-hidden="true" className={`h-8 w-24 ${className ?? ""}`} />;
  }

  return (
    <label className={`flex items-center gap-2 text-sm text-text-secondary ${className ?? ""}`}>
      <span className="sr-only">主题</span>
      <select
        aria-label="选择主题"
        className="h-8 rounded-button border border-border bg-surface px-2 text-sm text-text-primary transition-colors duration-150 ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        value={theme}
        onChange={(event) => setTheme(event.target.value)}
      >
        {THEME_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
