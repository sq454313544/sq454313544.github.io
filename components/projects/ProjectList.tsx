"use client";

import { Empty } from "@/components/primitives/states";
import type { ProjectItem } from "@/lib/content/types";
import Link from "next/link";
import { PROJECT_TYPE_LABELS } from "@/lib/content/types";
import { ContentCover } from "@/components/content/ContentCover";
import { useClientSearchParams } from "@/lib/hooks/useClientSearchParams";
import { PROJECT_GROUPS, projectGroupOf } from "@/lib/content/project-order";

const projectTypes = ["agent", "dashboard", "pipeline", "tool", "other"] as const;
const statusLabels: Record<ProjectItem["meta"]["status"], string> = { completed: "已完成", in_progress: "进行中", maintained: "维护中", archived: "已归档" };

/** 卡片上的阶段说明：区分生产使用与内部验证，不把页面更新时间当部署时间 */
const stageLabels: Record<string, string> = {
  "data-warehouse-modernization": "本机环境运行 · 日常全量刷新",
  "enterprise-qa-assistant": "内部验证 · 受控 Pilot",
  "enterprise-knowledge-assistant": "内部验证 · 正式试点验收推进中",
};

/** 每个项目的定位与本人职责，让卡片本身能说明做了什么 */
const roleLabels: Record<string, string> = {
  "data-warehouse-modernization":
    "梳理接入范围、分层建模、调度与质量治理，并对接看板、报表与取数交付。",
  "enterprise-qa-assistant":
    "产品与架构设计、核心开发：受控能力注册、参数与权限校验、检索与评测。",
  "enterprise-knowledge-assistant":
    "基于开源 WeKnora 定制问答与发布链路，负责版本与撤回治理、身份集成与验证。",
};

interface WecomSummary {
  title: string;
  description: string;
  href: string;
  lines: string[];
}

/** 筛选链接使用普通锚点，保证静态托管下每次点击都是一次完整加载，状态不会被客户端路由沿用 */
function FilterLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return <a href={href} aria-current={active ? "page" : undefined} className={`block rounded-button px-2 py-1 text-sm ${active ? "bg-surface-soft font-medium text-primary" : "text-text-secondary hover:bg-surface-soft hover:text-primary"}`}>{label}</a>;
}

export function ProjectList({ projects, wecom, tags, className }: { projects: ProjectItem[]; wecom?: WecomSummary; tags: { name: string; count: number }[]; className?: string }) {
  const searchParams = useClientSearchParams();
  const group = searchParams.get("group") ?? "";
  const type = searchParams.get("type") ?? "";
  const tech = searchParams.get("tech") ?? "";
  // 服务端已按代表案例优先排序，筛选只做过滤，顺序保持一致
  const filtered = projects.filter(
    (project) =>
      (!group || projectGroupOf(project.slug) === group) &&
      (!type || project.meta.projectType === type) &&
      (!tech || project.meta.techStack.includes(tech)),
  );
  // 技术栈筛选下不展示数仓交付摘要，避免与筛选结果矛盾
  const showWecom = !!wecom && !tech && (!group || group === "data") && (!type || type === "pipeline");

  return <div className={`mt-10 grid gap-10 lg:grid-cols-[13.75rem_minmax(0,1fr)] ${className ?? ""}`}>
    <aside className="space-y-7 lg:pr-6">
      <nav aria-label="展示分类">
        <h2 className="text-auxiliary font-semibold tracking-wide text-text-secondary">展示分类</h2>
        <ul className="mt-3 space-y-1">
          <li><FilterLink href="/projects" label="全部" active={!group} /></li>
          {PROJECT_GROUPS.map((item) => <li key={item.id}><FilterLink href={`/projects?group=${item.id}`} label={item.label} active={group === item.id} /></li>)}
        </ul>
      </nav>
      <nav aria-label="项目类型">
        <h2 className="text-auxiliary font-semibold tracking-wide text-text-secondary">项目类型</h2>
        <ul className="mt-3 space-y-1">
          <li><FilterLink href="/projects" label="全部" active={!type} /></li>
          {projectTypes.map((projectType) => <li key={projectType}><FilterLink href={`/projects?type=${projectType}`} label={PROJECT_TYPE_LABELS[projectType]} active={type === projectType} /></li>)}
        </ul>
      </nav>
      <nav aria-label="项目技术栈">
        <h2 className="text-auxiliary font-semibold tracking-wide text-text-secondary">技术栈</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => <li key={tag.name}><a href={`/projects?tech=${encodeURIComponent(tag.name)}`} aria-current={tech === tag.name ? "page" : undefined} className={`inline-flex rounded-tag border px-2 py-0.5 text-tag hover:border-primary hover:text-primary ${tech === tag.name ? "border-primary font-medium text-primary" : "border-border text-text-secondary"}`}>{tag.name}<span className="ml-1 text-text-muted">{tag.count}</span></a></li>)}
        </ul>
      </nav>
    </aside>
    {filtered.length === 0 && !showWecom
      ? <Empty message="暂无符合条件的项目案例" />
      : <div>
        <ul data-project-results className="grid gap-5 sm:grid-cols-2">
          {filtered.map((project) => <li key={project.slug}>
            <Link href={`/projects/${project.slug}`} className="group flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface p-5 shadow-card transition duration-150 ease-standard hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              <ContentCover slug={project.slug} priority className="mb-5 aspect-[2/1]" />
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-card-title font-semibold leading-tight text-text-primary group-hover:text-primary">{project.meta.title}</h2>
                <span className="rounded-tag bg-accent-bg px-2 py-0.5 text-tag text-accent-text">{statusLabels[project.meta.status]}</span>
              </div>
              <p className="mt-2 text-auxiliary text-text-secondary">{stageLabels[project.slug] ?? PROJECT_TYPE_LABELS[project.meta.projectType]}</p>
              <p className="mt-3 text-sm text-text-secondary">{project.meta.description}</p>
              {roleLabels[project.slug] && <p className="mt-2 flex-1 text-sm text-text-muted">{roleLabels[project.slug]}</p>}
              <div className="mt-3 flex flex-wrap gap-2 text-auxiliary text-text-muted">
                <span>{PROJECT_TYPE_LABELS[project.meta.projectType]}</span>
                <span>·</span>
                <time dateTime={project.meta.publishedAt}>{project.meta.publishedAt}</time>
                {project.meta.techStack.slice(0, 4).map((techName) => <span key={techName} className="rounded-tag bg-surface-soft px-1.5 py-0.5 text-tag text-text-secondary">{techName}</span>)}
              </div>
            </Link>
          </li>)}
        </ul>
        {showWecom && wecom ? <section aria-labelledby="wecom-delivery" className="mt-5 rounded-card border border-border bg-surface p-5 shadow-card">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="wecom-delivery" className="text-card-title font-semibold leading-tight text-text-primary">{wecom.title}</h2>
            <span className="rounded-tag bg-accent-bg px-2 py-0.5 text-tag text-accent-text">生产使用</span>
            <span className="rounded-tag bg-surface-soft px-2 py-0.5 text-tag text-text-secondary">企业微信智能表格</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">{wecom.description}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-3">
            {wecom.lines.map((line) => <li key={line} className="rounded-card border border-border bg-surface-soft px-3 py-2 text-auxiliary leading-relaxed text-text-secondary">{line}</li>)}
          </ul>
          <Link href={wecom.href} className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary-hover">查看数仓案例专节 →</Link>
        </section> : null}
      </div>}
  </div>;
}
