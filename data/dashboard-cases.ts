import type { DashboardItem } from "@/lib/content/types";

export interface DashboardCase {
  id: string;
  title: string;
  href: string;
  description: string;
  businessDomain: string;
  tools: string[];
  metrics: string[];
  statusLabel?: string;
  badge: string;
  actionLabel: string;
  coverSlug?: string;
  deliveryLines?: { title: string; status: string; description: string }[];
}

/** 看板是数仓的交付出口，项目页与 BI 入口共用摘要，详情仍在数仓专节。 */
export const wecomDashboard = {
  id: "wecom-dashboards",
  title: "企业微信经营看板",
  href: "/projects/data-warehouse-modernization#wecom-dashboards",
  description:
    "基于企业微信智能表格交付的三条经营看板。把原先的人工导出替换为自动采集、指标汇总与定时同步，并补充重复键检查、失效数据处理、依赖预检、失败告警与回读对账。",
  businessDomain: "法律业务运营",
  tools: ["企业微信智能表格"],
  metrics: ["自动采集", "定时同步", "回读对账"],
  statusLabel: "生产使用 · 部分验收收尾",
  badge: "数仓业务交付",
  actionLabel: "查看数仓案例专节",
  lines: [
    "立案与回款趋势：日粒度建模与周月汇总",
    "项目维度过程指标监控：自动采集替换人工导出",
    "人员过程数据追踪：人日聚合与人员映射",
  ],
  deliveryLines: [
    { title: "立案与回款趋势", status: "生产使用", description: "日粒度建模，周月汇总与逐键对账。" },
    { title: "项目维度过程指标监控", status: "生产使用", description: "自动采集与汇总，换源切换已完成并通过自检。" },
    { title: "人员过程数据追踪", status: "数据已上线 · 验收收尾", description: "定时同步已启用，正式验收与切换仍在收尾。" },
  ],
} satisfies DashboardCase & { lines: string[] };

export function getDashboardCases(dashboards: DashboardItem[]): DashboardCase[] {
  return [wecomDashboard, ...dashboards.map((dashboard) => ({
    id: dashboard.slug,
    href: `/dashboards/${dashboard.slug}`,
    title: dashboard.meta.title,
    description: dashboard.meta.description,
    businessDomain: dashboard.meta.businessDomain,
    tools: dashboard.meta.tools,
    metrics: dashboard.meta.metrics,
    statusLabel: dashboard.meta.statusLabel,
    badge: "真实项目 · 脱敏演示",
    actionLabel: "查看分析过程",
    coverSlug: dashboard.slug,
  }))];
}

export function getDashboardFilters(cases: DashboardCase[]) {
  const counts = new Map<string, number>();
  for (const entry of cases) {
    for (const tool of new Set(entry.tools)) counts.set(tool, (counts.get(tool) ?? 0) + 1);
  }
  return {
    domains: [...new Set(cases.map((entry) => entry.businessDomain))],
    tags: [...counts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
  };
}
