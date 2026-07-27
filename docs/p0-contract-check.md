# P0 契约一致性检查

> 日期：2026-07-27
> 状态：通过，允许进入 M1
> 范围：`docs/iteration-v2.md` 的视觉需求与现有内容模型、TypeScript 类型、页面契约及当前页面实现

## 结论

第二轮视觉实现可以进入 M1。现有内容模型足以支持主题、字体、Token、笔记视觉和大部分项目 / BI 展示；本轮不修改 MDX Schema、内容 Query、路由或既有 URL 参数语义。

以下边界已经冻结：

- 已存在字段直接消费，视觉层只做展示别名映射。
- 缺失字段不加入本轮 MDX Schema；使用占位、静态说明或暂不展示。
- `series` / `seriesOrder` 本轮不实现对应 UI。
- 项目筛选使用 `type` / `tech`，BI 筛选使用 `domain` / `tool`，笔记继续使用 `category` / `tag`。
- `ProjectStatus` 不在视觉层重定义枚举。

## 字段核验

| 视觉需求 | 现有来源 | 结论与本轮处置 |
|---|---|---|
| Note `category` / `tags` | `NoteMeta.category` / `NoteMeta.tags` | 已存在，仅用于笔记筛选和展示 |
| Note / Project / Dashboard `cover` | 三类 Meta 与 Zod Schema 均已有可选 `cover` | 已存在；空字符串或缺失时显示中性占位，不增加必填约束 |
| `series` / `seriesOrder` | 不存在 | 本轮不实现系列笔记 UI，留待下一轮内容模型评审 |
| Project `projectType` | `ProjectMeta.projectType` | 已存在；展示别名为“项目类型”，筛选参数使用 `type` |
| Project `status` | `ProjectMeta.status` | 已存在；唯一枚举为 `completed / in_progress / maintained / archived` |
| Project `stack` | `ProjectMeta.techStack` | 已存在；`stack` 仅是视图层展示别名 |
| Project `repo` | `ProjectMeta.repository` | 已存在；`repo` 仅是视图层展示别名 |
| Project `demo` | `ProjectMeta.demo` | 已存在；直接消费可选 URL |
| Project `role` | 不存在 | 不进入 Schema；本轮资料栏使用“待补充”占位或省略该行 |
| Project `period` | 无独立项目周期字段 | 不把发布日期伪装成项目周期；本轮改为展示“发布于 / 更新于”，下一轮再评审独立周期字段 |
| Dashboard `domain` | `DashboardMeta.businessDomain` | 已存在；`domain` 仅是视图层展示别名，筛选参数使用 `domain` |
| Dashboard `tools` | `DashboardMeta.tools` | 已存在；直接消费 |
| Dashboard `metrics` | `DashboardMeta.metrics` | 已存在；直接消费 |
| Dashboard `granularity` | 不存在 | 不进入 Schema；本轮资料栏使用“未单独记录”占位或省略该行 |
| Dashboard `dataStatus` | 不存在 | 不进入 Schema；当前两个 mock 案例可静态标注“模拟数据”，未来内容不得据此自动推断 |

## 类型与数据边界

### ProjectStatus

`lib/content/types.ts` 当前把状态联合类型内联在 `ProjectMeta.status`，没有独立导出名为 `ProjectStatus` 的类型。

M3 实现时应使用 `ProjectMeta["status"]`，或增加等价的纯类型导出；不得在组件中再次手写一份状态联合类型。这个处理不改变 Zod Schema 或运行时数据。

### ProjectItem / DashboardItem

页面和 Loader 已使用 `ProjectItem` / `DashboardItem`，专属字段位于 `item.meta`。M3 可继续进行强类型访问，不需要把两者降级为 `ContentItem` 或使用类型断言。

### About / Resume 数据源

`page-contracts.md` 约定 About 与 Resume 共用 `data/profile.ts` 和相关类型，但当前项目尚无 `data/` 目录，两页仍使用页面内静态内容。

该差异不阻塞 M1—M3。进入 M4 时需先建立独立的个人资料数据源并让两页共享；它不属于 MDX 内容 Schema，不得夹带真实手机号、内部账号或其他敏感信息。

## 页面与 URL 契约核验

| 页面 | 冻结参数 | 当前实现差异 | 后续处置 |
|---|---|---|---|
| `/notes` | `category` / `tag` | 既有字段与 Query 可支持 | M2 只调整交互和视觉 |
| `/projects` | `type` / `tech` | 当前页面展示类型与技术栈，但尚未读取 `searchParams` 进行筛选 | M3 在页面层基于现有数据过滤，不修改内容 Query 接口 |
| `/dashboards` | `domain` / `tool` | 当前页面展示领域与工具，但尚未读取 `searchParams` 进行筛选 | M3 在页面层基于现有数据过滤，不修改内容 Query 接口 |

不得把项目或 BI 参数改回 `category` / `tag`。筛选状态必须可通过 URL 恢复。

## 文档一致性修正

本次 P0 同步修正以下冲突：

- 从“缺失字段”示例中移除实际已经存在的 `cover`。
- 将误写的 `ProjectDetailMeta.granularity` 更正为 `DashboardDetailMeta.granularity`。
- 从“不做项”中移除本轮明确要求实现的 Light / Dark / System 三态主题。
- 修正系列笔记说明，避免声称当前已有 `series` / `seriesOrder` frontmatter。
- 将视觉最终验收出口从误写的 M6 更正为路线图中的 M5。
- 将 Resume 打印契约对齐为自然分页、保留灰度层级和可识别链接。
- 将已被合并删除的设计决策文档引用改为 `docs/iteration-v2.md`。

## 各阶段执行边界

- M1：可以实现 Token、Geist CSS Variables、三态主题、`viewport.themeColor` 和 ECharts 调色板。
- M1.5：可以在真实项目中验证 Shiki、Mermaid 分流和静态 TOC；不得改搜索逻辑。
- M2：可以重做笔记列表与详情视觉；不实现系列 UI。
- M3：按本报告的字段映射和占位策略实现项目 / BI；页面层补齐冻结参数的筛选行为。
- M4：先建立 About / Resume 共享数据源，再实现两页视觉；不得填入未经用户确认的真实个人信息。
- M5：执行多视口、主题、键盘、动效降级、打印和对比度验收，最后运行 release quality gate。

## P0 验收清单

- [x] 核对 `content-model.md`
- [x] 核对 `lib/content/types.ts` 与 `lib/content/schemas.ts`
- [x] 核对 `page-contracts.md`
- [x] 核对项目 / BI / About / Resume 当前实现
- [x] 冻结缺失字段处置
- [x] 冻结 URL 参数语义
- [x] 确认本轮不修改 MDX Schema、内容 Query 和路由
