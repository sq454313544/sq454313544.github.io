# Agent 接口预留（历史归档）

> **v2 revision (2026-07):** 移除自定义错误类，简化占位实现。

> **归档状态（2026-07-27）：** 本文仅记录第一阶段占位实现，不再作为后续开发计划或稳定接口契约。博客不部署在线 Agent 页面、API 或后端服务，详见 [`agent-deployment-decision.md`](./agent-deployment-decision.md)。

下述代码已于 2026-07-27 从仓库移除，保留片段仅用于记录第一阶段历史实现。

## 接口位置

```
lib/agent/
├─ types.ts    # 类型定义
├─ client.ts   # 抽象客户端接口（当前抛未实现错误）
└─ mock.ts     # 占位数据（供 /agent 页面使用）
```

## 类型定义 (`types.ts`)

```typescript
/** Agent 摘要信息（列表展示用） */
export interface AgentSummary {
  id: string
  name: string
  description: string
  status: AgentStatus
}

export type AgentStatus = "coming_soon" | "available" | "offline"

/** Agent 运行请求 */
export interface AgentRunRequest {
  agentId: string
  message: string
  sessionId?: string
}

/** Agent 运行事件流 */
export type AgentEvent =
  | { type: "run_started"; runId: string }
  | { type: "status"; message: string }
  | { type: "token"; content: string }
  | { type: "usage"; inputTokens: number; outputTokens: number }
  | { type: "limit_reached"; message: string }
  | { type: "error"; message: string }
  | { type: "run_completed"; runId: string }
```

## 客户端接口 (`client.ts`)

当前不实现真实请求。`client.ts` 只定义抽象接口签名，所有方法抛出 `NotImplementedError`：

```typescript
export interface AgentClient {
  listAgents(): Promise<AgentSummary[]>
  runAgent(request: AgentRunRequest): AsyncIterable<AgentEvent>
  cancelRun(runId: string): Promise<void>
}

// v2: Use throw new Error("Agent client is not implemented") directly, no custom error class needed
```

## Mock 数据 (`mock.ts`)

仅供 `/agent` 占位页面使用：

```typescript
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
]

export const mockExampleQuestions = [
  "上月销售额最高的 10 个产品是什么？",
  "帮我分析 DAU 下降的原因",
  "这个数据集中有哪些异常值？",
  "对比过去两个季度的 GMV 趋势",
]
```

## 归档说明

### 不再执行的上线计划

以下原计划已从博客范围中取消：

1. 搭建 FastAPI / LangGraph 在线 Agent 服务；
2. 配置 Agent 端点与博客代理接口；
3. 把 `/agent` 占位页升级为真实交互页面。

### 后续处理

遗留代码、Sitemap 与 E2E 引用已经清理。回归核验已确认 `/agent` 返回 404，同时 Agent 技术内容与项目案例保持可访问。

### 历史接口稳定性

`AgentRunRequest`、`AgentEvent` 与 `AgentClient` 不再承诺向后兼容；它们会随历史占位代码一并移除。若未来在博客之外启动独立 Agent 产品，应重新评审需求、安全边界和协议，不直接复用本归档。

### 历史安全备注

以下原则仅作为未来独立项目的安全参考，不构成本博客的实施计划：密钥不得暴露到客户端、接口需限流、日志不得默认保存用户对话、会话需设置调用上限。
