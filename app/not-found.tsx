import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
      <p className="text-gray-500 mb-6">页面未找到</p>
      <div className="space-x-4">
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          返回首页
        </Link>
        <Link href="/search" className="text-blue-600 hover:underline text-sm">
          搜索内容
        </Link>
      </div>
    </main>
  );
}
