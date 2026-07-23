---
name: playwright-interactive
description: Verify pages and features in a real browser using the local Playwright CLI and system Google Chrome. Use for interactive browser checks of page routing, search/filter behavior, MDX rendering, Mermaid/ECharts rendering, console errors, mobile overflow, loading/empty/error states, internal links, 404 pages, and multi-viewport layout validation. Do NOT use for code editing, content authoring, or automated CI-only test suites.
---

# Playwright Interactive

## 适用场景

- 页面实现后在真实浏览器中交互式验收。
- 验证路由访问、搜索和筛选功能。
- 检查 MDX 内容是否正确渲染。
- 验证 Mermaid 图表和 ECharts 图表在浏览器中的表现。
- 检查浏览器 Console 是否有严重错误。
- 在 390px 宽度验证无横向溢出。
- 验收 loading、empty、error 三种状态。
- 验证内部链接和 404 页面行为。
- 多视口尺寸下的基础布局检查。

## 不适用场景

- 页面代码实现时，使用 `nextjs-frontend-engineering`。
- 撰写 MDX 内容时，使用 `content-authoring`。
- 发布前批量自动化测试时，使用 `release-quality-gate`。
- 视觉设计审查或像素级比对 — 当前阶段不适用。

## 浏览器要求

- 使用本机已安装的 Google Chrome（`C:\Program Files\Google\Chrome\Application\chrome.exe`）。
- 使用 `--browser chrome` 参数。
- 不下载 Playwright 自带 Chromium。
- 不修改用户 Chrome 配置和 Profile。
- 每次测试使用隔离浏览器上下文。

## 执行步骤

1. 确认 `playwright-cli` 可用且系统 Chrome 已安装。
2. 启动开发服务器（`pnpm dev`），等待就绪。
3. 逐页打开目标路由，检查页面标题和关键内容是否可见。
4. 使用 `playwright-cli open "http://localhost:3000/path" --browser chrome` 打开页面。
5. 检查 Console 输出是否有严重错误（`console.error`、未捕获异常）。
6. 测试搜索输入、标签点击、分类筛选等交互。
7. 验证 loading 骨架、空状态提示和错误回退。
8. 在 390px 宽度检查横向溢出。
9. 关闭会话后报告通过项和失败项。

## 完成标准

- 所有目标路由可正常打开且页面标题正确。
- MDX 内容、代码高亮、Mermaid 和 ECharts 正常渲染。
- 控制台无 `console.error` 级错误。
- 390px 视口无横向溢出。
- loading、empty、error 状态存在且可用。
- 内部链接不产生意外 404。

## 安全限制

- 不访问需要认证的外部页面。
- 不在浏览器中执行用户提供的脚本。
- 不保存浏览器会话中的 Cookie 或 LocalStorage 数据。
- 不访问生产环境 URL。

## 推荐检查命令

```powershell
playwright-cli open "http://localhost:3000" --browser chrome
playwright-cli open "http://localhost:3000/notes" --browser chrome
playwright-cli open "http://localhost:3000/search" --browser chrome
```
