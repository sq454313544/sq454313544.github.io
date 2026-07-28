import Link from "next/link";

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={`site-footer border-t border-border py-8 text-sm text-text-muted ${className ?? ""}`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} 金仔伟 · 数据产品工程师</p>
        <nav aria-label="页脚导航" className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-text-secondary">
          <Link href="/about" className="transition-colors duration-150 ease-standard hover:text-primary">关于</Link>
          <Link href="/resume" className="transition-colors duration-150 ease-standard hover:text-primary">简历</Link>
          <a href="https://github.com/sq454313544" target="_blank" rel="noopener noreferrer" className="transition-colors duration-150 ease-standard hover:text-primary">GitHub</a>
          <a href="mailto:454313544@qq.com" className="transition-colors duration-150 ease-standard hover:text-primary">邮箱</a>
          <Link href="/search" className="transition-colors duration-150 ease-standard hover:text-primary">搜索</Link>
        </nav>
      </div>
    </footer>
  );
}
