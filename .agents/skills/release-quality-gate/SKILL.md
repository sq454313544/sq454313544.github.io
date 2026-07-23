---
name: release-quality-gate
description: Run the final quality gate for this personal technical blog and portfolio only after a feature is complete and ready to commit or deploy. Use for linting, type checks, unit tests, production builds, Playwright critical paths, link, SEO, accessibility, secret, Git diff, and temporary-file checks; do not use during ordinary implementation or exploratory design work.
---

# Release Quality Gate

## 适用场景

- 功能完成、准备提交或准备部署前。
- 需要汇总代码质量、构建、E2E、SEO、无障碍、敏感信息和 diff 风险。

## 不适用场景

- 功能尚在开发、API 或交互仍未确定时。
- 单独设计页面、撰写内容或做专项 SEO 审查时。

## 执行步骤

1. 确认工作范围和预期变更，先审阅 `git status` 与 `git diff`。
2. 按项目脚本依次运行 ESLint、TypeScript、单元测试和 Next.js 生产构建。
3. 运行 Playwright 关键路径，并检查链接、SEO 与基础无障碍结果。
4. 扫描密钥、凭据、私有 URL、真实客户/个人数据和不应提交的构建产物。
5. 仅在全部必需检查通过或已记录明确阻塞原因后，给出提交/部署结论。
6. 清理本轮创建且不再需要的 `.agent-temp`、测试报告、调试文件和中间产物；不删除用户文件、Git 已跟踪文件、依赖环境或最终交付物。

## 完成标准

- 已执行适用于项目的 lint、类型、测试、构建和关键路径检查。
- Git diff 与敏感信息检查无未解释风险。
- 已报告通过项、失败项、跳过项及其理由，并完成任务临时文件清理。

## 安全限制

- 不自动提交、推送、部署、合并或删除分支、Release、数据和文件。
- 不输出密钥、令牌、连接串或认证文件内容。
- 不把不存在的项目脚本或外部服务失败伪报为通过。

## 推荐检查命令

在正式项目存在并定义脚本后执行：

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright test
git diff --check
git status --short
```
