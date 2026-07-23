import { notFound } from "next/navigation";
import { loadProjects } from "@/lib/content/loaders";
import { getPrevNext, getRelated } from "@/lib/content/queries";
import type { ProjectItem } from "@/lib/content/types";
import { PrevNextNav } from "@/components/content/PrevNextNav";
import { RelatedArticles } from "@/components/content/RelatedArticles";
import type { Metadata } from "next";

export const dynamicParams = false;

export function generateStaticParams() {
  return loadProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = loadProjects().find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.meta.title,
    description: project.meta.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projects = loadProjects();
  const project = projects.find(
    (p): p is ProjectItem => p.slug === slug
  );

  if (!project) notFound();

  const { default: Content } = await import(
    `@/content/projects/${slug}.mdx`
  );

  const { prev, next } = getPrevNext(projects, slug);
  const related = getRelated(projects, project);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <article>
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{project.meta.title}</h1>
          <p className="text-gray-600 mb-3">{project.meta.description}</p>
          <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-3">
            <span>{project.meta.publishedAt}</span>
            <span>·</span>
            <span className="bg-gray-100 px-1.5 py-0.5 rounded">{project.meta.status}</span>
            <span>·</span>
            <span>{project.meta.projectType}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.meta.techStack.map((tech) => (
              <span key={tech} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                {tech}
              </span>
            ))}
          </div>
          {project.meta.repository && (
            <a
              href={project.meta.repository}
              className="inline-block mt-3 text-sm text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              仓库链接 →
            </a>
          )}
        </header>

        <div className="prose prose-gray max-w-none">
          <Content />
        </div>

        <PrevNextNav prev={prev} next={next} basePath="/projects" />
        <RelatedArticles items={related} />
      </article>
    </main>
  );
}
