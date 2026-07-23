import Link from "next/link";

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={`border-t py-6 text-center text-sm text-gray-400 ${className ?? ""}`}
    >
      <div className="max-w-3xl mx-auto px-4">
        <nav aria-label="页脚导航" className="flex justify-center gap-4 mb-2">
          <Link href="/about" className="hover:text-gray-600">关于</Link>
          <Link href="/resume" className="hover:text-gray-600">简历</Link>
          <Link href="/agent" className="hover:text-gray-600">Agent Demo</Link>
        </nav>
        <p>个人技术博客 · 数据产品工程师</p>
      </div>
    </footer>
  );
}
