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
