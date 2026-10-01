"use client";

import { Empty } from "@/components/primitives/states";
import { ContentCover } from "@/components/content/ContentCover";
import type { DashboardCase } from "@/data/dashboard-cases";
import Link from "next/link";
import { useClientSearchParams } from "@/lib/hooks/useClientSearchParams";

/** 筛选链接使用普通锚点，保证静态托管下每次点击都是一次完整加载，状态不会被客户端路由沿用 */
function FilterLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return <a href={href} aria-current={active ? "page" : undefined} className={`block rounded-button px-2 py-1 text-sm ${active ? "bg-surface-soft font-medium text-primary" : "text-text-secondary hover:bg-surface-soft hover:text-primary"}`}>{label}</a>;
}

export function DashboardList({ cases, domains, tags, className }: { cases: DashboardCase[]; domains: string[]; tags: { name: string; count: number }[]; className?: string }) {
  const searchParams = useClientSearchParams();
  const domain = searchParams.get("domain") ?? "";
  const tool = searchParams.get("tool") ?? "";
  const filtered = cases.filter((dashboard) => (!domain || dashboard.businessDomain === domain) && (!tool || dashboard.tools.includes(tool)));

  return <div className={`mt-10 grid gap-10 lg:grid-cols-[13.75rem_minmax(0,1fr)] ${className ?? ""}`}>
    <aside className="space-y-7 lg:pr-6">
      <nav aria-label="业务领域">
        <h2 className="text-auxiliary font-semibold tracking-wide text-text-secondary">业务领域</h2>
        <ul className="mt-3 space-y-1">
          <li><FilterLink href="/dashboards" label="全部" active={!domain} /></li>
          {domains.map((item) => <li key={item}><FilterLink href={`/dashboards?domain=${encodeURIComponent(item)}`} label={item} active={domain === item} /></li>)}
        </ul>
      </nav>
      <nav aria-label="BI 工具">
        <h2 className="text-auxiliary font-semibold tracking-wide text-text-secondary">工具</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => <li key={tag.name}><a href={`/dashboards?tool=${encodeURIComponent(tag.name)}`} aria-current={tool === tag.name ? "page" : undefined} className={`inline-flex rounded-tag border px-2 py-0.5 text-tag hover:border-primary hover:text-primary ${tool === tag.name ? "border-primary font-medium text-primary" : "border-border text-text-secondary"}`}>{tag.name}<span className="ml-1 text-text-muted">{tag.count}</span></a></li>)}
        </ul>
      </nav>
    </aside>
    {filtered.length === 0
      ? <Empty message="暂无符合条件的 BI 与经营看板" />
      : <ul data-dashboard-results className="grid gap-5 sm:grid-cols-2">
        {filtered.map((dashboard) => <li key={dashboard.id}>
          <Link href={dashboard.href} className="group flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface p-5 shadow-card transition duration-150 ease-standard hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            {dashboard.coverSlug ? <ContentCover slug={dashboard.coverSlug} className="mb-5 aspect-[2/1]" /> : null}
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-tag bg-surface-soft px-2 py-0.5 text-tag text-text-secondary">{dashboard.businessDomain}</span>
              {dashboard.statusLabel ? <span className="rounded-tag bg-surface-soft px-2 py-0.5 text-tag text-text-secondary">{dashboard.statusLabel}</span> : null}
              <span className="rounded-tag bg-accent-bg px-2 py-0.5 text-tag text-accent-text">{dashboard.badge}</span>
            </div>
            <h2 className="mt-3 text-card-title font-semibold leading-tight text-text-primary group-hover:text-primary">{dashboard.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">{dashboard.description}</p>
            {dashboard.deliveryLines ? <ul className="mt-4 space-y-3 text-sm leading-relaxed text-text-secondary">
              {dashboard.deliveryLines.map((line) => <li key={line.title}>
                <p className="font-medium text-text-primary">{line.title}</p>
                <p className="text-auxiliary text-primary">{line.status}</p>
                <p className="text-auxiliary">{line.description}</p>
              </li>)}
            </ul> : null}
            <p className="mt-4 text-auxiliary text-text-muted">{dashboard.metrics.slice(0, 3).join(" · ")}</p>
            <span className="mt-5 text-sm font-medium text-primary">{dashboard.actionLabel} <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">→</span></span>
          </Link>
        </li>)}
      </ul>}
  </div>;
}
