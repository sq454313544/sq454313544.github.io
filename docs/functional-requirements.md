# 功能需求

> **v2 修订（2026-07-23）**：路由数量修正为 15 个公开页面 + 1 个 not-found 边界。搜索改为真正的 searchText 全文索引（非仅 200 字摘要）。
> 分类体系：笔记=category, 项目=projectType, BI=businessDomain，不统一映射。

## 页面功能清单

### 1. 首页 `/`

**功能区块（可独立重排）：**
- 个人定位（文字，可编辑）
- 核心能力（列表）
- 精选项目（卡片列表，最多 3 个）
- 精选 BI 案例（卡片列表，最多 3 个）
- 最新学习笔记（列表，最多 5 篇）
- 关于我摘要（文字 + 链接）
- 简历入口（链接）
- Agent 未来入口（链接 + 状态标识）

**数据来源：** `lib/content/queries.ts` 的 `getFeaturedProjects()`, `getFeaturedDashboards()`, `getLatestNotes()`

**状态：**
- Normal：所有区块渲染
- Empty：某区块无内容时显示空状态提示

### 2. 学习笔记 `/notes` + `/notes/[slug]`

**列表页 `/notes`：**
- 全部已发布笔记（按日期降序）
- 分类筛选（点击分类过滤）
- 标签筛选（点击标签过滤）
- 发布时间、阅读时间显示
- 分页或加载更多（内容量大时可选）
- 空状态（无笔记时）

**详情页 `/notes/[slug]`：**
- 标题、描述、日期、分类、标签
- 阅读时间
- 自动生成的文章目录（ToC）
- MDX 正文渲染（含代码高亮、Mermaid 图表）
- 上一篇 / 下一篇导航
- 相关文章推荐（同分类或同标签）
- 404 状态（slug 不存在或内容为草稿时）
- 结构化数据（JSON-LD Article）

**数据来源：** `getAllNotes()`, `getNoteBySlug()`, `getPrevNextNote()`, `getRelatedNotes()`

### 3. 项目作品集 `/projects` + `/projects/[slug]`

**列表页 `/projects`：**
- 全部已发布项目
- 按项目类型筛选
- 按状态筛选
- 技术栈标签显示
- 空状态

**详情页 `/projects/[slug]`：**
- 完整项目信息
- 建议章节渲染
- Mermaid 架构图
- 仓库和 Demo 链接（如有）
- 404 状态

**数据来源：** `getAllProjects()`, `getProjectBySlug()`

### 4. BI 案例 `/dashboards` + `/dashboards/[slug]`

**列表页 `/dashboards`：**
- 全部已发布 BI 案例
- 按业务领域筛选
- 工具和指标标签
- 空状态

**详情页 `/dashboards/[slug]`：**
- 封面图片（如有）
- 多张截图展示（预留）
- 业务背景、核心指标
- ECharts 示例图表
- 图表 loading / error / empty 状态
- 404 状态

**数据来源：** `getAllDashboards()`, `getDashboardBySlug()`

### 5. 搜索 `/search`

**功能：**
- 搜索框（输入关键词）
- 搜索结果列表（按相关度 + 日期排序）
- 搜索范围：标题、描述、标签、分类、摘要
- 搜索类型：笔记、项目、BI 案例
- 高亮匹配文字（可选）
- 无结果状态
- URL 查询参数 `?q=关键词`，刷新可恢复

### 6. 标签 `/tags` + `/tags/[tag]`

**标签列表 `/tags`：**
- 所有标签（去重、按使用频率排序）
- 每个标签显示关联内容数量

**标签详情 `/tags/[tag]`：**
- 包含该标签的全部内容（笔记 + 项目 + BI 案例混合列表）
- 中文标签正确编码
- 空状态

### 7. 分类 `/categories` + `/categories/[category]`

**分类列表 `/categories`：**
- 所有分类（去重）
- 每个分类显示关联内容数量

**分类详情 `/categories/[category]`：**
- 该分类下的全部内容
- 空状态

### 8. 关于我 `/about`

- 个人简介（编辑内容）
- 技能列表
- 经验概述
- 联系方式（可选）

### 9. 简历 `/resume`

- 结构化简历内容（网页版）
- PDF 下载配置（预留，当前无 PDF 时显示明确提示）
- 不显示失效下载按钮

### 10. Agent 占位 `/agent`

- Agent Demo 未来定位说明
- 计划展示的能力列表
- "建设中" 状态标识
- 示例问题展示
- 隐私和数据安全说明
- 不调用任何模型 API

### 11. 404 `/not-found`

- 语义化 404 页面
- 返回首页链接
- 建议搜索功能

## 全局功能

### SEO
- 全局 Metadata（title template）
- 页面级 Metadata（每页独立 title、description）
- Canonical URL
- Open Graph（og:title, og:description, og:image 预留）
- Sitemap（`/sitemap.xml`）
- robots.txt
- 结构化数据（JSON-LD）：Article、SoftwareApplication

### 导航
- Header：Logo + 主导航 + 搜索入口
- Footer：版权 + 链接
- 移动端：汉堡菜单（390px 可用）

### 样式
- 中性基础排版
- 响应式（390px 无横向溢出）
- Tailwind dark: 前缀预留
- 组件接受 className prop
