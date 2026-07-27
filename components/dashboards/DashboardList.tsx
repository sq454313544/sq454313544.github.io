"use client";

import { Empty } from "@/components/primitives/states";
import type { DashboardItem } from "@/lib/content/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function DashboardList({ dashboards, domains, tags, className }: { dashboards: DashboardItem[]; domains: string[]; tags: { name: string; count: number }[]; className?: string }) {
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain") ?? "";
  const tool = searchParams.get("tool") ?? "";
  const filtered = dashboards.filter((dashboard) => (!domain || dashboard.meta.businessDomain === domain) && (!tool || dashboard.meta.tools.includes(tool)));

  return <div className={`mt-10 grid gap-10 lg:grid-cols-[13.75rem_minmax(0,1fr)] ${className ?? ""}`}><aside className="space-y-7 lg:pr-6"><nav aria-label="业务领域"><h2 className="text-auxiliary font-semibold tracking-wide text-text-secondary">业务领域</h2><ul className="mt-3 space-y-1"><li><Link href="/dashboards" className="block rounded-button px-2 py-1 text-sm text-text-secondary hover:bg-surface-soft hover:text-primary">全部</Link></li>{domains.map((item) => <li key={item}><Link href={`/dashboards?domain=${encodeURIComponent(item)}`} className="block rounded-button px-2 py-1 text-sm text-text-secondary hover:bg-surface-soft hover:text-primary">{item}</Link></li>)}</ul></nav><nav aria-label="BI 工具"><h2 className="text-auxiliary font-semibold tracking-wide text-text-secondary">工具</h2><ul className="mt-3 flex flex-wrap gap-2">{tags.map((tag) => <li key={tag.name}><Link href={`/dashboards?tool=${encodeURIComponent(tag.name)}`} className="inline-flex rounded-tag border border-border px-2 py-0.5 text-tag text-text-secondary hover:border-primary hover:text-primary">{tag.name}<span className="ml-1 text-text-muted">{tag.count}</span></Link></li>)}</ul></nav></aside>{filtered.length === 0 ? <Empty message="暂无符合条件的 BI 案例" /> : <ul className="border-t border-border">{filtered.map((dashboard) => <li key={dashboard.slug} className="border-b border-border"><Link href={`/dashboards/${dashboard.slug}`} className="group block py-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><h2 className="text-card-title font-semibold leading-tight text-text-primary group-hover:text-primary">{dashboard.meta.title}</h2><p className="mt-2 text-sm text-text-secondary">{dashboard.meta.description}</p><div className="mt-3 flex flex-wrap gap-2 text-auxiliary text-text-muted"><span>{dashboard.meta.businessDomain}</span><span>·</span><time dateTime={dashboard.meta.publishedAt}>{dashboard.meta.publishedAt}</time>{dashboard.meta.metrics.slice(0, 3).map((metric) => <span key={metric} className="rounded-tag bg-surface-soft px-1.5 py-0.5 text-tag text-text-secondary">{metric}</span>)}</div></Link></li>)}</ul>}</div>;
}
