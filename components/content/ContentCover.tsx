import Image from "next/image";

const covers = {
  "enterprise-qa-assistant": { src: "/covers/enterprise-qa-assistant.svg", alt: "智能问数项目的受控查询流程示意", width: 1200, height: 600 },
  "data-warehouse-modernization": { src: "/covers/data-warehouse-modernization.svg", alt: "数据仓库分层与治理流程示意", width: 1200, height: 600 },
  "operations-process-analysis": {
    src: "/dashboards/legal-operations-overview.png",
    alt: "法律业务经营分析看板的脱敏案件运营总览",
    width: 1600,
    height: 900,
  },
} as const;

export type CoverSlug = keyof typeof covers;

export function ContentCover({ slug, className, priority = false }: { slug: string; className?: string; priority?: boolean }) {
  if (!(slug in covers)) return null;
  const cover = covers[slug as CoverSlug];
  return <Image src={cover.src} alt={cover.alt} width={cover.width} height={cover.height} unoptimized={cover.src.endsWith(".png")} priority={priority} className={`w-full rounded-cover border border-border bg-surface-soft object-cover ${className ?? ""}`} />;
}
