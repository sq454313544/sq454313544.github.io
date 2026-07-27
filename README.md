# 个人技术博客与项目作品集

> **v2 修订版** — 2026-07-23

面向公开访客的个人技术平台，用于知识沉淀和求职展示。

## 项目入口

不知道从哪里开始时，先看 [`docs/project-navigation.md`](./docs/project-navigation.md)：其中列出了服务启动命令、页面入口、内容目录、组件、业务逻辑、测试和关键文档的位置。

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

第一阶段功能骨架与第二轮 M1–M5、C1–C4 已完成。三篇专题笔记已通过内容质量门并公开发布，M5 已完成用户人工视觉验收；D1 静态导出、D2 CI/CD 和 D3 首次发布已完成，下一步为 D4 线上完整验收。内容公开规则见 [`docs/content-refresh-plan.md`](./docs/content-refresh-plan.md)，总体进度见 [`docs/roadmap.md`](./docs/roadmap.md)。

## 部署

网站已发布到 [sq454313544.github.io](https://sq454313544.github.io/)，使用 GitHub 用户根站点、Next.js 静态导出和 GitHub Actions 发布。

部署实施前需完成 C4 内容质量门与 M5 视觉 QA，并在 D1 处理搜索、项目筛选和 BI 筛选的静态导出兼容性。Power BI 真实演示版的 iframe 嵌入不阻塞首次发布，安排在 D4 线上验收完成后的 B1 阶段，并需独立完成公开性与脱敏复核。完整决策、阶段、验收与回滚方案见 [`docs/github-pages-deployment-plan.md`](./docs/github-pages-deployment-plan.md)。

正式构建时设置：

```text
NEXT_PUBLIC_SITE_URL=https://<GitHub用户名>.github.io
```

首期不配置自定义域名，不部署 Node.js、API、数据库或登录服务。任何 GitHub 登录、仓库创建、提交、推送和部署都需要用户明确确认。

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
