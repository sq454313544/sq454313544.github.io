import { loadNotes } from "@/lib/content/loaders";
import { getAllCategories } from "@/lib/content/queries";
import Link from "next/link";
import { Empty } from "@/components/primitives/states";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "分类",
  description: "按分类浏览笔记",
};

export default function CategoriesPage() {
  const notes = loadNotes();
  const categories = getAllCategories(notes);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">分类</h1>
      {categories.length === 0 ? (
        <Empty message="暂无分类" />
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/categories/${cat.name}`}
              className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-sm transition-colors"
            >
              {cat.name}
              <span className="text-xs text-gray-400">({cat.count})</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
