"use client";

import { Empty } from "@/components/primitives/states";
import type { ProjectItem } from "@/lib/content/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PROJECT_TYPE_LABELS } from "@/lib/content/types";
import { ContentCover } from "@/components/content/ContentCover";

const projectTypes = ["agent", "dashboard", "pipeline", "tool", "other"] as const;
const statusLabels: Record<ProjectItem["meta"]["status"], string> = { completed: "已完成", in_progress: "进行中", maintained: "维护中", archived: "已归档" };

export function ProjectList({ projects, tags, className }: { projects: ProjectItem[]; tags: { name: string; count: number }[]; className?: string }) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "";
  const tech = searchParams.get("tech") ?? "";
  const filtered = projects.filter((project) => (!type || project.meta.projectType === type) && (!tech || project.meta.techStack.includes(tech)));

  return <div className={`mt-10 grid gap-10 lg:grid-cols-[13.75rem_minmax(0,1fr)] ${className ?? ""}`}><aside className="space-y-7 lg:pr-6"><nav aria-label="项目类型"><h2 className="text-auxiliary font-semibold tracking-wide text-text-secondary">项目类型</h2><ul className="mt-3 space-y-1"><li><Link href="/projects" className="block rounded-button px-2 py-1 text-sm text-text-secondary hover:bg-surface-soft hover:text-primary">全部</Link></li>{projectTypes.map((projectType) => <li key={projectType}><Link href={`/projects?type=${projectType}`} className="block rounded-button px-2 py-1 text-sm text-text-secondary hover:bg-surface-soft hover:text-primary">{PROJECT_TYPE_LABELS[projectType]}</Link></li>)}</ul></nav><nav aria-label="项目技术栈"><h2 className="text-auxiliary font-semibold tracking-wide text-text-secondary">技术栈</h2><ul className="mt-3 flex flex-wrap gap-2">{tags.map((tag) => <li key={tag.name}><Link href={`/projects?tech=${encodeURIComponent(tag.name)}`} className="inline-flex rounded-tag border border-border px-2 py-0.5 text-tag text-text-secondary hover:border-primary hover:text-primary">{tag.name}<span className="ml-1 text-text-muted">{tag.count}</span></Link></li>)}</ul></nav></aside>{filtered.length === 0 ? <Empty message="暂无符合条件的项目案例" /> : <ul className="grid gap-5 sm:grid-cols-2">{filtered.map((project) => <li key={project.slug}><Link href={`/projects/${project.slug}`} className="group flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface p-5 shadow-card transition duration-150 ease-standard hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><ContentCover slug={project.slug} priority className="mb-5 aspect-[2/1]" /><div className="flex flex-wrap items-center gap-2"><h2 className="text-card-title font-semibold leading-tight text-text-primary group-hover:text-primary">{project.meta.title}</h2><span className="rounded-tag bg-accent-bg px-2 py-0.5 text-tag text-accent-text">{statusLabels[project.meta.status]}</span></div><p className="mt-2 flex-1 text-sm text-text-secondary">{project.meta.description}</p><div className="mt-3 flex flex-wrap gap-2 text-auxiliary text-text-muted"><span>{PROJECT_TYPE_LABELS[project.meta.projectType]}</span><span>·</span><time dateTime={project.meta.publishedAt}>{project.meta.publishedAt}</time>{project.meta.techStack.slice(0, 4).map((techName) => <span key={techName} className="rounded-tag bg-surface-soft px-1.5 py-0.5 text-tag text-text-secondary">{techName}</span>)}</div></Link></li>)}</ul>}</div>;
}
