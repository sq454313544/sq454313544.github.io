import Link from "next/link";
import { loadDashboards } from "@/lib/content/loaders";
import { getPublished, getAllTags } from "@/lib/content/queries";
import type { DashboardItem } from "@/lib/content/types";
import { Empty } from "@/components/primitives/states";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BI 案例",
  description: "数据分析与商业智能看板案例",
};

export default function DashboardsPage() {
  const dashboards = loadDashboards();
  const published = getPublished(dashboards).filter(
    (d): d is DashboardItem => d.type === "dashboard"
  );
  const tags = getAllTags(dashboards);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">BI 案例</h1>
      <p className="text-gray-500 mb-6">数据分析与商业智能看板案例</p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {tags.map((tag) => (
            <span
              key={tag.name}
              className="text-xs bg-gray-50 px-2 py-0.5 rounded"
            >
              {tag.name} ({tag.count})
            </span>
          ))}
        </div>
      )}

      {published.length === 0 ? (
        <Empty message="暂无 BI 案例" />
      ) : (
        <ul className="divide-y">
          {published.map((dashboard) => (
            <li key={dashboard.slug} className="py-4">
              <Link
                href={`/dashboards/${dashboard.slug}`}
                className="block group"
              >
                <h3 className="text-lg font-medium group-hover:text-gray-600 mb-1">
                  {dashboard.meta.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {dashboard.meta.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                  <span>{dashboard.meta.publishedAt}</span>
                  <span>·</span>
                  <span>{dashboard.meta.businessDomain}</span>
                  {dashboard.meta.metrics.slice(0, 3).map((m) => (
                    <span key={m} className="bg-gray-50 px-1.5 py-0.5 rounded">
                      {m}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
