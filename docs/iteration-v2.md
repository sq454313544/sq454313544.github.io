# 第二轮迭代方案（v2 视觉与体验升级）

> 版本：v2.4 Completed
> 日期：2026-07-28
> 状态：M1–M5 与 C0–C4 已完成；在线 Agent 已排除出博客部署范围；下一阶段为 GitHub Pages D1 静态导出适配
> 范围：第一阶段功能性骨架已完成（历史验收为 15 个公开页面类型 + 1 个 not-found 边界，包含 `/agent` 占位页）。最终部署目标为 14 个公开页面类型 + 1 个 not-found 边界。本轮迭代在不动现有内容系统、Queries、既有内容 URL 参数、MDX Schema、ECharts 数据接口的前提下，完成视觉系统、深色模式、设计与开发的工程化对接，以及 Shiki/Mermaid/TOC 三项前置 POC。
> 上游契约（本轮不得破坏）：[`architecture.md`](./architecture.md)、[`content-model.md`](./content-model.md)、[`page-contracts.md`](./page-contracts.md)、[`functional-requirements.md`](./functional-requirements.md)、[`mdx-pipeline.md`](./mdx-pipeline.md)、[`design-handoff.md`](./design-handoff.md)。
> Agent 部署决策：[`agent-deployment-decision.md`](./agent-deployment-decision.md)。

---

## 一、迭代目标

1. 把现阶段的"中性功能骨架"升级为**Data Product Journal**视觉体系，建立可复用、可校色、可演进的设计 Token 系统。
2. 落地深色模式（class 策略 + Tailwind 4 `@theme inline`），与第一阶段已预留 `dark:` 前缀自动对接。
3. 完成三项前置技术验证（Shiki、Mermaid、TOC Heading ID），为 M3 笔记切片的代码块、图、目录做好端到端通路。
4. 完成首页节奏化长页 IA、项目/BI 详情右侧资料栏、About 普通垂直时间线、Resume 可打印文档模板。
5. 明确博客不部署在线 Agent；Agent、RAG、LangGraph 和智能问数仅作为技术内容、项目案例与真实能力描述保留。
6. **保持第一阶段成果不被破坏**：内容 Schema、Queries、既有内容路由与 URL 参数、搜索逻辑、MDX 模型、ECharts 数据接口均不修改；仅按独立清理任务移除 `/agent` 历史占位及其无调用方代码。

---

## 二、调研基础与不可避免结论

本轮迭代在 docs 下做了一轮"5 个开源仓库只读调研"，5 仓分别为 `tailwind-nextjs-starter-blog`、`magic-portfolio`、`magicui-portfolio`、`xirothedev/blog-tech`、`mk965/mengke.me`。关键结论：

1. **无任何参考仓库采用本项目的 `@next/mdx` + gray-matter + Zod 自建管线**，均使用 Contentlayer2 / Content Collections / next-mdx-remote 之一。本项目坚持自建管线，不引入这三种。
2. **仅一个仓库（magic-portfolio）提供真正的项目 MDX 详情页**，其余皆外链卡片。本项目采纳"per-project MDX 详情"路径，不退化为外链卡片。
3. **无任何参考仓库实现真正分类（category）体系**，只有 tag。本项目自主补上 tag（横向）+ category（主线程）二级体系。
4. **仅一个仓库（magicui-portfolio）使用 Zod**，且字段集小。本项目坚持完整 Zod 校验。
5. **许可证风险**：magic-portfolio 是 CC BY-NC，禁商用 + 强制署名，本轮不复制其代码、仅借鉴 IA 思想；blog-tech 无 LICENSE，默认 All rights reserved，仅参考其功能范围、按 Next.js 官方 API 独立实现，不复制其代码结构与表达；其余 3 个仓库为 MIT，复制片段须保留 MIT 版权与许可文本，仅学思想则无义务。
6. **明确不引入** 的依赖或范式：Contentlayer2 / Pliny / next-mdx-remote / Content Collections / sugar-high / 客户端 Shiki 加 DOMParser / Kbar / Prisma+Postgres / Once UI / motion（framer-motion）/ typed.js / plyr / Giscus / Mailchimp / LiquidGlass / FlickeringGrid / geist 装饰字体 / SCSS modules / Tailwind 3 路线 / bun / yarn Berry / body-scroll-lock。
7. **形态已决**：导航用标准顶栏（非 Dock / 非胶囊），About 工作经历用普通垂直时间线全程展开（非 Accordion / 非 `<details>`），Resume 与 About 为独立同级路由（互不锚点）。

---

## 三、视觉定位

**方案名**：Data Product Journal
**核心气质**：冷静、专业、结构化、数据感、内容优先、技术辨识度高、不追逐前端潮流。

**目标观感**：访客快速感受到 ①这是懂业务的数据技术人员；②不止会做报表也能设计数据产品和 Agent；③项目表达有业务背景、技术方案、结果与复盘；④内容专业但不沉闷。

**明确避免**：赛博朋克、大面积紫色 AI 渐变、霓虹发光、玻璃拟态、复杂 3D、满屏粒子动画、macOS Dock 导航、过大个人头像、纯简历式单页、每区都用卡片、以"高级感"牺牲可读性。

---

## 四、色彩系统

> **石墨灰中性 + 数据蓝主色 + 青绿色辅助**。蓝色管链接、按钮、关键交互；青绿色仅用于数据、成功状态、Agent / AI 能力提示。
> **Hex 为设计稿核对基准，OKLCH 由 Hex 经 OKLab 矩阵计算得出，二者不一致时修 OKLCH 不修 Hex。**

### 浅色模式 `:root`

| Token | Hex | OKLCH | 用途 |
|---|---|---|---|
| `--theme-background` | `#F7F8FA` | `oklch(0.9789 0.0029 274.3)` | 页面背景 |
| `--theme-surface` | `#FFFFFF` | `oklch(1 0 0)` | 卡片 / 导航 / 正文 |
| `--theme-surface-soft` | `#F0F3F7` | `oklch(0.963 0.0061 259.8)` | 次级区域 / 代码块外框 |
| `--theme-text-primary` | `#101828` | `oklch(0.2099 0.0341 263.6)` | 标题与正文 |
| `--theme-text-secondary` | `#475467` | `oklch(0.4422 0.0354 258.1)` | 描述与辅助文字 |
| `--theme-text-muted` | `#667085` | `oklch(0.5444 0.035 265.6)` | 日期 / 元数据 |
| `--theme-border` | `#DDE3EA` | `oklch(0.9133 0.0114 254.3)` | 卡片与分隔线 |
| `--theme-primary` | `#2563EB` | `oklch(0.5461 0.2152 263)` | 链接 / 主按钮 / 当前状态 |
| `--theme-primary-hover` | `#1D4ED8` | `oklch(0.4882 0.2171 264.4)` | 主色 Hover |
| `--theme-accent` | `#0F9D8A` | `oklch(0.6247 0.1107 180)` | 数据 / Agent / 成功 |

### 深色模式 `.dark`

| Token | Hex | OKLCH | 用途 |
|---|---|---|---|
| `--theme-background` | `#0B0F17` | `oklch(0.1683 0.0181 264.2)` | 页面背景 |
| `--theme-surface` | `#111827` | `oklch(0.2101 0.0318 264.9)` | 卡片 / 导航 |
| `--theme-surface-soft` | `#172033` | `oklch(0.2449 0.0388 264.5)` | 次级区域 |
| `--theme-text-primary` | `#F8FAFC` | `oklch(0.9842 0.0033 255.9)` | 标题与正文 |
| `--theme-text-secondary` | `#CBD5E1` | `oklch(0.869 0.0197 254.1)` | 描述文字 |
| `--theme-text-muted` | `#94A3B8` | `oklch(0.7107 0.035 257.4)` | 日期 / 元数据 |
| `--theme-border` | `#273449` | `oklch(0.3232 0.0415 260)` | 卡片与分隔线 |
| `--theme-primary` | `#60A5FA` | `oklch(0.7137 0.1433 254.8)` | 链接 / 主要交互 |
| `--theme-primary-hover` | `#93C5FD` | `oklch(0.8091 0.0955 252)` | Hover |
| `--theme-accent` | `#2DD4BF` | `oklch(0.7845 0.1321 181.9)` | 数据和 Agent 状态 |

### 图表色板

ECharts 默认走 Canvas 渲染，**Canvas 不会解析 CSS 变量 `var(--color-*)`**。因此不允许在 ECharts 主题 JSON 里写 `"var(--color-chart-blue)"`，业务代码也不得引用 `--color-chart-*` token。

图表色作为 **TypeScript 唯一来源**，给出浅色 / 深色两套具体 hex 数组：

```ts
// lib/charts/palette.ts
export const chartPalettes = {
  light: ["#2563EB", "#0F9D8A", "#7C3AED", "#EA580C", "#DC2626", "#64748B"],
  dark:  ["#60A5FA", "#2DD4BF", "#A78BFA", "#FB923C", "#F87171", "#94A3B8"],
} as const
```

| 顺序 | 浅色 Hex | 深色 Hex | 用途 |
|---|---|---|---|
| 1 | `#2563EB` | `#60A5FA` | 主数据系列 |
| 2 | `#0F9D8A` | `#2DD4BF` | Agent / 成功数据 |
| 3 | `#7C3AED` | `#A78BFA` | 第三系列 |
| 4 | `#EA580C` | `#FB923C` | 第四 / 警告 |
| 5 | `#DC2626` | `#F87171` | 第五 / 错误 |
| 6 | `#64748B` | `#94A3B8` | N/A |

**图表色使用约束**：
- ECharts 组件根据当前主题（`light` / `dark`）选择对应数组。
- 不得随机生成颜色；同一业务概念在不同页面保持同色。
- ECharts 面板背景使用 `Getcsscomputedstyle(document.documentElement, "--theme-surface-soft")` 解析后传入，不写死 hex。
- 业务代码不直接读 `chartPalettes`，统一通过 `lib/charts/getTheme()` 获取注册后的 ECharts 主题对象。

### 语义功能色映射（含成对 token）

Accent (`#0F9D8A` 在浅色 / `#2DD4BF` 在深色) 用作小号文字时与白底对比度不足以稳定达到正文级别。因此建立"前景/背景/边框"成对 token，文字（foreground）用更深的青绿，背景（background）用浅青绿。

#### 浅色 `:root`

```css
--color-accent-bg:       oklch(0.9513 0.0488 180);   /* #CCFBF1 */
--color-accent-border:   oklch(0.6247 0.1107 180);   /* #0F9D8A */
--color-accent-text:     oklch(0.4516 0.0953 180);  /* #0F766E */

--color-success-bg:      oklch(0.9513 0.0488 180);
--color-success-border:  oklch(0.6247 0.1107 180);
--color-success-text:    oklch(0.4516 0.0953 180);

--color-warning-bg:      oklch(0.9626 0.0548 41);   /* #FFEDD5 */
--color-warning-border:  oklch(0.6461 0.1946 41);   /* #EA580C */
--color-warning-text:    oklch(0.5302 0.1814 41);   /* #C2410C */

--color-error-bg:        oklch(0.9577 0.0631 27);   /* #FEE2E2 */
--color-error-border:    oklch(0.5771 0.2154 27);   /* #DC2626 */
--color-error-text:      oklch(0.4686 0.2119 27);   /* #B91C1C */
```

#### 深色 `.dark`

```css
--color-accent-bg:       oklch(0.2683 0.0432 181);   /* #134E4A */
--color-accent-border:   oklch(0.7845 0.1321 181);  /* #2DD4BF */
--color-accent-text:     oklch(0.8382 0.1408 181);  /* #5EEAD4 */

--color-success-bg:      oklch(0.2683 0.0432 181);
--color-success-border:  oklch(0.7845 0.1321 181);
--color-success-text:    oklch(0.8382 0.1408 181);

--color-warning-bg:      oklch(0.2673 0.0647 41);   /* #431407 */
--color-warning-border:  oklch(0.8043 0.1639 41);   /* #FB923C */
--color-warning-text:    oklch(0.8803 0.1710 41);   /* #FED7AA */

--color-error-bg:        oklch(0.2948 0.0713 27);   /* #450A0A */
--color-error-border:    oklch(0.7082 0.1865 27);   /* #F87171 */
--color-error-text:      oklch(0.8852 0.1932 27);   /* #FECACA */
```

#### 语义使用映射

| 语义 | 背景前景成对 token | 说明 |
|---|---|---|
| Link / Primary Button | `--theme-primary`（单值，背景与前景对比已验） | 所有 prose 链接、主 CTA |
| Surface Button | `--theme-surface` bg + `--theme-border` | 次要按钮 |
| Agent 标签 | `--color-accent-bg` + `--color-accent-text` + `--color-accent-border` | 小号文字必须用 accent-text 而非 accent |
| BI 标签 | `--theme-primary` bg + `--theme-primary-ui-text`（白底蓝字，小号文字用 `#1E40AF`/#93C5FD 视主题） | 同上做法 |
| 项目状态 - 规划中 / 已归档 | 中性灰，用 `--theme-text-muted` 作前景，`--theme-surface` 作背景 | 灰色 |
| 项目状态 - 进行中 | `--color-warning-*` 成对（橙色） | 用橙色与已完成（青绿）区分，避免都绿 |
| 项目状态 - 已完成 | `--color-accent-*` 成对（青绿） | 完成态 |
| 项目状态 - 维护中 | `--color-info-*`（蓝色，等同 `--theme-primary` 成对） | 维护态 |
| 警告 | `--color-warning-*` 成对 | — |
| 错误 | `--color-error-*` 成对 | — |

---

## 五、字体方案

Geist 是可变字体（variable font），通过 `next/font/google` 加载后在编译期自托管，浏览器运行时不向 Google 请求。Next.js 生成 CSS Variable（如 `--font-geist-sans`）写入 `<html>`，主题 / 组件代码引用该变量，**不直接写字面字体名**。

### 加载代码

```tsx
// app/fonts.ts
import { Geist, Geist_Mono } from "next/font/google"

export const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})
```

```tsx
// app/layout.tsx
import { geistSans, geistMono } from "./fonts"

export default function RootLayout({ children }) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

### Tailwind 4 `@theme inline`

```css
@theme inline {
  --font-sans:
    var(--font-geist-sans),
    "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  --font-mono:
    var(--font-geist-mono),
    "Cascadia Code", "Microsoft YaHei", monospace;
}
```

- 中文走系统字体回退（PingFang SC 仅 macOS/iOS、Microsoft YaHei 仅 Windows、Android 默认须在 M6 多设备验收时确认），**不打包中文字体**。
- Geist 是 variable font，单次加载即覆盖 Regular/Medium/Bold 三档，**不单独加载某一字重**。
- 组件代码用 `className="font-sans"` 或 `font-mono`，不直接 `import` Geist 包，不字面引用 `"Geist Sans"`。
- 构建时若 Google Fonts 下载失败（已知外网偶发风险），CI 应显式失败而不是回退 system-ui；实现阶段保留 `next/font/google` 默认行为，必要时切到 Vercel Bundler 缓存或自托管 woff2。

### 字号层级

| 场景 | 桌面端 | 移动端 |
|---|---|---|
| 首页主标题 | 52–60px（均值 56px 落 token） | 38–44px |
| 页面标题 | 40–48px（均值 44px） | 32–36px |
| 区块标题 | 28–32px（均值 30px） | 24–28px |
| 卡片标题 | 20–24px（均值 22px） | 18–20px |
| 正文 | 17px | 16px |
| 辅助文字 | 14px | 14px |
| 标签 | 12–13px | 12px |

正文行高 `1.75`，文章阅读列宽 720–760px。

---

## 六、布局与栅格

### 容器

| 容器 | 最大宽度 | 留白 |
|---|---|---|
| 普通页面 / 首页 / 项目列表 | 1200px | 桌面 32px / 移动 20px |
| 技术文章正文 | 760px | 同上 |
| 带目录的详情页 | 1080px | 同上 |

### 栅格（12 列）

- 首页 Hero：7 + 5
- 文章 / 项目 / BI 详情：8 + 4（8 prose + 4 右侧栏）
- 列表页：3 + 9 或单列
- 移动端全部单列

### 响应式断点

```text
< 768px            全部单列
768–1024px         详情页 TOC 隐藏，其余按桌面双列调整
Hero 上下结构切换断点 = 1024px
≥ 1024px           详情页保留右侧 TOC
390px 无横向溢出=硬性要求
```

### 圆角

| 元素 | 圆角 |
|---|---|
| 大型项目封面 | 20px |
| 普通卡片 | 16px |
| 按钮 / 输入框 | 10px |
| 代码块 | 12px |
| 标签 | 999px |

### 阴影策略

- 默认不使用明显阴影。卡片靠 **1px 边框 / 背景层级 / 留白 / Hover 边框变深** 区分。
- 仅浮层 / 移动端抽屉 / 搜索浮层允许轻微阴影，最终不透明度在视觉阶段第二轮确认。
- 不定义 `--shadow-card` 等常规阴影 token。

---

## 七、Tailwind 4 `@theme inline` 落地骨架

直接局部抄入 `app/styles/tokens.css` 或 `app/globals.css`：

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  /* 字体走 var(--font-geist-sans)，由 next/font 注入 */
  --font-sans:
    var(--font-geist-sans),
    "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  --font-mono:
    var(--font-geist-mono),
    "Cascadia Code", "Microsoft YaHei", monospace;

  --text-h1: 3.5rem;            /* 56px */
  --text-h2: 2.75rem;           /* 44px */
  --text-h3: 1.875rem;          /* 30px */
  --text-card-title: 1.375rem;  /* 22px */
  --text-body: 1.0625rem;       /* 17px */
  --text-auxiliary: 0.875rem;   /* 14px */
  --text-tag: 0.8125rem;        /* 13px */

  --leading-body: 1.75;
  --leading-tight: 1.2;
  --leading-normal: 1.5;

  --container-default: 75rem;   /* 1200px */
  --container-article: 47.5rem; /* 760px */
  --container-detail: 67.5rem;  /* 1080px */

  --radius-cover: 20px;
  --radius-card: 16px;
  --radius-button: 10px;
  --radius-code: 12px;
  --radius-tag: 999px;

  --spacing-1: 0.25rem; --spacing-2: 0.5rem;  --spacing-3: 0.75rem;
  --spacing-4: 1rem;    --spacing-6: 1.5rem;   --spacing-8: 2rem;
  --spacing-12: 3rem;   --spacing-16: 4rem;    --spacing-24: 6rem;

  /* 缓动函数：--ease-* 命名空间生成 ease-standard 等工具类 */
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
}
```

### 动效时长

**时长不是 ease**。Tailwind 的 `--duration-*` 命名空间用于 `duration-*` 工具类。本项目仅两种时长档位已经足够，**直接用 Tailwind 默认 `duration-150` / `duration-200`，不新增定制时长 token**。

| 场景 | 时长 |
|---|---|
| Hover / 颜色微交互 | `duration-150` |
| 菜单展开 / 卡片位移 / 图片淡入 | `duration-200` |

组件示例：

```tsx
<button className="transition-colors duration-150 ease-out">
<aside className="transition-all duration-200 ease-standard">
```

> Errata：上一版把 `--ease-micro: 150ms` 等当成"缓动函数 token" 是错的——`--ease-*` 命名空间必须是 timing function 而非 duration。已全部删除并改用 Tailwind 默认 duration-* 工具类。

### 颜色映射（accent 成对 token + chart 不入 @theme）

```css
/* 颜色映射：浅深共用的 @theme inline 段 */
@theme inline {
  --color-background:       var(--theme-background);
  --color-surface:          var(--theme-surface);
  --color-surface-soft:     var(--theme-surface-soft);
  --color-text-primary:     var(--theme-text-primary);
  --color-text-secondary:   var(--theme-text-secondary);
  --color-text-muted:       var(--theme-text-muted);
  --color-border:           var(--theme-border);
  --color-primary:          var(--theme-primary);
  --color-primary-hover:    var(--theme-primary-hover);
  --color-accent-bg:        var(--theme-accent-bg);
  --color-accent-border:    var(--theme-accent-border);
  --color-accent-text:      var(--theme-accent-text);
  --color-success-bg:       var(--theme-success-bg);
  --color-success-border:   var(--theme-success-border);
  --color-success-text:     var(--theme-success-text);
  --color-warning-bg:       var(--theme-warning-bg);
  --color-warning-border:   var(--theme-warning-border);
  --color-warning-text:     var(--theme-warning-text);
  --color-error-bg:         var(--theme-error-bg);
  --color-error-border:     var(--theme-error-border);
  --color-error-text:       var(--theme-error-text);
  --color-info-bg:          var(--theme-info-bg);
  --color-info-border:      var(--theme-info-border);
  --color-info-text:        var(--theme-info-text);
}

/* 浅色 */
:root {
  --theme-background:     oklch(0.9789 0.0029 274.3);
  --theme-surface:        oklch(1 0 0);
  --theme-surface-soft:   oklch(0.963 0.0061 259.8);
  --theme-text-primary:   oklch(0.2099 0.0341 263.6);
  --theme-text-secondary: oklch(0.4422 0.0354 258.1);
  --theme-text-muted:     oklch(0.5444 0.035 265.6);
  --theme-border:         oklch(0.9133 0.0114 254.3);
  --theme-primary:        oklch(0.5461 0.2152 263);
  --theme-primary-hover:  oklch(0.4882 0.2171 264.4);

  --theme-accent-bg:      oklch(0.9513 0.0488 180);
  --theme-accent-border:  oklch(0.6247 0.1107 180);
  --theme-accent-text:    oklch(0.4516 0.0953 180);
  --theme-success-bg:     oklch(0.9513 0.0488 180);
  --theme-success-border: oklch(0.6247 0.1107 180);
  --theme-success-text:   oklch(0.4516 0.0953 180);
  --theme-warning-bg:     oklch(0.9626 0.0548 41);
  --theme-warning-border: oklch(0.6461 0.1946 41);
  --theme-warning-text:   oklch(0.5302 0.1814 41);
  --theme-error-bg:       oklch(0.9577 0.0631 27);
  --theme-error-border:   oklch(0.5771 0.2154 27);
  --theme-error-text:     oklch(0.4686 0.2119 27);
  --theme-info-bg:        oklch(0.9491 0.0254 263);
  --theme-info-border:    oklch(0.5461 0.2152 263);
  --theme-info-text:      oklch(0.4882 0.2171 264.4);
  color-scheme: light;
}

/* 深色 */
.dark {
  --theme-background:     oklch(0.1683 0.0181 264.2);
  --theme-surface:        oklch(0.2101 0.0318 264.9);
  --theme-surface-soft:   oklch(0.2449 0.0388 264.5);
  --theme-text-primary:   oklch(0.9842 0.0033 255.9);
  --theme-text-secondary: oklch(0.869 0.0197 254.1);
  --theme-text-muted:     oklch(0.7107 0.035 257.4);
  --theme-border:         oklch(0.3232 0.0415 260);
  --theme-primary:        oklch(0.7137 0.1433 254.8);
  --theme-primary-hover:  oklch(0.8091 0.0955 252);

  --theme-accent-bg:      oklch(0.2683 0.0432 181);
  --theme-accent-border:  oklch(0.7845 0.1321 181);
  --theme-accent-text:    oklch(0.8382 0.1408 181);
  --theme-success-bg:     oklch(0.2683 0.0432 181);
  --theme-success-border: oklch(0.7845 0.1321 181);
  --theme-success-text:   oklch(0.8382 0.1408 181);
  --theme-warning-bg:     oklch(0.2673 0.0647 41);
  --theme-warning-border: oklch(0.8043 0.1639 41);
  --theme-warning-text:   oklch(0.8803 0.1710 41);
  --theme-error-bg:       oklch(0.2948 0.0713 27);
  --theme-error-border:   oklch(0.7082 0.1865 27);
  --theme-error-text:     oklch(0.8852 0.1932 27);
  --theme-info-bg:        oklch(0.2209 0.0431 264);
  --theme-info-border:    oklch(0.7137 0.1433 254.8);
  --theme-info-text:      oklch(0.8091 0.0955 252);
  color-scheme: dark;
}

html { scrollbar-gutter: stable; }
.shiki { font-family: var(--font-mono); }
```

要点：
- 用 `@theme inline` + `var(--theme-*)` 双变量模式让 next-themes `class="dark"` 切 `.dark` 时 Tailwind 工具类自动跟着切换，**组件代码无需 any 改动**。
- **图表色不进 `@theme`**：ECharts Canvas 渲染不解析 CSS 变量，图表色作为 TS 模块 `lib/charts/palette.ts` 唯一来源，详见 §四图表色板。
- `--color-accent-text` / `--color-accent-bg` / `--color-accent-border` 三色成对，保证小号文字对比度达标。
- `scrollbar-gutter: stable` 与导航纯实色策略配合，避免滚动条宽度变化导致 Header 闪烁。

---

## 八、深色模式实施

采用 **Light / Dark / System 三态切换**（已决，不再"二态/三态"摇摆）。底层 `next-themes` 已原生支持三态，若将来从二态升级三态反而要重写组件状态机和测试，一次性定到三态更稳。

### 接入

```tsx
// app/theme-provider.tsx
"use client"
import { ThemeProvider } from "next-themes"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
```

```tsx
// app/layout.tsx
<html lang="zh-CN" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
  <body className="font-sans">
    <ThemeProvider>{children}</ThemeProvider>
  </body>
</html>
```

### 重要约束

- **不再写自定义 IIFE 防闪脚本**。`next-themes` 自身会在页面加载前注入脚本设 `html.class`，重复实现会导致 Storage Key / 初始 Class 互相覆盖。
- 切换组件支持 Light / Dark / System 三选项（用 Headless UI RadioGroup 或原生 `<select>`，由实施时按组件库约束决定，无强依赖）。
- 切换组件内部用 `mounted` 标志避免 SSR 水合不一致（next-themes 文档标准做法）。

### themeColor 通过 Viewport 导出

Next.js 16 应通过 `viewport` 导出 `themeColor`，不放在普通 Metadata 里：

```ts
// app/layout.tsx
import type { Viewport } from "next"

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F8FA" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F17" },
  ],
}
```

> 注意：viewport 的 `prefers-color-scheme` 媒体查询跟的是**操作系统主题**，不一定跟用户在网站内手动选的主题。当前阶段采用这种"中性固定双色"足够；若需要精确匹配用户选项，须在客户端用 `useEffect` 同步更新 `<meta name="theme-color">`，本轮不做。

---

## 九、导航与页面入口契约

### 入口契约（本轮绝对不修改）

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

- 桌面端：左侧"仔伟 / Data & AI" + 中间 5 项主导航 + 右侧搜索 + 主题切换 + 简历。
- 移动端菜单：左侧站点名 + 右侧搜索 + 菜单按钮，菜单展开后包含 首页 / 学习笔记 / 项目 / BI 案例 / 关于 / 简历，**搜索和主题切换不并入菜单列表项**，作为独立控件。
- `/agent` 不属于最终部署路由，不设置 Agent Demo / Coming Soon 次级入口。Agent 技术方向只通过学习笔记、项目案例与真实能力描述呈现，不链接到在线体验页。
- Header 纯实色（不透明 100%，**不带玻璃效果**），底部 1px 边框。
- `About` 与 `Resume` 为独立同级路由 `/about` 与 `/resume`，互不锚点，互不嵌入。

---

## 十、首页 IA（节奏化长页，六屏）

| 屏 | 区块 | 视觉要点 | 数据来源 |
|---|---|---|---|
| 1 | 个人定位 | 桌面 7+5 两栏。左：`数据产品工程师 / BI / AI 数据应用` + 简短叙事 + 两个按钮（`查看项目` / `阅读笔记`）。右：**能力概览面板**（Data Product / Power BI / Agent / RAG / SQL / Python），**不大头像**；可有极轻量数据网格背景（**纯 CSS `linear-gradient` 或 SVG pattern，不用 Canvas / 粒子动画**） | Profile 静态资产（`data/profile.ts` 或 `content/profile.json`） |
| 2 | 精选项目 | 1 主项目（占 2/3 或整行）+ 2 次项目。每卡：16:9 封面 / 项目类型 / 标题 / 一句话业务价值 / 技术标签 / 查看案例入口 | `getFeaturedProjects({ limit: 1 })` + `getSecondaryProjects({ limit: 2 })`，组件接受纯数组 props |
| 3 | BI 案例 | 两列宽卡片。每卡：看板截图 / 业务领域 / 案例名 / 核心指标 / 工具 / 查看分析过程。截图保持原始比例，**不放入倾斜设备模型或假电脑外壳** | `getFeaturedDashboards({...})` |
| 4 | 核心能力 | 4 个能力模块，每项两行说明实际能力边界。**不用进度条，不展示"掌握 90%"的虚假数字** | `data/profile.ts` |
| 5 | 最新笔记 | 紧凑文本列表：`日期  分类  标题  阅读时间`，**不用大卡片** | `getLatestNotes({ limit: 5 })` |
| 6 | 关于与简历 | 简短介绍 + 两个独立入口 `关于我 → /about` 与 `查看在线简历 → /resume`，**不合并入口** | 静态 |

---

## 十一、项目作品集

### 列表 `/projects`

- 第一项精选项目占整行，其余两列网格。
- 卡片：上方封面 / 左上角项目类型 / 标题 / 2–3 行描述 / 技术标签 / 状态 / 查看案例。
- Hover 仅：上移 2px + 边框变深 + 右箭头轻微右移。

字段语义对齐（**与 content-model v2、page-contracts v4 严格一致**）：

```typescript
interface ProjectsPageData {
  featuredProject: ProjectItem | null
  projects: ProjectItem[]
  projectTypes: string[]      // 去重 projectType 列表
  technologies: string[]      // 去重 techStack 列表
}
```

URL 参数：`/projects?type=agent&tech=langgraph`（**不用 `category` / `tag`**——这两个属于 Notes 的语义）。

### 项目状态枚举与展示

**视觉层不重新定义业务枚举**，从现有 `ProjectMeta.status` 派生：

```ts
import type { ProjectMeta } from "@/lib/content/types"

type ProjectStatus = ProjectMeta["status"]
```

视觉层只维护展示映射，不维护枚举本身：

```ts
const projectStatusPresentation: Record<ProjectStatus, {
  label: string
  tone: "neutral" | "info" | "success" | "warning"
}> = {
  completed:  { label: "已完成",   tone: "success" },   // 绿色（accent成对）
  in_progress:{ label: "进行中",   tone: "warning" },   // 橙色
  maintained: { label: "维护中",   tone: "info" },      // 蓝色
  archived:   { label: "已归档",   tone: "neutral" },   // 灰色
}
```

> Errata：上一版写过 `'planning' | 'in-progress' | 'completed' | 'archived'`，与 content-model 既有 `'completed' | 'in_progress' | 'maintained' | 'archived'` 冲突（`in-progress` vs `in_progress`、删 `maintained`、加 `planning`），会破坏现有 Frontmatter 与 Query 过滤。已取消。

### 详情 `/projects/[slug]`

视觉结构：

```text
项目类型 / 状态
项目标题
一句话摘要
角色、时间、技术栈
大幅封面
正文
右侧项目资料栏
相关项目
```

右侧资料栏（字段集 `ProjectDetailMeta`，本轮**仅新增展示字段映射**，不重新定义枚举）：

- `role` 我的角色（**本轮新增字段**，按 §P0 流程走契约核验再决定是否进 Schema）
- `status` 项目状态枚举（从 content-model 既有 `ProjectMeta["status"]` 派生）
- `stack: string[]` 技术栈（取 content-model 既有 `techStack`，视觉层用展示别名 `stack`）
- `period` 项目时间（取 content-model 既有 `publishedAt` / `updatedAt`，或新增字段时按 P0 走）
- `repo?` Repository URL（取 content-model 既有 `repository`）
- `demo?` Demo URL（取 content-model 既有 `demo`）

数据契约（与 [`page-contracts.md`](./page-contracts.md) §项目详情 同步）：

```typescript
interface ProjectDetailPageData {
  project: ProjectItem
  relatedProjects: ProjectItem[]     // 最多 3 个
  meta: ProjectDetailMeta             // 由 project.meta 派生
  toc?: TocItem[]                     // 长文复盘可选
}
```

项目正文建议章节顺序（属 MDX 写作模板，**不在视觉层强制截断或重排序**）：

```text
项目背景 / 业务问题 / 目标用户 / 解决方案 / 系统架构 / 核心功能 /
关键难点 / 安全与治理 / 项目结果 / 复盘与计划
```

---

## 十二、BI 案例页面

### 列表 `/dashboards`

卡片顺序：看板截图 / 业务领域 / 案例名 / 核心指标 / 工具 / 查看分析过程。
列表项必须**显式标注数据状态**（模拟数据 / 脱敏数据 / 聚合数据），避免访客误以为是真实公司敏感数据。

字段语义对齐 content-model v2 与 page-contracts v4：

```typescript
interface DashboardsPageData {
  dashboards: DashboardItem[]
  businessDomains: string[]   // 去重 businessDomain 列表
  tools: string[]             // 去重 tools 列表
}
```

URL：`/dashboards?domain=retail&tool=powerbi`（**不用 `category`**，`domain` 对应 content-model 的 `businessDomain`）。

### 详情 `/dashboards/[slug]`

顶部先说明：业务背景 / 分析目标 / 使用数据 / 关键指标。

正文展示顺序：看板全景图 → 核心指标卡 → ECharts 示例 → 数据模型 → 分析过程 → 关键发现 → 建议和复盘。

右侧栏（`DashboardDetailMeta`，按 §P0 程序核验后落地）：

- `domain` 业务领域（取 content-model 既有 `businessDomain`，视觉层展示别名 `domain`）
- `tools: string[]` 工具（取 content-model 既有 `tools`）
- `metrics: string[]` 关键指标（取 content-model 既有 `metrics`）
- `granularity` 数据粒度（**本轮新增字段**，按 P0 流程走契约核验）
- `dataStatus: 'simulated' | 'masked' | 'aggregated'`（**本轮新增字段**，按 P0 流程走契约核验；未确认前视图层用静态占位文案）

数据契约（与 page-contracts §BI 详情 同步）：

```typescript
interface DashboardDetailPageData {
  dashboard: DashboardItem
  chartData: ChartOption[]
  relatedDashboards: DashboardItem[]
  meta: DashboardDetailMeta
  toc?: TocItem[]
}
```

页面始终明确标识数据属性。

---

## 十三、学习笔记

### 列表 `/notes`

- 桌面端：左侧分类与标签，右侧文章列表。**内容较少时左侧保持轻量，不使用庞大标签云**。
- 文章项采用文本列表（非大图片卡片）：标题 / 描述 / `分类 · 日期 · 阅读时间` / 标签。

### 详情 `/notes/[slug]`

- 桌面端中间正文约 760px + 右侧目录约 220px；移动端目录折叠到文章顶部。
- 正文重点：清晰标题层级 / 宽松段落间距 / 代码块 / Mermaid / 引用块 / 表格 / 注意事项 Callout。
- **代码块默认深色，即使浅色模式也保持深色代码区域**——这一决策直接把 Shiki POC 范围缩为单主题，不再需要双主题 token 切换。

---

## 十四、About 与 Resume

### About `/about`（长页面，不使用 ProfileCard 视觉中心）

```text
个人介绍
当前方向
工作经历
核心能力
项目方法
工具与技术
兴趣
联系方式
```

工作经历采用**普通垂直时间线，默认全部展开**，每段含 公司 / 职位 / 时间 / 工作背景 / 核心职责 / 关键项目或成果 / 相关技术和工具。
允许的轻量视觉层级：左侧时间轴线 / 年份标签 / 当前经历状态标识 / 技术标签 / 项目链接。

**不采用**：Accordion / 点击展开 / 默认收起 / 多层嵌套折叠 / 为时间线引入额外组件库。

数据契约（与 page-contracts §关于 同步）：

```typescript
interface AboutPageData {
  profile: Profile
  workExperiences: WorkExperience[]
  skills: SkillGroup[]
  toolsAndTech: TechGroup[]
  interests: string[]
  contacts: Contact[]
}
```

### Resume `/resume`（可打印文档风格）

- 白色或深色单一背景，明确分区，不使用大型封面图与复杂卡片，桌面端接近 A4 宽度。
- 强制 `@media print` 规则：

```css
@media print {
  /* 卡片移除边框、阴影、圆角 */
  .resume-card { border: 0; box-shadow: none; border-radius: 0; }
  /* 导航与主题切换器隐藏 */
  .resume-nav, .resume-theme-toggle { display: none !important; }
  /* 颜色降级为灰度，但保留灰度层级，不强制纯黑白 */
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  body { background: white; color: black; }
  /* 字号最小 9.5pt */
  body { font-size: 9.5pt; }
  /* 不在经历段尾强制分页：避免一页只一篇经历 */
  .resume-experience { break-inside: avoid; }
  .resume-section { break-before: auto; }
  /* 链接保留可见下划线；可选打印 URL */
  a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 0.85em; color: #555; }
  /* 隐藏纯交互按钮 */
  button { display: none !important; }
}
```

要点：
- **不在经历段尾强制分页**（否则一页只一篇文章），改为 `break-inside: avoid` 让浏览器自然分页，避免被截成两半。
- 保留链接下划线，并可选打印 URL（`::after`），方便纸面录取方读链接。
- **不强制纯黑白**，保留 `print-color-adjust: exact` 与灰度层级，比强制黑白更可读。
- 隐藏纯交互按钮（如"打印此页"），不隐藏纯展示元素。

- PDF 下载作为次要入口（当前阶段通过浏览器打印，**不引入 PDF 生成依赖**）。
- Resume 与 About **共享 Profile / WorkExperience / SkillGroup / Contact 数据源**但模板与版式互不嵌套。

数据契约（与 page-contracts §简历 同步）：

```typescript
interface ResumePageData {
  profile: Profile
  summary: string
  workExperiences: WorkExperience[]
  education: EducationEntry[]
  skills: SkillGroup[]
  certifications?: CertEntry[]
  projectHighlights?: ProjectHighlightRef[]
  languages?: string[]
  contacts: Contact[]
}
```

---

## 十五、Agent 部署边界

- 不部署 `/agent`、`/api/agent/*`、聊天界面、会话管理或 FastAPI / LangGraph 在线后端。
- 不设计 Agent Coming Soon 页面、Badge 或公开入口。
- Agent、RAG、LangGraph、智能问数等技术内容与 `projectType: "agent"` 项目案例继续保留。
- `/agent` 占位页面、`lib/agent/`、Sitemap 与 E2E 引用已清理；访问 `/agent` 返回 404。
- 完整边界与清理验收见 [`agent-deployment-decision.md`](./agent-deployment-decision.md)。

---

## 十六、按钮与控件

- **主按钮**：蓝色实心 + 白色文字 + 高度 40–44px + 圆角 10px + **不使用渐变**。
- **次按钮**：Surface 背景 + Border + 主文字颜色。
- **标签**：默认灰色中性标签；Agent 标签青绿色、BI 标签蓝色、项目状态 绿/橙/灰、警告 橙色、错误 红色（详见 §四语义映射）。

- **自定义 `<a>` 分流**（按官方 API 独立实现，**不复用 blog-tech 源码**）：`/` 开头走 `next/link`、`#` 开头走普通 `<a>`、其他外链默认当前窗口（不强制新窗口，下载/Demo/外部工具明确场景才新窗口并加 `rel="noopener noreferrer"`）。

---

## 十七、动效原则

动效时长统一 **150ms–220ms**：

**只实现**：按钮 Hover / 卡片 Hover / 导航状态 / 菜单展开 / TOC 当前项变化 / 图片淡入 / 复制成功提示。

**不实现**：页面大范围入场动画 / 滚动视差 / 鼠标跟随 / Canvas 背景 / 3D / 磁吸 Dock / 打字机动画。

**实现约束**：所有 `transition-*` 与动画类名使用 Tailwind 4 `motion-safe:` 变体，`@media (prefers-reduced-motion: reduce)` 自动降级。

---

## 十八、设计系统边界

**视觉实现阶段可以改**：颜色 / 字体 / 间距 / 圆角 / 卡片布局 / 页面区块顺序（首页六屏偏离原顺序需在 visual-spec 修记；其余页区块顺序可在视觉层调整但须保持 page-contracts 字段集合不缺失）/ 响应式布局 / Hover 与动效。

**不得修改**（由 [`page-contracts.md`](./page-contracts.md) 强制契约）：内容 Schema / 内容查询接口 / 最终部署路由与 URL 参数 / 搜索逻辑 / MDX 内容模型 / ECharts 数据接口。`/agent` 历史占位及其类型不属于稳定契约，按部署决策另行清理。

**与第一阶段成果的接口**：本轮既有业务字段已在 page-contracts v4 + content-model v2 + architecture v2 中冻结。page-contracts 中存在但 content-model 尚未提供的视图字段，按 [`p0-contract-check.md`](./p0-contract-check.md) 使用占位、静态说明或暂不展示；视觉实现不能改变 URL 路径与既有 key 名。

---

## 十九、前置 POC（M1.5：进入 M2 实施前必须先跑通）

### POC 工程位置

POC 必须在 **真实项目真实配置** 中验证，不能仅放 `.agent-temp/poc/` 里跑一个 standalone demo。原因：`.agent-temp/poc/` 不能真实验证当前的 `next.config` / `mdx-components.tsx` / 动态 import / Tailwind / App Router 构建。

**做法**：
- 实现集成代码直接改当前项目真实文件（或在临时 Git 分支上改，验证后 merge）。
- 测试用的临时内容与临时路由放在 `content/notes/__poc__.mdx`、`app/dev/poc/...` 这类显式标注的临时位置。
- `.agent-temp/poc/` 只用于：截图、实验记录、辅助脚本，不放真实集成代码。
- 在 `.gitignore` 里加 `content/notes/__poc__.mdx`、`app/dev/poc/**/*` 等临时 POC 路径，避免污染主干。
- POC 完成后：保留可用实现进主干；删除临时路由与内容；运行 `pnpm build` + `pnpm test:e2e` 确认无回归；记录 POC 报告（可保留为 `docs/poc/M1.5-report.md`）。

### POC 清单（4 项）

| POC | 范围 | 接受标准 | 失败回退 |
|---|---|---|---|
| **Shiki 单主题服务端高亮** | (1) Remark/Rehype 插件在编译期提取 fenced code 的原始 `code` / `lang` / `meta`；(2) 转为 `<CodeBlock code lang meta />` Server Component；(3) 调 `codeToHtml(code, { theme: 'github-dark-dimmed' })`；(4) `mdx-components.tsx` 重映射 `pre` 用返回 HTML；(5) 加客户端 clipboard 复制按钮 | `pnpm build` 通过；至少 4 种语言（ts/tsx/bash/md）渲染正确；复制按钮可用；不 flash | 深色 `<pre>` + mono 字体 + **纯色代码文本，不做语法上色**（Tailwind Typography 不做高亮，不能用它做 token 上色） |
| **Mermaid 转换** | (1) 在 fenced-code 分流阶段**先于 Shiki** 处理 `language-mermaid`；(2) 转给客户端 `MermaidDiagram` 组件按需加载；(3) Mermaid 解析失败时显示原始代码 + 错误提示，**不阻塞文章正文** | `pnpm build` 通过；合法 mermaid 图正确渲染；非法 mermaid 显示原始代码 + 错误；普通代码块不受影响 | Mermaid 不走 fenced code 路径，作者必须在 MDX 中显式 `<MermaidDiagram chart="..." />` |
| **TOC Heading ID** | (1) `rehype-slug` 在管道中接入生成稳定 id；(2) `ignoreHeadings` 过滤配置位置；(3) 静态 TOC 组件按 id 渲染（本轮先做静态 TOC，Active 跟踪在长文章稳定后再做） | `pnpm build` 通过；同一 h2 多次出现有不同 id；TOC 与正文锚点对齐；移动端 TOC 折叠到文章顶部 | 阶段内手写锚点（作者在 MDX 中显式 `<h2 id="xxx">`） |
| **搜索索引** | **本轮删除该 POC**。搜索逻辑在本轮是强制契约不可修改（详见 §一上游契约），不需预生成索引，继续走第一阶段服务端内存 matcher | — | — |

> Errata：上一版把"搜索索引生成方式"列入 POC，与"搜索逻辑不可改"自相矛盾，已删除。搜索本轮不引入新方案。

### Shiki POC 技术路径澄清

不能简单假设"`mdx-components.tsx` 重映射 `pre` 就能拿到原始 code"。Shiki Server Component 示例要求明确拿到 `children: string` + `lang: BundledLanguage`。

POC 的明确技术路径：

```
MDX fenced block
├─ Remark/Rehype 插件编译期提取 code/lang/meta
├─ 渲染为 <CodeBlock code="..." lang="..." meta="..." />（自定义组件，接受原始字符串 props）
└─ Server Component 调用 codeToHtml(code, { theme, lang })
```

回退方案的正确写法（注意 Tailwind Typography 不参与语法高亮）：

```css
.fallback-pre {
  background: #0B0F17;
  color: #F8FAFC;
  font-family: var(--font-mono);
  padding: 1rem;
  border-radius: 12px;
  /* 不做 token 上色 */
}
```

回退时所有代码字符同色，不做语法高亮，但保持深色背景与等宽字体。

### fenced code 分流顺序（必须严格遵守）

```
fenced code
├─ language === "mermaid" → MermaidDiagram（优先，不进 Shiki）
└─ 其他语言 → CodeBlock / Shiki
```

如果 Shiki 先于 Mermaid 处理，Mermaid 代码会被 Shiki 当普通文本渲染，图永远不会出。

POC 通过后回填本文件对应行从"POC"升级为"Adopt now"。POC 不通过且无回退前，对应能力不接入主干。

---

## 二十、实施阶段切片

本轮迭代沿用切片节奏，但与视觉并行。**修正重点**：删除"M2 内容系统层升级"（与"契约冻结"自相矛盾），改为"P0 契约一致性检查"作为前置条件。

| 阶段 | 内容 | 前置 |
|---|---|---|
| **P0 契约一致性检查** | (1) 检查视觉方案需要的字段是否已存在于 `content-model.md` 与 `page-contracts.md`；(2) 已存在 → 本轮纯消费；(3) 不存在（如 `role` / `granularity` / `dataStatus`）→ 记录到下一轮内容模型迭代，本轮视觉层用可选占位或已存在字段的展示别名实现；(4) **禁止视觉任务直接修改 Schema / Query / URL 参数** | — |
| **M1 Token、字体与主题** | (1) 修正 duration/ease 分离；(2) `next/font/google` CSS Variable 接入 Geist；(3) next-themes 三态（Light/Dark/System）；(4) accent 成对 token 与浅深 mode 落到 `@theme inline`；(5) `viewport` 导出 themeColor；(6) lib/charts/palette.ts 浅深两套 ECharts 数组 | P0 |
| **M1.5 真实项目中做 POC** | (1) Shiki 单主题服务端高亮；(2) Mermaid 分流；(3) Heading ID / 静态 TOC；**不做搜索 POC** | M1 |
| **M2 笔记视觉** | `/notes` 列表 + `/notes/[slug]` 详情 + Code / Mermaid / Callout / 静态 TOC 视觉重设计 | M1.5 |
| **M3 项目与 BI** | `ProjectItem` / `DashboardItem` 强类型 access；详情资料栏 + 右侧栏字段映射；ECharts 主题切换；项目状态展示映射 record | M2 |
| **M4 首页 + About + Resume** | 六屏首页、About 普通垂直时间线、Resume 可打印 stylesheet | M3 |
| **C0–C4 真实内容更新门禁** | C0 资料盘点与方案沉淀；C1 个人资料与简历；C2 真实项目与脱敏 BI 案例；C3 三篇面试问答专题；C4 事实、脱敏、链接、Schema 与完整质量门 | M4 |
| **M5 视觉 QA** | Playwright 多视口截图比对、390px 硬性验收、`prefers-reduced-motion` 验收、键盘验收、Light/Dark/System 三态验收、Print 验收；确认路由表/Sitemap 无 `/agent` 且 Agent 内容与案例可访问 | C4 |

### P0 的执行细节

契约核验产出一份 `docs/p0-contract-check.md`，列出：

| 视觉需求字段 | content-model 现状 | 处置 |
|---|---|---|
| ProjectDetailMeta.role | 不存在 | 视觉层渲染占位元素（如"待定"），不放 Schema；下一轮才考虑加 |
| DashboardDetailMeta.granularity | 不存在 | 同上 |
| DashboardDetailMeta.dataStatus | 不存在 | 同上；视觉层用静态文本展示 |
| ProjectStatus 枚举 | `ProjectMeta.status` 已定义为 `'completed' \| 'in_progress' \| 'maintained' \| 'archived'` | 视觉层通过 `ProjectMeta["status"]` 派生，**不重新定义** |
| projectType | content-model 已定义 `z.enum(["agent","dashboard","pipeline","tool","other"])` | URL 参数用 `?type=agent`，不用 `?category` |
| businessDomain | content-model 已定义 `businessDomain: string` | URL 参数用 `?domain=xxx`，不用 `?category` |
| tags / category | Note 专属字段 | 仅 `/notes` 用 |
| cover | Note / Project / Dashboard 均已有可选字段 | 直接消费；缺失或空字符串时使用中性占位 |
| series / seriesOrder | 不存在 | 视觉层本轮不实现系列笔记 UI；留到下一轮内容模型加字段 |

---

## 二十一、最终视觉验收标准（M5 出口）

完成后至少满足：

- 首页 5 秒内能看懂个人定位
- 重点项目在首屏后立即出现
- 技术文章连续阅读不疲劳
- 项目与 BI 案例有明确区别
- 页面不呈现模板拼接感
- 颜色使用克制、无大面积渐变、无玻璃拟态、无多余动画依赖
- 浅色和深色模式内容清晰
- 390px 宽度无横向溢出（硬性）
- 键盘焦点清晰
- 正文对比度符合可访问性要求
- 所有交互状态一致
- 打印简历页面正常

### 无障碍补充验收（按 WCAG 2.2 分级）

44×44px 是良好触控目标建议，但 WCAG 2.2 AA 最低目标是 24×24 CSS px（或满足间距例外）；正文中的行内链接有明确例外。本项目分级要求：

| 控件类型 | 最小目标尺寸 | 备注 |
|---|---|---|
| 主要按钮、图标按钮、导航控件 | ≥ 44×44px | 优先达到；移动端图标按钮硬性 |
| 次级紧凑控件 | ≥ 24×24px | 并保证目标间距 ≥ 24px |
| 正文行内链接 | 不强制 44×44 | 但必须有清晰焦点与链接下划线样式 |

### aria-live 使用约束（澄清）

**静态 Callout 不应设置 `aria-live`**。只有异步新增、且需要读屏器及时播报的**动态**状态信息才使用 Live Region。本项目：

- 静态注意事项 Callout（如 prose 里的 `> **注意**：...`）→ 不设 `aria-live`，正常 HTML 即可。
- 复制成功 toast、表单提交错误等异步反馈 → `aria-live="polite"`。
- 关键错误 → `aria-live="assertive"`。

> Errata：上一版"注意事项 Callout 的 `aria-live` 视情况启用" 表述模糊，会被实施者误读为静态 Callout 也设 Live Region。已明确分级。

---

## 二十二、不做项（本轮迭代明确排除）

- 在线 Agent 页面、`/api/agent/*`、FastAPI / LangGraph 博客后端、Agent Demo / Coming Soon 公开入口
- Contentlayer2 / Pliny / next-mdx-remote / Content Collections / prism / sugar-high / 客户端 Shiki 加 DOMParser
- `@once-ui-system/core` 全套（CC BY-NC 许可风险 + 强绑）
- motion / framer-motion + 内联 Magic UI 组件 / typed.js / plyr / react-medium-image-zoom / react-share
- Prisma + Postgres（不论内容存储还是访问量统计）
- Giscus / Mailchimp / Spotify now-playing / GitHub API / npm API（外部服务依赖）
- LiquidGlass 玻璃拟态 / FlickeringGrid Canvas
- geist **装饰字体**（注：Geist 作为正文 / mono 字体可以使用并子集化加载，本条禁止的是把 Geist 当作装饰性大标题字体使用）
- `<Projects range exclude />` 切片复用模式（与 Queries/组件分层冲突）
- per-post `layout` frontmatter 字段（与按内容类型自动选布局重复）
- 多作者内容系统（单作者过度工程）
- kbar 命令面板（长期 beta + 增 bundle）
- 生成索引产物放 `content/index/`（混入内容源）；改为显式脚本输出至 `.generated/` 或 `public/generated/`
- 外部链接全部强制 `target="_blank"`
- `body-scroll-lock` / `cookie` 鉴权 / `protectedRoutes`
- bun / yarn Berry（本项目 pnpm 单一 lockfile）
- 全局 `.prose` 巨型 CSS 块（用 `mdx-components.tsx` 重映射 + Tailwind 4 `@theme` 替代）
- TS `strict:false` / `as any` / `@ts-ignore`
- SCSS modules + `sass`
- content 内嵌 `app/blog/posts/`（内容放顶层 `content/` 与路由树解耦）
- 列表分页 `/notes/page/[page]`（笔记数 > 20 后再做）
- 嵌套 catch-all 路由 `/notes/[...slug]`（真正出现系列目录后再评审；`series` + `seriesOrder` 当前尚未进入 frontmatter，本轮不实现系列 UI）
- Active TOC IntersectionObserver（长文章稳定后再做，本轮先静态 TOC）
- 9 平台分享（本轮仅"复制链接"）
- Newsletter / RSS / 动态 OG 图 / Giscus / GitHub stars npm downloads 社会证明 / ProfileCard / Work Accordion / ScrollTop 浮动按钮 / 客户端搜索 Fuse.js MiniSearch

除在线 Agent（已按长期部署范围排除）外，上述可延后项在条件触达 milestones（笔记数 > 20、内容规模明显增长、纯静态导出需求出现等）后，再单独评审是否展开。

---

## 二十三、许可证风险与协作准则

- **magic-portfolio（CC BY-NC）**：用途若涉及职业推广或商业机会，为规避许可证解释风险，**不复制该仓库源码与视觉资产**，仅学 IA 思想。
- **blog-tech（无 LICENSE）**：默认 All rights reserved，**只参考其功能范围，按 Next.js 官方 API 从零独立实现，不复制其代码结构与表达**。
- **tailwind-nextjs-starter-blog / magicui-portfolio / mengke.me（MIT）**：复制源码须保留版权 + MIT 全文；仅学思想无义务。
- 独立实现常见逻辑（escapeXml / CustomLink 分支判断 / formatDate 算法等）属常见通用算法，可独立重写，**不必署名**（但也不是法律意见）。最安全的规则是：不复制无 LICENSE 仓库代码；按官方文档从零实现；实际引入 MIT 代码时保留相应许可证与版权声明。
- 校色工作流：Figma 改色记录新 hex → 同步给工程 → 工程用 §二十四脚本复算 oklch → 同步更新本文件 §四两表的 hex + oklch 双份 → commit message 写 `tokens: 调整 --color-xxx 由 #XXX 更新为 #XXX`。**禁止单边漂移**。

---

## 二十四、OKLCH 换算脚本（PowerShell，本文件自包含）

新增颜色时本地复算：

```powershell
function ConvertTo-OKLCH([string]$hexInput) {
  $h = $hexInput.TrimStart('#')
  $r = [Convert]::ToInt32($h.Substring(0,2),16)/255.0
  $g = [Convert]::ToInt32($h.Substring(2,2),16)/255.0
  $b = [Convert]::ToInt32($h.Substring(4,2),16)/255.0
  function Lin($c){ if($c -le 0.04045){return $c/12.92} else {return [Math]::Pow(($c+0.055)/1.055,2.4)} }
  $lr = Lin $r; $lg = Lin $g; $lb = Lin $b
  $l = 0.4122214708*$lr + 0.5363325363*$lg + 0.0514459929*$lb
  $m = 0.2119034982*$lr + 0.6806995451*$lg + 0.1073969566*$lb
  $s = 0.0883024619*$lr + 0.2817188376*$lg + 0.6299787005*$lb
  $l1 = if ($l -gt 0){ [Math]::Pow($l,1/3) } else { 0 }
  $m1 = if ($m -gt 0){ [Math]::Pow($m,1/3) } else { 0 }
  $s1 = if ($s -gt 0){ [Math]::Pow($s,1/3) } else { 0 }
  $L = 0.2104542553*$l1 + 0.7936177850*$m1 - 0.0040720468*$s1
  $a = 1.9779974951*$l1 - 2.4280929685*$m1 + 0.4505937058*$s1
  $bCH = 0.0259033734*$l1 + 0.7827717655*$m1 - 0.8086757854*$s1
  $C = [Math]::Sqrt($a*$a + $bCH*$bCH)
  $H = [Math]::Atan2($bCH,$a)*180.0/[Math]::PI
  if ($H -lt 0) { $H = $H + 360 }
  "oklch($([Math]::Round($L,4)) $([Math]::Round($C,4)) $([Math]::Round($H,1)))"
}
ConvertTo-OKLCH "#2563EB"
```

更稳妥方式：Chrome DevTools 颜色选择器切到 OKLCH 空间直接读取，二者结果应一致；不一致以 DevTools 为准。

---

## 二十五、进入实现前的全部决策（已关闭未决项）

以下是上一版列为"待第二轮决定"的项，**本轮进入实现前全部关闭**，避免 Codex 在实施过程中自行决定：

| 项 | 决策 | 依据 |
|---|---|---|
| 项目状态"进行中"颜色 | **用橙色（warning）**，与"已完成"（青绿 accent）区分；详见 §四语义映射 | 避免两态都用绿色辨识度差 |
| 项目状态枚举 | **从 content-model import，不重新定义**；为 `'completed' \| 'in_progress' \| 'maintained' \| 'archived'` | 不破坏既有 Frontmatter 与 Query 过滤 |
| 浮层阴影 light/dark | **固定一组**：light `0 4px 16px -2px rgb(0 0 0 / 0.08)`，dark `0 4px 16px -2px rgb(0 0 0 / 0.32)`；drawer / search 浮层按比例递增；详见 §四 | 避免待校项 |
| Geist Medium 字重 | **不单独加载固定字重**，使用 Geist variable font 单次加载覆盖 Regular / Medium / Bold | variable font 一份即可 |
| 主题切换二态 vs 三态 | **三态 Light / Dark / System**，next-themes `enableSystem` 打开 | §八已决 |
| `<a>` 外链 `target="_blank"` | **不强制**；下载 / Demo / 外部工具场景才新窗口并加 `rel="noopener noreferrer"` | §十六已决 |
| Resume 分页规则 | `break-inside: avoid` 自然分页，**不在经历段尾强制分页** | §十四已决 |
| Resume 颜色处理 | `print-color-adjust: exact` + 保留灰度层级，**不强制纯黑白** | §十四已决 |
| themeColor 注入 | 通过 `viewport.themeColor` 注入双色不跟随用户选项；如需精确跟随需 `useEffect` 同步 meta，本轮不做 | §八已决 |
| Mermaid 分流顺序 | fenced code 分流中 `language-mermaid` 优先进 Mermaid，其他语言才进 Shiki | §十九已决 |
| ECharts 主题色来源 | TypeScript `lib/charts/palette.ts` 浅深两套数组，**不读 CSS 变量** | §四已决 |
| Mermaid 解析失败 | 显示原始代码 + 错误提示，不阻塞正文 | §十九已决 |
| Shiki 失败回退 | 深色背景 + 等宽 + 纯色文本，**不做 token 语法上色**（Tailwind Typography 不做高亮） | §十九已决 |
| 搜索索引生成 | 本轮**不做**搜索 POC，搜索逻辑契约冻结 | §十九已决 |
| About 工作经历形式 | 普通垂直时间线，不折叠，不引入额外组件库 | §十四已决 |
| About 是否设 ProfileCard 视觉中心 | **不**，使用普通长页面 | §十四已决 |
| Agent 部署范围 | 博客不部署在线 Agent 页面、API 或后端；保留技术内容与项目案例 | [`agent-deployment-decision.md`](./agent-deployment-decision.md) |

---

## 二十六、与第一阶段文档的关系

本文件是第二轮视觉与体验迭代的主决策文档。Agent 是否进入博客部署范围由独立的 [`agent-deployment-decision.md`](./agent-deployment-decision.md) 决定。以下第一阶段文档作为上游契约：

- [`architecture.md`](./architecture.md) — 系统架构、组件边界、技术债务演进
- [`mdx-pipeline.md`](./mdx-pipeline.md) — `@next/mdx` + gray-matter + Zod 内容渲染流程
- [`content-model.md`](./content-model.md) — frontmatter Schema、字段定义、敏感数据规则
- [`page-contracts.md`](./page-contracts.md) — 每页数据契约、状态契约、组件契约（已 v3 增订补 `/projects`、`/dashboards`、`/about`、`/resume` 列表 + 详情 + ProjectDetailMeta / DashboardDetailMeta 字段）
- [`functional-requirements.md`](./functional-requirements.md) — 最终部署的 14 个公开页面类型 + 1 not-found 边界功能清单
- [`design-handoff.md`](./design-handoff.md) — 第一阶段"哪些已固定、哪些可改、需要提供什么"的交接清单（本文件 §四、§六、§九、§十八 视觉层决策已覆盖 design-handoff § 11 "后续设计需要提供的输入"，design-handoff 仅作为历史参照保留）
- [`agent-deployment-decision.md`](./agent-deployment-decision.md) — 在线 Agent 排除范围、历史与最终路由口径

本文件与上述任一文档冲突时，以上游契约（content-model / page-contracts / architecture）优先，本文件仅就"视觉 / 体验 / 工程 token / POC"层面决策；涉及在线 Agent 页面、API 或后端范围时，以 `agent-deployment-decision.md` 为准。

---

## 二十七、修订记录

| 日期 | 版本 | 变更 |
|---|---|---|
| 2026-07-24 | v2 草案 | 集成 5 仓开源调研结论 + 用户视觉方案 + 视觉方案补充决策；落地 Tailwind 4 `@theme inline` CSS 骨架与 OKLCH 双轨色板；合并原 `docs/design/visual-spec.md`、`docs/design/design-tokens.md`、`docs/design-reference-decisions.md`、`docs/research/reference-sites-review.md` 为本单一迭代方案文档；删除上述四份中间产物文件，保留 docs 树整洁。 |
| 2026-07-24 | v2.1 Approved | 修复 15 项阻塞问题：(1) 删除本轮"M2 内容系统层升级"，改 P0 契约一致性检查；(2) 项目/BI 字段与 URL 参数恢复 content-model 语义（`type` / `domain` 而非 `category`，字段用 `ProjectItem` / `DashboardItem` 而非 `ContentItem`）；(3) 项目状态枚举从 content-model import 不重新定义，删除 `'planning' / 'in-progress'` 改动；(4) 修正 Tailwind duration / ease 命名空间混淆，时长直接用 `duration-150 / duration-200` 不新增定制 token；(5) 删除与 `next-themes` 重复的自定义 IIFE 防闪脚本，确定 Light/Dark/System 三态；(6) Geist 通过 `next/font/google` 生成的 CSS Variable（`--font-geist-sans`）而非字面字体名；(7) ECharts 主题色作为 TypeScript `lib/charts/palette.ts` 浅深两套数组，不再依赖 CSS 变量（Canvas 不解析）；(8) Shiki / Mermaid / TOC POC 改在真实项目中做而非 `.agent-temp/poc/` 里跑 standalone demo；(9) fenced code 分流顺序明确（mermaid 优先于 Shiki）；(10) Shiki 失败回退方案修正（Tailwind Typography 不做高亮）；(11) 删除搜索索引 POC（与"搜索逻辑不可改"自相矛盾）；(12) Resume 打印分页改为 `break-inside: avoid` 自然分页 + `print-color-adjust: exact` 保留灰度 + 链接下划线 + URL 打印；(13) 无障碍 44×44 改为按 WCAG 2.2 AA 分级（44 / 24 / 正文链接不强制）；(14) 静态 Callout 不设 `aria-live` 澄清；(15) 进入实现前关闭全部"待第二轮决定"未决项。 |
| 2026-07-27 | v2.2 Approved | 根据 Agent 部署范围决策移除 `/agent` 次级入口、About `agentPreview`、M4 Coming Soon 视觉和后续上线条件；M4 调整为首页 + About + Resume，M5 增加无 `/agent` 路由/Sitemap/公开链接以及保留 Agent 技术内容与项目案例的验收。 |
| 2026-07-27 | v2.3 Approved | 在 M4 与 M5 之间增加 C0–C4 真实内容更新门禁：公开真实姓名、城市和求职邮箱，单位与业务泛化且不公开手机号；用真实智能问数、数据仓库和脱敏 BI 方法替换模拟案例；将 7 组技术问答整理为三篇专题笔记。M5 改为基于 C4 最终内容执行视觉验收。 |
| 2026-07-28 | v2.4 Completed | C0–C4 已完成，三篇专题公开发布并通过内容质量门；M5 已完成自动化回归与用户人工视觉验收，未发现阻塞问题。下一阶段为 GitHub Pages D1 静态导出适配。 |
