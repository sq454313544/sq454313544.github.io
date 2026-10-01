import { loadProjects } from "@/lib/content/loaders";
import { getAllTags } from "@/lib/content/queries";
import { sortProjects } from "@/lib/content/project-order";
import type { ProjectItem } from "@/lib/content/types";
import { ProjectList } from "@/components/projects/ProjectList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "项目案例",
  description:
    "数据仓库与治理、企业智能问数助手、企业知识库助手，以及企业微信经营看板、业务报表自动化与 Power BI 历史交付。",
  alternates: { canonical: "/projects" },
};

/** 企业微信经营看板作为数仓的业务交付摘要展示，不重复创建项目详情 */
const WECOM_SUMMARY = {
  title: "企业微信经营看板",
  href: "/projects/data-warehouse-modernization#wecom-dashboards",
  description:
    "基于企业微信智能表格交付的三条经营看板。把原先的人工导出替换为自动采集、指标汇总与定时同步，并补充重复键检查、失效数据处理、依赖预检、失败告警与回读对账。",
  lines: [
    "立案与回款趋势：日粒度建模与周月汇总",
    "项目维度过程指标监控：自动采集替换人工导出",
    "人员过程数据追踪：人日聚合与人员映射",
  ],
};

export default function ProjectsPage() {
  const projects = sortProjects(
    loadProjects().filter((item): item is ProjectItem => item.type === "project"),
  );
  const tags = getAllTags(projects);

  return (
    <main className="mx-auto w-full max-w-default px-5 py-10 sm:px-8 sm:py-14">
      <header className="border-b border-border pb-6">
        <p className="text-auxiliary font-medium text-primary">PROJECT WORK</p>
        <h1 className="mt-2 text-h1 font-semibold leading-tight text-text-primary">
          项目案例
        </h1>
        <p className="mt-3 text-body leading-body text-text-secondary">
          数据工程与 AI 应用两条主线各自展开：前者覆盖多源接入、分层建模、口径治理、调度质量与业务交付；后者包含受控问数与知识库助手。企业微信看板、报表自动化与 Power BI 作为业务交付一并列出。
        </p>
      </header>
      <ProjectList projects={projects} wecom={WECOM_SUMMARY} tags={tags} />
    </main>
  );
}
