import { notFound } from "next/navigation";
import { loadDashboards } from "@/lib/content/loaders";
import { getPrevNext, getRelated } from "@/lib/content/queries";
import type { DashboardItem } from "@/lib/content/types";
import { PrevNextNav } from "@/components/content/PrevNextNav";
import { RelatedArticles } from "@/components/content/RelatedArticles";
import { EChartsWrapper } from "@/components/charts/EChartsWrapper";
import type { Metadata } from "next";

export const dynamicParams = false;

export function generateStaticParams() {
  return loadDashboards().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const db = loadDashboards().find((d) => d.slug === slug);
  if (!db) return {};
  return {
    title: db.meta.title,
    description: db.meta.description,
  };
}

function getChartOption(title: string, data: number[] = []): object {
  return {
    title: { text: title, left: "center" },
    tooltip: {},
    xAxis: {
      data: ["1月", "2月", "3月", "4月", "5月", "6月"],
    },
    yAxis: {},
    series: [
      {
        name: title,
        type: "bar",
        data: data.length > 0 ? data : [820, 932, 901, 934, 1290, 1330],
      },
    ],
  };
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dashboards = loadDashboards();
  const dashboard = dashboards.find(
    (d): d is DashboardItem => d.slug === slug
  );

  if (!dashboard) notFound();

  const { default: Content } = await import(
    `@/content/dashboards/${slug}.mdx`
  );

  const { prev, next } = getPrevNext(dashboards, slug);
  const related = getRelated(dashboards, dashboard);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <article>
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{dashboard.meta.title}</h1>
          <p className="text-gray-600 mb-3">{dashboard.meta.description}</p>
          <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-3">
            <span>{dashboard.meta.publishedAt}</span>
            <span>·</span>
            <span>{dashboard.meta.businessDomain}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {dashboard.meta.tools.map((tool) => (
              <span key={tool} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                {tool}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-gray max-w-none">
          <Content />
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-4">示例图表</h2>
          <EChartsWrapper
            option={getChartOption(
              dashboard.meta.metrics[0] ?? "指标趋势",
              []
            )}
            height={300}
          />
        </section>

        <PrevNextNav prev={prev} next={next} basePath="/dashboards" />
        <RelatedArticles items={related} />
      </article>
    </main>
  );
}
