"use client";

import { Empty } from "@/components/primitives/states";
import type { SearchIndexEntry } from "@/lib/search/index";
import { search } from "@/lib/search/matcher";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function SearchResults({ index, className }: { index: SearchIndexEntry[]; className?: string }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const results = query ? search(index, query) : [];

  return <div className={className}>
    <form method="get" action="/search" className="mb-6">
      <input key={query} type="search" name="q" defaultValue={query} placeholder="搜索标题、描述、标签..." aria-label="搜索全站内容" className="w-full border rounded px-3 py-2 text-sm" autoFocus />
    </form>
    {query && results.length === 0 && <Empty message={`未找到与「${query}」相关的内容`} />}
    {results.length > 0 && <><p className="text-sm text-gray-400 mb-4">找到 {results.length} 条结果</p><ul className="divide-y">{results.map((result) => {
      const basePath = result.entry.type === "note" ? "/notes" : result.entry.type === "project" ? "/projects" : "/dashboards";
      const typeLabel = result.entry.type === "note" ? "笔记" : result.entry.type === "project" ? "项目" : "BI 案例";
      return <li key={`${result.entry.type}:${result.entry.slug}`} className="py-3"><Link href={`${basePath}/${result.entry.slug}`} className="block group"><span className="text-xs text-gray-400">{typeLabel}</span><h3 className="text-base font-medium group-hover:text-gray-600">{result.entry.title}</h3><p className="text-sm text-gray-500 line-clamp-2">{result.entry.description}</p></Link></li>;
    })}</ul></>}
  </div>;
}
