import type { AgentSummary } from "./types";

export const mockAgents: AgentSummary[] = [
  {
    id: "sql-qa",
    name: "智能问数助手",
    description: "基于自然语言查询数据库，自动生成 SQL 并返回可视化结果",
    status: "coming_soon",
  },
  {
    id: "metrics-governance",
    name: "指标治理 Agent",
    description: "帮助企业梳理指标口径，自动检测口径不一致问题",
    status: "coming_soon",
  },
  {
    id: "data-insight",
    name: "数据分析 Agent",
    description: "上传数据文件，AI 自动进行探索性分析和洞察提炼",
    status: "coming_soon",
  },
];

export const mockExampleQuestions = [
  "上月销售额最高的 10 个产品是什么？",
  "帮我分析 DAU 下降的原因",
  "这个数据集中有哪些异常值？",
  "对比过去两个季度的 GMV 趋势",
];
