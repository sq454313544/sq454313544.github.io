import Image from "next/image";

const covers = {
  "enterprise-qa-assistant": { src: "/covers/enterprise-qa-assistant.svg", alt: "智能问数项目的受控查询流程示意" },
  "data-warehouse-modernization": { src: "/covers/data-warehouse-modernization.svg", alt: "数据仓库分层与治理流程示意" },
  "operations-process-analysis": { src: "/covers/operations-process-analysis.svg", alt: "业务流程分析案例的抽象指标路径封面" },
  "payment-performance-analysis": { src: "/covers/payment-performance-analysis.svg", alt: "回款与团队绩效案例的抽象分析路径封面" },
} as const;

export type CoverSlug = keyof typeof covers;

export function ContentCover({ slug, className, priority = false }: { slug: string; className?: string; priority?: boolean }) {
  if (!(slug in covers)) return null;
  const cover = covers[slug as CoverSlug];
  return <Image src={cover.src} alt={cover.alt} width={1200} height={600} priority={priority} className={`w-full rounded-cover border border-border bg-surface-soft object-cover ${className ?? ""}`} />;
}
