"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, SystemIcon } from "./icons/SiteIcons";

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

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const themes = ["system", "light", "dark"] as const;
  const labels = { system: "跟随系统", light: "浅色", dark: "深色" } as const;
  const currentTheme = themes.includes(theme as (typeof themes)[number])
    ? (theme as (typeof themes)[number])
    : "system";

  if (!mounted) {
    return <span aria-hidden="true" className={`block h-10 w-10 ${className ?? ""}`} />;
  }

  const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
  const icon = currentTheme === "light"
    ? <SunIcon aria-hidden="true" className="size-5" />
    : currentTheme === "dark"
      ? <MoonIcon aria-hidden="true" className="size-5" />
      : <SystemIcon aria-hidden="true" className="size-5" />;

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={`当前主题：${labels[currentTheme]}。切换至${labels[nextTheme]}`}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-button border border-border bg-surface text-text-secondary transition-colors duration-150 ease-standard hover:bg-surface-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className ?? ""}`}
    >
      {icon}
      <span className="sr-only">当前主题：{labels[currentTheme]}</span>
    </button>
  );
}
