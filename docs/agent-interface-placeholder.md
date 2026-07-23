# Agent 接口预留

> **v2 revision (2026-07):** 移除自定义错误类，简化占位实现。

> **当前状态：占位。** 所有 Agent 功能尚未实现。本文档定义未来接口的边界和类型。

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

## 后续演进说明

### 何时实现真实 Agent

当以下条件满足时，开始实现真实 Agent 服务：

1. 后端 Agent 服务已搭建（FastAPI + LangGraph 等）
2. Agent 端点已定义并可访问
3. 用户明确要求接入真实 Agent

### 实现步骤

1. 创建 `.env.local` 添加 `NEXT_PUBLIC_AGENT_API_URL`
2. 实现 `AgentClientImpl` 类替换 `client.ts` 中的 mock
3. 实现 `/api/agent/run` API Route 作为服务端代理（避免暴露 API Key）
4. 更新 `/agent` 页面使用真实交互组件

### 协议稳定性

当前定义的 `AgentRunRequest` 和 `AgentEvent` 是初始设计，后续允许调整：
- 可以新增事件类型
- 可以扩展请求参数
- 不能删除已有字段（保持向后兼容）

### 安全注意事项（后续实现时必须遵守）

- API Key 只存在于服务端（`.env.local`，不提交）
- 客户端通过 Next.js API Route 代理请求（不直接调用 Agent 服务）
- 实施请求频率限制（rate limiting）
- 记录请求日志但不保存用户对话内容（除非用户明确要求）
- 设置每次会话的 Token 上限
