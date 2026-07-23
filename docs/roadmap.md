# 路线图

> **v2 revision** — 2026-07-23：从 v1 平面阶段（M0→M1→M2+M3→M4→M5）改为 v2 纵向切片（M0→M1 POC→M2 content layer→M3 notes slice→M4 projects+BI slice→M5 aux pages→M6 SEO+QA），每个切片包含路由、组件、SEO、测试。

## 当前阶段：功能骨架

**状态：进行中**

- [x] 环境准备（Git/pnpm/Node/Playwright/Skills）
- [x] 文档规划（AGENTS.md、README.md、docs/）
- [x] M0：工程初始化（Next.js 项目创建、依赖安装、配置）
- [ ] M1：POC 垂直切片（notes 第一条路由通顶，打通 MDX→Content Loader→Server Component→路由→Metadata→E2E）
- [ ] M2：内容系统层（MDX、Zod Schema、Content Loader、示例内容、搜索索引）
- [ ] M3：笔记切片（15 个公开页面路由 + 1 个 not-found 边界，notes/ 全部页面 + ToC + Shiki + Mermaid + SEO）
- [ ] M4：项目 + BI 切片（projects/ + dashboards/ 全部页面 + ECharts + SEO）
- [ ] M5：辅助页面（首页、Agent 占位页、简历页、404 以及全局导航状态）
- [ ] M6：SEO + 质量门（Metadata、Sitemap、结构化数据、lint、typecheck、单测、E2E、构建验收）

## 下一阶段：视觉设计

**状态：待定**

需要用户提供：
- 品牌色板和字体方案
- 组件设计稿（桌面端 + 移动端）
- 首页布局设计
- 设计参考网站

完成后启用 `frontend-visual-implementation` Skill。

任务：
- [ ] 创建设计 Token 系统
- [ ] 实现深色模式
- [ ] 重新设计所有页面视觉
- [ ] 添加合理动画（尊重 `prefers-reduced-motion`）
- [ ] 响应式视觉细节调整
- [ ] 视觉 QA（Playwright 多视口截图比对）

## 后续阶段：内容扩充

**状态：待定**

- [ ] 补充更多学习笔记（5-10 篇）
- [ ] 补充更多项目案例（2-3 个）
- [ ] 补充更多 BI 案例（2-3 个）
- [ ] 完善简历内容
- [ ] 添加 PDF 简历
- [ ] 配置 Google Analytics

## 后续阶段：Agent 功能

**状态：待定（低优先级）**

- [ ] 搭建 FastAPI Agent 后端服务
- [ ] 实现 LangGraph Agent 工作流
- [ ] 实现 `/api/agent/run` API Route
- [ ] 更新 `/agent` 页面为真实交互界面
- [ ] 实施 rate limiting 和 Token 上限
- [ ] 添加会话管理

## 后续阶段：部署

**状态：待定**

- [ ] 选择部署平台（推荐 Vercel）
- [ ] 配置自定义域名
- [ ] 设置 CI/CD 流水线
- [ ] 监控和错误追踪
- [ ] CDN 和缓存策略

## 不做事项

以下功能被明确排除（除非用户明确要求）：

- 用户注册和登录系统
- 评论系统
- CMS 管理后台
- 邮件订阅
- 多语言支持（i18n）
- 暗色模式自动切换（手动切换在视觉设计阶段做）
- PWA / Service Worker
- RSS Feed（可在内容丰富后考虑）
- 社交媒体集成
