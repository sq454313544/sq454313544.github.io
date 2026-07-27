<!-- v2 修订：状态分层化，不再强制所有组件实现四种状态 (2026-07) -->
# 设计交接文档

> **本文档供后续视觉设计师 / 前端开发者使用。**
> 当前所有页面只有功能骨架和中性基础样式。以下说明哪些已固定、哪些可改、需要提供什么。

## 当前页面状态总览

| 页面 | 路由 | 当前状态 | 功能完整性 | 可重新设计 |
|---|---|---|---|---|
| 首页 | `/` | 功能骨架 | 完整 | 是 |
| 笔记列表 | `/notes` | 功能骨架 | 完整 | 是 |
| 笔记详情 | `/notes/[slug]` | 功能骨架 | 完整 | 是 |
| 项目列表 | `/projects` | 功能骨架 | 完整 | 是 |
| 项目详情 | `/projects/[slug]` | 功能骨架 | 完整 | 是 |
| BI 列表 | `/dashboards` | 功能骨架 | 完整 | 是 |
| BI 详情 | `/dashboards/[slug]` | 功能骨架 | 完整 | 是 |
| 搜索 | `/search` | 功能骨架 | 完整 | 是 |
| 标签 | `/tags` + `/tags/[tag]` | 功能骨架 | 完整 | 是 |
| 分类 | `/categories` + `/categories/[category]` | 功能骨架 | 完整 | 是 |
| 关于 | `/about` | 功能骨架 | 完整 | 是 |
| 简历 | `/resume` | 功能骨架 | 完整 | 是 |
| 404 | `/not-found` | 功能骨架 | 完整 | 是 |

## 每个页面的稳定数据字段

### 首页
- `featuredProjects: ContentItem[]`（最多 3 个）
- `featuredDashboards: ContentItem[]`（最多 3 个）
- `latestNotes: ContentItem[]`（最多 5 个）
- 个人定位文字（可编辑字符串）
- 核心能力列表（`string[]`）

### 笔记列表
- `notes: ContentItem[]`
- `categories: string[]`
- `tags: string[]`
- URL 参数：`?category=xx&tag=yy`

### 笔记详情
- `note: ContentItem`
- `prevNote: ContentItem | null`
- `nextNote: ContentItem | null`
- `relatedNotes: ContentItem[]`
- `toc: TocItem[]`

### 搜索
- `query: string`
- `results: SearchResult[]`
- URL 参数：`?q=xx`

### 标签
- 标签名 `string` + 计数 `number`
- URL：`/tags/[tag]`

### BI 详情
- 图表数据：`ChartOption[]`（每个 option 是 ECharts 配置对象）
- 封面图片路径（`string`）
- 截图列表（`string[]`）

## 每个页面的交互状态

所有页面需支持四种状态：

| 状态 | 视觉要求 |
|---|---|
| **Loading** | 骨架屏或轻量加载指示，不闪烁 |
| **Empty** | 友好提示 + 建议下一步操作 |
| **Error** | 错误信息 + 重试按钮（如适用） |
| **Normal** | 内容正常展示 |

> **v2 说明**：以上四种状态不再要求所有页面/组件全部实现。状态支持按组件职责分层，详见 `page-contracts.md` 中的"状态分层契约"。数据列表组件仅需 normal/empty，异步图表组件才需 loading/error，纯展示组件仅需 normal，路由段通过 Suspense 边界处理。

## 哪些组件可以重新设计

以下组件可以完全重新设计（样式、布局、动画），但必须保持 props 签名：

1. **Header** — 导航栏（Logo、导航链接、搜索入口、移动端汉堡菜单）
2. **Footer** — 页脚（版权、链接）
3. **NoteCard** — 笔记卡片
4. **ProjectCard** — 项目卡片
5. **DashboardCard** — BI 案例卡片
6. **SearchInput** — 搜索输入框
7. **TagCloud** — 标签云/列表
8. **CategoryList** — 分类列表
9. **Toc** — 文章目录
10. **PrevNextNav** — 上一篇/下一篇导航
11. **RelatedArticles** — 相关文章
12. **Loading / Empty / Error** — 通用状态组件
13. **EChartsWrapper** — 图表容器（只改容器样式，不改 option 逻辑）
14. **MermaidDiagram** — Mermaid 容器

## 哪些功能契约不能被视觉设计破坏

1. **所有组件 Props 签名** — 可以扩展但不能删除已有 props
2. **`className` prop** — 所有组件必须支持外部传入 className
3. **URL 结构** — 不能改变路由路径
4. **URL 参数** — 搜索 `?q=`、筛选参数不能改变 key 名
5. **内容 Schema** — frontmatter 字段不能删减
6. **状态分层** — 按组件职责支持对应状态，不要求所有组件实现全部四种状态
7. **390px 无溢出** — 窄屏可用性
8. **ECharts 数据分离** — option 数据对象不能嵌入布局代码
9. **语义化 HTML** — `main`、`nav`、`article`、`h1-h6` 层级
10. **键盘焦点可见** — 所有交互控件必须显示 focus 状态

## 后续设计需要提供的输入

1. **品牌色板** — 主色、辅色、状态色（成功/警告/错误/信息）、中性色阶
2. **字体方案** — 中文字体 + 英文字体 + 等宽字体（代码块）
3. **间距系统** — 基础间距单位和层级
4. **圆角系统** — 按钮、卡片、输入框的圆角值
5. **阴影系统** — 卡片、弹窗、导航的阴影
6. **组件设计稿** — 每个可设计组件的桌面端 + 移动端视觉稿
7. **首页布局** — 各区块的排列顺序和视觉层级
8. **卡片样式** — 笔记卡片、项目卡片、BI 案例卡片的最终视觉
9. **代码块样式** — 代码高亮配色方案
10. **响应式断点** — 除 390px 外的大屏断点
11. **深色模式** — 各颜色在深色模式下的对应值
12. **动画规范** — 过渡时长、缓动函数、触发条件

## 响应式视觉细节

以下细节当前使用中性默认值，后续需重新确定：

- 字体大小层级（正文、h1-h6、小字）
- 行高和段落间距
- 内容区最大宽度
- 卡片间距和网格列数
- 导航栏高度和粘性行为
- 移动端导航展开/收起动画
- 图片圆角和阴影
- 搜索框样式
- 标签和分类标签（pill/chip）样式
- 分页或加载更多按钮样式
- 页脚视觉层级

## 不在此文档的内容

- 最终品牌视觉方案（由 `frontend-visual-implementation` Skill 在后续阶段负责）
- 设计 Token 系统的具体数值
- 组件实现细节代码
