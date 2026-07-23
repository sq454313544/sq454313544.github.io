# 个人技术博客与项目作品集 — 项目总文档

> **v2.1 — 已完成修订、准备执行（2026-07-23）**：本文档为 v2.1 主汇总文档。v1→v2 的 15 项修订已全部落实到代码和配置中。M0（工程初始化）已通过检验（typecheck + content:check + dev server 200）。
>
> 关键修订：Next.js 16.2.11、TypeScript 7.0.2、MDX 管线（@next/mdx + remark-frontmatter + remark-mdx-frontmatter）、ContentItem 判别联合类型、searchText 全文提取、组件状态分层、实施阶段改为垂直切片、frontend-design-system 变更为 Disabled。

---

## 目录

1. [项目定位与目标](#1-项目定位与目标)
2. [环境预检](#2-环境预检)
3. [固定技术栈](#3-固定技术栈)
4. [核心技术决策](#4-核心技术决策)
5. [系统架构](#5-系统架构)
6. [内容模型](#6-内容模型)
7. [搜索方案](#7-搜索方案)
8. [Agent 接口预留](#8-agent-接口预留)
9. [功能需求清单](#9-功能需求清单)
10. [页面契约](#10-页面契约)
11. [设计交接](#11-设计交接)
12. [实施计划](#12-实施计划)
13. [Skills 配置](#13-skills-配置)
14. [项目治理规则](#14-项目治理规则)
15. [风险与约束](#15-风险与约束)
16. [路线图](#16-路线图)
17. [完成标准](#17-完成标准)
18. [问题清单（供评审 AI 回答）](#18-问题清单供评审-ai-回答)

---

## 1. 项目定位与目标

**项目名称**：个人技术博客与项目作品集

**目标受众**：公开访客（技术同行、潜在雇主）

**用途**：知识沉淀 + 求职展示

**内容方向**：数据分析、Power BI、SQL、Python、数据产品、RAG、LangGraph、Agent 工程、指标治理、智能问数、项目复盘

**当前阶段包含**：

1. 个人首页
2. 学习笔记（列表 + 详情 + 分类/标签筛选）
3. 项目作品集（列表 + 详情）
4. BI 案例展示（列表 + 详情 + ECharts）
5. 搜索（站内全文）
6. 分类和标签系统
7. 关于我
8. 在线简历
9. Agent 体验页占位
10. SEO 基础设施

**当前阶段不包含**：

- 真实的 Agent 运行、模型 API 调用
- FastAPI 服务、数据库、用户系统
- 最终视觉设计（品牌色、字体、动画）
- 部署（Vercel/Cloudflare）、自动 push

**状态**：M0 工程初始化已完成，项目已可运行。工作目录 `E:\昂承\个人网站`。

---

## 2. 环境预检

| # | 项目 | 状态 | 详情 |
|---|---|---|---|
| 1 | 操作系统 | ✅ | Windows 11 x64 |
| 2 | Node.js | ✅ | v22.22.1 LTS |
| 3 | pnpm | ✅ | 11.16.0，Registry PING/PONG 正常 |
| 4 | Git | ✅ | 2.50.1，`main` 分支已初始化，身份已配置 |
| 5 | Playwright CLI | ✅ | 0.1.17 |
| 6 | Google Chrome | ✅ | v150.0.7871.129，Playwright 烟雾测试通过 |
| 7 | Context7 | ✅ | HTTP 200 可达 |
| 8 | Skills | ✅ | 5 active + 1 disabled（详见 §13） |
| 9 | 目录名 | ⚠️ | `E:\昂承\个人网站` 含中文，`pnpm create next-app` 需用 `--name` 绕过 |
| 10 | OpenAI API | ⚠️ | `api.openai.com:443` TCP 不通，Codex Agent 功能受限 |
| 11 | TypeScript | ✅ | 7.0.2（devDependencies） |
| 12 | MDX 管线 | ✅ | remark-frontmatter + remark-mdx-frontmatter 插件链已验证，mdxRs 已移除，pageExtensions 已扩展 |
| 13 | M0 状态 | ✅ | 已完成（typecheck + content:check + dev server 200 全部通过） |

---

## 3. 固定技术栈

| 类别 | 技术 | 版本约束 |
|---|---|---|
| 框架 | Next.js App Router | 16.2.11 |
| UI 库 | React | 19.2.4 |
| 语言 | TypeScript | 7.0.2，strict 模式 |
| 样式 | Tailwind CSS | 4.x |
| 内容 | MDX | `@next/mdx` + `remark-frontmatter` + `remark-mdx-frontmatter`（gray-matter 仅用于静态 frontmatter 索引） |
| 校验 | Zod | 4.x |
| 代码高亮 | Shiki | 4.x |
| 图表 | Mermaid + ECharts | 11.x / 6.x |
| 测试 | Vitest + Playwright Test | 4.x / 1.x |
| 包管理 | pnpm | 11.x |

**明确排除的技术**：Vue、Nuxt、Astro、WordPress、Django、FastAPI、Supabase、Redis、PostgreSQL、MySQL、用户认证、支付、管理后台、Docker Compose、Turborepo、Nx、远程搜索服务、远程 CMS、mdxRs

**Playwright 约束**：使用系统 Google Chrome（`channel: "chrome"`），不下载 Chromium

---

## 4. 核心技术决策

| 决策项 | 选择 | 理由 |
|---|---|---|
| MDX 方案 | `@next/mdx` + `remark-frontmatter` + `remark-mdx-frontmatter`（YAML→`export const meta`） | 官方包，与 App Router 深度集成；remark 插件链将 frontmatter 编译为 `export const meta`，页面直接 import 使用 |
| Frontmatter 处理 | remark-frontmatter + remark-mdx-frontmatter 插件链（编译时） + gray-matter（仅用于 content index 静态扫描） | MDX 编译时自动将 YAML frontmatter 转为 JS export，页面代码可直接访问 `meta` 对象；gray-matter 仅用于构建索引时批量读取 frontmatter，避免重复解析 |
| 搜索方案 | 构建时全量索引 + 请求时内存匹配 | 内容量可控（数十到数百篇），无外部依赖，逻辑可单测，URL 参数恢复搜索状态 |
| 代码高亮 | Shiki（rehype-shiki 构建时） | 用户指定；构建时高亮，无客户端 JS |
| 图表渲染 | Mermaid + ECharts（客户端 `"use client"` 组件） | 用户指定；数据/Option/布局分离 |
| 内容校验 | Zod | 用户指定；每种内容类型独立 Schema，构建时失败并报告具体文件和字段 |
| 测试框架 | Vitest（单测）+ Playwright Test（E2E） | 用户指定；Vitest 比 Jest 更快 |
| 内容组织 | 每个 `.mdx` 文件 = 一条内容 | 文件名 = slug（如 `langgraph-state-nodes.mdx` → `/notes/langgraph-state-nodes`） |

---

## 5. 系统架构

### 5.1 分层架构

```
浏览器
  │
  ▼
Next.js App Router（Server Component 优先）
  ├─ 页面路由（RSC）
  ├─ API Route（未来）
  │
  ├─ 内容服务层（lib/content/）
  │   ├─ Zod Schema  →  构建时校验 frontmatter
  │   ├─ Content Loader  →  扫描 content/，解析 MDX
  │   └─ Queries  →  过滤、排序、关联
  │
  ├─ 搜索系统（lib/search/）
  │   ├─ 索引（构建时生成）
  │   └─ 匹配器（请求时匹配）
  │
  ├─ Agent 接口预留（lib/agent/）
  │   ├─ types.ts  →  类型定义
  │   ├─ client.ts  →  抽象接口（当前抛 NotImplementedError）
  │   └─ mock.ts  →  占位数据
  │
  └─ 内容源（content/）
      ├─ notes/      →  学习笔记 MDX
      ├─ projects/   →  项目案例 MDX
      └─ dashboards/ →  BI 案例 MDX
```

### 5.2 关键设计原则

1. **Server Component 优先**：所有页面默认为 RSC，仅在需要浏览器 API 或交互状态时添加 `"use client"`
2. **内容与渲染解耦**：页面通过 Queries 获取数据，不直接扫描文件系统；后续更换渲染方式不影响内容系统
3. **构建时校验**：所有内容在构建时通过 Zod Schema 校验，失败则构建终止并报告具体文件和字段
4. **搜索无外部依赖**：索引在构建时生成，匹配在请求时完成
5. **组件契约**：每个组件提供明确 Props + 可选 `className` + 对应状态视图 + 语义化 HTML

### 5.3 目录结构（当前）

```
.
├─ app/                    # Next.js App Router 页面
│  ├─ page.tsx             # 首页
│  ├─ layout.tsx           # 全局布局
│  ├─ not-found.tsx        # 404（计划）
│  ├─ sitemap.ts           # Sitemap（计划）
│  ├─ robots.ts            # robots.txt（计划）
│  ├─ notes/
│  │  ├─ page.tsx          # 笔记列表（计划）
│  │  └─ [slug]/page.tsx   # 笔记详情（计划）
│  ├─ projects/
│  │  ├─ page.tsx
│  │  └─ [slug]/page.tsx
│  ├─ dashboards/
│  │  ├─ page.tsx
│  │  └─ [slug]/page.tsx
│  ├─ search/page.tsx
│  ├─ tags/
│  │  ├─ page.tsx
│  │  └─ [tag]/page.tsx
│  ├─ categories/
│  │  ├─ page.tsx
│  │  └─ [category]/page.tsx
│  ├─ agent/page.tsx
│  ├─ about/page.tsx
│  └─ resume/page.tsx
├─ components/             # 可复用组件
│  ├─ content/             # ToC、PrevNext、Related
│  ├─ navigation/          # Header、Footer
│  ├─ charts/              # ECharts、Mermaid 客户端封装
│  ├─ seo/                 # SEO 组件（JsonLd）
│  └─ primitives/          # Loading、Empty、Error
├─ content/                # MDX 内容源
│  ├─ notes/
│  ├─ projects/
│  └─ dashboards/
├─ lib/
│  ├─ content/             # 内容服务层（schemas、loaders、queries、slugs、reading-time、types）
│  ├─ search/              # 搜索索引和匹配
│  ├─ seo/                 # SEO 工具
│  ├─ agent/               # Agent 接口预留（types、client、mock）
│  └─ utils/
├─ public/                 # 静态资源
├─ tests/
│  ├─ unit/
│  └─ e2e/
├─ docs/                   # 项目文档（含 mdx-pipeline.md）
├─ .agent-temp/            # 临时文件（任务后清理）
├─ AGENTS.md               # Agent 工作规则
├─ README.md               # 项目说明
├─ .env.example            # 环境变量模板
├─ playwright.config.ts    # Playwright 配置（channel: chrome）
└─ vitest.config.ts        # Vitest 配置
```

---

## 6. 内容模型

### 6.1 三种内容类型

| 类型 | 目录 | slug 来源 | 用途 |
|---|---|---|---|
| 学习笔记 | `content/notes/` | 文件名 | 技术学习、经验总结 |
| 项目案例 | `content/projects/` | 文件名 | 完整项目复盘 |
| BI 案例 | `content/dashboards/` | 文件名 | 数据分析看板案例 |

### 6.2 学习笔记 Schema

```typescript
const NoteMetaSchema = z.object({
  title:        z.string().min(1, "标题不能为空"),
  description:  z.string().min(1, "描述不能为空"),
  publishedAt:  z.string().date("日期格式: YYYY-MM-DD"),
  updatedAt:    z.string().date("日期格式: YYYY-MM-DD"),
  category:     z.string(),
  tags:         z.array(z.string()),
  draft:        z.boolean().default(false),
  featured:     z.boolean().default(false),
  cover:        z.string().url().optional(),
})
```

日期验证使用 `z.string().date()` 并附加语义检查（`updatedAt >= publishedAt`）。URL 字段使用 `.optional() + .url()`，不存在则字段缺失时为 `undefined`。

### 6.3 项目案例 Schema

```typescript
const ProjectMetaSchema = z.object({
  title:        z.string().min(1),
  description:  z.string().min(1),
  publishedAt:  z.string().date("日期格式: YYYY-MM-DD"),
  updatedAt:    z.string().date("日期格式: YYYY-MM-DD"),
  projectType:  z.enum(["agent", "dashboard", "pipeline", "tool", "other"]),
  status:       z.enum(["completed", "in_progress", "maintained", "archived"]),
  featured:     z.boolean().default(false),
  techStack:    z.array(z.string()),
  cover:        z.string().url().optional(),
  repository:   z.string().url().optional(),
  demo:         z.string().url().optional(),
})
```

### 6.4 BI 案例 Schema

```typescript
const DashboardMetaSchema = z.object({
  title:          z.string().min(1),
  description:    z.string().min(1),
  publishedAt:    z.string().date("日期格式: YYYY-MM-DD"),
  updatedAt:      z.string().date("日期格式: YYYY-MM-DD"),
  businessDomain: z.string(),
  tools:          z.array(z.string()),
  metrics:        z.array(z.string()),
  featured:       z.boolean().default(false),
  cover:          z.string().url().optional(),
})
```

### 6.5 构建时校验规则

以下任一条件触发时，构建必须失败并报告具体文件路径和字段名：

- 必填字段（title, description, publishedAt, updatedAt 等）缺失
- 字段类型错误（如 tags 不是数组）
- 日期格式不是 `YYYY-MM-DD`
- slug 在同一类型内重复
- `projectType` 或 `status` 使用非法枚举值
- 内容类型无法识别（不在 note/project/dashboard 中）

### 6.6 判别联合类型

每种内容类型使用独立的 `ContentItem` 类型，组成判别联合（discriminated union），而非单一 `ContentItem` 接口含 `meta` 联合：

```typescript
interface BaseContentItem {
  slug: string
  excerpt: string        // searchText 前 200 字（仅用于展示）
  searchText: string     // 全文提取文本（用于搜索匹配，详见 §7.1）
  readingTime: number    // 自动计算阅读时间（分钟）
}

interface NoteItem extends BaseContentItem {
  type: "note"
  meta: NoteMeta
  body: string           // Markdown 正文
}

interface ProjectItem extends BaseContentItem {
  type: "project"
  meta: ProjectMeta
  body: string
}

interface DashboardItem extends BaseContentItem {
  type: "dashboard"
  meta: DashboardMeta
  body: string
}

type ContentItem = NoteItem | ProjectItem | DashboardItem
```

注意：三种类型各自保持独立字段名称（`category`、`projectType`、`businessDomain`），统一到 `category` 字段只在搜索索引层做映射，不在内容模型层面破坏类型独立性。

### 6.7 首批示例内容（7 篇）

**学习笔记（3 篇）**：
1. LangGraph 状态与节点设计入门
2. RAG 多路召回与 Reranker 的作用
3. Power BI 指标口径管理实践

**项目案例（2 篇）**：
1. 企业智能问数助手
2. Agent 可观测性与监控看板

**BI 案例（2 篇）**：
1. 模拟经营分析看板
2. 模拟 Agent 运行监控看板

所有示例内容：frontmatter 完整、明确标识模拟数据、不包含真实客户/企业/密钥信息。

### 6.8 内容服务层

```
lib/content/
├─ types.ts           # NoteMeta, ProjectMeta, DashboardMeta, ContentItem 类型
├─ schemas.ts         # 3 个 Zod Schema + 校验函数
├─ loaders.ts         # 扫描目录 → 解析 MDX → 校验 → 返回 ContentItem[]
├─ queries.ts         # getAllPublished(), getBySlug(), getByCategory(), getByTag(), getFeatured(), getLatest(), getPrevNext(), getRelated()
├─ slugs.ts           # slug 生成 + 去重检查
├─ reading-time.ts    # 阅读时间计算
└─ relations.ts       # 标签/分类统计
```

页面只能通过 `queries.ts` 获取数据，不得直接扫描 `content/` 目录。

---

## 7. 搜索方案

### 7.1 searchText 提取（构建时）

`searchText` 为从 MDX 正文中提取的全文纯文本，用于搜索索引匹配。提取规则详见 `docs/mdx-pipeline.md` §7：

```
MDX body
  → 移除 fenced code block（``` ... ```）
  → 移除 inline code（`...`）
  → 移除 Mermaid/ECharts 组件标签
  → 移除 JSX 标签但保留内部文本
  → 移除 Markdown 链接语法 [text](url) → text
  → Unicode normalize + 小写 + 连续空格合并
  → searchText（用于索引匹配）
```

`excerpt` 为 `searchText` 的前 200 字，仅用于列表页展示摘要。

### 7.2 索引结构（构建时）

```typescript
// lib/search/index.ts
interface SearchIndexEntry {
  type: "note" | "project" | "dashboard"
  slug: string
  title: string
  description: string
  tags: string[]
  category: string      // 笔记用 category，项目用 projectType，BI 用 businessDomain（索引层统一映射）
  searchText: string    // 全文提取文本
  excerpt: string       // searchText 前 200 字（仅用于展示）
}
```

构建时从内容服务层获取全部已发布内容（排除 `draft: true`），提取 `searchText` 并生成扁平索引数组。

### 7.3 搜索匹配（请求时）

URL: `/search?q=关键词`

匹配优先级（从高到低）：
1. 标题精确匹配
2. 标题部分匹配
3. 描述匹配
4. 标签匹配
5. 分类匹配
6. 全文匹配（searchText）

结果按匹配权重和日期降序排列。搜索逻辑在 `lib/search/matcher.ts` 中，可单测。

### 7.4 特性

- URL 查询参数（`?q=xxx`），页面刷新后搜索条件可恢复
- 不依赖数据库或外部搜索服务
- 内容量大时（数百篇+）可替换为 Meilisearch/Algolia，但当前阶段不需要

---

## 8. Agent 接口预留

### 8.1 类型定义（`lib/agent/types.ts`）

```typescript
export interface AgentSummary {
  id: string
  name: string
  description: string
  status: "coming_soon" | "available" | "offline"
}

export interface AgentRunRequest {
  agentId: string
  message: string
  sessionId?: string
}

export type AgentEvent =
  | { type: "run_started"; runId: string }
  | { type: "status"; message: string }
  | { type: "token"; content: string }
  | { type: "usage"; inputTokens: number; outputTokens: number }
  | { type: "limit_reached"; message: string }
  | { type: "error"; message: string }
  | { type: "run_completed"; runId: string }
```

### 8.2 客户端（`lib/agent/client.ts`）

只定义抽象接口签名，所有方法抛出 `NotImplementedError`：

```typescript
export interface AgentClient {
  listAgents(): Promise<AgentSummary[]>
  runAgent(request: AgentRunRequest): AsyncIterable<AgentEvent>
  cancelRun(runId: string): Promise<void>
}
```

### 8.3 Mock 数据（`lib/agent/mock.ts`）

3 个示例 Agent（全部 `status: "coming_soon"`）：
- 智能问数助手：NL2SQL + 可视化
- 指标治理 Agent：口径梳理 + 不一致检测
- 数据分析 Agent：探索性分析 + 洞察提炼

4 个示例问题供 `/agent` 占位页面展示。

### 8.4 `/agent` 页面要求

- 展示 Agent 未来定位和能力
- "建设中" 状态标识
- 示例问题展示
- 隐私和数据安全说明
- 不调用模型 API、不创建后端、不保存对话

---

## 9. 功能需求清单

### 9.1 页面路由（15 public pages + 1 not-found boundary）

| # | 路由 | 页面 | 关键功能 |
|---|---|---|---|
| 1 | `/` | 首页 | 8 个功能区块（定位/能力/精选项目/精选BI/最新笔记/关于摘要/简历入口/Agent入口） |
| 2 | `/notes` | 笔记列表 | 分类筛选、标签筛选、日期/阅读时间、空状态 |
| 3 | `/notes/[slug]` | 笔记详情 | ToC、代码高亮、Mermaid、前后篇、相关文章、结构化数据 |
| 4 | `/projects` | 项目列表 | 类型/状态筛选、技术栈标签、空状态 |
| 5 | `/projects/[slug]` | 项目详情 | 完整项目结构（背景/方案/结果/复盘）、Mermaid 架构图、结构化数据 |
| 6 | `/dashboards` | BI 列表 | 业务领域筛选、工具/指标标签、空状态 |
| 7 | `/dashboards/[slug]` | BI 详情 | ECharts 示例、截图、loading/error/empty 状态 |
| 8 | `/search` | 搜索 | 搜索框、结果列表、无结果状态、`?q=` URL 参数 |
| 9 | `/tags` | 标签列表 | 去重、按频率排序、计数 |
| 10 | `/tags/[tag]` | 标签详情 | 混合内容列表（笔记+项目+BI） |
| 11 | `/categories` | 分类列表 | 去重、计数 |
| 12 | `/categories/[category]` | 分类详情 | 该分类下的内容列表 |
| 13 | `/about` | 关于我 | 个人简介、技能、经验 |
| 14 | `/resume` | 简历 | 结构化简历、PDF 下载预留（无 PDF 时明确提示） |
| 15 | `/agent` | Agent 占位 | 定位说明、示例问题、隐私说明 |
| — | `not-found` | 404 边界 | 返回首页链接 |

`generateStaticParams` 仅用于 5 条动态路由（`/notes/[slug]`、`/projects/[slug]`、`/dashboards/[slug]`、`/tags/[tag]`、`/categories/[category]`），并设置 `dynamicParams = false`。

### 9.2 全局功能

- **导航**：Header（Logo + 主导航 + 搜索入口）+ Footer（版权 + 链接）+ 移动端汉堡菜单
- **SEO**：全局 Metadata、页面级 Metadata、Canonical URL、Open Graph、Sitemap、robots.txt、结构化数据（JSON-LD）
- **样式**：中性基础排版、响应式（390px 无横向溢出）、Tailwind dark: 前缀预留、组件接受 className
- **状态**：每个页面/组件按自身类型支持对应状态（详见 §10.2）

---

## 10. 页面契约

### 10.1 通用组件契约

所有组件必须遵守：

```typescript
interface ComponentProps {
  className?: string       // 外部样式覆盖（所有组件）
}
```

### 10.2 组件状态分层（按组件类型）

组件状态不是统一的四种状态，而是按组件性质分层：

| 组件类型 | 状态 | 说明 |
|---|---|---|
| **数据列表**（笔记列表、项目列表、BI 列表、标签列表等） | normal / empty | 有数据时渲染列表；无数据时渲染"暂无内容"空状态 |
| **异步图表**（EChartsWrapper） | loading / normal / error / empty | 数据加载中→加载完成→出错→无数据，各状态独立视图 |
| **纯展示**（About、Resume、Agent 占位等） | normal only | 无异步数据依赖，直接渲染 |
| **路由段** | loading.tsx / error.tsx | Next.js App Router 文件约定：Suspense 边界和 Error Boundary 由页面级文件提供 |

### 10.3 各页面数据契约（摘要）

| 页面 | 核心数据 | URL 参数 |
|---|---|---|
| 首页 | `featuredProjects[]`, `featuredDashboards[]`, `latestNotes[]` | — |
| 笔记列表 | `notes[]`, `categories[]`, `tags[]` | `?category=xx&tag=yy` |
| 笔记详情 | `note`, `prevNote\|null`, `nextNote\|null`, `relatedNotes[]`, `toc[]` | slug |
| 搜索 | `query`, `results[]`, `totalCount` | `?q=xx` |
| 标签列表 | `{name, count}[]` | — |
| 标签详情 | `tag`, `items[]`（混合类型） | tag |
| 分类列表 | `{name, count}[]` | — |
| 分类详情 | `category`, `items[]` | category |
| BI 详情 | `dashboard`, `chartData[]`（ECharts option） | slug |
| Agent | `agents[]`（来自 mock） | — |

### 10.4 不能破坏的契约

1. 所有页面数据接口（props 类型和必需字段不能改变）
2. URL 参数格式（`?q=`、`?category=` 等参数名不能改变）
3. 组件 Props 签名（可以扩展但不能删除已有 props）
4. 内容 Schema（frontmatter 必填字段不能删减）
5. 路由结构（URL 路径不能改变）
6. 各组件按自身类型支持对应状态视图
7. 390px 无横向溢出（硬性要求）

---

## 11. 设计交接

### 11.1 当前页面状态

所有页面当前仅实现**功能骨架和中性基础样式**。品牌色、字体方案、卡片样式、动画和最终视觉设计将在后续阶段完成。

### 11.2 可重新设计的组件

以下组件可以完全重新设计（样式、布局、动画），但必须保持 props 签名：
Header、Footer、NoteCard、ProjectCard、DashboardCard、SearchInput、TagCloud、CategoryList、Toc、PrevNextNav、RelatedArticles、Loading/Empty/Error、EChartsWrapper、MermaidDiagram、AgentCard

### 11.3 后续设计需要的输入

品牌色板、字体方案、间距系统、圆角系统、阴影系统、组件设计稿（桌面+移动端）、首页布局、卡片样式、代码块样式、响应式断点、深色模式配色、动画规范

---

## 12. 实施计划

### 12.1 总阶段结构（v2.1）

```
M0（工程初始化）✅ → M1（POC）→ M2（内容层）→ M3（笔记切片）→ M4（项目+BI 切片）→ M5（辅助页面）→ M6（SEO+QA）
```

阶段间串行执行（无并行）。每个阶段完成后验证方可进入下一阶段。

### 12.2 M0：工程初始化 ✅

| # | 操作 | 验证 |
|---|---|---|
| M0.1 | 用临时目录创建 Next.js 项目 + 迁移到当前目录 | `pnpm dev` 可启动 |
| M0.2 | 安装所有依赖 | `pnpm ls` 确认 |
| M0.3 | 配置 `next.config.ts`（MDX、pageExtensions、remark-frontmatter + remark-mdx-frontmatter） | 构建通过 |
| M0.4 | 配置 `tsconfig.json`（strict） | typecheck 通过 |
| M0.5 | 配置 `playwright.config.ts`（channel: chrome） | 配置正确 |
| M0.6 | 配置 `package.json` scripts | 命令可执行 |
| M0.7 | 创建 `.env.example` | 文件存在 |
| M0.8 | 创建空目录结构 | 目录树完整 |
| M0.9-11 | 创建 AGENTS.md、README.md、docs/ | 内容完整 |

### 12.3 M1：POC（概念验证）

验证关键技术链路：MDX 编译 + frontmatter 访问 + Shiki 高亮 + Mermaid + ECharts + searchText 提取。实现一到两条路由作为端到端验证。

### 12.4 M2：内容服务层

构建完整内容管道：schema → loader → queries → reading-time → search index → 示例 MDX。涵盖 `docs/mdx-pipeline.md` 中定义的全部萃取规则。

### 12.5 M3：笔记切片

笔记列表页 + 详情页 + 分类/标签筛选 + ToC + 代码高亮 + 前后篇导航 + 相关文章。

### 12.6 M4：项目 + BI 切片

项目列表/详情 + BI 列表/详情 + Mermaid + ECharts + 完整的 loading/error/empty 状态。

### 12.7 M5：辅助页面

搜索、标签页、分类页、关于我、简历、Agent 占位、404、导航组件、全局 Header/Footer。

### 12.8 M6：SEO + QA

Metadata、Sitemap、robots、结构化数据、语义 HTML、单元测试、E2E、lint/typecheck/build 最终验证。

---

## 13. Skills 配置

项目级 Skills（`.agents/skills/`）：

| Skill | 状态 | 职责 | 触发条件 |
|---|---|---|---|
| `nextjs-frontend-engineering` | ✅ Active | App Router 路由、组件、数据流、MDX 集成、Server/Client Component 边界 | 页面工程实现 |
| `content-authoring` | ✅ Active | MDX 内容、frontmatter、分类/标签、脱敏检查 | MDX 内容编写 |
| `playwright-interactive` | ✅ Active | 浏览器交互验收（系统 Chrome）、Console 错误、移动端溢出 | 页面验收 |
| `seo-accessibility-review` | ✅ Active | Metadata、Sitemap、结构化数据、语义 HTML、键盘导航 | SEO 审查 |
| `release-quality-gate` | ✅ Active | lint/typecheck/test/build/Playwright/敏感信息检查/清理 | 发布前验收 |
| `frontend-design-system` | ❌ Disabled | 视觉设计、深色模式、品牌色（当前阶段禁用，设计阶段将重命名为 `frontend-visual-implementation`） | 设计阶段启用 |

每个 Skill 的详细规则见对应的 `SKILL.md` 文件。

---

## 14. 项目治理规则

详见 `AGENTS.md`，核心规则摘要：

1. 统一使用 `pnpm`，不用 npm 或 yarn
2. 涉及框架 API 时使用 Context7 查询最新文档
3. 修改文件前检查 `git status` 和 `git diff`
4. 不覆盖用户已有文件或未提交的改动
5. TypeScript strict 模式，禁止 `as any`、`@ts-ignore`
6. 不自动 `git push`、不自动部署、不创建付费资源
7. 禁止提交：密钥、Token、真实客户数据、未脱敏公司数据
8. 临时文件放 `.agent-temp/`，任务后清理
9. 当前阶段不得擅自完成最终视觉设计
10. Playwright 使用系统 Chrome，不下载 Chromium
11. 页面功能完成后必须运行 E2E 验收

---

## 15. 风险与约束

| # | 风险 | 影响 | 缓解措施 |
|---|---|---|---|
| 1 | 中文目录名 | `pnpm create next-app` 拒绝 | 临时目录创建 + `--name` 覆盖包名（✅ 已验证可行） |
| 2 | OpenAI API 不通 | Codex Agent 无法查询 Context7 文档 | 使用 webfetch 直接查文档；不影响项目创建 |
| 3 | Tailwind CSS v4 API 变化 | 配置方式可能与 v3 不同 | Context7 查询最新文档 |
| 4 | `@next/mdx` 兼容性 | MDX 管线可能不稳定 | M0 已验证 remark-frontmatter + remark-mdx-frontmatter 插件链正常 |
| 5 | Chrome 150.x 兼容性 | Playwright 可能版本不匹配 | M5 实际验证，失败则报告原因而非下载 Chromium |
| 6 | 无代理/VPN | 外网资源（CDN、npm）下载慢或失败 | 使用 npmmirror 国内镜像 |

### 15.1 硬性约束

- 不下载 Playwright Chromium（使用系统 Chrome）
- 不创建付费资源
- 不自动 push / deploy / PR
- 不实现 Agent 后端
- 不连接数据库
- 不擅自确定品牌色/字体/动画等最终视觉设计
- 页面功能、内容数据和样式必须解耦

---

## 16. 路线图

| 阶段 | 状态 | 内容 |
|---|---|---|
| 环境准备 + 文档 | ✅ 完成 | Git/pnpm/Node/Playwright/Skills/docs |
| M0：工程初始化 | ✅ 完成 | Next.js 16.2.11 项目骨架 + MDX 管线 + 基础配置 |
| M1：POC | ⏳ 下一步 | 概念验证（MDX 编译 + Shiki + Mermaid + ECharts + searchText） |
| M2：内容服务层 | 📋 待执行 | Schema + Loader + Queries + searchText 提取 + 示例内容 |
| M3：笔记切片 | 📋 待执行 | 笔记列表 + 详情 + 分类/标签 + ToC + Shiki |
| M4：项目+BI 切片 | 📋 待执行 | 项目列表/详情 + BI 列表/详情 + Mermaid + ECharts |
| M5：辅助页面 | 📋 待执行 | 搜索/标签/分类/About/Resume/Agent/404 + 导航组件 |
| M6：SEO + QA | 📋 待执行 | Metadata/Sitemap/结构化数据/lint/typecheck/test/e2e/build |
| 视觉设计 | 🔮 后续 | 需要用户提供设计稿/参考；启用 frontend-visual-implementation skill |
| 内容扩充 | 🔮 后续 | 补充更多文章和案例 |
| Agent 功能 | 🔮 后续 | 搭建 FastAPI + LangGraph 后端 |
| 部署上线 | 🔮 后续 | Vercel / 自托管 |

---

## 17. 完成标准

本轮（M0-M6）同时满足以下条件才算完成：

- [x] `pnpm install` 成功
- [x] `pnpm dev` 可启动
- [ ] 所有 15 条路由 + 1 not-found 边界可访问
- [ ] MDX 正常渲染（含代码高亮、Mermaid、ECharts）
- [ ] Zod Schema 校验有效，故意错误内容触发构建失败
- [x] `pnpm typecheck` 零错误
- [ ] 搜索可用（含 searchText 全文匹配 + URL 参数恢复）
- [ ] 分类和标签可用（含中文路径编码）
- [x] `mdx-components.tsx` 已创建并可用
- [ ] `/agent` 页面明确为占位状态，未调用真实模型
- [ ] 页面功能与视觉样式解耦，`className` 接口可用
- [ ] `docs/design-handoff.md` 存在且内容完整
- [ ] `pnpm lint` 零错误
- [x] `pnpm content:check` 可运行（scripts/check-content.ts 已配置）
- [ ] `pnpm test` 全部通过
- [ ] `pnpm build` 构建成功
- [x] `playwright.config.ts` 已配置（channel: chrome）
- [x] `vitest.config.ts` 已配置
- [ ] `pnpm test:e2e` 使用系统 Chrome 全部通过
- [ ] 未下载 Playwright Chromium
- [ ] 无密钥、Token、真实敏感数据
- [ ] `.agent-temp` 已清理
- [ ] 未自动 push / deploy / PR

---

## 18. 问题清单（供评审 AI 回答）

请评审以下方面并给出意见：

1. **MDX 方案**：`@next/mdx` + `remark-frontmatter` + `remark-mdx-frontmatter` + `gray-matter`（仅用于索引）是否合理？是否有更好的替代方案？
2. **搜索方案**：构建时内存索引 + 请求时匹配，在 100-500 篇内容规模下是否有性能隐患？
3. **内容校验时机**：构建时校验 vs 运行时校验，前端应用场景下哪种更合适？
4. **Server Component 边界**：ECharts 和 Mermaid 都用 `"use client"` 是否最优？是否有更好的 hydration 策略？
5. **组件状态契约**：按组件类型分层的状态设计（数据列表 normal/empty、异步图表 loading/normal/error/empty、纯展示 normal only）是否足够？是否需要骨架屏（skeleton）作为 loading 的细化？
6. **中文目录名**：除了临时目录迁移方案，是否有更优雅的解决方式？
7. **Phase 依赖关系**：M0→M1→M2→M3→M4→M5→M6 的串行结构是否合理？是否有隐式依赖？
8. **E2E 测试覆盖**：15 个验证项是否过于乐观？哪些可以降级为可选？
9. **Agent 接口**：`AgentEvent` 的联合类型设计是否足够灵活？未来加入 `tool_call` 事件是否需要重新设计？
10. **架构风险**：有哪些潜在的技术债务或架构缺陷在本计划中被遗漏？
