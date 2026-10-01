import { loadDashboards } from "@/lib/content/loaders";
import { getPublished } from "@/lib/content/queries";
import { getDashboardCases, getDashboardFilters } from "@/data/dashboard-cases";
import type { DashboardItem } from "@/lib/content/types";
import { DashboardList } from "@/components/dashboards/DashboardList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BI 与经营看板",
  description:
    "企业微信经营看板与 Power BI 历史交付：自动采集、指标汇总、语义模型与看板设计，区分生产使用与验收阶段。",
  alternates: { canonical: "/dashboards" },
};

export default function DashboardsPage() {
  const dashboards = loadDashboards();
  const published = getPublished(dashboards).filter((item): item is DashboardItem => item.type === "dashboard");
  const cases = getDashboardCases(published);
  const { tags, domains } = getDashboardFilters(cases);
  return <main className="mx-auto w-full max-w-default px-5 py-10 sm:px-8 sm:py-14"><header className="border-b border-border pb-6"><p className="text-auxiliary font-medium text-primary">BUSINESS INTELLIGENCE</p><h1 className="mt-2 text-h1 font-semibold leading-tight text-text-primary">BI 与经营看板</h1><p className="mt-3 max-w-3xl text-body leading-body text-text-secondary">企业微信经营看板与 Power BI 历史交付，呈现数据采集、指标口径和业务交付过程。各案例注明实际使用与验收阶段，Power BI 公开截图为脱敏重建的演示版本。</p></header><DashboardList cases={cases} domains={domains} tags={tags} /></main>;
}
