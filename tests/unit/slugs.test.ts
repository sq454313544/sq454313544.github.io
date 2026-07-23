import { describe, it, expect } from "vitest";
import { generateSlug, findDuplicateSlugs } from "@/lib/content/slugs";
import type { ContentItem } from "@/lib/content/types";

describe("generateSlug", () => {
  it("extracts slug from filename", () => {
    expect(generateSlug("my-post.mdx")).toBe("my-post");
  });

  it("handles filenames with multiple dots", () => {
    expect(generateSlug("my.post.name.mdx")).toBe("my.post.name");
  });

  it("handles filenames without extension", () => {
    expect(generateSlug("no-ext")).toBe("no-ext");
  });
});

describe("findDuplicateSlugs", () => {
  function makeNote(slug: string): ContentItem {
    return {
      type: "note",
      slug,
      meta: {
        title: "t",
        description: "d",
        publishedAt: "2026-01-01",
        updatedAt: "2026-01-01",
        category: "c",
        tags: ["t"],
        draft: false,
        featured: false,
      },
      body: "",
      excerpt: "",
      searchText: "",
      readingTime: 1,
    };
  }

  it("returns empty for unique slugs", () => {
    const items = [makeNote("a"), makeNote("b")];
    expect(findDuplicateSlugs(items)).toEqual([]);
  });

  it("detects duplicate slugs in same type", () => {
    const items = [makeNote("a"), makeNote("a")];
    expect(findDuplicateSlugs(items)).toEqual(["a"]);
  });

  it("allows same slug in different types", () => {
    const note = makeNote("shared");
    const project: ContentItem = {
      ...makeNote("shared"),
      type: "project",
      meta: {
        title: "t",
        description: "d",
        publishedAt: "2026-01-01",
        updatedAt: "2026-01-01",
        projectType: "agent" as const,
        status: "completed" as const,
        techStack: [],
        featured: false,
      },
    };
    expect(findDuplicateSlugs([note, project])).toEqual([]);
  });
});
