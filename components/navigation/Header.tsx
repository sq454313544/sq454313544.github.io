"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { ThemeSwitch, ThemeToggle } from "./ThemeSwitch";

const NAV_ITEMS = [
  { href: "/notes", label: "笔记" },
  { href: "/projects", label: "项目" },
  { href: "/dashboards", label: "BI 案例" },
  { href: "/about", label: "关于" },
] as const;

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({ className }: { className?: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const drawerId = useId();

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const linkClassName = (href: string) =>
    `border-b-2 px-1 py-3 text-sm font-medium transition-colors duration-150 ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
      isActivePath(pathname, href)
        ? "border-primary text-primary"
        : "border-transparent text-text-secondary hover:border-border hover:text-primary"
    }`;

  return (
    <header className={`site-header sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur-md ${className ?? ""}`}>
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="shrink-0 whitespace-nowrap text-sm font-semibold text-text-primary transition-colors duration-150 ease-standard hover:text-primary sm:text-base">
          金仔伟 · Data & AI
        </Link>
        <nav aria-label="主导航" className="hidden items-center gap-4 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className={linkClassName(item.href)}>{item.label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link href="/search" className="inline-flex h-10 items-center rounded-button px-2 text-sm text-text-secondary transition-colors duration-150 ease-standard hover:bg-surface-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" aria-label="搜索">搜索</Link>
          <Link href="/resume" className="hidden h-10 items-center rounded-button px-2 text-sm text-text-secondary transition-colors duration-150 ease-standard hover:bg-surface-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:inline-flex">简历</Link>
          <ThemeToggle className="hidden sm:inline-flex" />
          <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-button border border-border text-text-secondary transition-colors duration-150 ease-standard hover:bg-surface-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden" aria-expanded={isOpen} aria-controls={drawerId} aria-label={isOpen ? "关闭导航菜单" : "打开导航菜单"} onClick={() => setIsOpen((open) => !open)}>
            <span aria-hidden="true" className="text-lg">{isOpen ? "×" : "☰"}</span>
          </button>
        </div>
      </div>
      <div id={drawerId} hidden={!isOpen} className="border-t border-border bg-surface px-4 py-4 shadow-lg md:hidden">
        <nav aria-label="移动端主导航" className="mx-auto grid max-w-6xl gap-1">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className={`rounded-button px-3 py-3 text-sm font-medium ${isActivePath(pathname, item.href) ? "bg-surface-soft text-primary" : "text-text-secondary hover:bg-surface-soft hover:text-primary"}`}>{item.label}</Link>
          ))}
          <Link href="/resume" onClick={() => setIsOpen(false)} className={`rounded-button px-3 py-3 text-sm font-medium ${isActivePath(pathname, "/resume") ? "bg-surface-soft text-primary" : "text-text-secondary hover:bg-surface-soft hover:text-primary"}`}>简历</Link>
          <div className="mt-2 border-t border-border pt-4"><ThemeSwitch /></div>
        </nav>
      </div>
    </header>
  );
}
