<!-- v2 修订：状态契约分层化，不再强制所有组件实现四种状态 (2026-07) -->
<!-- v3 增订：补 /projects /dashboards /about /resume 四页契约；新增导航入口契约段 (2026-07-24) -->
<!-- v4 增订：项目/BI 字段恢复 content-model 语义（ProjectItem/DashboardItem 强类型，URL 参数改 type/domain）；ProjectDetailMeta.status 从 ProjectMeta 派生、不重定义 (2026-07-24) -->
<!-- v5 修订：最终部署排除 /agent 路由与入口，页面目标改为 14 + 1 (2026-07-27) -->
# 页面契约

本文档定义每个页面的数据契约、状态契约和组件契约。后续视觉设计或重构必须遵守这些契约。

## 导航入口契约（先于页面定义）

以下入口关系是当前阶段的正式页面契约，后续视觉实现与路由实现不得自行修改：

```text
主导航
├─ 首页             /
├─ 学习笔记         /notes
├─ 项目             /projects
├─ BI 案例          /dashboards
└─ 关于             /about

导航右侧
├─ 搜索             /search
├─ 主题切换         非路由操作
└─ 简历             /resume
```

约束：

1. `/resume` 是独立同级路由，不是下载按钮，也不是 `/about` 页内锚点。
2. `/agent` 不属于最终部署路由，不在主导航、次级入口、首页、About、Resume 或项目详情中提供 Agent Demo / Coming Soon 链接。
3. 移动端菜单同时展示 主导航 5 项 + "简历"，搜索与主题切换作为独立操作控件。
4. 任何后续视觉阶段决定不得改变本契约中的 URL 路径与一级入口数量。新增页面入口须经本文档与 `docs/iteration-v2.md` 同步更新。
5. 最终部署目标为 14 个公开页面类型 + 1 个 not-found 边界；Agent 技术内容和 `projectType: "agent"` 项目案例不受影响。

Agent 部署边界详见 [`agent-deployment-decision.md`](./agent-deployment-decision.md)。

---

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

## 项目列表 `/projects`

### 数据契约

```typescript
interface ProjectsPageData {
  featuredProject: ProjectItem | null   // 精选项目（0 或 1 个，首页"主项目"来源）
  projects: ProjectItem[]               // 其余项目，按 publishedAt 倒序
  projectTypes: string[]                // 去重 projectType 列表（取自 content-model.projectType）
  technologies: string[]                // 去重 techStack 列表（取自 content-model.techStack）
}
```

### URL 参数

```
/projects?type=agent&tech=langgraph
```

> Errata (v4 增订)：上一版 (v3) 把 URL 参数写为 `?category=agent&tag=langgraph`，与 Notes 的 `category` / `tag` 字段语义冲突（按 content-model，Notes 用 `category` + `tags`，Projects 用 `projectType` + `techStack`）。已改为 `?type=` / `?tech=`；类型从 `ContentItem` 改为 `ProjectItem` 以便 TS 强类型访问 `projectType` `techStack` `status` 等专属字段。

### 状态

| 状态 | 条件 | 展示 |
|---|---|---|
| Normal | 有内容 | 精选 + 列表 + 筛选器 |
| Empty | 无内容 | "暂无项目案例" |
| FilteredEmpty | 筛选后无结果 | "该条件下无项目，清除筛选" |
| Error | 查询异常 | 错误回退 |

### 交互

- 卡片点击 → `/projects/[slug]`
- 筛选 → URL 参数变化，不触发整页跳转

---

## 项目详情 `/projects/[slug]`

### 数据契约

```typescript
interface ProjectDetailPageData {
  project: ProjectItem
  relatedProjects: ProjectItem[]     // 相关项目（最多 3 个）
  meta: ProjectDetailMeta            // 右侧资料栏字段集合
  toc?: TocItem[]                    // 正文目录（长文复盘可选）
}

interface ProjectDetailMeta {
  role: string                        // 我的角色（本轮新增字段，按 P0 流程核验）
  status: ProjectMeta["status"]        // 从 content-model 派生，不重新定义
  stack: string[]                     // 技术栈（视觉层展示别名，对应 content-model.techStack）
  period: { start: string; end: string | null }   // 项目时间（本轮新增字段，按 P0 流程核验）
  repo?: string                       // Repository URL（对应 content-model.repository）
  demo?: string                       // Demo URL（对应 content-model.demo）
}
```

> Errata (v4 增订)：上一版 (v3) 把 `status` 枚举写成 `'planning' | 'in-progress' | 'completed' | 'archived'`，与 content-model 既有 `'completed' | 'in_progress' | 'maintained' | 'archived'` 冲突。已修正为从 `ProjectMeta["status"]` 派生，视觉层不再重定义业务枚举。详见 `docs/iteration-v2.md` §十一。

### 状态

| 状态 | 条件 | 展示 |
|---|---|---|
| Normal | 内容存在且非草稿 | 完整详情 |
| Draft | draft: true | 返回 404 |
| NotFound | slug 不存在 | 404 页面 |
| Error | 渲染异常 | 错误回退 |

---

## BI 列表 `/dashboards`

### 数据契约

```typescript
interface DashboardsPageData {
  dashboards: DashboardItem[]   // 按 publishedAt 倒序
  businessDomains: string[]      // 去重业务领域列表（取自 content-model.businessDomain）
  tools: string[]                // 去重工具列表
}
```

### URL 参数

```
/dashboards?domain=retail&tool=powerbi
```

> Errata (v4 增订)：上一版 (v3) 把 URL 参数写为 `?category=retail` 跟 Notes 字段冲突，已改为 `?domain=` 对应 `businessDomain`；字段类型从 `ContentItem` 改为 `DashboardItem` 以便 TS 强类型访问 `businessDomain` `tools` `metrics` 等专属字段。

### 状态

| 状态 | 条件 | 展示 |
|---|---|---|
| Normal | 有内容 | 列表 + 筛选器 |
| Empty | 无内容 | "暂无 BI 案例" |
| FilteredEmpty | 筛选后无结果 | "该条件下无案例，清除筛选" |
| Error | 查询异常 | 错误回退 |

### 交互

- 列表项必须显式标注数据状态（模拟数据 / 脱敏数据），避免访客误以为展示真实公司敏感数据
- 卡片点击 → `/dashboards/[slug]`

---

## BI 详情 `/dashboards/[slug]`

### 数据契约

```typescript
interface DashboardDetailPageData {
  dashboard: DashboardItem
  chartData: ChartOption[]          // ECharts 配置数组
  relatedDashboards: DashboardItem[]  // 相关 BI 案例（最多 3 个）
  meta: DashboardDetailMeta         // 右侧资料栏字段集合
  toc?: TocItem[]                   // 正文目录可选
}

interface DashboardDetailMeta {
  domain: string                    // 业务领域（视觉层展示别名，对应 content-model.businessDomain）
  tools: string[]                   // 使用工具（对应 content-model.tools）
  metrics: string[]                 // 关键指标（对应 content-model.metrics）
  granularity: string               // 数据粒度（本轮新增字段，按 P0 流程核验）
  dataStatus: 'simulated' | 'masked' | 'aggregated'   // 数据属性（本轮新增，按 P0 核验；未确认前用静态占位）
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

## 关于 `/about`

### 数据契约

```typescript
interface AboutPageData {
  profile: Profile                 // 个人信息，来自 data/profile.ts + Zod 校验
  workExperiences: WorkExperience[]  // 工作经历（按时间倒序）
  skills: SkillGroup[]             // 核心能力分组
  toolsAndTech: TechGroup[]        // 工具与技术
  interests: string[]              // 兴趣
  contacts: Contact[]              // 联系方式
}

interface Profile {
  name: string
  headline: string                 // 当前职业方向，例 "数据产品工程师"
  summary: string                 // 个人介绍正文，可 MDX
  location?: string
  availableForHire?: boolean
}

interface WorkExperience {
  company: string
  role: string
  period: { start: string; end: string | null }   // end 为 null 表示至今
  isCurrent?: boolean              // 当前经历状态标识
  background: string               // 工作背景
  responsibilities: string[]      // 核心职责
  keyProjects?: KeyProjectRef[]    // 关键项目或成果（可链接到 /projects/[slug]）
  stack: string[]                  // 相关技术和工具
}

interface KeyProjectRef {
  title: string
  href?: string                    // 通常指 /projects/[slug]
}

interface SkillGroup {
  title: string                    // 例：数据产品设计 / BI 与经营分析 / Agent / RAG 应用 / 数据建模与治理
  boundaries: string               // 两行文字说明实际能力边界
}

interface TechGroup {
  title: string
  items: string[]
}

interface Contact {
  label: string                    // 例：Email / GitHub / LinkedIn
  href: string
}
```

### 状态

| 状态 | 条件 | 展示 |
|---|---|---|
| Normal | profile 可用 | 全部长页面 |
| Partial | 缺少 workExperiences 或 skills | 缺块显示空提示或省略 |
| Error | profile 加载失败 | 错误回退 |

### 视觉层约束（已决）

- 工作经历采用普通垂直时间线，默认全部展开，不使用 Accordion 与 `<details>` 折叠。
- 仅允许左侧时间轴线 / 年份或时间标签 / 当前经历状态标识 / 技术标签 / 项目链接等轻量视觉层级，不为时间线引入额外组件库。
- 不使用大个人头像作为视觉中心。

---

## 简历 `/resume`

### 数据契约

```typescript
interface ResumePageData {
  profile: Profile                 // 与 About 共享同一 profile 源
  summary: string                  // 简短自我概述，面向招聘方
  workExperiences: WorkExperience[]   // 与 About 共享数据源
  education: EducationEntry[]
  skills: SkillGroup[]
  certifications?: CertEntry[]
  projectHighlights?: ProjectHighlightRef[]   // 指向 /projects/[slug]
  languages?: string[]
  contacts: Contact[]
}

interface EducationEntry {
  school: string
  degree: string
  period: { start: string; end: string }
  notes?: string
}

interface CertEntry {
  name: string
  issuer: string
  year: string
}

interface ProjectHighlightRef {
  title: string
  role: string
  href: string                     // 通常 /projects/[slug]
  description: string
}
```

### 状态

| 状态 | 条件 | 展示 |
|---|---|---|
| Normal | 简历数据可用 | 完整简历 |
| Partial | 缺少教育或证书段 | 缺块显示空提示或省略 |
| Error | 数据加载失败 | 错误回退 |

### 视觉层约束（已决）

- 简历采用可打印文档风格：明确分区、不使用大型封面图、不使用复杂卡片。
- 桌面端阅读宽度接近 A4，避免过宽阅读眼动跨度过大。
- 必须实现打印 stylesheet：所有卡片移除边框 / 阴影 / 圆角；导航与主题切换器隐藏；使用 `break-inside: avoid` 自然分页；通过 `print-color-adjust: exact` 保留必要灰度层级；链接保留下划线并打印 URL；字号最小 9.5pt。
- PDF 下载作为次要入口（可通过浏览器打印呈现，当前阶段不引入 PDF 生成依赖）。
- 简历页面与 About 页面共享 Profile / WorkExperience / SkillGroup / Contact 数据源，但模板与版式互不嵌套。

---

## 排除路由 `/agent`

`/agent` 不属于最终部署页面契约，不定义页面数据、视觉或交互状态。后续代码清理完成后必须满足：

- 生产构建路由表与 Sitemap 不包含 `/agent`；
- 访问 `/agent` 返回 404；
- 公开页面和全局导航不存在 Agent Demo / Coming Soon 链接；
- Agent、RAG、LangGraph 等学习内容和 Agent 项目案例保持正常访问。

历史占位实现及清理范围见 [`agent-deployment-decision.md`](./agent-deployment-decision.md)。

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
