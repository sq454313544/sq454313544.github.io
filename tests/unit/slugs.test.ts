import { describe, it, expect } from "vitest";
import { generateSlug, findDuplicateSlugs } from "@/lib/content/slugs";
import type { ContentType } from "@/lib/content/types";

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
  function item(type: ContentType, slug: string) {
    return { type, slug };
  }

  it("returns empty for unique slugs", () => {
    expect(findDuplicateSlugs([item("note", "a"), item("note", "b")])).toEqual([]);
  });

  it("detects duplicate slugs in same type", () => {
    expect(findDuplicateSlugs([item("note", "a"), item("note", "a")])).toEqual(["note:a"]);
  });

  it("allows same slug in different types", () => {
    expect(findDuplicateSlugs([item("note", "shared"), item("project", "shared")])).toEqual([]);
  });
});
