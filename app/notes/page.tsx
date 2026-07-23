import Link from "next/link";
import { loadNotes } from "@/lib/content/loaders";
import { getPublished, getAllCategories, getAllTags } from "@/lib/content/queries";
import type { NoteItem } from "@/lib/content/types";
import { Empty } from "@/components/primitives/states";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "学习笔记",
  description: "技术学习、经验总结与知识分享",
};

export default function NotesPage() {
  const allNotes = loadNotes();
  const notes = getPublished(allNotes).filter(
    (n): n is NoteItem => n.type === "note"
  );
  const categories = getAllCategories(allNotes);
  const tags = getAllTags(allNotes);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">学习笔记</h1>

      {categories.length > 0 && (
        <nav aria-label="分类筛选" className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">分类</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/categories/${cat.name}`}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors"
              >
                {cat.name} ({cat.count})
              </Link>
            ))}
          </div>
        </nav>
      )}

      {tags.length > 0 && (
        <nav aria-label="标签筛选" className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">标签</h2>
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 20).map((tag) => (
              <Link
                key={tag.name}
                href={`/tags/${tag.name}`}
                className="text-xs bg-gray-50 hover:bg-gray-100 px-2 py-0.5 rounded transition-colors"
              >
                {tag.name} ({tag.count})
              </Link>
            ))}
          </div>
        </nav>
      )}

      {notes.length === 0 ? (
        <Empty message="暂无学习笔记" />
      ) : (
        <ul className="divide-y">
          {notes.map((note) => (
            <li key={note.slug} className="py-4">
              <Link href={`/notes/${note.slug}`} className="block group">
                <h3 className="text-lg font-medium group-hover:text-gray-600 mb-1">
                  {note.meta.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {note.meta.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                  <span>{note.meta.publishedAt}</span>
                  <span>·</span>
                  <span>{note.meta.category}</span>
                  <span>·</span>
                  <span>阅读约 {note.readingTime} 分钟</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
