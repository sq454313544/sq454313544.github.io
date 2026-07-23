import { loadAllContent } from "@/lib/content/loaders";
import { buildSearchIndex } from "@/lib/search/index";
import { search } from "@/lib/search/matcher";
import Link from "next/link";
import { Empty } from "@/components/primitives/states";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "搜索",
  description: "搜索全站内容",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const allContent = loadAllContent();
  const index = buildSearchIndex(allContent);

  const results = q ? search(index, q) : [];

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">搜索</h1>

      <form method="get" action="/search" className="mb-6">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="搜索标题、描述、标签..."
          className="w-full border rounded px-3 py-2 text-sm"
          autoFocus
        />
      </form>

      {q && results.length === 0 && (
        <Empty message={`未找到与「${q}」相关的内容`} />
      )}

      {results.length > 0 && (
        <>
          <p className="text-sm text-gray-400 mb-4">
            找到 {results.length} 条结果
          </p>
          <ul className="divide-y">
            {results.map((r) => {
              const base =
                r.entry.type === "note"
                  ? "/notes"
                  : r.entry.type === "project"
                    ? "/projects"
                    : "/dashboards";
              return (
                <li key={`${r.entry.type}:${r.entry.slug}`} className="py-3">
                  <Link
                    href={`${base}/${r.entry.slug}`}
                    className="block group"
                  >
                    <span className="text-xs text-gray-400">
                      {r.entry.type === "note"
                        ? "笔记"
                        : r.entry.type === "project"
                          ? "项目"
                          : "BI 案例"}
                    </span>
                    <h3 className="text-base font-medium group-hover:text-gray-600">
                      {r.entry.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {r.entry.description}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </main>
  );
}
