import { z } from "zod/v4";

const dateSchema = z.string().date("日期格式: YYYY-MM-DD");

export const NoteMetaSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  description: z.string().min(1, "描述不能为空"),
  publishedAt: dateSchema,
  updatedAt: dateSchema,
  category: z.string(),
  tags: z.array(z.string().min(1)).min(1, "至少需要一个标签"),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  cover: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.updatedAt < data.publishedAt) {
    ctx.addIssue({
      code: "custom",
      path: ["updatedAt"],
      message: "updatedAt 不能早于 publishedAt",
    });
  }
});

export const ProjectMetaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  publishedAt: dateSchema,
  updatedAt: dateSchema,
  projectType: z.enum(["agent", "dashboard", "pipeline", "tool", "other"]),
  status: z.enum(["completed", "in_progress", "maintained", "archived"]),
  featured: z.boolean().default(false),
  techStack: z.array(z.string().min(1)).min(1, "至少需要一项技术栈"),
  cover: z.string().optional(),
  repository: z.string().url().optional(),
  demo: z.string().url().optional(),
}).superRefine((data, ctx) => {
  if (data.updatedAt < data.publishedAt) {
    ctx.addIssue({
      code: "custom",
      path: ["updatedAt"],
      message: "updatedAt 不能早于 publishedAt",
    });
  }
});

export const DashboardMetaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  publishedAt: dateSchema,
  updatedAt: dateSchema,
  businessDomain: z.string().min(1),
  tools: z.array(z.string().min(1)).min(1, "至少需要一个工具"),
  metrics: z.array(z.string().min(1)).min(1, "至少需要一个关键指标"),
  featured: z.boolean().default(false),
  cover: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.updatedAt < data.publishedAt) {
    ctx.addIssue({
      code: "custom",
      path: ["updatedAt"],
      message: "updatedAt 不能早于 publishedAt",
    });
  }
});

export function validateNoteMeta(data: unknown) {
  return NoteMetaSchema.parse(data);
}

export function validateProjectMeta(data: unknown) {
  return ProjectMetaSchema.parse(data);
}

export function validateDashboardMeta(data: unknown) {
  return DashboardMetaSchema.parse(data);
}
