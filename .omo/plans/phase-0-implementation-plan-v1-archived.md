# 个人技术博客与项目作品集 — 实施计划

## 环境预检结果（已完成）

| # | 项目 | 结果 |
|---|---|---|
| 1 | 目录内容 | 仅有 `.git`、`.codex`、`.agents`、`.codegraph`、`.omo`、`.playwright-cli` |
| 2 | Git 状态 | `main` 分支，无提交，无未提交修改 |
| 3 | Node.js | v22.22.1 LTS |
| 4 | pnpm | 11.16.0，PING/PONG 正常 |
| 5 | Git CLI | 2.50.1 |
| 6 | Skills（6个） | content-authoring ✅ / seo-accessibility-review ✅ / release-quality-gate ✅ / nextjs-frontend-engineering ✅ / playwright-interactive ✅ / frontend-design-system [FUTURE] |
| 7 | Context7 | 可达（HTTP 200） |
| 8 | Playwright + Chrome | CLI 0.1.17, Chrome v150.0.7871.129, 烟雾测试通过 |
| 9 | ⚠️ 目录名 | 含中文，需 `--name personal-tech-site` 绕过 |
| 10 | ⚠️ OpenAI API | `api.openai.com:443` 不通 → Codex Agent 功能受限，但不影响项目创建 |

## 核心技术决策

| 决策 | 选择 | 理由 |
|---|---|---|
| 框架 | Next.js 15 App Router | 用户指定 |
| 语言 | TypeScript strict | 用户指定 |
| 样式 | Tailwind CSS 4 | 随 Next.js 15 默认安装 |
| 包管理 | pnpm 11 | 用户指定 |
| MDX 方案 | `@next/mdx` + `gray-matter` + 自定义 content loader | 1) `@next/mdx` 是官方包，与 App Router 深度集成；2) `gray-matter` 解析 frontmatter；3) 自定义 loader 统一从 `content/` 目录读取，页面不重复扫描 |
| 搜索 | 构建时全量索引 + 请求时内存匹配 | 内容量可控（数十到数百篇），无需外部服务；索引逻辑可单测；URL 查询参数恢复搜索状态 |
| 代码高亮 | Shiki (`rehype-pretty-code` 或直接 `shiki`) | 用户指定；构建时高亮，无客户端 JS |
| 图表 | Mermaid（客户端 `mermaid` npm 包）+ ECharts（客户端 `echarts` + `echarts-for-react`） | 用户指定；均封装为 `"use client"` 组件，数据/Option/布局分离 |
| 校验 | Zod | 用户指定；每种内容类型独立 Schema，构建时校验 |
| 测试 | Vitest（单测）+ Playwright Test（E2E） | Vitest 比 Jest 更快，与 Next.js 生态兼容；Playwright 使用系统 Chrome |
| 内容目录 | `content/notes/`, `content/projects/`, `content/dashboards/` | 用户指定；每个 `.mdx` 文件 = 一条内容 |

## MDX 内容方案

### 文件结构

```
content/
├─ notes/
│  ├─ langgraph-state-nodes.mdx
│  ├─ rag-multi-recall-reranker.mdx
│  └─ powerbi-metrics-management.mdx
├─ projects/
│  ├─ enterprise-qa-assistant.mdx
│  └─ agent-observability-dashboard.mdx
└─ dashboards/
   ├─ business-analysis-mock.mdx
   └─ agent-monitoring-mock.mdx
```

### 处理流程

1. **读取阶段**：`lib/content/loaders.ts` 扫描 `content/` 目录，用 `gray-matter` 解析每个 `.mdx` 文件的 frontmatter + body
2. **校验阶段**：`lib/content/schemas.ts` 用 Zod 校验 frontmatter，构建时失败并报告具体文件和字段
3. **索引阶段**：`lib/content/queries.ts` 生成内存索引（按 slug、分类、标签、日期），供所有页面查询
4. **渲染阶段**：`@next/mdx` 处理 MDX body，Shiki 插件处理代码块

### 构建时校验项

- 必填字段缺失 → 构建失败
- 字段类型错误 → 构建失败
- 日期格式错误 → 构建失败
- slug 重复 → 构建失败
- 非法状态值 → 构建失败
- 非法标签/分类 → 构建失败
- 内容类型无法识别 → 构建失败

## 搜索实现方案

### 索引构建（构建时）

在 `lib/search/index.ts` 中，将全部已发布内容（排除 draft）提取为扁平数组：

```typescript
interface SearchIndexEntry {
  type: "note" | "project" | "dashboard"
  slug: string
  title: string
  description: string
  tags: string[]
  category: string
  excerpt: string // body 前 200 字
}
```

### 搜索匹配（请求时）

`/search?q=关键词` → Server Component 读取 URL 参数，在内存索引中匹配：

1. 标题精确匹配（权重最高）
2. 标题部分匹配
3. 描述匹配
4. 标签匹配
5. 分类匹配
6. 摘要匹配

结果按权重和日期降序排列。无结果时返回空状态 UI。

### 特性

- URL 查询参数（`?q=xxx`），刷新后可恢复
- 搜索逻辑在 `lib/search/matcher.ts` 中，可单测
- 不依赖数据库或外部搜索服务

## 分阶段实施计划

### M0：工程初始化

**输入**：当前空目录
**输出**：可运行的 Next.js 项目骨架

| 步骤 | 操作 | 验证 |
|---|---|---|
| M0.1 | `pnpm create next-app . --name personal-tech-site --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack --use-pnpm` | `pnpm dev` 可启动 |
| M0.2 | 安装额外依赖：`zod`, `gray-matter`, `@next/mdx`, `@mdx-js/mdx`, `shiki`, `mermaid`, `echarts`, `echarts-for-react`, `@playwright/test`, `vitest`, `@vitejs/plugin-react` | `pnpm ls` 确认 |
| M0.3 | 配置 `next.config.ts`：启用 MDX、Shiki 插件 | 构建通过 |
| M0.4 | 配置 `tsconfig.json`：strict true，path aliases | typecheck 通过 |
| M0.5 | 配置 `playwright.config.ts`：channel chrome | 配置语法正确 |
| M0.6 | 配置 `package.json` scripts：dev/lint/typecheck/test/test:e2e/build | 所有命令可执行 |
| M0.7 | 创建 `.env.example`（NEXT_PUBLIC_SITE_URL=） | 文件存在 |
| M0.8 | 创建目录结构（空目录） | 目录树正确 |
| M0.9 | 创建 `AGENTS.md` | 文件存在且内容完整 |
| M0.10 | 创建 `README.md` | 文件存在且内容完整 |
| M0.11 | 创建 `docs/` 7 个文档 | 所有文档存在 |

### M1：内容系统

**输入**：M0 完成
**输出**：完整的 Zod Schema + Content Loader + 7 篇示例内容

| 步骤 | 操作 | 验证 |
|---|---|---|
| M1.1 | 创建 `lib/content/types.ts`：NoteMeta, ProjectMeta, DashboardMeta 类型 | TypeScript 编译通过 |
| M1.2 | 创建 `lib/content/schemas.ts`：3 个 Zod Schema | 单测验证 Schema 校验 |
| M1.3 | 创建 `lib/content/loaders.ts`：扫描目录、解析 MDX、校验 | 单测验证加载逻辑 |
| M1.4 | 创建 `lib/content/queries.ts`：全部已发布、按 slug、按分类、按标签、精选、最新、前后篇、相关文章 | 单测覆盖所有查询 |
| M1.5 | 创建 `lib/content/slugs.ts`：slug 生成与去重检查 | 单测验证 |
| M1.6 | 创建 `lib/content/reading-time.ts`：阅读时间计算 | 单测验证 |
| M1.7 | 创建 `lib/search/index.ts`：搜索索引构建 | 单测验证 |
| M1.8 | 创建 `lib/search/matcher.ts`：搜索匹配逻辑 | 单测验证 |
| M1.9 | 创建 3 篇学习笔记 MDX | frontmatter 校验通过 |
| M1.10 | 创建 2 篇项目案例 MDX | frontmatter 校验通过 |
| M1.11 | 创建 2 篇 BI 案例 MDX | frontmatter 校验通过 |
| M1.12 | 运行内容 Schema 校验 → 构建失败测试 | 故意错误内容触发预期失败 |

### M2：功能页面

**输入**：M1 完成
**输出**：所有 14 条路由可访问并渲染内容

| 步骤 | 操作 | 验证 |
|---|---|---|
| M2.1 | 更新 `app/layout.tsx`：全局 Metadata、导航结构、语义化 HTML | 页面可访问 |
| M2.2 | 创建 `components/navigation/`：Header、Footer、Nav | 导航可用 |
| M2.3 | 创建 `app/page.tsx`（首页）：8 个功能区块 | 首页渲染正常 |
| M2.4 | 创建 `app/notes/page.tsx` + `app/notes/[slug]/page.tsx` | 笔记列表和详情页 |
| M2.5 | 创建 `app/projects/page.tsx` + `app/projects/[slug]/page.tsx` | 项目列表和详情页 |
| M2.6 | 创建 `app/dashboards/page.tsx` + `app/dashboards/[slug]/page.tsx` | BI 列表和详情页 |
| M2.7 | 创建 `app/search/page.tsx` | 搜索页 |
| M2.8 | 创建 `app/tags/page.tsx` + `app/tags/[tag]/page.tsx` | 标签页 |
| M2.9 | 创建 `app/categories/page.tsx` + `app/categories/[category]/page.tsx` | 分类页 |
| M2.10 | 创建 `app/about/page.tsx` | 关于页 |
| M2.11 | 创建 `app/resume/page.tsx` | 简历页 |
| M2.12 | 创建 `app/agent/page.tsx` | Agent 占位页 |
| M2.13 | 创建 `app/not-found.tsx` | 404 页面 |
| M2.14 | 所有页面使用 `generateStaticParams()` 生成静态路径 | 构建通过 |

### M3：功能组件

**输入**：M2 完成
**输出**：所有功能组件可工作

| 步骤 | 操作 | 验证 |
|---|---|---|
| M3.1 | 创建 `components/content/Toc.tsx`（文章目录） | 目录正确生成 |
| M3.2 | 整合 Shiki 代码高亮到 MDX 渲染管线 | 代码块有语法高亮 |
| M3.3 | 创建 `components/content/MermaidDiagram.tsx`（"use client"） | Mermaid 图形渲染 |
| M3.4 | 创建 `components/charts/EChartsWrapper.tsx`（"use client"） | ECharts 图表渲染 |
| M3.5 | 创建 `components/content/PrevNextNav.tsx` | 前后篇导航 |
| M3.6 | 创建 `components/content/RelatedArticles.tsx` | 相关文章列表 |
| M3.7 | 创建 `components/primitives/Loading.tsx`、`Empty.tsx`、`Error.tsx` | 三种状态组件 |
| M3.8 | 在主要页面集成 loading/empty/error 状态 | 状态展示正确 |

### M4：SEO 与可访问性

**输入**：M2 完成
**输出**：SEO 基础设施完备

| 步骤 | 操作 | 验证 |
|---|---|---|
| M4.1 | 更新 `app/layout.tsx`：全局 Metadata（title template, description） | Meta 标签存在 |
| M4.2 | 为每个页面添加页面级 Metadata | 各页面 title 不同 |
| M4.3 | 创建 `app/sitemap.ts` | `/sitemap.xml` 可访问 |
| M4.4 | 创建 `app/robots.ts` | `/robots.txt` 可访问 |
| M4.5 | 为笔记详情页添加 Article 结构化数据 | JSON-LD 存在 |
| M4.6 | 为项目详情页添加 SoftwareApplication 结构化数据 | JSON-LD 存在 |
| M4.7 | 语义化 HTML 审查（main, nav, article, h1-h6） | 层级正确 |
| M4.8 | 键盘焦点可见、图片 alt 属性、skip-link | 可访问性基础达标 |

### M5：测试与验收

**输入**：M1-M4 完成
**输出**：全部测试通过

| 步骤 | 操作 | 验证 |
|---|---|---|
| M5.1 | 创建 `tests/unit/schemas.test.ts` | Schema 单测通过 |
| M5.2 | 创建 `tests/unit/slugs.test.ts` | Slug 单测通过 |
| M5.3 | 创建 `tests/unit/queries.test.ts` | 查询单测通过 |
| M5.4 | 创建 `tests/unit/search.test.ts` | 搜索单测通过 |
| M5.5 | 创建 `tests/e2e/home.spec.ts` | E2E 通过 |
| M5.6 | 创建 `tests/e2e/notes.spec.ts` | E2E 通过 |
| M5.7 | 创建 `tests/e2e/projects.spec.ts` | E2E 通过 |
| M5.8 | 创建 `tests/e2e/dashboards.spec.ts` | E2E 通过 |
| M5.9 | 创建 `tests/e2e/search-tags-categories.spec.ts` | E2E 通过 |
| M5.10 | 创建 `tests/e2e/a11y-basics.spec.ts` | E2E 通过 |
| M5.11 | 运行 `pnpm lint` | 零错误 |
| M5.12 | 运行 `pnpm typecheck` | 零错误 |
| M5.13 | 运行 `pnpm test` | 全部通过 |
| M5.14 | 运行 `pnpm build` | 构建成功 |
| M5.15 | 运行 `pnpm test:e2e`（使用系统 Chrome） | 全部通过 |
| M5.16 | 清理 `.agent-temp`，检查无密钥/敏感数据 | 清理干净 |

## 当前阶段明确不做

- 品牌配色、字体方案、最终视觉设计
- 复杂动画、渐变、装饰背景、玻璃拟态
- Agent 实际运行、模型 API 调用
- FastAPI 服务、数据库、用户认证
- 部署（Vercel/Cloudflare）、push、PR
- 下载 Playwright Chromium

## 后续视觉设计需要保留的接口

| 层面 | 接口 | 说明 |
|---|---|---|
| 组件 Props | 所有组件接受 `className?: string` | 外部可用 Tailwind 覆盖样式 |
| 布局 | `app/layout.tsx` 控制页面级最大宽度 | 不硬编码到组件中 |
| 内容渲染 | MDX 组件可替换（`mdx-components.tsx`） | 替换渲染器不需改内容 |
| 数据 | `lib/content/queries.ts` 返回纯数据 | 不包含样式代码 |
| ECharts | `EChartsWrapper` 接收 `option` prop | 数据和布局分离 |
| 导航 | Nav 组件接受 links 数组 | 内容和结构分离 |
| 主题 | Tailwind dark: 前缀预留 | 后续启用 dark mode 无需重写组件 |
| 设计 Token | 未定义（后续由 `frontend-visual-implementation` Skill 负责） | 当前用 Tailwind 默认值 |

## 风险与假设

| 风险 | 影响 | 缓解 |
|---|---|---|
| OpenAI API 不通 | Codex Agent 无法调用 Context7 查询文档 | 使用 webfetch 直接查文档；项目创建不需要 AI Agent |
| 目录名中文 | `pnpm create next-app` 拒绝 | 使用 `--name` 指定 ASCII 包名 |
| Tailwind CSS 版本 | Next.js 15 默认安装 Tailwind v4，API 有变化 | 使用 Context7 查询最新文档确认 API |
| `@next/mdx` 与 Turbopack | 兼容性需确认 | M0.1 先不加 `--turbopack`，确认 MDX 可用后再评估 |
| 系统 Chrome 版本 | 150.x 可能不兼容最新 Playwright | M5 实际验证，若失败报告原因而不下载 Chromium |
