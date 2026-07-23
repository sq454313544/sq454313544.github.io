import { notFound } from "next/navigation";
import { loadAllContent } from "@/lib/content/loaders";
import { getByTag } from "@/lib/content/queries";
import Link from "next/link";
import type { Metadata } from "next";

export function generateStaticParams() {
  const items = loadAllContent();
  const tagSet = new Set<string>();
  for (const item of items) {
    const tags: string[] =
      item.type === "note"
        ? item.meta.tags
        : item.type === "project"
          ? item.meta.techStack
          : [...item.meta.tools, ...item.meta.metrics];
    tags.forEach((t) => tagSet.add(t));
  }
  return [...tagSet].map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return { title: `标签: ${tag}` };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const items = loadAllContent();
  const results = getByTag(items, tag);

  if (results.length === 0) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">标签: {tag}</h1>
      <p className="text-gray-500 mb-6">{results.length} 条内容</p>
      <ul className="divide-y">
        {results.map((item) => {
          const base =
            item.type === "note"
              ? "/notes"
              : item.type === "project"
                ? "/projects"
                : "/dashboards";
          return (
            <li key={`${item.type}:${item.slug}`} className="py-3">
              <Link href={`${base}/${item.slug}`} className="block group">
                <span className="text-xs text-gray-400">
                  {item.type === "note"
                    ? "笔记"
                    : item.type === "project"
                      ? "项目"
                      : "BI 案例"}
                </span>
                <h3 className="text-base font-medium group-hover:text-gray-600">
                  {item.meta.title}
                </h3>
                <p className="text-sm text-gray-500">{item.meta.description}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
