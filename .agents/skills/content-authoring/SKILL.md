---
name: content-authoring
description: Author or review learning notes, project portfolio cases, and BI case-study MDX for this personal technical site. Use only when creating or editing structured content, frontmatter, categories, tags, summaries, publishing metadata, media paths, or sensitive-data redaction; do not use for component design, SEO-only audits, or release verification.
---

# Content Authoring

## 适用场景

- 编写或审阅学习笔记、项目案例与 BI 案例 MDX。
- 补全 frontmatter、分类、标签、摘要、发布日期、草稿状态和媒体路径。
- 发布前检查内容脱敏与事实表达。

## 不适用场景

- 页面工程实现使用 `nextjs-frontend-engineering`。
- 浏览器交互验收使用 `playwright-interactive`。
- 元数据和无障碍专项审查使用 `seo-accessibility-review`。
- 发布门禁使用 `release-quality-gate`。

## 执行步骤

1. 沿用项目既有 MDX schema；若尚未定义，不臆造最终 schema，只列出待项目初始化时确认的字段。
2. 先写清标题、摘要、受众与结论，再补充可复现的背景、方法、结果和局限。
3. 使用稳定、可读的分类和标签；将草稿与发布日期明确写入 frontmatter。
4. 使用仓库内的相对图片或附件路径，并为每个可视内容提供上下文和替代文本来源。
5. 发布前逐项执行敏感信息检查与链接检查。

## 完成标准

- 内容有准确标题、简洁摘要、清晰层级和一致的 frontmatter。
- 分类、标签、发布日期和草稿状态可供后续列表、搜索和 SEO 使用。
- 图片、附件和外部资料链接均有可验证的来源或路径。

## 安全限制

绝不写入真实客户信息、身份证和手机号、案件编号、数据库地址、密钥、内部系统账号或未脱敏公司数据。对可能识别个人、客户、雇主或内部系统的信息先删除、泛化或取得明确授权；不以占位符泄露真实格式。

## 推荐检查命令

在正式项目存在后，按项目脚本执行：

```powershell
pnpm lint
pnpm typecheck
rg -n --hidden -g '*.mdx' -g '*.md' '(AKIA|BEGIN .*PRIVATE KEY|password|token|mongodb://|mysql://)'
```
