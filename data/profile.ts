import { z } from "zod";

export interface Profile {
  name: string;
  /** 站点标识，用于页头与页脚 */
  siteIdentity: string;
  headline: string;
  subtitle: string;
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
  summary: string;
  responsibilities: string[];
  keyProjects: KeyProjectRef[];
  stack: string[];
}

export interface SkillGroup {
  title: string;
  summary: string;
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

/** 首屏两类能力概览：数据工程与治理、AI 应用与 Agent 工程 */
export interface CapabilityGroup {
  title: string;
  description: string;
  items: string[];
}

/** 首页与关于页共用的 Agent 工作方式能力条目 */
export interface AgentCapability {
  title: string;
  description: string;
}

export interface AgentWorkflow {
  title: string;
  summary: string;
  resumeSummary: string[];
  capabilities: AgentCapability[];
  example: { title: string; paragraph: string };
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
    siteIdentity: z.string(),
    headline: z.string(),
    subtitle: z.string(),
    summary: z.string(),
    location: z.string(),
    availability: z.string(),
  }),
  heroSkills: z.array(z.string()),
  capabilityGroups: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      items: z.array(z.string()).min(1),
    }),
  ).min(2),
  agentWorkflow: z.object({
    title: z.string(),
    summary: z.string(),
    resumeSummary: z.array(z.string()).min(1),
    capabilities: z.array(
      z.object({ title: z.string(), description: z.string() }),
    ).min(1),
    example: z.object({ title: z.string(), paragraph: z.string() }),
  }),
  workExperiences: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      location: z.string(),
      period: z.object({ start: z.string(), end: z.string().nullable() }),
      summary: z.string().min(1),
      responsibilities: z.array(z.string()).min(1),
      keyProjects: z.array(
        z.object({ title: z.string(), href: z.string().optional() }),
      ),
      stack: z.array(z.string()),
    }),
  ),
  skills: z.array(
    z.object({ title: z.string(), summary: z.string().min(1), boundaries: z.string() }),
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
    siteIdentity: "金仔伟 · 数据与 AI",
    headline: "数据工程与 AI 应用",
    subtitle: "数仓建设 · 数据治理 · 智能问数 · 知识库 · Agent 工作流",
    location: "长沙",
    availability: "在职，考虑机会",
    summary:
      "我负责企业数仓建设、经营看板和报表自动化，同时开发智能问数与知识库助手。这里记录我的项目实践、技术笔记，以及使用 Agent 辅助开发的经验和复盘。",
  },
  heroSkills: [
    "数仓建模",
    "多源采集与调度",
    "数据治理与对账",
    "智能问数",
    "知识库与检索",
    "Agent 工作流",
  ],
  capabilityGroups: [
    {
      title: "数据工程与治理",
      description:
        "把业务库与外部来源接入统一链路，按分层建模固定口径，用测试、新鲜度与发布门保证批次可消费。",
      items: ["DataX 同步 102 张表", "raw → stg → core → ads 分层", "口径注册表与数据契约"],
    },
    {
      title: "AI 应用与 Agent 工程",
      description:
        "做受控查询与知识库问答：模型只选能力与参数，取数由注册定义生成并校验；回答带可追溯出处与回退链路。",
      items: ["LangGraph 编排与 MCP 工具", "只读账号、参数与行级权限", "离线评测、确定性回放与审计"],
    },
  ],
  agentWorkflow: {
    title: "Agent 工作流：研发工作方式",
    summary:
      "使用 Codex、OpenCode、DeepSeek Harness 辅助需求拆解、开发、评审与排障。结合 AGENTS.md 约束、可复用 Skills、MCP 与插件组织上下文和工具访问，通过代码审查、自动化测试与数据对账验证交付结果。",
    resumeSummary: [
      "使用 Codex、OpenCode、DeepSeek Harness 辅助需求拆解、开发、评审与排障。",
      "将项目检查沉淀为 Skills，用 AGENTS.md 明确工程约束，结合 MCP 与插件接入工具，并通过测试、代码审查和数据对账验收结果。",
    ],
    capabilities: [
      {
        title: "任务组织与上下文",
        description:
          "把需求拆成可检查的步骤，提供项目说明、数据口径和相关代码，记录阶段结论以便继续推进。",
      },
      {
        title: "Skills 与流程沉淀",
        description:
          "按任务选择并适配技能，把数据契约影响检查、发布前检查等重复流程整理为可复用的项目步骤。",
      },
      {
        title: "AGENTS.md 约束与工具集成",
        description:
          "用 AGENTS.md 明确修改范围、数据保护和生产边界，通过 MCP 与插件连接数据库、检索和文档工具。",
      },
      {
        title: "验证与持续改进",
        description:
          "检查 Diff、测试结果、数据对账和页面行为，把发现的问题补回规则或检查流程，形成下一轮约束。",
      },
    ],
    example: {
      title: "把重复检查整理成可复用 Skill",
      paragraph:
        "在数仓与知识库项目中，我把数据契约影响检查、发布前检查等重复步骤整理为项目专用 Skills，并用 AGENTS.md 限定修改范围与数据保护要求。开发时按任务选用数据库、代码检索与文档工具，在 Codex 与 DeepSeek Harness 之间复用技能时核对来源与内容差异；结果再通过测试和数据对账检查，关键口径与是否发布由我判断。",
    },
  },
  workExperiences: [
    {
      company: "湖南昂承律师事务所",
      role: "数据分析师",
      location: "长沙",
      period: { start: "2026.04", end: null },
      summary: "负责数仓建设、数据治理与业务交付，开发智能问数和知识库助手。",
      responsibilities: [
        "建设统一数据仓库：梳理业务源数据接入范围，用 DataX 完成同步、dbt 建设 raw、stg、core、ads 主链路与按需 dws 模型，并通过 Airflow 编排调度；当前在本机环境运行，日常走每日全量刷新，增量链路的设计已实现并保留待恢复。",
        "负责多源采集与调度整合：把业务库、补充数据与外部来源收敛到统一链路，处理跨源人员与坐席映射、汇总行与个人明细不可混算、快照与历史沉淀等问题。",
        "推进数据质量与口径治理：设计全量与增量协同刷新机制，建立业务口径注册表、数据契约、质量检查与发布门，并维护数据字典与运行健康监控。",
        "交付企业微信经营看板与业务报表：把三条经营线接入企业微信智能表格并完成自动同步与对账；维护周报、月报、运营日报口径，建设 SQL 结果到报表模板的自动填表与逐格对账流程。",
        "开发 AI 数据应用：完成企业智能问数助手的受控查询与权限边界设计，并负责企业知识库助手的员工问答、资料发布与出处引用定制及作业系统单点登录集成。",
      ],
      keyProjects: [
        { title: "企业数据仓库建设", href: "/projects/data-warehouse-modernization" },
        { title: "企业智能问数助手", href: "/projects/enterprise-qa-assistant" },
        { title: "企业知识库助手", href: "/projects/enterprise-knowledge-assistant" },
      ],
      stack: [
        "SQL",
        "MySQL",
        "DataX",
        "dbt",
        "Airflow",
        "Python",
        "Docker",
        "企业微信智能表格",
        "FastAPI",
        "LangGraph",
      ],
    },
    {
      company: "长沙恒顺智慧信息科技有限公司",
      role: "数据专员",
      location: "长沙",
      period: { start: "2024.11", end: "2026.02" },
      summary: "负责经营指标监控与分析，用 Power Query 和 Python 自动化重复数据处理。",
      responsibilities: [
        "负责交易额、配送费、签约门店数等核心指标监控，按城市、门店和时间维度定位业务波动并输出经营分析结论。",
        "使用 Power Query 与 Python 自动化重复数据处理流程，减少人工整理与口径错误。",
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
      summary: "负责功能、性能与网络测试，积累缺陷定位、质量保障和交付验收经验。",
      responsibilities: [
        "负责游戏版本功能、性能和网络专项测试，分析缺陷影响范围并推动问题闭环。",
        "验证数值与系统逻辑，维护版本和配置文件，积累需求理解、流程协作和交付验收经验。",
      ],
      keyProjects: [],
      stack: ["功能测试", "性能测试", "网络测试", "质量保障"],
    },
  ],
  skills: [
    {
      title: "数据工程与治理",
      summary:
        "接入分散的数据，建设数仓与指标口径，用调度、质量检查和对账保障业务取数。主要使用 SQL、MySQL、DataX、dbt 与 Airflow。",
      boundaries:
        "SQL、MySQL、分层建模与维度建模、DataX、dbt、Airflow、Docker、全量与增量协同刷新、调度依赖、指标口径与业务口径注册表、数据契约、质量检查与发布门、对账与差异归因、数据字典与运行健康。",
    },
    {
      title: "AI 应用与 Agent 工程",
      summary:
        "开发智能问数与知识库助手，处理工具调用、权限、检索出处、评测与失败回退。主要使用 Python、FastAPI、LangGraph 与 MCP。",
      boundaries:
        "Python、FastAPI、LangGraph、MCP、工具调用与能力注册、受控查询与权限边界、检索与出处引用、知识库发布与撤回治理、离线评测与确定性回放、失败回退与审计。",
    },
    {
      title: "BI 与业务交付",
      summary:
        "把数据资产转成经营看板和业务报表，交付 Power BI、企业微信智能表格与报表自动化，并验证指标和结果。",
      boundaries:
        "Power BI、DAX、Power Query、TMDL / PBIP、星型模型与计算组、企业微信智能表格看板、周月报与业务取数、报表模板自动填表与逐格对账。",
    },
  ],
  toolsAndTech: [
    {
      title: "数仓与数据工程",
      items: [
        "SQL",
        "MySQL",
        "DataX",
        "dbt",
        "Airflow",
        "Docker",
        "Python",
      ],
    },
    {
      title: "治理与质量",
      items: [
        "业务口径注册表",
        "数据契约",
        "数据字典",
        "质量检查与发布门",
        "对账与差异归因",
      ],
    },
    {
      title: "BI 与业务交付",
      items: [
        "Power BI",
        "DAX",
        "Power Query",
        "TMDL / PBIP",
        "星型模型",
        "企业微信智能表格看板",
      ],
    },
    {
      title: "AI 应用与工作流",
      items: [
        "FastAPI",
        "LangGraph",
        "MCP",
        "受控查询与 RLS",
        "检索与出处引用",
        "AGENTS.md / Skills",
      ],
    },
  ],
  interests: ["数据工程", "数据治理", "数仓建模", "AI 数据应用", "智能问数"],
  contacts: [
    { label: "454313544@qq.com", href: "mailto:454313544@qq.com" },
    { label: "GitHub", href: "https://github.com/sq454313544" },
  ],
  resumeSummary: [
    "约 2 年数据岗位经验（数据专员 → 数据分析师）。目前负责不良资产法律业务的企业数仓建设、经营看板和报表自动化，同时开发智能问数与知识库助手，并使用 Agent 辅助开发。此前从事游戏测试，积累了问题定位与交付验收经验。",
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
      title: "企业数据仓库与治理",
      role: "数仓建模 / 数据治理 / 自动化调度",
      href: "/projects/data-warehouse-modernization",
      details: [
        "梳理业务源表接入范围，通过 DataX 同步 102 张可用表，用 dbt 建设 raw、stg、core、ads 主链路与按需 dws 模型，形成接近 300 张表 / 视图的数据资产（2026-09 快照口径）。",
        "用 Airflow 编排刷新，通过水位线、任务互斥、dbt 测试与发布门保障批次一致性。当前在本机环境运行、日常全量刷新，增量链路保留待恢复；服务器部署属历史阶段。",
        "对外交付企业微信经营看板三条线、周月报取数与「SQL 结果到 Word 周报」自动填表与逐格对账。",
      ],
    },
    {
      title: "企业智能问数助手",
      role: "产品设计 / 架构设计 / 核心开发",
      href: "/projects/enterprise-qa-assistant",
      details: [
        "基于 FastAPI、LangGraph 与 MCP 构建企业微信和 Web 双入口，按 Kernel、Plugin、Capability、MCP 分层组织指标查询、受控明细、上下文追问与结果导出。",
        "模型只选择已注册能力并输出结构化参数，取数由注册定义生成并校验后执行；配合只读账号、行级权限与审计日志控制访问边界。",
        "51 条离线检索评估集将阶段性 Recall 从 39.22% 提升至 82.35%（离线检索演进，非真实业务效果；受控内部验证阶段）。",
      ],
    },
    {
      title: "企业知识库助手",
      role: "定制开发 / 发布治理 / 身份集成",
      href: "/projects/enterprise-knowledge-assistant",
      details: [
        "基于开源 WeKnora 定制员工问答与资料发布流程，建立原文版本、发布批次、撤回与新版替代机制，回答按已发布资料给出处；对接作业系统一次性票据单点登录并完成核心链路验证（内部验证阶段）。",
      ],
    },
    {
      title: "企业微信经营看板",
      role: "数据接入 / 指标汇总 / 同步与对账",
      href: "/projects/data-warehouse-modernization#wecom-dashboards",
      details: [
        "基于企业微信智能表格交付立案与回款趋势、项目维度过程指标、人员过程数据三条看板，覆盖日粒度建模、周月汇总与项目批次两级分组。",
        "把人工导出替换为自动采集与定时同步，补充重复键检查、失效数据处理、依赖预检、失败告警与回读对账。",
      ],
    },
    {
      title: "Power BI 经营分析平台（历史交付）",
      role: "从零搭建 / BI 建模 / 指标治理",
      details: [
        "从零搭建经营分析平台（2026-05 起），基于旧数仓数据设计语义模型并开发报表；2026-06 完成核心表重建与自建数仓切源，随后优化星型模型、关系主路径与日期角色；2026-07 完成 8 页报表、135 个视觉对象的迁移复刻。",
        "统一管理 150 个 DAX 度量与 1 个计算组，交付案件总览、地区法院、案件流程、还款监控、人员看板与运营日报等 10 个正式看板页；该平台已于 2026-09 停止维护，作为历史交付保留。",
      ],
    },
  ],
});
