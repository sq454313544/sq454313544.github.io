# 项目导航

本页用于快速定位项目入口。它描述当前目录职责，不改变路由、URL 或内容模型。

## 从哪里启动

| 目标 | 位置 / 命令 | 说明 |
|---|---|---|
| 开发服务 | `pnpm dev` | 默认访问 `http://localhost:3000` |
| 生产构建 | `pnpm build` | 先校验 MDX 内容，再构建 Next.js 应用 |
| 生产服务 | `pnpm start` | 运行已构建的应用 |
| 常用脚本 | `package.json` | 所有 `pnpm` 命令的唯一入口 |

Next.js App Router 没有独立的 `server.ts`。开发与生产服务均由 `package.json` 的脚本调用 Next.js CLI 启动。

## 页面与路由

| 目标 | 位置 | 说明 |
|---|---|---|
| 全局入口 | `app/layout.tsx` | HTML、字体、主题 Provider、Header 和 Footer |
| 首页 | `app/page.tsx` | `/` |
| 页面路由 | `app/**/page.tsx` | 文件夹名即 URL 片段 |
| 动态详情 | `app/notes/[slug]/page.tsx` 等 | 根据内容 slug 渲染详情 |
| 全局样式 | `app/globals.css` | Tailwind Token、浅深主题变量与基础样式 |
| 主题基础设施 | `app/theme-provider.tsx`、`app/fonts.ts` | 三态主题与字体加载 |

## 内容、组件与业务逻辑

| 目录 | 职责 |
|---|---|
| `content/notes/` | 学习笔记 MDX |
| `content/projects/` | 项目案例 MDX |
| `content/dashboards/` | BI 案例 MDX |
| `components/navigation/` | Header、Footer、主题切换等全局导航 |
| `components/content/` | ToC、上一篇下一篇、相关文章、代码与 Mermaid 渲染 |
| `components/charts/` | ECharts 客户端封装 |
| `components/primitives/` | Loading、Empty、Error 等基础状态 |
| `lib/content/` | MDX Schema、加载器、查询和 slug 规则 |
| `lib/search/` | 搜索索引与匹配 |
| `lib/charts/` | 图表主题与调色板 |

## 配置、测试与文档

| 目录 / 文件 | 职责 |
|---|---|
| `tests/unit/` | Vitest 单元测试 |
| `tests/e2e/` | Playwright 浏览器验收 |
| `scripts/` | 构建前内容检查 |
| `next.config.mjs` | Next.js 与 MDX 配置 |
| `playwright.config.ts` | Chrome E2E 配置 |
| `docs/roadmap.md` | 当前迭代与任务状态 |
| `docs/iteration-v2.md` | 第二轮视觉与体验的批准方案 |
| `docs/p0-contract-check.md` | 本轮字段与契约边界 |

## 整理原则与后续步骤

当前先保持 `app/` 的路由结构不动，避免无收益的大规模移动。后续按以下顺序渐进整理：

1. 维护本导航文档和 README 的入口索引。
2. 新增全局 UI 时放入 `components/navigation/` 或 `components/primitives/`，不要堆在 `app/`。
3. 页面专属展示组件可放在对应路由旁；跨页面复用后再提升到 `components/`。
4. `data/profile.ts` 已作为 About 与 Resume 的共享个人资料数据源；后续补充真实公开资料时仅维护这一处。
5. 每完成一个里程碑再评估是否需要 Route Group；不为整理而改变公开 URL。
