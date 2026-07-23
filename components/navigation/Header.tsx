import Link from "next/link";

const NAV_ITEMS = [
  { href: "/notes", label: "笔记" },
  { href: "/projects", label: "项目" },
  { href: "/dashboards", label: "BI 案例" },
  { href: "/about", label: "关于" },
] as const;

export function Header({ className }: { className?: string }) {
  return (
    <header
      className={`border-b bg-white sticky top-0 z-10 ${className ?? ""}`}
    >
      <div className="max-w-3xl mx-auto px-4 h-12 flex items-center justify-between">
        <Link href="/" className="font-semibold text-gray-900 hover:text-gray-600">
          个人技术博客
        </Link>
        <nav aria-label="主导航" className="flex items-center gap-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/search"
            className="text-sm text-gray-400 hover:text-gray-600"
            aria-label="搜索"
          >
            搜索
          </Link>
        </nav>
      </div>
    </header>
  );
}
