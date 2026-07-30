import { z } from "zod";

export interface Profile {
  name: string;
  headline: string;
  summary: string;
  location: string;
  availability: string;
}

export interface KeyProjectRef {
  title: string;
  href?: string;
}

export interface WorkExperience {
  company: string;
  role: string;
  location: string;
  period: { start: string; end: string | null };
  responsibilities: string[];
  keyProjects: KeyProjectRef[];
  stack: string[];
}

export interface SkillGroup {
  title: string;
  boundaries: string;
}

export interface TechGroup {
  title: string;
  items: string[];
}

export interface Contact {
  label: string;
  href: string;
}

export interface SiteHighlight {
  label: string;
  value: string;
  unit?: string;
  emphasis?: "primary" | "standard" | "quiet";
}

export interface EducationEntry {
  school: string;
  degree: string;
  period: { start: string; end: string };
  notes?: string;
}

export interface ProjectHighlightRef {
  title: string;
  role: string;
  href?: string;
  details: string[];
}

const profileDataSchema = z.object({
  profile: z.object({
    name: z.string(),
    headline: z.string(),
    summary: z.string(),
    location: z.string(),
    availability: z.string(),
  }),
  heroSkills: z.array(z.string()),
  siteHighlights: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      unit: z.string().optional(),
      emphasis: z.enum(["primary", "standard", "quiet"]).optional(),
    }),
  ),
  workExperiences: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      location: z.string(),
      period: z.object({ start: z.string(), end: z.string().nullable() }),
      responsibilities: z.array(z.string()).min(1),
      keyProjects: z.array(
        z.object({ title: z.string(), href: z.string().optional() }),
      ),
      stack: z.array(z.string()),
    }),
  ),
  skills: z.array(
    z.object({ title: z.string(), boundaries: z.string() }),
  ),
  toolsAndTech: z.array(
    z.object({ title: z.string(), items: z.array(z.string()) }),
  ),
  interests: z.array(z.string()),
  contacts: z.array(z.object({ label: z.string(), href: z.string() })),
  resumeSummary: z.array(z.string()).min(1),
  education: z.array(
    z.object({
      school: z.string(),
      degree: z.string(),
      period: z.object({ start: z.string(), end: z.string() }),
      notes: z.string().optional(),
    }),
  ),
  certifications: z.array(
    z.object({ name: z.string(), issuer: z.string(), year: z.string() }),
  ),
  projectHighlights: z.array(
    z.object({
      title: z.string(),
      role: z.string(),
      href: z.string().optional(),
      details: z.array(z.string()).min(1),
    }),
  ),
});

export const profileData = profileDataSchema.parse({
  profile: {
    name: "金仔伟",
    headline: "数据产品工程师｜Power BI｜AI 数据应用｜数据工程",
    location: "长沙",
    availability: "在职，考虑机会",
    summary:
      "具备数据产品、Power BI 与 AI 数据应用的端到端交付经验，能够从业务问题出发，完成需求拆解、指标口径梳理、数据建模、BI 语义模型建设、智能问数产品设计及工程落地。当前负责不良资产法律业务的数据仓库、经营分析看板和企业智能问数助手建设，已打通“业务 MySQL → 数据加工与治理 → Power BI / AI Agent”完整链路。",
  },
  heroSkills: [
    "数据产品",
    "Power BI",
    "AI 数据应用",
    "数据工程",
    "SQL",
    "Python",
  ],
  siteHighlights: [
    { label: "数据资产", value: "276", unit: "张表 / 视图", emphasis: "standard" },
    { label: "DAX 度量值", value: "150", unit: "个", emphasis: "quiet" },
    { label: "智能问数自动化测试", value: "246", unit: "项", emphasis: "standard" },
    { label: "智能问数 Recall", value: "39.22% → 82.35%", emphasis: "primary" },
  ],
  workExperiences: [
    {
      company: "湖南昂承律师事务所",
      role: "数据分析师",
      location: "长沙",
      period: { start: "2026.04", end: null },
      responsibilities: [
        "负责案件、回款、催记、调解、开庭及执行等主题的数据产品建设，完成从业务需求、指标口径、数据模型到看板和智能问数应用的端到端交付。",
        "建设统一数据仓库及自动化处理链路，推动业务源数据、Excel 补充数据与下游分析应用从分散直连转向分层治理和统一消费。",
        "主导 Power BI 新数仓切源及语义模型重构，持续交付案件总览、流程监控、回款分析、人员绩效和运营日报等经营分析看板。",
        "设计并开发企业智能问数助手，实现企业微信和 Web 双入口的指标查询、案件明细、口径解释、上下文追问及结果导出。",
        "建立数据字典、枚举字典、SQL/ETL 规范和指标/维度/明细数据契约，并通过只读查询、AST 校验、RLS、审计日志等机制控制数据访问风险。",
        "将 Git、编程 Agent、自动化测试、发布清单和回滚方案纳入日常研发流程，完成测试环境端到端验收并持续进行稳定性与性能加固。",
      ],
      keyProjects: [
        { title: "企业数据仓库建设", href: "/projects/data-warehouse-modernization" },
        { title: "Power BI 经营分析平台重构" },
        { title: "企业智能问数助手", href: "/projects/enterprise-qa-assistant" },
      ],
      stack: [
        "Power BI",
        "DAX",
        "Python",
        "FastAPI",
        "LangGraph",
        "MCP",
        "MySQL",
        "DataX",
        "dbt",
        "Airflow",
      ],
    },
    {
      company: "长沙恒顺智慧信息科技有限公司",
      role: "数据专员",
      location: "长沙",
      period: { start: "2024.11", end: "2026.02" },
      responsibilities: [
        "负责交易额、配送费、签约门店数等核心指标监控，按城市、门店和时间维度定位业务波动并输出经营分析结论。",
        "使用 Power Query 与 Python 自动化重复数据处理流程，将处理效率提升约 60%，降低人工整理和口径错误。",
        "定期输出经营分析报告，为业务团队提供运营优化和异常处理建议。",
      ],
      keyProjects: [],
      stack: ["Power Query", "Python", "Power BI", "SQL"],
    },
    {
      company: "北京途游科技有限公司",
      role: "游戏测试工程师",
      location: "长沙",
      period: { start: "2021.04", end: "2023.12" },
      responsibilities: [
        "负责游戏版本功能、性能和网络专项测试，分析缺陷影响范围并推动问题闭环。",
        "验证数值与系统逻辑，维护版本和配置文件，积累需求理解、产品质量、流程协作和交付验收经验。",
      ],
      keyProjects: [],
      stack: ["功能测试", "性能测试", "网络测试", "质量保障"],
    },
  ],
  skills: [
    {
      title: "数据产品与 BI",
      boundaries:
        "Power BI、DAX、Power Query、TMDL/PBIP、星型模型、计算组、指标体系、经营分析、产品方案与验收设计。",
    },
    {
      title: "AI 数据应用",
      boundaries:
        "Python、FastAPI、LangGraph、MCP、Registry First、Redis、SSE、企业微信 WebSocket、自然语言问数与上下文追问。",
    },
    {
      title: "数据工程与治理",
      boundaries:
        "SQL、MySQL、DataX、dbt、Airflow、Docker、分层建模、数据质量、数据字典、数据契约、调度与血缘。",
    },
  ],
  toolsAndTech: [
    {
      title: "数据产品与 BI",
      items: [
        "Power BI",
        "DAX",
        "Power Query",
        "TMDL / PBIP",
        "星型模型",
        "计算组",
        "指标体系",
      ],
    },
    {
      title: "AI 数据应用",
      items: [
        "Python",
        "FastAPI",
        "LangGraph",
        "MCP",
        "Registry First",
        "Redis",
        "SSE",
        "企业微信 WebSocket",
      ],
    },
    {
      title: "数据工程与治理",
      items: [
        "SQL",
        "MySQL",
        "DataX",
        "dbt",
        "Airflow",
        "Docker",
        "数据契约",
        "调度与血缘",
      ],
    },
    {
      title: "AI 辅助研发",
      items: [
        "Codex",
        "OpenCode",
        "Git diff",
        "人工审查",
        "自动化测试",
        "发布清单",
        "回滚机制",
      ],
    },
  ],
  interests: ["数据产品", "Power BI", "AI 数据应用", "数据工程", "智能问数"],
  contacts: [
    { label: "454313544@qq.com", href: "mailto:454313544@qq.com" },
    { label: "GitHub", href: "https://github.com/sq454313544" },
  ],
  resumeSummary: [
    "具备数据产品、Power BI 与 AI 数据应用的端到端交付经验，能够从业务问题出发，完成需求拆解、指标口径梳理、数据建模、BI 语义模型建设、智能问数产品设计及工程落地。当前负责不良资产法律业务的数据仓库、经营分析看板和企业智能问数助手建设，已打通“业务 MySQL → 数据加工与治理 → Power BI / AI Agent”完整链路。",
    "熟练使用 Codex、OpenCode 等编程 Agent 辅助需求分析、方案设计、代码实现、测试验证、代码审查和文档沉淀，并通过 Git diff、人工审查、自动化测试及回滚机制控制交付质量。",
  ],
  education: [
    {
      school: "湖南机电职业技术学院",
      degree: "移动应用开发（Java Web 方向）｜大专",
      period: { start: "2017.09", end: "2020.06" },
    },
  ],
  certifications: [],
  projectHighlights: [
    {
      title: "企业数据仓库建设",
      role: "数据建模 / 数据治理 / 自动化调度",
      href: "/projects/data-warehouse-modernization",
      details: [
        "梳理 143 张业务源表，通过 DataX 同步 102 张可用表，使用 dbt 建设 raw、stg、core、dws、ads 五层模型，形成 276 张表/视图的数据资产。",
        "围绕案件、进展、审查、开庭、执行、回款和催记等主题建设事实表、维度表及应用汇总层，统一 Power BI 与智能问数助手的数据消费口径。",
        "使用 Airflow 编排数据同步、dbt 建模与测试、中文注释同步和数据新鲜度写入，并建立数据契约检查及运行健康检查机制。",
      ],
    },
    {
      title: "Power BI 经营分析平台重构",
      role: "数据产品 / BI 建模 / 可视化",
      details: [
        "完成 Power BI 从旧数仓及业务表直连模式切换至统一数据层，重构星型模型、关系主路径和日期角色，减少口径分散及维护成本。",
        "统一管理 150 个 DAX 度量值和 1 个计算组，按业务领域组织指标，并推动可复用计算逻辑优先下沉数据层。",
        "交付案件总览、地区法院、案件流程、还款监控、人员看板、达标追踪和运营日报等 10 页正式看板，并通过数据状态卡展示数据日期、ETL 和 BI 刷新状态。",
      ],
    },
    {
      title: "企业智能问数助手",
      role: "产品设计 / 架构设计 / 核心开发",
      href: "/projects/enterprise-qa-assistant",
      details: [
        "基于 FastAPI、LangGraph 和 MCP 构建企业微信与 Web 双入口，支持自然语言指标查询、案件明细、指标解释、上下文追问、流式响应和结果导出。",
        "采用 Registry First 管理 16 个业务指标及维度、明细映射，结合只读账号、参数校验、SQL AST、白名单、RLS、行数限制和审计日志实现受控查询。",
        "构建 51 条离线评估集，将检索 Recall 从 39.22% 提升至 82.35%、MRR 从 0.412 提升至 0.833；进一步完善版本化元数据、请求追踪、查询预算、消息去重、并发与慢查询监控，全量自动化测试达到 246 项通过。",
      ],
    },
  ],
});
