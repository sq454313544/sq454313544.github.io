---
name: seo-accessibility-review
description: Review completed pages of this personal technical blog and portfolio for SEO and baseline accessibility. Use only for audits of metadata, canonical URLs, Open Graph, sitemap, robots, structured data, semantic HTML, keyboard support, focus states, alt text, contrast, mobile usability, internal links, or 404 behavior; do not use to build the page or author its main content.
---

# SEO and Accessibility Review

## 适用场景

- 页面完成后审查 SEO、可访问性与链接完整性。
- 检查标题、描述、canonical、Open Graph、sitemap、robots 和结构化数据。
- 检查语义、键盘操作、焦点、图片 alt、对比度、移动端和 404。

## 不适用场景

- 页面工程实现时使用 `nextjs-frontend-engineering`。
- 撰写 MDX 正文时使用 `content-authoring`。
- 执行完整发布门禁时使用 `release-quality-gate`。

## 执行步骤

1. 从页面目标、受众与 URL 开始，确认标题、描述和 canonical 唯一且匹配内容。
2. 检查 Open Graph、robots、sitemap 和结构化数据是否存在、有效且不暴露草稿或私有内容。
3. 检查 `main`、标题层级、导航、按钮、表单标签和图片 alt 的语义。
4. 只用键盘走完主要路径，确认可见焦点、合理顺序和无键盘陷阱。
5. 在窄视口验证缩放、触控目标、对比度、内部链接、失效链接和 404 页面。
6. 报告可操作问题及严重度，不把视觉偏好误报为无障碍失败。

## 完成标准

- 每个公开页面具备准确元数据与唯一 canonical。
- 主要交互可通过键盘完成且焦点可见。
- 非装饰图片具备有意义 alt，装饰图片正确忽略。
- 关键内部链接、404 和移动端主路径通过检查。

## 安全限制

- 不在 metadata、结构化数据、图片说明或 URL 中暴露草稿、客户、个人或内部信息。
- 不以跳过焦点样式、伪文本 alt 或降低对比度换取视觉效果。
- 不将外部链接检查结果视为可自动修改第三方内容的授权。

## 推荐检查命令

在正式项目存在后，按项目脚本执行：

```powershell
pnpm lint
pnpm build
pnpm exec playwright test
```
