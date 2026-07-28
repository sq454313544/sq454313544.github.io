import { z } from "zod";

export interface Profile {
  name: string;
  headline: string;
  summary: string;
  location?: string;
}

export interface KeyProjectRef {
  title: string;
  href?: string;
}

export interface WorkExperience {
  company: string;
  role: string;
  period: { start: string; end: string | null };
  background: string;
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
  description: string;
}

const profileDataSchema = z.object({
  profile: z.object({
    name: z.string(),
    headline: z.string(),
    summary: z.string(),
    location: z.string().optional(),
  }),
  heroSkills: z.array(z.string()),
  siteHighlights: z.array(z.object({ label: z.string(), value: z.string(), unit: z.string().optional() })),
  workExperiences: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      period: z.object({ start: z.string(), end: z.string().nullable() }),
      background: z.string(),
      responsibilities: z.array(z.string()),
      keyProjects: z.array(z.object({ title: z.string(), href: z.string().optional() })),
      stack: z.array(z.string()),
    })
  ),
  skills: z.array(z.object({ title: z.string(), boundaries: z.string() })),
  toolsAndTech: z.array(z.object({ title: z.string(), items: z.array(z.string()) })),
  interests: z.array(z.string()),
  contacts: z.array(z.object({ label: z.string(), href: z.string() })),
  resumeSummary: z.string(),
  education: z.array(
    z.object({
      school: z.string(),
      degree: z.string(),
      period: z.object({ start: z.string(), end: z.string() }),
      notes: z.string().optional(),
    })
  ),
  certifications: z.array(z.object({ name: z.string(), issuer: z.string(), year: z.string() })),
  projectHighlights: z.array(
    z.object({ title: z.string(), role: z.string(), href: z.string().optional(), description: z.string() })
  ),
});

export const profileData = profileDataSchema.parse({
  profile: {
    name: "金仔伟",
    headline: "数据产品工程师 · BI / AI 数据应用",
    location: "长沙",
    summary:
      "具备数据产品、BI、数据工程与 AI 数据应用的端到端实践经验，擅长把业务问题转化为可验证、可维护的数据产品：从指标口径与建模、Power BI 语义模型，到受控的智能问数与工程化交付。",
  },
  heroSkills: ["数据产品", "Power BI", "数据工程", "智能问数", "SQL", "Python"],
  siteHighlights: [
    { label: "核心项目", value: "2", unit: "个" },
    { label: "数据资产", value: "250+", unit: "张表 / 视图" },
    { label: "智能问数项目测试", value: "100+", unit: "条" },
    { label: "智能问数 Recall", value: "40% → 80%+" },
  ],
  workExperiences: [
    {
      company: "专业服务行业数据团队",
      role: "数据分析师",
      period: { start: "2026.04", end: null },
      background:
        "负责数据平台、经营分析与智能问数相关建设，服务运营监控、流程分析、绩效分析和数据自助需求。",
      responsibilities: [
        "梳理指标口径、数据链路与消费边界，将业务问题拆解为可交付的数据产品能力。",
        "建设数据同步、分层建模、质量检查与调度链路，为 BI 和 AI 数据应用提供统一数据底座。",
        "设计受控智能问数能力，围绕检索、查询校验、权限与审计完善可靠性边界。",
      ],
      keyProjects: [
        { title: "企业智能问数助手", href: "/projects/enterprise-qa-assistant" },
        { title: "数据仓库重构与治理平台", href: "/projects/data-warehouse-modernization" },
      ],
      stack: ["Python", "SQL", "Power BI", "LangGraph", "dbt", "Airflow"],
    },
    {
      company: "本地生活与运营服务团队",
      role: "数据专员",
      period: { start: "2024.11", end: "2026.02" },
      background:
        "面向经营团队提供指标监控和专题分析，支持城市、门店与时间维度的经营问题定位。",
      responsibilities: [
        "梳理交易、履约和门店运营等核心指标，输出可追溯的经营分析结论。",
        "使用 Power Query 与 Python 自动化重复数据处理流程，降低人工整理与口径偏差。",
      ],
      keyProjects: [],
      stack: ["Power BI", "Power Query", "Python", "SQL"],
    },
    {
      company: "互联网产品团队",
      role: "游戏测试工程师",
      period: { start: "2021.04", end: "2023.12" },
      background:
        "负责产品版本的功能、性能与网络专项测试，积累需求理解、质量保障和交付验收经验。",
      responsibilities: [
        "分析缺陷影响范围并推动问题闭环，协作保障版本交付质量。",
        "验证数值与系统逻辑，维护测试过程中的版本与配置记录。",
      ],
      keyProjects: [],
      stack: ["功能测试", "性能测试", "质量保障", "产品协作"],
    },
  ],
  skills: [
    {
      title: "数据产品与 BI",
      boundaries: "从业务问题、指标定义到 Power BI 语义模型和交付路径，建立可验证、可迭代的数据产品方案。",
    },
    {
      title: "AI 数据应用",
      boundaries: "围绕意图路由、受控检索、自然语言问数与结果解释，明确 AI 能力的可靠应用边界。",
    },
    {
      title: "数据工程底座",
      boundaries: "通过分层建模、数据契约、质量检查、调度与血缘，提升数据资产的可信度和复用性。",
    },
    {
      title: "AI 辅助研发",
      boundaries: "将 Agent 用于需求拆解、实现、测试和审查，并通过人工复核、自动化测试与回滚控制交付质量。",
    },
  ],
  toolsAndTech: [
    { title: "数据与分析", items: ["Power BI", "DAX", "Power Query", "TMDL/PBIP", "指标治理"] },
    { title: "AI 数据应用", items: ["Python", "FastAPI", "LangGraph", "MCP", "RAG"] },
    { title: "数据工程", items: ["SQL", "MySQL", "DataX", "dbt", "Airflow", "Docker"] },
    { title: "工程质量", items: ["Git", "自动化测试", "代码审查", "发布与回滚"] },
  ],
  interests: ["数据产品", "指标治理", "智能问数", "RAG 工程", "技术复盘"],
  contacts: [
    { label: "454313544@qq.com", href: "mailto:454313544@qq.com" },
    { label: "GitHub", href: "https://github.com/sq454313544" },
  ],
  resumeSummary:
    "数据产品工程师，具备数据分析、Power BI、数据工程与 AI 数据应用实践经验，擅长在业务目标和工程可行性之间建立清晰、可维护的交付路径。",
  education: [
    {
      school: "湖南机电职业技术学院",
      degree: "移动应用开发（Java Web 方向）· 大专",
      period: { start: "2017.09", end: "2020.06" },
    },
  ],
  certifications: [],
  projectHighlights: [
    {
      title: "企业智能问数助手",
      role: "产品设计 / 架构设计 / 核心开发",
      href: "/projects/enterprise-qa-assistant",
      description: "围绕自然语言指标查询、明细查询、上下文追问与结果导出，设计受控检索、查询校验、权限与审计边界。",
    },
    {
      title: "数据仓库重构与治理平台",
      role: "数据产品 / 数据建模 / 治理建设",
      href: "/projects/data-warehouse-modernization",
      description: "以源数据同步、五层建模、数据契约、质量检查与调度治理为主线，为 BI 与 AI 数据应用提供统一的数据消费边界。",
    },
  ],
});
