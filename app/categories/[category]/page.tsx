import { notFound } from "next/navigation";
import { loadNotes } from "@/lib/content/loaders";
import { getByCategory } from "@/lib/content/queries";
import Link from "next/link";
import type { Metadata } from "next";

export function generateStaticParams() {
  const notes = loadNotes();
  const catSet = new Set(notes.map((n) => n.meta.category));
  return [...catSet].map((cat) => ({ category: cat }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  return { title: `分类: ${category}` };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const notes = loadNotes();
  const results = getByCategory(notes, category);

  if (results.length === 0) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">分类: {category}</h1>
      <p className="text-gray-500 mb-6">{results.length} 篇笔记</p>
      <ul className="divide-y">
        {results.map((note) => (
          <li key={note.slug} className="py-3">
            <Link href={`/notes/${note.slug}`} className="block group">
              <h3 className="text-base font-medium group-hover:text-gray-600">
                {note.meta.title}
              </h3>
              <p className="text-sm text-gray-500">{note.meta.description}</p>
              <span className="text-xs text-gray-400">{note.meta.publishedAt}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
