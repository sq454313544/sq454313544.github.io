# GitHub Pages 部署方案

> 版本：v1.2
> 日期：2026-07-28
> 决策状态：D1–D3 已完成；D4 尚未实施
> 当前边界：已发布到 `https://sq454313544.github.io/`；D4 线上完整验收尚未开始

## 一、目标

将个人技术博客作为纯静态网站部署到 GitHub Pages，用于公开展示学习笔记、项目作品、BI 案例、About 与 Resume。

最终形态：

- 公开仓库：`<GitHub用户名>.github.io`
- 默认地址：`https://<GitHub用户名>.github.io/`
- 发布分支：`main`
- 发布方式：推送 `main` 后自动发布，同时保留手动触发
- 构建方式：Next.js 静态导出
- 运行环境：GitHub Pages 静态文件托管，不运行 Node.js 服务

首期不配置自定义域名，不设置 `basePath` 或 `assetPrefix`。

## 二、明确不做

GitHub Pages 不承载以下能力：

- `/agent` 在线页面、Agent API、FastAPI 或 LangGraph 后端
- 数据库、登录、会话和服务端鉴权
- Server Actions、请求时动态渲染和依赖服务器的 Route Handler
- 在线内容管理后台
- 需要密钥才能在浏览器运行的第三方服务

首期 D1–D4 也不实施 Power BI iframe 嵌入；现有 BI 案例继续使用已脱敏的图表、方法说明和静态内容。真实 Power BI 演示版的嵌入安排在站点首次发布并完成线上验收之后，作为独立的 B1 阶段。

Agent、RAG、LangGraph 和智能问数仍可作为公开技术内容、项目案例与能力描述保留。Agent 部署边界以 [`agent-deployment-decision.md`](./agent-deployment-decision.md) 为准。

## 三、当前兼容性结论

项目主体适合静态导出：

- 内容来自本地 MDX，可在构建期读取和校验。
- 笔记、项目、BI、标签和分类详情路由已提供 `generateStaticParams()`。
- Shiki 在服务端构建阶段生成高亮 HTML。
- Mermaid、ECharts、主题切换等功能在浏览器端运行。
- 项目不依赖数据库、登录或线上 Agent 服务。

静态导出前仍需处理以下兼容项：

1. `/search` 当前通过服务端 `searchParams` 读取查询词。
2. `/projects` 当前通过服务端 `searchParams` 处理 `type` 与 `tech`。
3. `/dashboards` 当前通过服务端 `searchParams` 处理 `domain` 与 `tool`。
4. Sitemap、robots、Metadata 和结构化数据需要使用正式 GitHub Pages 地址。
5. E2E 需要能够针对 `out/` 静态产物运行，而不是只验证 `next dev`。

上述兼容项纳入 D1，不在本次文档任务中修改。

## 四、静态导出实施设计

### 4.1 Next.js 配置

D1 在 `next.config.mjs` 中启用：

```js
const nextConfig = {
  output: "export",
  trailingSlash: true,
};
```

构建结果输出到 `out/`。由于使用用户名根站点，不配置仓库子路径。

如果后续引入 `next/image`，必须使用静态导出兼容的自定义 loader 或 `images.unoptimized`，不得依赖 Next.js 默认图片优化服务。

在 `public/` 中加入 `.nojekyll`，确保发布产物明确按静态文件处理。

### 4.2 搜索与筛选

保持现有公开 URL 参数不变：

- `/search?q=关键词`
- `/projects?type=agent`
- `/projects?tech=Python`
- `/dashboards?domain=业务领域`
- `/dashboards?tool=Power%20BI`

页面在构建期取得公开内容数据，再由客户端组件读取和更新查询参数：

- 页面服务端部分只负责构建期数据准备和静态 HTML 外壳。
- 客户端组件通过 `useSearchParams` 读取查询条件，并放入 `Suspense` 边界。
- 查询、筛选和空状态在浏览器端计算。
- URL 可复制、刷新和前进后退，既有参数名称与语义不变。
- 草稿和非公开内容不得进入客户端数据。

### 4.3 正式站点地址

GitHub Actions 构建时设置：

```text
NEXT_PUBLIC_SITE_URL=https://<GitHub用户名>.github.io
```

Sitemap、robots、canonical、Open Graph 和 JSON-LD 必须基于该地址生成，不得出现 `localhost`。

## 五、GitHub Actions 设计

工作流触发条件：

- 推送到 `main`
- `workflow_dispatch` 手动触发

构建任务：

1. 检出代码。
2. 使用 Node.js 22 与 pnpm 11。
3. 执行 `pnpm install --frozen-lockfile`。
4. 依次运行内容校验、lint、typecheck、单元测试和静态构建。
5. 启动 `out/` 静态预览并运行 Playwright E2E。
6. 上传 `out/` 作为 GitHub Pages artifact。

部署任务：

- 仅在构建任务全部通过后执行。
- 使用 `github-pages` environment。
- 最小权限为 `contents: read`、`pages: write`、`id-token: write`。
- 使用 `actions/checkout@v6`、`pnpm/action-setup@v4`、`actions/setup-node@v4`、`actions/configure-pages@v5`、`actions/upload-pages-artifact@v4` 与 `actions/deploy-pages@v4`。
- 同一时间只允许一个 Pages 部署流程，避免并发覆盖。

## 六、实施阶段

- [x] **D0：方案沉淀**
  - 完成本文件。
  - 更新路线图、README 与架构部署口径。
- [x] **D1：静态导出适配**
  - 已启用 Next.js 静态导出与末尾斜杠，构建产物输出至 `out/`。
  - 已将搜索、项目筛选和 BI 筛选改为客户端查询参数处理，并以 `Suspense` 包裹。
  - 已为 Sitemap 与 robots 声明构建期静态生成；正式站点 URL 仍由 D2 Actions 注入。
  - 已加入 `.nojekyll`、本地静态预览脚本和 `pnpm test:e2e:static` 验收命令。
- [x] **D2：CI/CD**
  - 已添加 `.github/workflows/deploy-pages.yml`；`main` 推送自动触发，并保留 `workflow_dispatch`。
  - 已配置 Node.js 22、pnpm 11、内容/代码质量门、静态构建、Chrome 静态 E2E 和 Pages artifact。
  - 已配置最小权限、`github-pages` environment 与同组串行部署；本地尚未创建仓库或触发工作流。
- [x] **D3：首次发布**
  - 已完成 GitHub 登录，并创建公开仓库 `sq454313544/sq454313544.github.io`。
  - 已配置 `origin`、GitHub Pages Actions 发布源与 HTTPS。
  - 已提交并推送首次发布；Actions 构建、静态 E2E、artifact 与部署均成功。
- [ ] **D4：线上验收**
  - 验证 HTTPS、深层链接、404、静态资源和 SEO 文件。
  - 验证搜索、筛选、主题、Mermaid、ECharts、Resume 打印和移动端。
  - 确认线上无 `/agent` 页面、Sitemap 条目或导航入口。

- [ ] **B1：Power BI 公开演示嵌入（首次发布后）**
  - 仅在 D4 完成、用户明确确认并完成单独脱敏复核后评估实施。
  - 只允许嵌入独立的作品集演示版，不嵌入生产或内部看板。
  - 若使用 Power BI 的“发布到 Web”，报告及其模型中的数据必须可被任何互联网访客公开访问；不能依赖 RLS、隐藏页或隐藏字段保护数据。
  - 若无法满足完全公开条件，则保留静态脱敏展示，不接入 iframe。
  - GitHub Pages 不保存 Power BI 凭据、嵌入令牌或其他密钥，也不实现需要服务端令牌的安全嵌入。

D1 必须在 C4 内容质量门和第二轮 M5 视觉 QA 均完成后开始，避免内容更新、静态适配和视觉修正并行改变同一批页面。

## 七、验收标准

本地质量门：

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

静态产物应满足：

- `out/` 包含首页、404、Sitemap、robots 以及所有公开详情页。
- 直接刷新深层链接不会返回 GitHub Pages 404。
- CSS、字体和 `_next` 静态资源加载成功。
- URL 查询参数在刷新、复制、前进和后退后仍然有效。
- 390px 视口无横向溢出。
- Light、Dark、System 三态正常。
- Mermaid 与 ECharts 正常渲染，控制台无错误。
- Sitemap 与 robots 使用正式 HTTPS 地址。
- `/agent` 不存在，Agent 技术内容和项目案例仍可访问。
- B1 不属于本轮静态导出、CI/CD 或首次发布验收范围。

线上质量门：

- GitHub Actions 构建与部署任务均为成功状态。
- `https://<GitHub用户名>.github.io/` 返回成功响应。
- Pages 强制使用 HTTPS。
- 未提交密钥、Token、连接串、真实客户信息或未脱敏数据。

## 八、安全与发布权限

- 仓库公开前执行敏感信息、环境变量和内容脱敏检查。
- `.env.example` 只保留变量名和公开示例，不写入真实值。
- GitHub Pages 产物视为完全公开，不放置任何内部材料。
- 本项目不自动创建付费资源。
- 未经用户明确确认，不执行 `git push`、仓库创建、Pages 启用或首次发布。
- GitHub 登录应由用户完成，不在文档、脚本或聊天输出中保存 Token。

## 九、失败与回滚

- 构建或测试失败时不执行部署，保留上一版线上站点。
- 新版本上线后出现问题时，回退对应部署提交并重新触发 Actions。
- GitHub Actions 与 Pages 状态是首次排查入口；浏览器控制台、网络请求和 artifact 内容用于定位静态路径问题。
- 如果未来改用普通项目仓库或自定义域名，必须重新评审 `basePath`、`assetPrefix`、站点 URL、DNS 与 canonical，不直接沿用当前根站点配置。
