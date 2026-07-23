import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我",
  description: "数据产品工程师，专注于 BI 与 AI 数据应用",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">关于我</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">个人简介</h2>
        <p className="text-gray-700 leading-relaxed">
          数据产品工程师，具备数据分析、BI 系统和 AI Agent 工程的综合能力。
          擅长将复杂的业务问题转化为可落地的数据产品和自动化方案。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">技能</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Python",
            "SQL",
            "Power BI",
            "LangGraph",
            "RAG",
            "FastAPI",
            "Next.js",
            "TypeScript",
            "指标治理",
            "智能问数",
            "Agent 工程",
            "数据建模",
          ].map((skill) => (
            <span
              key={skill}
              className="bg-gray-100 px-3 py-1 rounded text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">经验</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>企业级 BI 系统建设与指标治理</li>
          <li>AI Agent 在工作流自动化和智能问数中的应用</li>
          <li>数据产品从 0 到 1 的规划与交付</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">联系方式</h2>
        <p className="text-gray-500 text-sm">
          如需联系，请通过 GitHub 或邮件。详细联系信息请查看简历页面。
        </p>
      </section>
    </main>
  );
}
