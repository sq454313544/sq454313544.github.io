import { loadAllContent } from "@/lib/content/loaders";
import { buildSearchIndex } from "@/lib/search/index";
import { SearchResults } from "@/components/search/SearchResults";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "搜索",
  description: "搜索项目案例、实践笔记与 BI 案例",
  alternates: { canonical: "/search" },
};

export default function SearchPage() {
  const allContent = loadAllContent();
  const index = buildSearchIndex(allContent);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">搜索</h1>
      <SearchResults index={index} />
    </main>
  );
}
