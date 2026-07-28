import Link from "next/link";
import { loadNotes } from "@/lib/content/loaders";
import { getPublished, getAllCategories, getAllTags } from "@/lib/content/queries";
import type { NoteItem } from "@/lib/content/types";
import { Empty } from "@/components/primitives/states";
import type { Metadata } from "next";
import { ContentCover } from "@/components/content/ContentCover";

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
    <main className="mx-auto w-full max-w-default px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-10 border-b border-border pb-6">
        <p className="text-auxiliary font-medium text-primary">KNOWLEDGE BASE</p>
        <h1 className="mt-2 text-h2 font-semibold leading-tight text-text-primary sm:text-h1">学习笔记</h1>
        <p className="mt-3 max-w-2xl text-body leading-body text-text-secondary">
          技术学习、方法沉淀与数据产品实践的持续记录。
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[13.75rem_minmax(0,1fr)]">
        <aside className="space-y-7 lg:pr-6">
          {categories.length > 0 && (
            <nav aria-label="笔记分类">
              <h2 className="text-auxiliary font-semibold tracking-wide text-text-secondary">分类</h2>
              <ul className="mt-3 space-y-1">
                {categories.map((cat) => (
                  <li key={cat.name}>
                    <Link
                      href={`/categories/${encodeURIComponent(cat.name)}`}
                      className="flex min-h-6 items-center justify-between gap-3 rounded-button px-2 py-1 text-sm text-text-secondary transition-colors duration-150 ease-standard hover:bg-surface-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <span>{cat.name}</span>
                      <span className="text-text-muted">{cat.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {tags.length > 0 && (
            <nav aria-label="笔记标签">
              <h2 className="text-auxiliary font-semibold tracking-wide text-text-secondary">标签</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {tags.slice(0, 20).map((tag) => (
                  <li key={tag.name}>
                    <Link
                      href={`/tags/${encodeURIComponent(tag.name)}`}
                      className="inline-flex min-h-6 items-center rounded-tag border border-border px-2 py-0.5 text-tag text-text-secondary transition-colors duration-150 ease-standard hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {tag.name} <span className="ml-1 text-text-muted">{tag.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>

        <section aria-label="笔记列表">
          {notes.length === 0 ? (
            <Empty message="暂无学习笔记" />
          ) : (
            <ul className="border-t border-border">
              {notes.map((note) => (
                <li key={note.slug} className="border-b border-border">
                  <Link
                    href={`/notes/${note.slug}`}
                    className="group block py-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                  >
                    {note.meta.cover && <ContentCover slug={note.slug} className="mb-5 aspect-[2/1] max-w-xl" />}
                    <h2 className="text-card-title font-semibold leading-tight text-text-primary transition-colors duration-150 ease-standard group-hover:text-primary">
                      {note.meta.title}
                    </h2>
                    <p className="mt-2 text-sm leading-normal text-text-secondary">{note.meta.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-auxiliary text-text-muted">
                      <span>{note.meta.category}</span>
                      <span aria-hidden="true">·</span>
                      <time dateTime={note.meta.publishedAt}>{note.meta.publishedAt}</time>
                      <span aria-hidden="true">·</span>
                      <span>阅读约 {note.readingTime} 分钟</span>
                    </div>
                    {note.meta.tags.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="文章标签">
                        {note.meta.tags.map((tag) => (
                          <li key={tag} className="rounded-tag bg-surface-soft px-2 py-0.5 text-tag text-text-secondary">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
