import { loadAllContent } from "@/lib/content/loaders";
import { buildSearchIndex } from "@/lib/search/index";
import { SearchResults } from "@/components/search/SearchResults";
import { Loading } from "@/components/primitives/states";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "搜索",
  description: "搜索全站内容",
};

export default function SearchPage() {
  const allContent = loadAllContent();
  const index = buildSearchIndex(allContent);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">搜索</h1>
      <Suspense fallback={<Loading className="py-6" />}>
        <SearchResults index={index} />
      </Suspense>
    </main>
  );
}
