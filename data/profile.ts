export interface Profile {
  name: string;
  headline: string;
  summary: string;
  location?: string;
}

export interface KeyProjectRef {
  title: string;
  href: string;
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

export interface EducationEntry {
  school: string;
  degree: string;
  period: { start: string; end: string };
  notes?: string;
}

export interface ProjectHighlightRef {
  title: string;
  role: string;
  href: string;
  description: string;
}

const profileDataSchema = z.object({
  profile: z.object({
    name: z.string(),
    headline: z.string(),
    summary: z.string(),
    location: z.string().optional(),
  }),
  workExperiences: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      period: z.object({ start: z.string(), end: z.string().nullable() }),
      background: z.string(),
      responsibilities: z.array(z.string()),
      keyProjects: z.array(z.object({ title: z.string(), href: z.string() })),
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
    z.object({ title: z.string(), role: z.string(), href: z.string(), description: z.string() })
  ),
});

export const profileData = profileDataSchema.parse({
  profile: {
    name: "数据产品工程师",
    headline: "BI / AI 数据应用",
    summary:
      "聚焦把业务问题转化为可验证的数据产品：从指标口径、BI 分析到 RAG 与工作流自动化，强调可用性、可解释性与长期维护。",
  },
  workExperiences: [
    {
      company: "数据产品与分析团队",
      role: "数据产品工程师",
      period: { start: "2023", end: null },
      background:
        "面向经营分析和数据自助需求，连接业务、数据与工程实施，持续完善分析链路和数据使用体验。",
      responsibilities: [
        "梳理指标口径与数据链路，将业务问题拆解为可交付的数据产品能力。",
        "建设 BI 分析与数据自助查询方案，降低重复取数和沟通成本。",
        "探索 RAG 与 Agent 工程在数据工作流中的可靠应用边界。",
      ],
      keyProjects: [
        { title: "企业智能问数助手", href: "/projects/enterprise-qa-assistant" },
        { title: "Agent 可观测性与监控看板", href: "/projects/agent-observability-dashboard" },
      ],
      stack: ["Python", "SQL", "Power BI", "LangGraph", "RAG"],
    },
  ],
  skills: [
    {
      title: "数据产品设计",
      boundaries: "从业务问题、指标定义到交付路径，建立可验证、可迭代的数据产品方案。",
    },
    {
      title: "BI 与经营分析",
      boundaries: "将多维经营数据组织为可读、可追溯的分析模型和决策看板。",
    },
    {
      title: "Agent / RAG 应用",
      boundaries: "关注检索质量、工作流编排与可观测性，避免把实验性能力包装为在线产品。",
    },
    {
      title: "数据建模与治理",
      boundaries: "围绕口径一致性、数据质量和复用边界，提升分析结果的可信度。",
    },
  ],
  toolsAndTech: [
    { title: "数据与分析", items: ["SQL", "Python", "Power BI", "指标治理"] },
    { title: "AI 数据应用", items: ["LangGraph", "RAG", "向量检索", "可观测性"] },
    { title: "工程实践", items: ["TypeScript", "Next.js", "Git", "Playwright"] },
  ],
  interests: ["数据产品", "指标治理", "智能问数", "RAG 工程", "技术复盘"],
  contacts: [],
  resumeSummary:
    "数据产品工程师，具备数据分析、BI 建设、指标治理与 AI 数据应用实践经验，擅长在业务目标和工程可行性之间建立清晰、可维护的交付路径。",
  education: [],
  certifications: [],
  projectHighlights: [
    {
      title: "企业智能问数助手",
      role: "数据产品与工程实现",
      href: "/projects/enterprise-qa-assistant",
      description: "以 LangGraph 与 RAG 为基础，组织自然语言查询、数据检索与 SQL 生成的工作流。",
    },
    {
      title: "Agent 可观测性与监控看板",
      role: "可观测性方案设计",
      href: "/projects/agent-observability-dashboard",
      description: "围绕调用链、Token 用量、错误率和性能指标建立生产监控视图。",
    },
  ],
});
import { z } from "zod";
