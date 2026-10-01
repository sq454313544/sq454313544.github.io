import type { ProjectItem } from "@/lib/content/types";

/**
 * 项目案例的展示顺序：数据工程与 AI 应用两条主线各出一个代表案例放在最前，
 * 其后是知识库与业务交付，其余按发布日期倒序。
 *
 * 首页「代表案例」「更多交付」与项目列表共用这一份顺序来源，
 * 避免两处各自维护排序规则而产生矛盾。
 */
export const PRIMARY_PROJECT_ORDER: readonly string[] = [
  "data-warehouse-modernization",
  "enterprise-qa-assistant",
  "enterprise-knowledge-assistant",
];

/**
 * 展示分组：数据工程与 AI 应用两条主线。
 * 同一份定义同时用于项目列表的筛选入口与首页的代表案例，避免两处规则不一致。
 */
export const PROJECT_GROUPS = [
  { id: "data", label: "数据工程", slugs: ["data-warehouse-modernization"] },
  {
    id: "ai",
    label: "AI 应用",
    slugs: ["enterprise-qa-assistant", "enterprise-knowledge-assistant"],
  },
] as const;

export type ProjectGroupId = (typeof PROJECT_GROUPS)[number]["id"];

/** 判断项目属于哪个展示分组；不属于两条主线的返回 null */
export function projectGroupOf(slug: string): ProjectGroupId | null {
  return PROJECT_GROUPS.find((group) => (group.slugs as readonly string[]).includes(slug))?.id ?? null;
}

export function sortProjects(projects: ProjectItem[]): ProjectItem[] {
  return [...projects].sort((a, b) => {
    const rankA = PRIMARY_PROJECT_ORDER.indexOf(a.slug);
    const rankB = PRIMARY_PROJECT_ORDER.indexOf(b.slug);
    const orderA = rankA === -1 ? PRIMARY_PROJECT_ORDER.length : rankA;
    const orderB = rankB === -1 ? PRIMARY_PROJECT_ORDER.length : rankB;
    if (orderA !== orderB) return orderA - orderB;
    return (
      new Date(b.meta.publishedAt).getTime() -
      new Date(a.meta.publishedAt).getTime()
    );
  });
}
