import { notFound } from "next/navigation";
import { loadNotes } from "@/lib/content/loaders";
import type { NoteItem } from "@/lib/content/types";
import type { Metadata } from "next";

export const dynamicParams = false;

export function generateStaticParams() {
  const notes = loadNotes().filter((n) => !n.meta.draft);
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const notes = loadNotes();
  const note = notes.find((n) => n.slug === slug && !n.meta.draft);
  if (!note) return {};
  return {
    title: note.meta.title,
    description: note.meta.description,
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const notes = loadNotes();
  const note = notes.find(
    (n): n is NoteItem => n.slug === slug && !n.meta.draft
  );

  if (!note) notFound();

  const { default: Content } = await import(
    `@/content/notes/${slug}.mdx`
  );

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <article>
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{note.meta.title}</h1>
          <p className="text-gray-600 mb-3">{note.meta.description}</p>
          <div className="flex flex-wrap gap-2 text-sm text-gray-500">
            <span>{note.meta.publishedAt}</span>
            {note.meta.updatedAt !== note.meta.publishedAt && (
              <span>· 更新于 {note.meta.updatedAt}</span>
            )}
            <span>· 阅读约 {note.readingTime} 分钟</span>
            <span>· {note.meta.category}</span>
          </div>
          {note.meta.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {note.meta.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>
        <div className="prose prose-gray max-w-none">
          <Content />
        </div>
      </article>
    </main>
  );
}
