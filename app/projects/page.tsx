import Link from "next/link";
import { loadProjects } from "@/lib/content/loaders";
import { getPublished, getAllTags } from "@/lib/content/queries";
import type { ProjectItem } from "@/lib/content/types";
import { Empty } from "@/components/primitives/states";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "项目作品集", description: "数据产品与自动化项目案例" };

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ type?: string; tech?: string }> }) {
  const { type, tech } = await searchParams;
  const projects = loadProjects();
  const published = getPublished(projects).filter((item): item is ProjectItem => item.type === "project");
  const tags = getAllTags(projects);
  const filtered = published.filter((project) => (!type || project.meta.projectType === type) && (!tech || project.meta.techStack.includes(tech)));
  const statusLabels: Record<ProjectItem["meta"]["status"], string> = { completed: "已完成", in_progress: "进行中", maintained: "维护中", archived: "已归档" };

  return (
    <main className="mx-auto w-full max-w-default px-5 py-10 sm:px-8 sm:py-14">
      <header className="border-b border-border pb-6"><p className="text-auxiliary font-medium text-primary">PROJECT WORK</p><h1 className="mt-2 text-h2 font-semibold leading-tight text-text-primary sm:text-h1">项目作品集</h1><p className="mt-3 text-body leading-body text-text-secondary">数据产品、自动化流程与智能应用的项目复盘。</p></header>
      <div className="mt-10 grid gap-10 lg:grid-cols-[13.75rem_minmax(0,1fr)]">
        <aside className="space-y-7 lg:pr-6">
          <nav aria-label="项目类型"><h2 className="text-auxiliary font-semibold tracking-wide text-text-secondary">项目类型</h2><ul className="mt-3 space-y-1"><li><Link href="/projects" className="block rounded-button px-2 py-1 text-sm text-text-secondary hover:bg-surface-soft hover:text-primary">全部</Link></li>{["agent", "dashboard", "pipeline", "tool", "other"].map((projectType) => <li key={projectType}><Link href={`/projects?type=${projectType}`} className="block rounded-button px-2 py-1 text-sm text-text-secondary hover:bg-surface-soft hover:text-primary">{projectType}</Link></li>)}</ul></nav>
          <nav aria-label="项目技术栈"><h2 className="text-auxiliary font-semibold tracking-wide text-text-secondary">技术栈</h2><ul className="mt-3 flex flex-wrap gap-2">{tags.map((tag) => <li key={tag.name}><Link href={`/projects?tech=${encodeURIComponent(tag.name)}`} className="inline-flex rounded-tag border border-border px-2 py-0.5 text-tag text-text-secondary hover:border-primary hover:text-primary">{tag.name}<span className="ml-1 text-text-muted">{tag.count}</span></Link></li>)}</ul></nav>
        </aside>
        {filtered.length === 0 ? <Empty message="暂无符合条件的项目案例" /> : <ul className="border-t border-border">{filtered.map((project) => <li key={project.slug} className="border-b border-border"><Link href={`/projects/${project.slug}`} className="group block py-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><div className="flex flex-wrap items-center gap-2"><h2 className="text-card-title font-semibold leading-tight text-text-primary group-hover:text-primary">{project.meta.title}</h2><span className="rounded-tag bg-accent-bg px-2 py-0.5 text-tag text-accent-text">{statusLabels[project.meta.status]}</span></div><p className="mt-2 text-sm text-text-secondary">{project.meta.description}</p><div className="mt-3 flex flex-wrap gap-2 text-auxiliary text-text-muted"><span>{project.meta.projectType}</span><span>·</span><time dateTime={project.meta.publishedAt}>{project.meta.publishedAt}</time>{project.meta.techStack.slice(0, 4).map((techName) => <span key={techName} className="rounded-tag bg-surface-soft px-1.5 py-0.5 text-tag text-text-secondary">{techName}</span>)}</div></Link></li>)}</ul>}
      </div>
    </main>
  );
}
