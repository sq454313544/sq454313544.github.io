# 路线图

> **v5 revision** — 2026-07-28：第一阶段功能骨架已完成；第二轮迭代的 M1–M5 与 C0–C4 已完成。博客最终不部署在线 Agent 页面、API 或后端服务。

## 第一阶段：功能骨架（已完成）

**状态：完成**

- [x] 环境准备（Git/pnpm/Node/Playwright/Skills）
- [x] 文档规划（AGENTS.md、README.md、docs/）
- [x] M0：工程初始化（Next.js 项目创建、依赖安装、配置）
- [x] M1：POC 垂直切片（notes 第一条路由通顶，打通 MDX→Content Loader→Server Component→路由→Metadata→E2E）
- [x] M2：内容系统层（MDX、Zod Schema、Content Loader、示例内容、搜索索引）
- [x] M3：笔记切片（15 个公开页面路由 + 1 个 not-found 边界，notes/ 全部页面 + ToC + Shiki + Mermaid + SEO）
- [x] M4：项目 + BI 切片（projects/ + dashboards/ 全部页面 + ECharts + SEO）
- [x] M5：辅助页面（首页、Agent 占位页、简历页、404 以及全局导航状态）
- [x] M6：SEO + 质量门（Metadata、Sitemap、结构化数据、lint、typecheck、单测、E2E、构建验收）

历史产出：15 个公开页面类型 + 1 个 not-found 边界全部功能骨架通过验收，其中包含 `/agent` 占位页。最终部署目标调整为 14 个公开页面类型 + 1 个 not-found 边界；历史验收记录不回写。

## 当前阶段：第二轮迭代（v2 视觉与体验升级）

**状态：进行中**
**决策文档：[`docs/iteration-v2.md`](./iteration-v2.md) v2.3 Approved**

视觉与功能切片并行推进，严格保持第一阶段契约（content-model / page-contracts / architecture / mdx-pipeline）不被破坏。

- [x] **P0：契约一致性检查**
  - 核验视觉方案需要的字段是否已存在于 content-model 与 page-contracts
  - 已存在的：本轮纯消费
  - 不存在的（`role` / `granularity` / `dataStatus` / `series` / `seriesOrder` 等）：记录到下一轮内容模型迭代，本轮视觉层用可选占位或已存在字段的展示别名实现
  - 禁止视觉任务直接修改 Schema / Query / URL 参数
  - 产出：[`docs/p0-contract-check.md`](./p0-contract-check.md)
- [x] **M1：Token、字体与主题**
  - 修正 duration / ease 语义分离（时长直接用 `duration-150 / duration-200`，不新增定制时长 token；`--ease-standard` 仅保留为缓动函数）
  - `next/font/google` CSS Variable 接入 Geist（`--font-geist-sans` / `--font-geist-mono`，不字面引用字体名）
  - next-themes Light / Dark / System 三态（`enableSystem` + `disableTransitionOnChange`，删除任何自定义防闪 IIFE）
  - accent / success / warning / error / info 成对 token（bg / border / text）落入 `@theme inline`
  - `viewport.themeColor` 导出双色（light/dark），不跟随用户选项
  - `lib/charts/palette.ts` 浅深两套 ECharts hex 数组（Canvas 不解析 CSS 变量）
- [x] **M1.5：在真实项目中做 POC**
  - Shiki 单主题服务端高亮（`codeToHtml(code, { theme: 'github-dark-dimmed' })` + Remark/Rehype 提取原始 code/lang/meta + clipboard 复制按钮）
  - Mermaid fenced code 分流（`language-mermaid` 先于 Shiki 处理；解析失败显示原始代码 + 错误提示不阻塞正文）
  - Heading ID 与静态 TOC（`rehype-slug` 接入，`break-inside: avoid` 移动端折叠到顶部）
  - **不做搜索 POC**（搜索逻辑本轮契约冻结）
  - POC 实现代码改当前项目真实文件或临时 Git 分支；测试内容放 `content/notes/__poc__.mdx` 与 `app/dev/poc/`，并加 `.gitignore`
  - 验收报告：[`docs/poc/M1.5-report.md`](./poc/M1.5-report.md)
- [x] **M2：笔记视觉**
  - `/notes` 列表（左侧分类与标签轻量 + 右侧文本列表，内容少时不堆庞大标签云）
  - `/notes/[slug]` 详情（中间 760px prose + 右侧 220px 静态 TOC，移动端 TOC 折叠到顶部）
  - Code / Mermaid / Callout 视觉重设计
- [x] **M3：项目与 BI**
  - `ProjectItem` / `DashboardItem` 强类型 access
  - 项目详情右侧资料栏（`role` / `status` / `stack` / `period` / `repo` / `demo` 字段映射）
  - BI 详情右侧资料栏（`domain` / `tools` / `metrics` / `granularity` / `dataStatus`）
  - ECharts 主题切换（按当前主题读 `chartPalettes.light` / `chartPalettes.dark`）
  - 项目状态展示 record（从 `ProjectMeta["status"]` 派生，视觉层不重定义枚举）
- [x] **M4：首页 + About + Resume**
  - 首页六屏节奏化长页（个人定位 / 精选项目 / BI 案例两列 / 核心能力 / 最新笔记 / 关于简历入口）
  - About 普通垂直时间线（不折叠，不引入额外组件库）
  - Resume 可打印 stylesheet（`break-inside: avoid` + `print-color-adjust: exact` + 链接保留下划线 + URL 打印）
- [x] **C0：真实内容资料盘点与方案沉淀**
  - 确认个人资料、项目、BI 与技术问答的事实来源和公开尺度
  - 产出：[`docs/content-refresh-plan.md`](./content-refresh-plan.md)
- [x] **C1：个人资料与简历**
  - 已更新首页、About、Resume 与 `profileData`
  - 已公开真实姓名、城市和求职邮箱；单位已泛化且未公开手机号
- [x] **C2：真实项目与 BI 案例**
  - 已用智能问数与数据仓库重构替换两个模拟项目
  - 已用两个脱敏经营分析案例替换模拟 BI 案例；旧模拟路由返回 404
- [x] **C3：面试问答专题**
  - 已将 7 组技术问答合并去重为三篇脱敏支柱专题笔记
  - 已建立统一标签、文内专题导航和更新记录；三篇专题已公开发布
- [x] **C4：内容质量门**
  - 已完成事实复核、脱敏扫描、链接和内容 Schema 检查
  - 已通过 lint、typecheck、单测、构建与 E2E
- [x] **M5：视觉 QA**
  - 已基于 C4 最终内容完成自动化回归与用户人工视觉验收，未发现阻塞问题。
  - 已验证 390px 无横向溢出、主题切换、关键路由、标签聚合与项目/BI 内容路径。
  - `/agent` 不在生产路由、Sitemap 或公开导航中；Agent 技术文章和项目案例保持可访问。

已在 C4 中完成 `release-quality-gate` 收尾；D1 可在用户确认后开始。

详见 [`docs/iteration-v2.md`](./iteration-v2.md) §二十实施阶段切片、§二十一最终视觉验收、§二十五全部决策清单。

## 后续阶段：持续内容扩充

**状态：待定**

- [ ] 补充更多学习笔记（5-10 篇）
- [ ] 补充更多项目案例（2-3 个）
- [ ] 补充更多 BI 案例（2-3 个）
- [ ] 真实内容上线后继续扩充学习笔记与案例；PDF 简历单独评审
- [ ] 配置 Google Analytics
- [ ] 视觉轮迭代中关闭的"下一轮内容模型"字段（`role` / `granularity` / `dataStatus` / `series` / `seriesOrder`）经评估后纳入 content-model 与 page-contracts

## Agent 部署范围

**状态：已排除**

本博客不部署在线 Agent 页面、API 或后端服务。Agent、RAG、LangGraph 和智能问数仍作为技术内容、项目案例与真实能力描述保留。详细边界与后续代码清理验收见 [`agent-deployment-decision.md`](./agent-deployment-decision.md)。

## 后续阶段：GitHub Pages 部署

**状态：平台已选择，实施未开始**

部署目标为公开的 GitHub 用户根站点 `<GitHub用户名>.github.io`。首期不使用自定义域名，博客以 Next.js 静态导出方式运行，不部署 Node.js、API、数据库、登录或在线 Agent 服务。

- [x] **D0：部署决策与本地文档沉淀**
  - 决策文档：[`github-pages-deployment-plan.md`](./github-pages-deployment-plan.md)
  - 同步 README、路线图与架构部署口径
- [x] **D1：静态导出适配**
  - 已启用 Next.js `output: "export"`、末尾斜杠与 GitHub Pages `.nojekyll` 标记
  - 已将搜索、项目筛选与 BI 筛选改为客户端查询参数处理
  - 已完成 Sitemap、robots 的构建期静态生成，以及 `out/` 静态预览 E2E
- [x] **D2：GitHub Pages CI/CD**
  - 已添加 GitHub Pages Actions 工作流：`main` 推送自动发布，同时保留手动触发
  - 已配置构建、质量门、静态 artifact、最小部署权限和 `github-pages` environment
  - 尚未创建仓库、推送或触发线上工作流
- [x] **D3：创建仓库与首次发布**
  - 已创建公开仓库 [`sq454313544/sq454313544.github.io`](https://github.com/sq454313544/sq454313544.github.io)
  - 已配置 GitHub Pages Actions 发布源、HTTPS 与 `origin`；首次部署成功
- [ ] **D4：线上验收**
  - HTTPS、深层链接、静态资源、SEO、390px、主题、Mermaid、ECharts
  - 确认线上无 `/agent` 页面、Sitemap 条目或公开入口

- [ ] **B1：Power BI 公开演示嵌入（D4 后）**
  - 首次发布和线上验收完成后再评估；不阻塞 D1–D4。
  - 仅使用经过独立脱敏复核的作品集演示版；真实生产看板不嵌入公开网站。
  - 无法完全公开时保持静态脱敏案例，不引入 iframe、密钥或服务端鉴权。

D1 必须在 C4 内容质量门和 M5 视觉 QA 均完成后开始，避免内容、视觉与部署适配并行改变同一批页面。任何仓库创建、登录、提交、推送和部署都不属于 D0。

## 不做事项

以下功能被明确排除（除非用户明确要求）：

- 用户注册和登录系统
- 评论系统（Giscus 等本轮不引）
- CMS 管理后台
- 邮件订阅 / Newsletter
- 多语言支持（i18n）
- PWA / Service Worker
- Contentlayer2 / Pliny / next-mdx-remote / Content Collections 内容管线
- prism / sugar-high / 客户端 `useEffect`+DOMParser Shiki
- `@once-ui-system/core` 全套（CC BY-NC 许可风险 + 强绑）
- motion / framer-motion + 内联 Magic UI 组件 / typed.js / plyr / react-medium-image-zoom / react-share
- Prisma + Postgres（不论内容存储还是访问量统计）
- Mailchimp / Spotify now-playing / GitHub API / npm API（外部服务依赖）
- LiquidGlass 玻璃拟态 / FlickeringGrid Canvas
- `<Projects range exclude />` 切片复用模式（与 Queries / 组件分层冲突）
- per-post `layout` frontmatter 字段（与按内容类型自动选布局重复）
- 多作者内容系统（单作者过度工程）
- kbar 命令面板（长期 beta + 增 bundle）
- 生成索引产物放 `content/index/`（混入内容源）
- 外部链接全部强制 `target="_blank"`
- `body-scroll-lock` / `cookie` 鉴权 / `protectedRoutes`
- bun / yarn Berry（本项目 pnpm 单一 lockfile）
- 全局 `.prose` 巨型 CSS 块（用 `mdx-components.tsx` 重映射 + Tailwind 4 `@theme`）
- TS `strict:false` / `as any` / `@ts-ignore`
- SCSS modules + `sass`
- content 内嵌 `app/blog/posts/`（内容放顶层 `content/` 与路由树解耦）
- 列表分页 `/notes/page/[page]`（笔记数 > 20 后再做）
- 嵌套 catch-all 路由 `/notes/[...slug]`（真正出现系列目录后；当前系列用 frontmatter 实现）
- Active TOC IntersectionObserver（长文章稳定后再做，本轮先静态 TOC）
- 9 平台分享（本轮仅"复制链接"）
- GitHub stars / npm 下载量社会证明（当前不做）
- RSS Feed（可在内容上线后再做）
- 动态 OG 图（SEO 基础完成后）
- 社交媒体集成

## 与第一阶段文档的关系

第二轮迭代严格以上游契约为先。以下文档保持不变，作为本轮不可绕过的上游契约：

- [`architecture.md`](./architecture.md) — 系统架构、组件边界、技术债务演进
- [`mdx-pipeline.md`](./mdx-pipeline.md) — `@next/mdx` + gray-matter + Zod 内容渲染流程
- [`content-model.md`](./content-model.md) — frontmatter Schema、字段定义、敏感数据规则
- [`page-contracts.md`](./page-contracts.md) — 每页数据契约、状态契约、组件契约（v4 增订已对齐 iteration-v2 修正）
- [`functional-requirements.md`](./functional-requirements.md) — 最终部署的 14 个公开页面类型 + 1 个 not-found 边界功能清单
- [`design-handoff.md`](./design-handoff.md) — 第一阶段交接清单（作为历史参照保留）
- [`agent-deployment-decision.md`](./agent-deployment-decision.md) — 在线 Agent 排除范围、历史与最终路由口径
- [`content-refresh-plan.md`](./content-refresh-plan.md) — 真实个人资料、项目、BI、专题笔记与脱敏发布规则
- [`github-pages-deployment-plan.md`](./github-pages-deployment-plan.md) — GitHub Pages 静态部署决策、阶段、质量门与发布边界

第二轮迭代总决策文档为 [`docs/iteration-v2.md`](./iteration-v2.md) v2.3 Approved；内容公开与脱敏以 [`content-refresh-plan.md`](./content-refresh-plan.md) 为准，Agent 部署范围以 [`agent-deployment-decision.md`](./agent-deployment-decision.md) 为准。
