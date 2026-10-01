import Link from "next/link";
import { profileData } from "@/data/profile";
import { loadDashboards, loadNotes, loadProjects } from "@/lib/content/loaders";
import { PROJECT_TYPE_LABELS, type ProjectMeta } from "@/lib/content/types";
import { sortProjects } from "@/lib/content/project-order";

const WAREHOUSE_HREF = "/projects/data-warehouse-modernization";
const WECOM_HREF = `${WAREHOUSE_HREF}#wecom-dashboards`;
const REPORT_HREF = `${WAREHOUSE_HREF}#report-automation`;
const KB_HREF = "/projects/enterprise-knowledge-assistant";
const AGENT_WORKFLOW_HREF = "/about#agent-workflow";

/** 两个代表案例：数仓与智能问数同等展示层级 */
const REPRESENTATIVE_SLUGS = ["data-warehouse-modernization", "enterprise-qa-assistant"] as const;

/**
 * 人工精选的四篇实践：数据侧两篇、AI 侧两篇，各取一半。
 * 复用已有文章，不按发布日期自动排序。
 */
const CURATED_NOTE_SLUGS: readonly string[] = [
  "multi-source-pipeline-self-audit",
  "wecom-batch-lifecycle-orphan-rows",
  "controlled-query-mcp-security",
  "agent-tool-calling-evaluation",
];

/** 两个代表案例在首页卡片上展示的业务问题 / 职责 / 结果 / 阶段 */
const CASE_CARDS: Record<
  string,
  { problem: string; work: string; result: string; stage: string }
> = {
  "data-warehouse-modernization": {
    problem: "数据来源分散在业务库、补充表与外部系统，指标口径不一致，人工取数反复。",
    work: "梳理接入范围，用 DataX 与自动采集收敛来源，dbt 分层建模，Airflow 编排刷新，并用口径注册表与数据契约固定定义。",
    result: "形成接近 300 张表 / 视图的数据资产，支撑企业微信经营看板、周月报取数与报表自动填表对账。",
    stage: "本机环境运行 · 日常全量刷新",
  },
  "enterprise-qa-assistant": {
    problem: "业务人员取一个指标或一批明细，要跨系统、翻口径说明、找人人工取数。",
    work: "按 Kernel、Plugin、Capability、MCP 分层搭建双入口；模型只选已注册能力并输出结构化参数，取数由注册定义生成并校验后执行。",
    result: "企业微信与网页双入口的受控问数、明细查询与结果导出，带行级权限、审计日志和可回退的检索链路。",
    stage: "受控内部验证阶段",
  },
};

/**
 * 其余交付：与两个代表案例同列在一个项目列表里，
 * 沿用同一组字段（业务问题 / 我的工作 / 交付结果），只是篇幅更短。
 */
const MORE_DELIVERIES = [
  {
    title: "企业知识库助手",
    href: KB_HREF,
    stage: "内部验证阶段",
    problem: "内部制度散落在文档、通知和口头约定里，员工要先找资料负责人确认。",
    work: "基于开源 WeKnora 定制员工问答与管理员发布流程，把资料版本、发布批次、撤回与新版替代纳入治理。",
    result: "回答只依据已发布资料并给出可追溯出处；资料变化后旧会话转为只读；作业系统单点登录核心链路通过真实验证。",
    tags: ["WeKnora 定制", "发布与撤回治理", "SSO"],
  },
  {
    title: "企业微信经营看板",
    href: WECOM_HREF,
    stage: "生产使用",
    problem: "三条经营线原先靠人工导出、手工整理、手工贴表，数据到得慢且容易漏。",
    work: "把采集、指标汇总与人日粒度写入智能表格的链路自动化，并补重复键检查、失效数据处理、依赖预检与失败告警。",
    result: "立案与回款趋势、项目维度过程指标、人员过程数据三条看板定时同步，同步后按定位信息回读对账。",
    tags: ["企业微信智能表格", "定时同步与对账", "隐私边界"],
  },
  {
    title: "业务报表自动化",
    href: REPORT_HREF,
    stage: "持续运行",
    problem: "周报要跑 SQL、看结果、再一格格贴进 Word 模板，费时且容易贴错。",
    work: "把周报 SQL 结果集自动灌入 Word 模板，表头、列宽与配色按原文档反向标定，手写分析段落保留给业务。",
    result: "结构校验 + 逐格对账 + Word 真实打开复验三条全过才算可用；月报、运营日报与业务取数同链路维护口径。",
    tags: ["SQL → Word 自动填表", "逐格对账", "统计截止日"],
  },
  {
    title: "Power BI 经营分析平台",
    href: "/dashboards/operations-process-analysis",
    stage: "历史交付 · 已停维",
    problem: "经营分析缺少统一模型，指标口径分散在各人手里。",
    work: "从零搭建分析平台并切换到自建数仓；重构星型模型、关系主路径与日期角色。",
    result: "统一管理 150 个 DAX 度量与 1 个计算组，交付 10 个正式看板页；平台已于 2026-09 停止维护，案例保留模型与口径设计过程。",
    tags: ["星型模型与计算组", "指标口径治理", "脱敏截图"],
  },
] as const;

export default function HomePage() {
  const projects = sortProjects(loadProjects());
  const projectBySlug = new Map(projects.map((project) => [project.slug, project]));

  const representative = REPRESENTATIVE_SLUGS.map((slug) => projectBySlug.get(slug)).filter(
    (project): project is (typeof projects)[number] => project !== undefined,
  );

  const dashboards = [...loadDashboards()]
    .sort((a, b) => Number(b.meta.featured) - Number(a.meta.featured))
    .slice(0, 1);

  const notesBySlug = new Map(loadNotes().map((note) => [note.slug, note]));
  const notes = CURATED_NOTE_SLUGS.map((slug) => notesBySlug.get(slug)).filter(
    (note): note is NonNullable<typeof note> => note !== undefined && !note.meta.draft,
  );

  const typeLabel = (meta: ProjectMeta) => PROJECT_TYPE_LABELS[meta.projectType];

  return (
    <main className="w-full">
      {/* 1. 综合定位 */}
      <section className="border-b border-border">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[minmax(0,7fr)_minmax(20rem,5fr)]">
          <div>
            <p className="hero-enter text-sm font-medium text-primary">
              {profileData.profile.name} · {profileData.profile.location}
            </p>
            <h1 className="hero-enter hero-delay-60 mt-3 text-h1 font-semibold leading-tight text-text-primary">
              {/* 拆成两个不可断行片段：换行只发生在「与」和「AI 应用」之间，
                  避免末尾单字独占一行 */}
              <span className="whitespace-nowrap">数据工程与</span>{" "}
              <span className="whitespace-nowrap">AI 应用</span>
            </h1>
            <p className="hero-enter hero-delay-60 mt-4 text-body leading-body text-text-secondary">
              {profileData.profile.subtitle}
            </p>
            <p className="hero-enter hero-delay-120 mt-5 max-w-2xl text-body leading-body text-text-secondary">
              {profileData.profile.summary}
            </p>
            <div className="hero-enter hero-delay-160 mt-7 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="rounded-button bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 ease-standard hover:bg-primary-hover"
              >
                查看项目
              </Link>
              <a
                href="/resume/jin-zaiwei-resume.pdf" download
                className="rounded-button border border-border px-4 py-2.5 text-sm font-medium text-text-primary transition-colors duration-150 ease-standard hover:bg-surface-soft"
              >
                下载简历
              </a>
            </div>
            <p className="hero-enter hero-delay-160 mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a
                href="mailto:454313544@qq.com"
                className="font-medium text-text-secondary transition-colors duration-150 ease-standard hover:text-primary"
              >
                邮件联系
              </a>
              <a
                href="https://github.com/sq454313544"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-text-secondary transition-colors duration-150 ease-standard hover:text-primary"
              >
                GitHub
              </a>
            </p>
          </div>

          {/* 两类能力概览：让访客在首屏同时看到数据与 AI */}
          <div aria-label="能力概览" className="hero-enter hero-delay-160 grid gap-4">
            {profileData.capabilityGroups.map((group) => (
              <article
                key={group.title}
                className="rounded-card border border-border bg-surface p-5 shadow-card"
              >
                <h2 className="text-card-title font-semibold text-text-primary">{group.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {group.description}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-tag bg-surface-soft px-2 py-1 text-tag text-text-secondary"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 2. 项目：一个列表，两个代表案例排在最前、篇幅更完整 */}
      <section className="border-b border-border bg-surface-soft">
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-text-muted">项目</p>
              <h2 className="mt-1 text-h2 font-semibold text-text-primary">
                数据、知识与应用的实际落地
              </h2>
            </div>
            <Link
              href="/projects"
              className="shrink-0 text-sm font-medium text-primary hover:text-primary-hover"
            >
              全部项目 →
            </Link>
          </div>

          {/* 两列网格：两个代表案例并排各占一列，其余四张两两成排，不留空档 */}
          <ul data-home-projects className="mt-7 grid gap-5 lg:grid-cols-2">
            {/* 代表案例：桌面并排、手机连续阅读 */}
            {representative.map((project) => {
              const card = CASE_CARDS[project.slug];
              return (
                <li
                  key={project.slug}
                  className="flex flex-col rounded-card border border-border bg-surface p-6 shadow-card sm:p-7"
                  data-featured="true"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-tag bg-accent-bg px-2 py-0.5 text-tag text-accent-text">
                      {typeLabel(project.meta)}
                    </span>
                    <span className="rounded-tag bg-surface-soft px-2 py-0.5 text-tag text-text-secondary">
                      {card.stage}
                    </span>
                  </div>
                  <h3 className="mt-3 text-card-title font-semibold leading-tight text-text-primary">
                    {project.meta.title}
                  </h3>

                  <dl className="mt-4 flex-1 space-y-3 text-sm leading-relaxed">
                    <div>
                      <dt className="font-medium text-text-primary">业务问题</dt>
                      <dd className="mt-1 text-text-secondary">{card.problem}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-text-primary">我的工作</dt>
                      <dd className="mt-1 text-text-secondary">{card.work}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-text-primary">交付结果</dt>
                      <dd className="mt-1 text-text-secondary">{card.result}</dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.meta.techStack.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-tag bg-surface-soft px-2 py-1 text-tag text-text-secondary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="mt-5 text-sm font-medium text-primary hover:text-primary-hover"
                  >
                    查看案例详情 →
                  </Link>
                </li>
              );
            })}

            {/* 其余交付：同一组字段，篇幅更短 */}
            {MORE_DELIVERIES.map((item) => (
              <li
                key={item.title}
                className="flex flex-col rounded-card border border-border bg-surface p-5 shadow-card transition duration-150 ease-standard hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-card-title font-semibold text-text-primary">{item.title}</h3>
                  <span className="rounded-tag bg-surface-soft px-2 py-0.5 text-tag text-text-secondary">
                    {item.stage}
                  </span>
                </div>
                <dl className="mt-4 flex-1 space-y-3 text-sm leading-relaxed">
                  <div>
                    <dt className="font-medium text-text-primary">业务问题</dt>
                    <dd className="mt-1 text-text-secondary">{item.problem}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-text-primary">我的工作</dt>
                    <dd className="mt-1 text-text-secondary">{item.work}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-text-primary">交付结果</dt>
                    <dd className="mt-1 text-text-secondary">{item.result}</dd>
                  </div>
                </dl>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-tag bg-surface-soft px-2 py-1 text-tag text-text-secondary"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <Link
                  href={item.href}
                  className="mt-5 text-sm font-medium text-primary hover:text-primary-hover"
                >
                  查看详情 →
                </Link>
              </li>
            ))}

            {/* 演示说明作为网格里的补充说明，不是项目条目 */}
            {dashboards.map((dashboard) => (
              <li key={dashboard.slug} aria-hidden="true" data-note="true" className="lg:col-span-2">
                <p className="text-sm text-text-muted">
                  {dashboard.meta.title}的公开截图为脱敏重建的演示版本，用于说明指标组织与分析路径。
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Agent 工作方式 */}
      <section className="border-b border-border bg-surface-soft">
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <div className="rounded-card border border-border bg-surface p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-text-muted">工作方式</p>
                <h2 className="mt-1 text-h2 font-semibold text-text-primary">
                  {profileData.agentWorkflow.title}
                </h2>
              </div>
              <Link
                href={AGENT_WORKFLOW_HREF}
                className="text-sm font-medium text-primary hover:text-primary-hover"
              >
                了解我的工作方式 →
              </Link>
            </div>
            <p className="mt-4 max-w-3xl text-body leading-body text-text-secondary">
              {profileData.agentWorkflow.summary}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {profileData.agentWorkflow.capabilities.map((capability) => (
                <li
                  key={capability.title}
                  className="rounded-tag border border-border px-3 py-1 text-sm text-text-secondary"
                >
                  {capability.title}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-text-secondary">
              <span className="font-medium text-text-primary">
                一个实例：{profileData.agentWorkflow.example.title}。
              </span>{" "}
              把数据契约影响检查、发布前检查等重复步骤整理为项目专用 Skill，用 AGENTS.md 限定修改范围，
              再通过测试与数据对账验证结果，是否发布由我判断。
            </p>
          </div>
        </div>
      </section>

      {/* 5. 精选实践：数据侧两篇、AI 侧两篇 */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-text-muted">精选实践</p>
              <h2 className="mt-1 text-h2 font-semibold text-text-primary">
                工程记录与问题复盘
              </h2>
            </div>
            <Link
              href="/notes"
              className="shrink-0 text-sm font-medium text-primary hover:text-primary-hover"
            >
              全部笔记 →
            </Link>
          </div>
          <p className="mt-3 text-sm text-text-muted">
            人工挑选，数据侧与 AI 侧各两篇，不按发布日期自动排序。
          </p>
          <ol className="mt-6 divide-y divide-border border-y border-border">
            {notes.map((note) => (
              <li key={note.slug}>
                <Link
                  href={`/notes/${note.slug}`}
                  className="grid gap-1 py-4 transition-colors hover:bg-surface-soft sm:grid-cols-[7rem_9rem_1fr_auto] sm:items-center sm:gap-4"
                >
                  <time className="text-sm text-text-muted">{note.meta.publishedAt}</time>
                  <span className="text-sm text-text-secondary">{note.meta.category}</span>
                  <span className="font-medium text-text-primary">{note.meta.title}</span>
                  <span className="text-sm text-text-muted">{note.readingTime} 分钟</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. 经历与联系 */}
      <section>
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <p className="text-sm text-text-muted">经历</p>
          <h2 className="mt-1 text-h2 font-semibold text-text-primary">简短经历</h2>
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {profileData.workExperiences.map((experience) => (
              <li
                key={`${experience.company}-${experience.role}`}
                className="grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-4"
              >
                <p className="text-sm text-text-primary">
                  <span className="font-medium">{experience.company}</span>
                  <span className="text-text-secondary">｜{experience.role}</span>
                </p>
                <p className="text-sm text-text-muted">
                  {experience.period.start} — {experience.period.end ?? "至今"}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-10 border-t-2 border-accent-border pt-10 text-center">
            <h3 className="text-h3 font-semibold text-text-primary">
              {profileData.profile.availability}
            </h3>
            <p className="mt-2 text-text-secondary">
              数据工程、数仓与治理，或 AI 应用与 Agent 工程方向的机会均可沟通。
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="/resume/jin-zaiwei-resume.pdf" download
                className="rounded-button bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 ease-standard hover:bg-primary-hover"
              >
                下载简历
              </a>
              <a
                href="mailto:454313544@qq.com"
                className="rounded-button border border-border px-4 py-2.5 text-sm font-medium text-text-primary transition-colors duration-150 ease-standard hover:bg-surface-soft"
              >
                邮件联系
              </a>
              <a
                href="https://github.com/sq454313544"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-button border border-border px-4 py-2.5 text-sm font-medium text-text-primary transition-colors duration-150 ease-standard hover:bg-surface-soft"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
