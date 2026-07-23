<!-- v2 修订：状态契约分层化，不再强制所有组件实现四种状态 (2026-07) -->
# 页面契约

本文档定义每个页面的数据契约、状态契约和组件契约。后续视觉设计或重构必须遵守这些契约。

## 首页 `/`

### 数据契约

```typescript
interface HomePageData {
  featuredProjects: ContentItem[]      // 最多 3 个
  featuredDashboards: ContentItem[]    // 最多 3 个
  latestNotes: ContentItem[]           // 最多 5 个
  aboutSummary: string                 // 可编辑文本
  skills: string[]                     // 可编辑列表
}
```

### 状态

| 状态 | 条件 | 展示 |
|---|---|---|
| Normal | 所有数据可用 | 所有区块渲染 |
| Partial | 部分区块无内容 | 有内容区块正常，无内容区块显示空提示 |
| Error | 数据加载失败 | 全局错误回退 |

### 交互

- 筛选/排序按钮 → URL 参数变化
- 卡片点击 → 导航到详情页

---

## 笔记列表 `/notes`

### 数据契约

```typescript
interface NotesPageData {
  notes: ContentItem[]       // 已发布、非草稿
  categories: string[]       // 去重分类列表
  tags: string[]             // 去重标签列表
}
```

### URL 参数

```
/notes?category=langgraph&tag=agent
```

### 状态

| 状态 | 条件 | 展示 |
|---|---|---|
| Normal | 有内容 | 列表 + 筛选器 |
| Empty | 无内容 | "暂无学习笔记" |
| FilteredEmpty | 筛选后无结果 | "该条件下无内容，清除筛选" |
| Error | 查询异常 | 错误回退 |

---

## 笔记详情 `/notes/[slug]`

### 数据契约

```typescript
interface NoteDetailPageData {
  note: ContentItem             // 当前笔记
  prevNote: ContentItem | null  // 上一篇
  nextNote: ContentItem | null  // 下一篇
  relatedNotes: ContentItem[]   // 相关笔记（最多 3 个）
  toc: TocItem[]                // 文章目录
}
```

### 状态

| 状态 | 条件 | 展示 |
|---|---|---|
| Normal | 内容存在且非草稿 | 完整详情 |
| Draft | draft: true | 返回 404 |
| NotFound | slug 不存在 | 404 页面 |
| Error | 渲染异常 | 错误回退 |

---

## 搜索 `/search`

### 数据契约

```typescript
interface SearchPageData {
  query: string              // 当前查询
  results: SearchResult[]    // 搜索结果
  totalCount: number         // 结果总数
}
```

### URL 参数

```
/search?q=LangGraph
```

### 状态

| 状态 | 条件 | 展示 |
|---|---|---|
| Initial | 无查询参数 | 搜索框（空状态提示） |
| Searching | 正在匹配 | Loading 指示 |
| Results | 有结果 | 结果列表 |
| NoResults | 无匹配 | "未找到相关内容" |
| EmptyQuery | q= 或空 | "请输入搜索关键词" |

---

## 标签 `/tags` + `/tags/[tag]`

### 数据契约

```typescript
interface TagsPageData {
  tags: { name: string; count: number }[]  // 标签 + 数量
}

interface TagDetailPageData {
  tag: string
  items: ContentItem[]     // 混合类型（笔记+项目+BI）
}
```

### 状态

| 状态 | 条件 | 展示 |
|---|---|---|
| Normal | 有内容 | 标签云/列表 |
| Empty | 无内容 | "暂无标签" |
| TagEmpty | 标签无关联内容 | "该标签下暂无内容" |

---

## 项目详情 `/projects/[slug]`

### 数据契约

```typescript
interface ProjectDetailPageData {
  project: ContentItem
}
```

### 状态

同笔记详情。

---

## BI 详情 `/dashboards/[slug]`

### 数据契约

```typescript
interface DashboardDetailPageData {
  dashboard: ContentItem
  chartData: ChartOption[]   // ECharts 配置数组
}
```

### 状态

| 状态 | 条件 | 展示 |
|---|---|---|
| Normal | 内容和图表可用 | 详情 + 图表 |
| ChartLoading | 图表数据加载中 | 图表容器 + Loading 骨架 |
| ChartError | 图表渲染失败 | 图表容器 + 错误提示 |
| ChartEmpty | 无图表数据 | 图表容器 + "暂无图表数据" |

---

## Agent `/agent`

### 数据契约

```typescript
interface AgentPageData {
  agents: AgentSummary[]    // 来自 lib/agent/mock.ts
}
```

### 状态

| 状态 | 条件 | 展示 |
|---|---|---|
| Normal | mock 数据可用 | Agent 卡片 + 示例问题 |

---

## 通用组件契约

所有组件必须接受 `className` prop：

```typescript
interface ComponentProps {
  className?: string       // 外部样式覆盖
}
```

### 状态分层契约（v2）

不再要求所有组件实现全部四种状态。按组件职责分层：

| 组件类型 | 需支持的状态 | 说明 |
|---|---|---|
| 数据列表组件 | normal / empty | 如笔记列表、标签列表。数据同步获取，不存在 loading 态 |
| 异步图表组件 | loading / normal / error / empty | 如 BI 图表。数据异步加载，需完整状态覆盖 |
| 纯展示组件 | 仅 normal | 如 Header、Footer、About 描述段。无异步数据依赖 |
| 路由段 | loading.tsx / error.tsx | 通过 Suspense 边界处理，不在组件内部重复实现 |

### ContentComponentProps

```typescript
interface ContentComponentProps<T> extends ComponentProps {
  data: T                     // 内容数据（非 null）
  isLoading?: boolean         // 仅异步组件使用
  error?: Error | null        // 仅异步组件使用
}
```

### 不能破坏的契约

1. **所有页面数据接口** — 视觉设计不能改变 props 类型和必需字段
2. **URL 参数格式** — 搜索 `?q=`、分类筛选不能改变参数名
3. **组件 Props 签名** — 可以扩展但不能删除已有 props
4. **内容 Schema** — 不能改变 frontmatter 必填字段
5. **路由结构** — 不能改变 URL 路径（SEO 友好 slug 约定）
6. **状态分层** — 按组件职责支持对应状态，不要求所有组件实现全部四种状态
7. **响应式断点** — 390px 无横向溢出是硬性要求
