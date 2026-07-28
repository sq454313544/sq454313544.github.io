import Image from "next/image";

const covers = {
  "enterprise-qa-assistant": { src: "/covers/enterprise-qa-assistant.svg", alt: "智能问数项目的受控查询流程示意" },
  "data-warehouse-modernization": { src: "/covers/data-warehouse-modernization.svg", alt: "数据仓库分层与治理流程示意" },
  "registry-first-for-enterprise-analytics": { src: "/covers/registry-first.svg", alt: "企业分析指标注册表专题封面" },
  "controlled-query-mcp-security": { src: "/covers/controlled-query.svg", alt: "受控查询与安全边界专题封面" },
  "enterprise-analytics-agent-architecture": { src: "/covers/agent-architecture.svg", alt: "企业分析智能应用架构专题封面" },
} as const;

export type CoverSlug = keyof typeof covers;

export function ContentCover({ slug, className, priority = false }: { slug: string; className?: string; priority?: boolean }) {
  if (!(slug in covers)) return null;
  const cover = covers[slug as CoverSlug];
  return <Image src={cover.src} alt={cover.alt} width={1200} height={600} priority={priority} className={`w-full rounded-cover border border-border bg-surface-soft object-cover ${className ?? ""}`} />;
}
