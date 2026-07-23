---
name: nextjs-frontend-engineering
description: Implement Next.js App Router pages, routes, components, and data-fetching for this personal technical blog and portfolio. Use for App Router routing, Server/Client Component boundaries, MDX integration, metadata/sitemap/robots, loading/error/not-found states, responsive functional skeletons, ECharts and Mermaid client wrappers, and TypeScript types. Use ONLY for frontend engineering implementation — do NOT use for visual design, branding, color palettes, fonts, animations, gradients, or decorative styling.
---

# Next.js Frontend Engineering

## 适用场景

- 创建或修改 Next.js App Router 页面、路由、布局和动态路由。
- 决定 Server Component 与 Client Component 边界。
- 集成 MDX 内容渲染与前端组件。
- 实现 Metadata、Sitemap、robots.txt 和结构化数据。
- 封装 ECharts、Mermaid 为客户端组件。
- 实现 loading.tsx、error.tsx、not-found.tsx 和全局 error boundary。
- 创建中性基础布局和响应式功能骨架。
- 组件 Props 定义、TypeScript 类型和内容查询逻辑。
- 避免 hydration error 和不必要的客户端 JavaScript。

## 不适用场景

- 编写和审阅 MDX 内容、frontmatter、分类或标签时，使用 `content-authoring`。
- SEO 或无障码专项审查时，使用 `seo-accessibility-review`。
- 发布前质量门禁时，使用 `release-quality-gate`。
- 浏览器交互式验收时，使用 `playwright-interactive`。
- 品牌视觉设计、配色、字体选择、最终卡片样式或复杂动画时 — 当前阶段不使用任何 Skill，等待后续 `frontend-visual-implementation`。

## 允许的操作

- 实现页面结构和功能路由。
- 创建中性、可用的基础布局。
- 实现响应式可用性（390px 无横向溢出）。
- 拆分可复用组件并暴露明确的 Props 和 className。
- 保证组件可被后续视觉设计替换，不硬编码品牌色或固定布局。

## 禁止的操作

- 自行确定品牌色、主色调或配色方案。
- 自行设计最终首页排版、Hero 区域或装饰性元素。
- 自行选择字体或引入自定义字体文件。
- 加入复杂渐变、大面积动画或装饰背景。
- 使用玻璃拟态、阴影系统或过度圆角。
- 把临时中性样式当作最终视觉设计固化到组件中。
- 在内容查询逻辑中嵌入样式代码。
- 在组件中硬编码页面级最大宽度（由布局层控制）。

## 执行步骤

1. 先阅读项目现有页面、布局和组件，了解当前路由结构和数据流。
2. 使用 Server Component 作为默认起点，仅在需要交互、浏览器 API 或第三方客户端库时才添加 `"use client"`。
3. 路由和动态参数使用 Next.js App Router 约定（`page.tsx`、`layout.tsx`、`loading.tsx`、`error.tsx`、`not-found.tsx`）。
4. 内容数据通过统一内容服务层获取，不在页面中重复实现查询逻辑。
5. 组件提供 loading、empty、error 三种状态，使用语义化 HTML。
6. 使用 Tailwind CSS 实现最低限度可用样式：可读、可导航、可交互，但保持中性。
7. 完成后交由 SEO/可访问性审查和发布门禁。

## 完成标准

- 所有路由可访问且返回正确内容。
- Server/Client Component 边界清晰，无不必要的客户端 JS。
- 组件有明确 Props、可选 className 和三种状态（loading/empty/error）。
- 390px 视口无横向溢出。
- 代码通过 TypeScript strict 检查。
- 样式与内容逻辑解耦，后续视觉设计可独立替换。

## 安全限制

- 不引入未核实的 UI 包或远程字体。
- 不在客户端组件中暴露密钥、Token 或内部 URL。
- 不为了视觉效果降低文本对比度、键盘可达性或语义结构。

## 推荐检查命令

```powershell
pnpm lint
pnpm typecheck
pnpm build
pnpm exec playwright test
```
