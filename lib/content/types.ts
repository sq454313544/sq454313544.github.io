export interface NoteMeta {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  draft: boolean;
  featured: boolean;
  cover?: string;
}

export interface ProjectMeta {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  projectType: "agent" | "dashboard" | "pipeline" | "tool" | "other";
  status: "completed" | "in_progress" | "maintained" | "archived";
  featured: boolean;
  techStack: string[];
  cover?: string;
  repository?: string;
  demo?: string;
}

export const PROJECT_TYPE_LABELS: Record<ProjectMeta["projectType"], string> = {
  agent: "智能应用",
  dashboard: "数据看板",
  pipeline: "数据管道",
  tool: "工具",
  other: "其他",
};

export interface DashboardMeta {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  businessDomain: string;
  tools: string[];
  metrics: string[];
  featured: boolean;
  cover?: string;
}

export interface BaseContentItem {
  slug: string;
  body: string;
  excerpt: string;
  searchText: string;
  readingTime: number;
}

export interface NoteItem extends BaseContentItem {
  type: "note";
  meta: NoteMeta;
}

export interface ProjectItem extends BaseContentItem {
  type: "project";
  meta: ProjectMeta;
}

export interface DashboardItem extends BaseContentItem {
  type: "dashboard";
  meta: DashboardMeta;
}

export type ContentItem = NoteItem | ProjectItem | DashboardItem;

export type ContentType = ContentItem["type"];
