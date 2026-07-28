import { notFound } from "next/navigation";
import { loadProjects } from "@/lib/content/loaders";
import { getPrevNext, getRelated } from "@/lib/content/queries";
import type { ProjectItem } from "@/lib/content/types";
import { PrevNextNav } from "@/components/content/PrevNextNav";
import { RelatedArticles } from "@/components/content/RelatedArticles";
import { DetailMeta, type DetailMetaItem } from "@/components/content/DetailMeta";
import type { Metadata } from "next";
import { PROJECT_TYPE_LABELS } from "@/lib/content/types";
import { ContentCover } from "@/components/content/ContentCover";

export const dynamicParams = false;

export function generateStaticParams() {
  return loadProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = loadProjects().find((item) => item.slug === slug);
  return project ? { title: project.meta.title, description: project.meta.description } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projects = loadProjects();
  const project = projects.find((item): item is ProjectItem => item.slug === slug);
  if (!project) notFound();

  const { default: Content } = await import(`@/content/projects/${slug}.mdx`);
  const { prev, next } = getPrevNext(projects, slug);
  const related = getRelated(projects, project);
  const statusLabels: Record<ProjectItem["meta"]["status"], string> = {
    completed: "已完成",
    in_progress: "进行中",
    maintained: "维护中",
    archived: "已归档",
  };
  const metaItems: DetailMetaItem[] = [
    { label: "项目状态", value: statusLabels[project.meta.status] },
    { label: "项目类型", value: PROJECT_TYPE_LABELS[project.meta.projectType] },
    { label: "技术栈", value: project.meta.techStack.join(" · ") },
    { label: "发布于", value: project.meta.publishedAt },
    ...(project.meta.updatedAt !== project.meta.publishedAt ? [{ label: "更新于", value: project.meta.updatedAt }] : []),
    ...(project.meta.repository ? [{ label: "Repository", value: <a href={project.meta.repository} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">查看仓库</a> }] : []),
    ...(project.meta.demo ? [{ label: "Demo", value: <a href={project.meta.demo} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">查看演示</a> }] : []),
  ];

  return (
    <main className="mx-auto w-full max-w-detail px-5 py-10 sm:px-8 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_13.75rem] lg:gap-12">
        <article className="min-w-0">
          <header className="border-b border-border pb-7">
            <ContentCover slug={project.slug} className="mb-7 aspect-[2/1]" />
            <p className="text-auxiliary font-medium text-primary">{PROJECT_TYPE_LABELS[project.meta.projectType]}</p>
            <h1 className="mt-2 text-h2 font-semibold leading-tight text-text-primary sm:text-h1">{project.meta.title}</h1>
            <p className="mt-4 text-body leading-body text-text-secondary">{project.meta.description}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="项目技术栈">
              {project.meta.techStack.map((tech) => <li key={tech} className="rounded-tag border border-border px-2 py-0.5 text-tag text-text-secondary">{tech}</li>)}
            </ul>
          </header>
          <div className="mt-10"><Content /></div>
          <PrevNextNav prev={prev} next={next} basePath="/projects" />
          <RelatedArticles items={related} />
        </article>
        <DetailMeta title="项目资料" items={metaItems} className="lg:sticky lg:top-20" />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "CreativeWork", name: project.meta.title, description: project.meta.description, datePublished: project.meta.publishedAt, dateModified: project.meta.updatedAt }) }} />
    </main>
  );
}
