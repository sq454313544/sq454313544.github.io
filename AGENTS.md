<!-- v2 修订：Next.js 16 + MDX 编译流程澄清 (2026-07) -->
# AGENTS.md — 个人技术博客与项目作品集

## 项目目标

面向公开访客的个人技术平台，用于知识沉淀和求职展示。

内容方向：数据分析、Power BI、SQL、Python、数据产品、RAG、LangGraph、Agent 工程、指标治理、智能问数、项目复盘。

## 固定技术栈

- Next.js 16 App Router
- React 19
- TypeScript strict（5.9.2，Next.js 16 兼容）
- Tailwind CSS 4
- 本地 MDX（`@next/mdx` 编译 + `gray-matter` 仅解析 frontmatter）
- Zod（frontmatter 校验）
- Shiki（代码高亮，Turbopack 兼容方案待定）
- Mermaid（图表）
- ECharts（图表）
- pnpm（包管理）
- Playwright Test（E2E，系统 Chrome）

## 工作流规则

### 代码修改
- 统一使用 `pnpm`，不使用 npm 或 yarn。
- 涉及 Next.js、React、Tailwind、MDX、Zod、Shiki、Mermaid、ECharts、Playwright 的 API 时，使用 Context7 查询最新官方文档，不依赖记忆或过时教程。
- 修改任何文件前，先检查 `git status` 和 `git diff`。
- 不覆盖用户已有文件或未提交的改动。
- TypeScript 使用 strict 模式，禁止 `as any`、`@ts-ignore`。

### 提交与部署
- 不自动 `git push`。
- 不自动部署（Vercel、Cloudflare 等）。
- 不创建付费资源。
- 不自动创建 PR。

### 安全
- 禁止提交密钥、Token、连接串、密码。
- 禁止提交真实客户名称、案件数据、身份证、手机号、数据库地址、内部账号、未脱敏公司数据。
- `.env.example` 只包含变量名，不含真实值。

### 临时文件
- 所有临时脚本、调试输出、构建产物放入 `.agent-temp/`。
- 任务完成后清理 `.agent-temp/` 中本轮创建且不再需要的文件。
- 不删除用户文件、Git 已跟踪文件、`node_modules`、`.venv` 或全局配置。

### 当前阶段限制
- 不得擅自完成最终视觉设计（品牌色、字体、卡片样式、动画、渐变、玻璃拟态）。
- 只实现简洁、中性、可使用、可测试的功能骨架。
- 页面功能、内容数据和样式必须解耦。
- 所有组件接受 `className` prop，样式可被后续设计替换。

### Playwright
- 使用本机 Google Chrome（`channel: "chrome"`）。
- 不执行 `playwright install chromium`。
- 不下载 Playwright 自带 Chromium。
- 不修改用户 Chrome 配置或 Profile。
- 页面功能完成后必须运行 E2E 验收。

### 验证命令
```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

## 目录结构

```
.
├─ app/                    # Next.js App Router 页面
├─ components/             # 可复用组件
│  ├─ content/             # 内容渲染（ToC、PrevNext、Related）
│  ├─ navigation/          # Header、Footer
│  ├─ charts/              # ECharts、Mermaid 客户端封装
│  ├─ seo/                 # SEO 组件
│  └─ primitives/          # Loading、Empty、Error 状态组件
├─ content/                # MDX 内容
│  ├─ notes/               # 学习笔记
│  ├─ projects/            # 项目案例
│  └─ dashboards/          # BI 案例
├─ lib/                    # 业务逻辑
│  ├─ content/             # 内容服务层（Schema、Loader、Queries）
│  ├─ search/              # 搜索索引和匹配
│  ├─ seo/                 # SEO 工具
│  └─ agent/               # Agent 接口预留（types、client、mock）
├─ public/                 # 静态资源
├─ tests/                  # 测试
│  ├─ unit/                # Vitest 单测
│  └─ e2e/                 # Playwright E2E
├─ docs/                   # 项目文档
├─ .agent-temp/            # 临时文件（任务后清理）
├─ AGENTS.md               # 本文件
├─ README.md               # 项目说明
├─ .env.example            # 环境变量模板
└─ playwright.config.ts    # Playwright 配置（channel: chrome）
```
