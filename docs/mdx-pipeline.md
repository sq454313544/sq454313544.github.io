# MDX 转换管线规则（v2 最终版）

> 本文档明确 Shiki、Mermaid、ToC 的编译链路，消除 v1 规划中的模糊点。

## 1. 代码高亮：Shiki

```
MDX fenced code block
  │  ```python
  │  code here
  │  ```
  ▼
@next/mdx → remark/rehype 插件链
  │  rehype-shiki 插件（构建时）
  ▼
输出：高亮 HTML（<pre><code> 含内联样式）
```

**实现方式**：在 `next.config.ts` 的 `rehypePlugins` 中添加 Shiki rehype 插件。构建时完成高亮，无客户端 JS。

**不采用**：
- ❌ `mdx-components.tsx` 中覆写 `<code>`（这是运行时方案，不适合构建时高亮）
- ❌ 客户端 Shiki（增加 bundle 体积）

## 2. 文章目录：ToC

```
MDX heading
  │  ## 章节标题
  ▼
rehype-slug 插件（构建时）
  │  生成 id="章节标题"
  ▼
rehype-extract-toc 或自定义插件
  │  提取 [{ level: 2, text: "章节标题", id: "章节标题" }]
  ▼
传递给页面 → <Toc items={toc} />
  │  渲染为导航链接 <a href="#章节标题">
```

**实现方式**：
- 构建时：`rehype-slug` 生成 heading id + 自定义 rehype 插件提取 h2/h3 结构
- 渲染时：`<Toc>` 组件接收 `{ level, text, id }[]` 并渲染导航

## 3. Mermaid 图表

```
方案 A（推荐）：显式组件
  <MermaidDiagram chart={`graph TD
    A-->B
  `} />

方案 B：Fenced code block
  ```mermaid
  graph TD
    A-->B
  ```
  → rehype 插件转换为 <MermaidDiagram> 组件
```

**采用方案 A**：第一版使用显式 `<MermaidDiagram>` 组件。避免 fenced code block 转换的复杂性，且语义清晰。

**不采用方案 B 的原因**：
- 需要自定义 rehype 插件识别 `language=mermaid`
- 与 Shiki 的 code block 处理存在优先级冲突
- 后续可升级到方案 B

**组件实现**：
```typescript
// components/content/MermaidDiagram.tsx
"use client"
import { useEffect, useRef } from "react"
import mermaid from "mermaid"

mermaid.initialize({ startOnLoad: false, securityLevel: "strict" })

export function MermaidDiagram({ chart, className }: { chart: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  // render mermaid on mount
}
```

## 4. ECharts 图表

```
方案：显式组件 + 数据分离
  <EChartsWrapper option={chartOption} />
```

**组件实现**：
```typescript
// components/charts/EChartsWrapper.tsx
"use client"
import ReactECharts from "echarts-for-react"

export function EChartsWrapper({
  option,
  className,
  loading,
  error,
}: {
  option: object
  className?: string
  loading?: boolean
  error?: Error | null
}) {
  // 四种状态：loading / error / empty(!option) / normal
}
```

**数据分离**：option 配置在内容层或页面层定义，组件只负责渲染。布局和图表解耦。

## 5. 完整 MDX 编译链

```
next.config.ts
  │
  ├─ remarkPlugins:
  │   ├─ remark-frontmatter       # 解析 YAML frontmatter
  │   └─ remark-mdx-frontmatter   # 将 YAML 转为 export const meta
  │
  ├─ rehypePlugins（后续添加）:
  │   ├─ rehype-slug              # heading 生成 id
  │   └─ rehype-shiki             # 代码高亮（构建时）
  │
  └─ mdx-components.tsx:
      └─ useMDXComponents()       # HTML 元素 → 自定义组件映射
```

## 6. Frontmatter 访问

MDX 文件中：
```yaml
---
title: "文章标题"
tags: ["agent", "langgraph"]
---
```

编译后通过 `export const meta` 暴露：
```typescript
// 页面中访问
const { meta, default: Content } = await import(`@/content/notes/${slug}.mdx`)
// meta.title, meta.tags, ...
```

内容服务层（`lib/content/loaders.ts`）**仅**使用 `gray-matter` 读取静态 frontmatter 用于索引——不重复解析 `export const meta`。

## 7. 搜索文本提取规则

```
MDX 源文件
  ▼
gray-matter 分离 frontmatter + body
  ▼
body 处理（lib/search/extract-text.ts）：
  1. 移除 fenced code block（``` ... ```）
  2. 移除 inline code（`...`）
  3. 移除 Mermaid/ECharts 组件标签
  4. 移除 JSX 标签但保留内部文本
  5. 移除 Markdown 链接语法 [text](url) → text
  6. Unicode normalize + 小写 + 连续空格合并
  ▼
searchText（用于索引匹配）
  +
excerpt = searchText 前 200 字（用于展示）
```
