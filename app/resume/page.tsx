import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "在线简历",
  description: "个人简历",
};

export default function ResumePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">在线简历</h1>
      <p className="text-gray-500 mb-6">数据产品工程师</p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">个人概况</h2>
        <p className="text-gray-700">
          具备多年数据领域经验，覆盖数据分析、BI 报表开发、数据产品设计和 AI
          Agent 工程。擅长 Python、SQL、Power BI，熟悉 LangGraph、RAG
          等 AI 技术栈。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">工作经历</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">数据产品工程师</h3>
            <p className="text-sm text-gray-500">
              负责企业 BI 平台建设、指标治理体系搭建和 AI Agent 应用落地。
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">项目经验</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>企业智能问数助手 — LangGraph + RAG</li>
          <li>Agent 可观测性与监控看板 — OpenTelemetry + Grafana</li>
          <li>BI 指标口径管理 — Power BI + Tabular Editor</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">教育背景</h2>
        <p className="text-gray-700">
          计算机相关专业本科
        </p>
      </section>

      <div className="border-t pt-6 text-center">
        <p className="text-sm text-gray-400">
          PDF 简历暂未提供。完成后将在此处提供下载链接。
        </p>
      </div>
    </main>
  );
}
