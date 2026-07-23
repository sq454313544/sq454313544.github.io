import { loadAllContent } from "@/lib/content/loaders";
import { getAllTags } from "@/lib/content/queries";
import Link from "next/link";
import { Empty } from "@/components/primitives/states";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "标签",
  description: "按标签浏览内容",
};

export default function TagsPage() {
  const items = loadAllContent();
  const tags = getAllTags(items);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">标签</h1>
      {tags.length === 0 ? (
        <Empty message="暂无标签" />
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={`/tags/${tag.name}`}
              className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-sm transition-colors"
            >
              {tag.name}
              <span className="text-xs text-gray-400">({tag.count})</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
