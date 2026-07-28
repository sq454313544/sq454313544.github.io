import { loadDashboards } from "@/lib/content/loaders";
import { getPublished, getAllTags } from "@/lib/content/queries";
import type { DashboardItem } from "@/lib/content/types";
import { DashboardList } from "@/components/dashboards/DashboardList";
import { Loading } from "@/components/primitives/states";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "BI 案例", description: "数据分析与商业智能看板案例" };

export default function DashboardsPage() {
  const dashboards = loadDashboards();
  const published = getPublished(dashboards).filter((item): item is DashboardItem => item.type === "dashboard");
  const tags = getAllTags(dashboards);
  const domains = [...new Set(published.map((item) => item.meta.businessDomain))];
  return <main className="mx-auto w-full max-w-default px-5 py-10 sm:px-8 sm:py-14"><header className="border-b border-border pb-6"><p className="text-auxiliary font-medium text-primary">BUSINESS INTELLIGENCE</p><h1 className="mt-2 text-h1 font-semibold leading-tight text-text-primary">BI 案例</h1><p className="mt-3 text-body leading-body text-text-secondary">数据分析、指标体系与商业智能看板的案例记录。</p></header><Suspense fallback={<Loading className="py-10" />}><DashboardList dashboards={published} domains={domains} tags={tags} /></Suspense></main>;
}
