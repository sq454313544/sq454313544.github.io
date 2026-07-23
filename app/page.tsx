import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "数据产品工程师 · BI / AI 数据应用",
};

export default function HomePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <section className="mb-12">
        <h1 className="text-2xl font-bold mb-3">数据产品工程师</h1>
        <p className="text-gray-600 text-lg">BI / AI 数据应用</p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">核心能力</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>数据分析（SQL, Python, Power BI）</li>
          <li>数据产品设计（指标治理、智能问数）</li>
          <li>AI Agent 工程（LangGraph, RAG）</li>
        </ul>
      </section>

      <nav className="space-y-2">
        <h2 className="text-lg font-semibold mb-3">浏览</h2>
        <ul className="space-y-1">
          <li><Link href="/notes" className="text-blue-600 hover:underline">学习笔记 →</Link></li>
          <li><Link href="/projects" className="text-blue-600 hover:underline">项目作品集 →</Link></li>
          <li><Link href="/dashboards" className="text-blue-600 hover:underline">BI 案例 →</Link></li>
          <li><Link href="/search" className="text-blue-600 hover:underline">搜索 →</Link></li>
          <li><Link href="/about" className="text-blue-600 hover:underline">关于我 →</Link></li>
          <li><Link href="/agent" className="text-blue-600 hover:underline">Agent Demo（建设中）→</Link></li>
        </ul>
      </nav>
    </main>
  );
}
