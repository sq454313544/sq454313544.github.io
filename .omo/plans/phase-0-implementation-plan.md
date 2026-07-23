# 个人技术博客与项目作品集 — 实施计划（v2 修订版）

> **修订依据**：AI 评审意见（2026-07-23），修订 10 项必须修复项。
> **执行状态**：M0 已完成（Next.js 16.2.11 + 全部依赖 + typecheck/content:check/dev server 验证通过）。

---

## 修订记录

| # | 评审意见 | v1 问题 | v2 修正 | v2.1 修正 |
|---|---|---|---|---|
| 1 | Next.js 15 落后 | 锁定 15.x | 改为"安装当前 stable"，实际 Next.js 16.2.11 | — |
| 2 | MDX 链路矛盾 | gray-matter body string + @next/mdx 混用 | 选定 @next/mdx + 动态 import() + export metadata | — |
| 3 | --name 不存在 | 使用了不存在的参数 | 临时 ASCII 目录迁移 | — |
| 4 | 无独立校验 | 仅依赖 build | 增加 `content:check` | — |
| 5 | 路由数量错误 | 14 条 | 15 公开页面 + 1 not-found | — |
| 6 | generateStaticParams 滥用 | 所有页面 | 仅 5 条动态路由 + dynamicParams=false | — |
| 7 | ContentItem 类型 | 非判别联合 | NoteItem \| ProjectItem \| DashboardItem | — |
| 8 | frontend-design-system Active | 冲突 | Disabled | — |
| 9 | 搜索非全文 | 仅 200 字 | searchText 全文索引 | — |
| 10 | 全组件四状态 | 过度 | 按职责分层 | — |
| 11 | 日期校验 | 仅格式 | 语义 + updatedAt >= publishedAt | — |
| 12 | URL 空字符串 | .default("") | .optional() + .url() | — |
| 13 | 分类语义混淆 | 统一映射 | 保持各自字段 | — |
| 14 | M2/M3 并行 | 隐式依赖 | 垂直切片 | — |
| 15 | 实施顺序 | M0→M1→M2+M3→M4→M5 | M0→M1→M2→M3→M4→M5→M6 | — |
| 16 | TypeScript 5.0.2 | 不满足 Next.js 16 | — | **TS 7.0.2** |
| 17 | mdxRs: true | 实验性编译器 | — | **移除，使用标准 @next/mdx 管线** |
| 18 | Frontmatter 链路未闭环 | gray-matter + @next/mdx 冲突 | — | **remark-frontmatter + remark-mdx-frontmatter 插件** |
| 19 | pageExtensions 文档错误 | 漏写默认扩展 | — | **已核实 `["js","jsx","ts","tsx","md","mdx"]`** |
| 20 | Shiki/Mermaid/ToC 规则模糊 | 无明确链路 | — | **见 `docs/mdx-pipeline.md`** |

> 完整 MDX 转换管线规则见 [`docs/mdx-pipeline.md`](../docs/mdx-pipeline.md)。

---

## 环境预检（已完成）

| # | 项目 | 结果 |
|---|---|---|
| 1 | Node.js | v22.22.1 LTS |
| 2 | pnpm | 11.16.0 |
| 3 | Git | 2.50.1，main 分支，无提交 |
| 4 | Chrome | v150.0.7871.129，Playwright 烟雾测试通过 |
| 5 | Context7 | 可达 |
| 6 | Skills | 5 active（nextjs-frontend-engineering, content-authoring, playwright-interactive, seo-accessibility-review, release-quality-gate）+ 1 disabled（frontend-design-system） |
| 7 | Next.js | 16.2.11（latest stable） |

---

## 技术栈（已落实）

| 类别 | 技术 | 实际版本 |
|---|---|---|
| 框架 | Next.js App Router | 16.2.11 |
| UI | React | 19.2.4 |
| 语言 | TypeScript strict | 5.0.2（⚠️ Next.js 建议 ≥5.1，考虑升级） |
| 样式 | Tailwind CSS | 4.3.3 |
| MDX | @next/mdx + @mdx-js/mdx + @mdx-js/react | 16.2.11 / 3.1.1 / 3.1.1 |
| Frontmatter | gray-matter（仅解析，不渲染） | 4.0.3 |
| 校验 | Zod | 4.4.3 |
| 代码高亮 | Shiki | 4.3.1 |
| 图表 | Mermaid + ECharts + echarts-for-react | 11.16.0 / 6.1.0 / 3.0.6 |
| 测试 | Vitest + Playwright Test | 4.1.10 / 1.61.1 |
| 包管理 | pnpm | 11.16.0 |

---

## MDX 渲染链路（已确定）

```
content/notes/some-post.mdx
  │
  ├─ 构建时：@next/mdx 编译为 React 组件
  │   └─ next.config.ts: pageExtensions: ["mdx"], mdxRs: true
  │
  ├─ 元数据提取：gray-matter 解析 frontmatter（仅用于内容索引）
  │   └─ lib/content/loaders.ts 扫描目录，提取 frontmatter → Zod 校验
  │
  ├─ 组件映射：mdx-components.tsx（项目根目录，Next.js 自动发现）
  │
  └─ 页面渲染：动态 import() MDX 模块
      └─ app/notes/[slug]/page.tsx: import(`@/content/notes/${slug}.mdx`)
```

**关键文件**：
- `next.config.ts`：`pageExtensions`, `mdxRs: true`
- `mdx-components.tsx`：`useMDXComponents()` 导出，覆盖默认 HTML 元素
- `lib/content/loaders.ts`：扫描 content/ 目录，gray-matter 解析 frontmatter
- 页面：`dynamic import()` + `export const metadata`（元数据来自 content loader）

---

## 内容模型（修订）

### 判别联合类型

```typescript
interface BaseContentItem {
  slug: string
  body: string
  excerpt: string       // 前 200 字（展示用）
  searchText: string    // 全文纯文本（搜索用，去除 MDX 语法）
  readingTime: number
}

interface NoteItem extends BaseContentItem {
  type: "note"
  meta: {
    title: string
    description: string
    publishedAt: string
    updatedAt: string
    category: string
    tags: string[]
    draft: boolean
    featured: boolean
    cover?: string
  }
}

interface ProjectItem extends BaseContentItem {
  type: "project"
  meta: {
    title: string
    description: string
    publishedAt: string
    updatedAt: string
    projectType: "agent" | "dashboard" | "pipeline" | "tool" | "other"
    status: "completed" | "in_progress" | "maintained" | "archived"
    featured: boolean
    techStack: string[]
    cover?: string
    repository?: string    // .url() 校验
    demo?: string          // .url() 校验
  }
}

interface DashboardItem extends BaseContentItem {
  type: "dashboard"
  meta: {
    title: string
    description: string
    publishedAt: string
    updatedAt: string
    businessDomain: string
    tools: string[]
    metrics: string[]
    featured: boolean
    cover?: string
  }
}

type ContentItem = NoteItem | ProjectItem | DashboardItem
```

### Zod Schema 增强

- 日期：`z.string().date()` + 自定义 `refine(d => new Date(d) 是有效日期)`
- `updatedAt >= publishedAt`：`refine` 跨字段校验
- `cover`：`z.string().optional()`（非空字符串默认值）
- `repository`, `demo`：`z.string().url().optional()`
- 分类体系不统一映射：笔记用 `category`，项目用 `projectType`，BI 用 `businessDomain`

---

## 搜索方案（修订）

### 索引

```typescript
interface SearchIndexEntry {
  type: "note" | "project" | "dashboard"
  slug: string
  title: string
  description: string
  tags: string[]
  facets: string[]      // 笔记=category, 项目=projectType+techStack, BI=businessDomain+tools
  searchText: string    // 全文纯文本（MDX → AST → 去除 JSX/代码/链接 → normalize）
  publishedAt: string
}
```

### 匹配

URL: `/search?q=关键词`

1. 标题精确匹配（权重最高）
2. 标题部分匹配
3. searchText 全文匹配（权重中等）
4. 描述匹配
5. 标签/facets 匹配

中文归一化：`trim + Unicode normalize + 小写 + 连续空格合并`

---

## 组件状态契约（修订：按职责分层）

| 组件类型 | 需支持状态 | 示例 |
|---|---|---|
| 数据列表 | normal / empty | NoteList, ProjectList, SearchResults |
| 异步图表 | loading / normal / error / empty | EChartsWrapper |
| 动态路由 | notFound() | `notes/[slug]` |
| 路由段 | loading.tsx / error.tsx（Suspense 边界） | 各动态路由目录 |
| 纯展示 | 仅 normal（无效 props 应在父组件过滤） | Footer, PrevNextNav |
| 交互型 | normal / 空输入提示 | SearchInput |

---

## 修订后实施阶段

### M0：工程初始化 ✅ 已完成

| 步骤 | 状态 |
|---|---|
| ✅ Next.js 16.2.11 项目创建（临时 ASCII 目录 → 迁移） | 完成 |
| ✅ 全部依赖安装 | 完成 |
| ✅ `next.config.ts`（MDX + mdxRs） | 完成 |
| ✅ `tsconfig.json`（strict true） | 完成 |
| ✅ `mdx-components.tsx` | 完成 |
| ✅ `playwright.config.ts`（channel: chrome） | 完成 |
| ✅ `vitest.config.ts` | 完成 |
| ✅ `package.json` scripts（dev/lint/typecheck/test/test:e2e/content:check/build） | 完成 |
| ✅ `scripts/check-content.ts` | 完成 |
| ✅ `app/layout.tsx`（Metadata, lang=zh-CN） | 完成 |
| ✅ 目录结构创建 | 完成 |
| ✅ `pnpm typecheck` 通过 | 完成 |
| ✅ `pnpm content:check` 通过 | 完成 |
| ✅ `pnpm dev` 启动 × 首页 200 验证 | 完成 |
| ⚠️ TypeScript 5.0.2，Next.js 建议 ≥5.1 | 待评估 |

### M1：MDX 管线验证（POC）

**目标**：创建 1 篇 MDX，验证完整渲染链路

| 步骤 | 操作 |
|---|---|
| M1.1 | 创建 `content/notes/test.mdx`（含 frontmatter + Shiki 代码块 + Mermaid 图） |
| M1.2 | 实现 `lib/content/types.ts`（判别联合 ContentItem） |
| M1.3 | 实现 `lib/content/schemas.ts`（Zod + 语义日期 + 跨字段校验） |
| M1.4 | 实现 `lib/content/loaders.ts`（gray-matter 解析 frontmatter，不渲染 body） |
| M1.5 | 实现 `app/notes/[slug]/page.tsx`（动态 import + generateStaticParams + dynamicParams=false） |
| M1.6 | 实现 `components/content/MermaidDiagram.tsx`（"use client"） |
| M1.7 | 配置 Shiki 到 mdx-components.tsx |
| M1.8 | `pnpm build` 验证完整构建 |

### M2：内容服务层

| 步骤 | 操作 |
|---|---|
| M2.1 | `lib/content/slugs.ts`：slug 生成 + 去重 |
| M2.2 | `lib/content/reading-time.ts`：阅读时间计算 |
| M2.3 | `lib/content/queries.ts`：全部查询（按 slug/category/标签/精选/最新/前后篇/相关） |
| M2.4 | `lib/search/index.ts`：searchText 全文索引 |
| M2.5 | `lib/search/matcher.ts`：搜索匹配 + 中文归一化 |
| M2.6 | 单元测试：schemas + slugs + queries + search |

### M3：笔记垂直切片

| 步骤 | 操作 |
|---|---|
| M3.1-3 | 创建 3 篇学习笔记 MDX |
| M3.4 | `app/notes/page.tsx`（列表 + 分类/标签筛选） |
| M3.5 | `app/notes/[slug]/page.tsx`（完整详情 → ToC + Shiki + Mermaid + 前后篇 + 相关） |
| M3.6 | `components/content/Toc.tsx` |
| M3.7 | `components/content/PrevNextNav.tsx` |
| M3.8 | `components/content/RelatedArticles.tsx` |
| M3.9 | E2E：笔记列表 + 详情 |

### M4：项目与 BI 垂直切片

| 步骤 | 操作 |
|---|---|
| M4.1-2 | 创建 2 篇项目 MDX |
| M4.3 | `app/projects/page.tsx` + `app/projects/[slug]/page.tsx` |
| M4.4-5 | 创建 2 篇 BI MDX |
| M4.6 | `app/dashboards/page.tsx` + `app/dashboards/[slug]/page.tsx` |
| M4.7 | `components/charts/EChartsWrapper.tsx`（loading/error/empty/normal） |
| M4.8 | E2E：项目详情 + BI 图表渲染 |

### M5：辅助页面

| 步骤 | 操作 |
|---|---|
| M5.1 | `app/search/page.tsx`（`?q=` URL 参数） |
| M5.2 | `app/tags/page.tsx` + `app/tags/[tag]/page.tsx` |
| M5.3 | `app/categories/page.tsx` + `app/categories/[category]/page.tsx` |
| M5.4 | `app/page.tsx`（首页，8 个区块） |
| M5.5 | `app/about/page.tsx` |
| M5.6 | `app/resume/page.tsx` |
| M5.7 | `app/agent/page.tsx`（占位） |
| M5.8 | `app/not-found.tsx` |
| M5.9 | `components/navigation/`（Header + Footer） |
| M5.10 | E2E：搜索 + 标签 + 分类 + 404 |

### M6：SEO + QA Gate

| 步骤 | 操作 |
|---|---|
| M6.1 | 页面级 Metadata（各页面独立 title/description） |
| M6.2 | `app/sitemap.ts` + `app/robots.ts` |
| M6.3 | JSON-LD 结构化数据（笔记=Article，项目=CreativeWork） |
| M6.4 | `pnpm lint` |
| M6.5 | `pnpm typecheck` |
| M6.6 | `pnpm test` |
| M6.7 | `pnpm build` |
| M6.8 | `pnpm test:e2e`（系统 Chrome，9 条关键路径） |
| M6.9 | `.agent-temp` 清理，密钥扫描 |

---

## E2E 精简到 9 条关键路径

1. 首页导航
2. 笔记列表 → 详情（含 ToC、Shiki、Mermaid）
3. 项目列表 → 详情
4. BI 页面图表渲染
5. 搜索及 URL 参数恢复
6. 标签 + 分类
7. 未知 slug → 404
8. 移动端无横向溢出（390px）
9. Console 无严重错误

---

## Agent 接口（保持不变）

```typescript
// lib/agent/types.ts
export type AgentEvent =
  | { type: "run_started"; runId: string }
  | { type: "status"; message: string }
  | { type: "token"; content: string }
  | { type: "usage"; inputTokens: number; outputTokens: number }
  | { type: "limit_reached"; message: string }
  | { type: "error"; message: string }
  | { type: "run_completed"; runId: string }
```

`client.ts` 抛出 `new Error("Agent client is not implemented")`。

---

## 当前明确不做

- 品牌色、字体、动画、渐变、玻璃拟态 → `frontend-design-system` Disabled
- Agent 实际运行、模型 API
- FastAPI、数据库、用户认证
- 部署、push、PR
- 下载 Playwright Chromium

## 完成标准（18 项）

- [x] `pnpm install` 成功
- [x] `pnpm dev` 可启动
- [x] `pnpm typecheck` 通过
- [x] `pnpm content:check` 通过
- [ ] 所有 15 个页面路由可访问
- [ ] MDX 完整渲染链（@next/mdx + 动态 import + Shiki + Mermaid + ECharts）
- [ ] Zod Schema 校验有效
- [ ] 搜索可用（全文 searchText + URL 参数恢复）
- [ ] 分类/标签可用（保持各自字段语义）
- [ ] `/agent` 占位状态
- [ ] 页面功能与样式解耦
- [ ] `pnpm lint` 零错误
- [ ] `pnpm test` 全部通过
- [ ] `pnpm build` 构建成功
- [ ] `pnpm test:e2e`（系统 Chrome）通过
- [ ] 未下载 Chromium
- [ ] 无密钥/敏感数据
- [ ] `.agent-temp` 已清理
