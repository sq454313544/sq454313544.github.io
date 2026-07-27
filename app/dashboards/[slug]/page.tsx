import { notFound } from "next/navigation";
import { loadDashboards } from "@/lib/content/loaders";
import { getPrevNext, getRelated } from "@/lib/content/queries";
import type { DashboardItem } from "@/lib/content/types";
import { PrevNextNav } from "@/components/content/PrevNextNav";
import { RelatedArticles } from "@/components/content/RelatedArticles";
import { DetailMeta, type DetailMetaItem } from "@/components/content/DetailMeta";
import { EChartsWrapper } from "@/components/charts/EChartsWrapper";
import type { Metadata } from "next";

export const dynamicParams = false;

export function generateStaticParams() {
  return loadDashboards().map((dashboard) => ({ slug: dashboard.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dashboard = loadDashboards().find((item) => item.slug === slug);
  return dashboard ? { title: dashboard.meta.title, description: dashboard.meta.description } : {};
}

function getChartOption(title: string): object {
  return {
    title: { text: title, left: "center" },
    tooltip: {},
    xAxis: { data: ["1月", "2月", "3月", "4月", "5月", "6月"] },
    yAxis: {},
    series: [{ name: title, type: "bar", data: [820, 932, 901, 934, 1290, 1330] }],
  };
}

export default async function DashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dashboards = loadDashboards();
  const dashboard = dashboards.find((item): item is DashboardItem => item.slug === slug);
  if (!dashboard) notFound();

  const { default: Content } = await import(`@/content/dashboards/${slug}.mdx`);
  const { prev, next } = getPrevNext(dashboards, slug);
  const related = getRelated(dashboards, dashboard);
  const metaItems: DetailMetaItem[] = [
    { label: "业务领域", value: dashboard.meta.businessDomain },
    { label: "使用工具", value: dashboard.meta.tools.join(" · ") },
    { label: "关键指标", value: dashboard.meta.metrics.join(" · ") },
    { label: "数据说明", value: "模拟数据" },
    { label: "发布于", value: dashboard.meta.publishedAt },
  ];

  return (
    <main className="mx-auto w-full max-w-detail px-5 py-10 sm:px-8 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_13.75rem] lg:gap-12">
        <article className="min-w-0">
          <header className="border-b border-border pb-7">
            <p className="text-auxiliary font-medium text-primary">{dashboard.meta.businessDomain}</p>
            <h1 className="mt-2 text-h2 font-semibold leading-tight text-text-primary sm:text-h1">{dashboard.meta.title}</h1>
            <p className="mt-4 text-body leading-body text-text-secondary">{dashboard.meta.description}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="BI 工具">
              {dashboard.meta.tools.map((tool) => <li key={tool} className="rounded-tag border border-border px-2 py-0.5 text-tag text-text-secondary">{tool}</li>)}
            </ul>
          </header>
          <section className="mt-10" aria-labelledby="dashboard-chart-title">
            <h2 id="dashboard-chart-title" className="text-h3 font-semibold leading-tight text-text-primary">指标示例</h2>
            <p className="mt-2 text-sm text-text-muted">基于模拟数据的展示图表。</p>
            <EChartsWrapper option={getChartOption(dashboard.meta.metrics[0] ?? "指标趋势")} height={300} className="mt-5 rounded-card border border-border p-3" />
          </section>
          <div className="mt-10"><Content /></div>
          <PrevNextNav prev={prev} next={next} basePath="/dashboards" />
          <RelatedArticles items={related} />
        </article>
        <DetailMeta title="BI 资料" items={metaItems} className="lg:sticky lg:top-20" />
      </div>
    </main>
  );
}
