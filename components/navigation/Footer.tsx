import Link from "next/link";

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={`site-footer border-t border-border py-6 text-center text-sm text-text-muted ${className ?? ""}`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <nav aria-label="页脚导航" className="flex justify-center gap-4 mb-2">
          <Link href="/about" className="transition-colors duration-150 ease-standard hover:text-primary">关于</Link>
          <Link href="/resume" className="transition-colors duration-150 ease-standard hover:text-primary">简历</Link>
        </nav>
        <p>个人技术博客 · 数据产品工程师</p>
      </div>
    </footer>
  );
}
