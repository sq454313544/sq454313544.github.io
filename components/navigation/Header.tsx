import Link from "next/link";
import { ThemeSwitch } from "./ThemeSwitch";

const NAV_ITEMS = [
  { href: "/notes", label: "笔记" },
  { href: "/projects", label: "项目" },
  { href: "/dashboards", label: "BI 案例" },
  { href: "/about", label: "关于" },
] as const;

export function Header({ className }: { className?: string }) {
  return (
    <header
      className={`site-header sticky top-0 z-10 border-b border-border bg-surface ${className ?? ""}`}
    >
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold text-text-primary transition-colors duration-150 ease-standard hover:text-primary">
          个人技术博客
        </Link>
        <nav aria-label="主导航" className="flex items-center gap-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-text-secondary transition-colors duration-150 ease-standard hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/search"
            className="text-sm text-text-muted transition-colors duration-150 ease-standard hover:text-primary"
            aria-label="搜索"
          >
            搜索
          </Link>
          <Link
            href="/resume"
            className="text-sm text-text-secondary transition-colors duration-150 ease-standard hover:text-primary"
          >
            简历
          </Link>
          <ThemeSwitch />
        </nav>
      </div>
    </header>
  );
}
