# 个人技术博客与项目作品集

> **v2 修订版** — 2026-07-23

面向公开访客的个人技术平台，用于知识沉淀和求职展示。

## 内容方向

数据分析 · Power BI · SQL · Python · 数据产品 · RAG · LangGraph · Agent 工程 · 指标治理 · 智能问数 · 项目复盘

---

## 技术栈

| 类别 | 技术 |
|---|---|
| 框架 | Next.js 16 App Router |
| 语言 | TypeScript (strict) |
| 样式 | Tailwind CSS 4 |
| 内容 | MDX (`@next/mdx` + `gray-matter` 仅解析 frontmatter) |
| 校验 | Zod |
| 代码高亮 | Shiki |
| 图表 | Mermaid + ECharts |
| 测试 | Vitest + Playwright Test |
| 包管理 | pnpm |

## 环境要求

- Node.js >= 22
- pnpm >= 9
- Google Chrome（用于 E2E 测试）

## 快速开始

```powershell
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
# → http://localhost:3000

# 生产构建
pnpm build

# 启动生产服务器
pnpm start
```

## 测试

```powershell
# 类型检查
pnpm typecheck

# Lint
pnpm lint

# 单元测试
pnpm test

# E2E 测试（使用系统 Chrome）
pnpm test:e2e
```

## 添加内容

### 新增学习笔记

在 `content/notes/` 下创建 `.mdx` 文件：

```yaml
---
title: "文章标题"
description: "文章描述"
publishedAt: "2026-01-01"
updatedAt: "2026-01-01"
category: "langgraph"
tags: ["agent", "state"]
draft: false
featured: false
cover: ""
---

正文内容（Markdown + MDX 组件）...
```

### 新增项目案例

在 `content/projects/` 下创建 `.mdx` 文件：

```yaml
---
title: "项目名称"
description: "项目描述"
publishedAt: "2026-01-01"
updatedAt: "2026-01-01"
projectType: "agent"
status: "completed"
featured: false
techStack: ["Next.js", "LangGraph", "FastAPI"]
cover: ""
repository: ""
demo: ""
---

项目详情（使用项目案例模板结构）...
```

### 新增 BI 案例

在 `content/dashboards/` 下创建 `.mdx` 文件：

```yaml
---
title: "看板名称"
description: "看板描述"
publishedAt: "2026-01-01"
updatedAt: "2026-01-01"
businessDomain: "销售"
tools: ["Power BI", "SQL"]
metrics: ["GMV", "转化率", "客单价"]
featured: false
cover: ""
---

BI 案例分析...
```

## 搜索实现

构建时生成全量内容索引（排除草稿），请求时在内存中匹配。支持按标题、描述、标签、分类、**全文**搜索（去除 MDX 语法后的纯文本）。URL 查询参数 `?q=关键词`，页面刷新后搜索条件可恢复。不依赖外部搜索服务或数据库。

## 页面设计状态

当前阶段所有页面仅实现功能骨架和中性基础样式。品牌色、字体方案、卡片样式、动画和最终视觉设计将在后续阶段完成。详见 `docs/design-handoff.md`。

## Agent 功能状态

`/agent` 页面当前为占位状态，展示未来规划的能力和示例问题。未实现实际 Agent 运行、模型 API 调用、对话系统和数据库。详见 `docs/agent-interface-placeholder.md`。

## 部署

本项目具备部署兼容性。部署前需设置环境变量：

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

推荐平台：Vercel（零配置）或自托管 Node.js 服务器。

---

## 目录结构

```
.
├─ app/                    # Next.js App Router 页面
│  ├─ page.tsx             # 首页
│  ├─ notes/               # 学习笔记
│  ├─ projects/            # 项目作品集
│  ├─ dashboards/          # BI 案例
│  ├─ search/              # 搜索
│  ├─ tags/                # 标签
│  ├─ categories/          # 分类
│  ├─ agent/               # Agent 占位
│  ├─ about/               # 关于
│  ├─ resume/              # 简历
│  ├─ sitemap.ts           # Sitemap
│  ├─ robots.ts            # robots.txt
│  ├─ not-found.tsx        # 404
│  └─ layout.tsx           # 全局布局
├─ components/             # 可复用组件
├─ content/                # MDX 内容
├─ lib/                    # 业务逻辑
├─ public/                 # 静态资源
├─ tests/                  # 测试
├─ docs/                   # 项目文档
└─ AGENTS.md               # Agent 工作规则
```
