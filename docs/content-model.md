# 内容模型

> **v2 修订（2026-07-23）**：ContentItem 改为 discriminated union，新增 searchText 字段用于全文检索。日期验证改为 `z.string().date()` + `refine` 进行语义校验和跨字段校验（`updatedAt >= publishedAt`）。URL 字段改为 `z.string().url().optional()`。

## 内容类型概览

| 类型 | 目录 | 用途 |
|---|---|---|
| 学习笔记 | `content/notes/` | 技术学习、经验总结、知识分享 |
| 项目案例 | `content/projects/` | 完整项目复盘，含问题/方案/结果 |
| BI 案例 | `content/dashboards/` | 数据分析看板案例，含图表和指标 |

## 学习笔记 (Note)

### Frontmatter Schema

```typescript
const NoteMetaSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  description: z.string().min(1, "描述不能为空"),
  publishedAt: z.string().date("日期格式: YYYY-MM-DD"),
  updatedAt: z.string().date("日期格式: YYYY-MM-DD"),
  category: z.string(),
  tags: z.array(z.string()),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  cover: z.string().optional(),
})
// 跨字段校验（对象级 refine）:
// .refine(d => d.updatedAt >= d.publishedAt, "updatedAt 不能早于 publishedAt")
```

### 字段说明

| 字段 | 必填 | 说明 |
|---|---|---|
| title | 是 | 标题 |
| description | 是 | 摘要（列表页展示） |
| publishedAt | 是 | 发布日期 YYYY-MM-DD |
| updatedAt | 是 | 更新日期 YYYY-MM-DD |
| category | 是 | 分类 slug（如 `langgraph`, `powerbi`） |
| tags | 是 | 标签列表 |
| draft | 否 | 草稿（true 则不发布） |
| featured | 否 | 是否精选 |
| cover | 否 | 封面图片路径 |

## 项目案例 (Project)

### Frontmatter Schema

```typescript
const ProjectMetaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  publishedAt: z.string().date("日期格式: YYYY-MM-DD"),
  updatedAt: z.string().date("日期格式: YYYY-MM-DD"),
  projectType: z.enum(["agent", "dashboard", "pipeline", "tool", "other"]),
  status: z.enum(["completed", "in_progress", "maintained", "archived"]),
  featured: z.boolean().default(false),
  techStack: z.array(z.string()),
  cover: z.string().optional(),
  repository: z.string().url().optional(),
  demo: z.string().url().optional(),
})
```

### 字段说明

| 字段 | 必填 | 说明 |
|---|---|---|
| projectType | 是 | 项目类型枚举 |
| status | 是 | 项目状态枚举 |
| techStack | 是 | 技术栈列表 |
| repository | 否 | 仓库 URL |
| demo | 否 | Demo URL |

## BI 案例 (Dashboard)

### Frontmatter Schema

```typescript
const DashboardMetaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  publishedAt: z.string().date("日期格式: YYYY-MM-DD"),
  updatedAt: z.string().date("日期格式: YYYY-MM-DD"),
  businessDomain: z.string(),
  tools: z.array(z.string()),
  metrics: z.array(z.string()),
  featured: z.boolean().default(false),
  cover: z.string().optional(),
})
```

### 字段说明

| 字段 | 必填 | 说明 |
|---|---|---|
| businessDomain | 是 | 业务领域（如 "销售"、"供应链"） |
| tools | 是 | 使用工具列表 |
| metrics | 是 | 核心指标列表 |

## 统一类型

```typescript
interface BaseContentItem {
  slug: string
  body: string
  excerpt: string
  searchText: string
  readingTime: number
}

interface NoteItem extends BaseContentItem {
  type: "note"
  meta: NoteMeta
}

interface ProjectItem extends BaseContentItem {
  type: "project"
  meta: ProjectMeta
}

interface DashboardItem extends BaseContentItem {
  type: "dashboard"
  meta: DashboardMeta
}

type ContentItem = NoteItem | ProjectItem | DashboardItem
```

## Slug 规则

- slug 从文件名自动生成（移除扩展名）
- 同一类型内 slug 必须唯一
- 构建时检测并报告 slug 重复
- slug 用于路由（`/notes/[slug]`、`/projects/[slug]`、`/dashboards/[slug]`）

## 内容正文规范（推荐但不强制）

### 项目案例建议章节

1. 项目背景 — 为什么做这个项目
2. 业务问题 — 要解决什么问题
3. 目标用户 — 谁在用
4. 解决方案 — 怎么做的
5. 系统架构 — 技术架构图（Mermaid）
6. 核心功能 — 主要功能列表
7. 技术选型 — 为什么选这些技术
8. 关键难点 — 遇到什么挑战
9. 安全与治理 — 数据安全和权限
10. 项目结果 — 成果和指标
11. 复盘 — 经验教训
12. 后续计划 — 未来改进方向

### BI 案例建议章节

1. 业务背景 — 业务场景和需求
2. 核心指标 — 关键 KPI 及定义
3. 数据模型 — 数据来源和表结构
4. 分析过程 — 分析方法和步骤
5. 结论和建议 — 基于数据的洞察
6. 截图 — 多张看板截图

## 敏感数据规则

内容中禁止包含：
- 真实客户名称
- 真实案件数据
- 身份证号、手机号
- 数据库地址、连接串
- 内部系统账号
- 密钥、Token、密码
- 未脱敏的公司数据

模拟数据需明确标识。
