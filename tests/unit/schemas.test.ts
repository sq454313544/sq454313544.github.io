import { describe, it, expect } from "vitest";
import {
  NoteMetaSchema,
  ProjectMetaSchema,
  DashboardMetaSchema,
} from "@/lib/content/schemas";

describe("NoteMetaSchema", () => {
  const valid = {
    title: "Test Note",
    description: "A test note",
    publishedAt: "2026-01-15",
    updatedAt: "2026-01-20",
    category: "langgraph",
    tags: ["agent"],
  };

  it("accepts valid note meta", () => {
    expect(() => NoteMetaSchema.parse(valid)).not.toThrow();
  });

  it("applies default values", () => {
    const result = NoteMetaSchema.parse(valid);
    expect(result.draft).toBe(false);
    expect(result.featured).toBe(false);
    expect(result.cover).toBeUndefined();
  });

  it("rejects missing title", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { title: _title, ...rest } = valid;
    expect(() => NoteMetaSchema.parse(rest)).toThrow();
  });

  it("rejects invalid date format", () => {
    expect(() =>
      NoteMetaSchema.parse({ ...valid, publishedAt: "2026-13-01" })
    ).toThrow();
  });

  it("rejects updatedAt before publishedAt", () => {
    expect(() =>
      NoteMetaSchema.parse({ ...valid, updatedAt: "2025-01-01" })
    ).toThrow(/updatedAt/);
  });

  it("rejects empty tags array", () => {
    expect(() =>
      NoteMetaSchema.parse({ ...valid, tags: [""] })
    ).toThrow();
  });

  it("accepts optional cover", () => {
    const result = NoteMetaSchema.parse({ ...valid, cover: "/img/cover.png" });
    expect(result.cover).toBe("/img/cover.png");
  });
});

describe("ProjectMetaSchema", () => {
  const valid = {
    title: "Test Project",
    description: "A test project",
    publishedAt: "2026-01-15",
    updatedAt: "2026-01-20",
    projectType: "agent" as const,
    status: "completed" as const,
    techStack: ["Next.js"],
  };

  it("accepts valid project meta", () => {
    expect(() => ProjectMetaSchema.parse(valid)).not.toThrow();
  });

  it("rejects invalid projectType", () => {
    expect(() =>
      ProjectMetaSchema.parse({ ...valid, projectType: "invalid" })
    ).toThrow();
  });

  it("rejects invalid status", () => {
    expect(() =>
      ProjectMetaSchema.parse({ ...valid, status: "invalid" })
    ).toThrow();
  });

  it("validates repository URL format", () => {
    expect(() =>
      ProjectMetaSchema.parse({ ...valid, repository: "not-a-url" })
    ).toThrow();
    const result = ProjectMetaSchema.parse({
      ...valid,
      repository: "https://github.com/example/repo",
    });
    expect(result.repository).toBe("https://github.com/example/repo");
  });

  it("accepts optional fields as undefined", () => {
    const result = ProjectMetaSchema.parse(valid);
    expect(result.cover).toBeUndefined();
    expect(result.repository).toBeUndefined();
    expect(result.demo).toBeUndefined();
  });

  it("rejects updatedAt before publishedAt", () => {
    expect(() =>
      ProjectMetaSchema.parse({ ...valid, updatedAt: "2025-01-01" })
    ).toThrow(/updatedAt/);
  });
});

describe("DashboardMetaSchema", () => {
  const valid = {
    title: "Test Dashboard",
    description: "A test dashboard",
    publishedAt: "2026-01-15",
    updatedAt: "2026-01-20",
    businessDomain: "销售",
    tools: ["Power BI"],
    metrics: ["GMV"],
  };

  it("accepts valid dashboard meta", () => {
    expect(() => DashboardMetaSchema.parse(valid)).not.toThrow();
  });

  it("accepts empty tools (min validation on element, not array)", () => {
    const result = DashboardMetaSchema.parse({ ...valid, tools: [] });
    expect(result.tools).toEqual([]);
  });

  it("rejects updatedAt before publishedAt", () => {
    expect(() =>
      DashboardMetaSchema.parse({ ...valid, updatedAt: "2025-01-01" })
    ).toThrow(/updatedAt/);
  });
});
