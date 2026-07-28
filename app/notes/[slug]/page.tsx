import { notFound } from "next/navigation";
import { loadNotes } from "@/lib/content/loaders";
import { getPrevNext, getRelated } from "@/lib/content/queries";
import type { NoteItem } from "@/lib/content/types";
import type { Metadata } from "next";
import { Toc, extractToc } from "@/components/content/Toc";
import { PrevNextNav } from "@/components/content/PrevNextNav";
import { RelatedArticles } from "@/components/content/RelatedArticles";

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
  const allNotes = loadNotes();
  const note = allNotes.find(
    (n): n is NoteItem => n.slug === slug && !n.meta.draft
  );

  if (!note) notFound();

  const { default: Content } = await import(
    `@/content/notes/${slug}.mdx`
  );

  const toc = extractToc(note.body);
  const { prev, next } = getPrevNext(allNotes, slug);
  const related = getRelated(allNotes, note);

  return (
    <main className="mx-auto w-full max-w-detail px-5 py-10 sm:px-8 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,47.5rem)_13.75rem] lg:items-start lg:gap-12">
        <article className="min-w-0">
          <header className="border-b border-border pb-7">
            <p className="text-auxiliary font-medium text-primary">{note.meta.category}</p>
            <h1 className="mt-2 text-h1 font-semibold leading-tight text-text-primary">{note.meta.title}</h1>
            <p className="mt-4 text-body leading-body text-text-secondary">{note.meta.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-auxiliary text-text-muted">
              <time dateTime={note.meta.publishedAt}>{note.meta.publishedAt}</time>
              {note.meta.updatedAt !== note.meta.publishedAt && (
                <>
                  <span aria-hidden="true">·</span>
                  <time dateTime={note.meta.updatedAt}>更新于 {note.meta.updatedAt}</time>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span>阅读约 {note.readingTime} 分钟</span>
            </div>
            {note.meta.tags.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="文章标签">
                {note.meta.tags.map((tag: string) => (
                  <li key={tag} className="rounded-tag border border-border px-2 py-0.5 text-tag text-text-secondary">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </header>

          {toc.length > 0 && (
            <aside className="my-7 lg:hidden">
              <Toc items={toc} />
            </aside>
          )}

          <div className="mt-10">
            <Content />
          </div>

          <PrevNextNav prev={prev} next={next} basePath="/notes" />
          <RelatedArticles items={related} />
        </article>

        {toc.length > 0 && (
          <aside className="sticky top-20 hidden lg:block">
            <Toc items={toc} />
          </aside>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: note.meta.title,
            description: note.meta.description,
            datePublished: note.meta.publishedAt,
            dateModified: note.meta.updatedAt,
          }),
        }}
      />
    </main>
  );
}
