---
name: frontend-design-system
description: (DISABLED for current phase) Apply visual design only when the user explicitly provides design references, mockups, screenshots, or a design brief. Do NOT auto-trigger during engineering implementation — use nextjs-frontend-engineering instead. This skill remains dormant until the user enters the visual design phase.
---

# Frontend Design System (Disabled)

> **当前阶段禁用。** 只有用户提供设计稿、参考截图或明确要求视觉设计时才触发。
> 前端工程实现请使用 `nextjs-frontend-engineering`。

## 适用场景（未来）

- 用户明确提供了设计稿、参考网站或截图。
- 用户要求实现品牌色、字体、组件样式和深色模式。
- 用户要求对照桌面端和移动端截图逐像素调整。

## 不适用场景

- 前端工程实现（路由、Server/Client Component 边界、数据流）时，使用 `nextjs-frontend-engineering`。
- 撰写 MDX 内容时，使用 `content-authoring`。
- SEO 或无障码审查时，使用 `seo-accessibility-review`。
- 浏览器交互验收时，使用 `playwright-interactive`。
- 发布前质量门禁时，使用 `release-quality-gate`。

## 执行步骤

1. 先查看现有页面、组件和布局，理解当前功能骨架。
2. 若用户提供了设计稿/参考 → 按参考实现，用 Playwright 截图比对。
3. 若无设计参考 → 使用中性专业默认值（`neutral-900` 正文、`slate` 灰阶、系统字体栈），对品牌色等关键决策询问用户。
4. 以移动端单列布局开始，再补充大屏布局。
5. 使用有限且一致的字体层级、间距和圆角。为深色模式预留 `dark:` 前缀。
6. 仅在能传达状态或反馈时添加动画，尊重 `prefers-reduced-motion`。
7. 交由 SEO/无障碍与发布质量 Skill 做后续审查。

## 完成标准

- 组件在小屏到大屏均无横向溢出，交互状态清晰。
- 明暗主题、间距、圆角和按钮/卡片状态保持一致。
- 页面不依赖无意义渐变、装饰性动效或过度营销式组件。

## 安全限制

- 不引入未核实的 UI 包、远程字体或第三方脚本。
- 不把令牌、内部链接、真实客户数据或私有截图嵌入界面。
- 不为了视觉效果降低文本对比度、键盘可达性或语义结构。

## 推荐检查命令

```powershell
pnpm lint
pnpm typecheck
pnpm dev
```

