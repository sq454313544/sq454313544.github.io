import type { Metadata } from "next";
import { mockAgents, mockExampleQuestions } from "@/lib/agent/mock";

export const metadata: Metadata = {
  title: "Agent Demo",
  description: "AI Agent 体验演示 — 建设中",
};

export default function AgentPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Agent Demo</h1>
      <p className="text-gray-500 mb-6">AI Agent 体验演示</p>

      <div className="bg-amber-50 border border-amber-200 rounded p-4 mb-8">
        <p className="text-amber-800 text-sm font-medium">建设中</p>
        <p className="text-amber-700 text-sm mt-1">
          Agent 功能正在开发中，当前为预览占位页面。后续上线时将支持以下能力。
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">计划展示的 Agent</h2>
        <div className="space-y-4">
          {mockAgents.map((agent) => (
            <div key={agent.id} className="border rounded p-4">
              <h3 className="font-medium mb-1">{agent.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{agent.description}</p>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                状态: 即将上线
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">示例问题</h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          {mockExampleQuestions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">使用说明</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>未来公开试用将设有每日额度限制</li>
          <li>Agent 基于 AI 模型，回答仅供参考</li>
          <li>我们不会保存您的对话内容</li>
          <li>请勿输入个人隐私或敏感信息</li>
        </ul>
      </section>
    </main>
  );
}
