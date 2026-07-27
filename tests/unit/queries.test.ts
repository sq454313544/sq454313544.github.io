import { describe, it, expect } from "vitest";
import {
  getPublished,
  getBySlug,
  getByCategory,
  getByTag,
  getFeatured,
  getLatest,
  getPrevNext,
  getRelated,
  getAllTags,
  getAllCategories,
} from "@/lib/content/queries";
import type { NoteItem, ContentItem } from "@/lib/content/types";

function makeNote(overrides: Partial<NoteItem> = {}): NoteItem {
  return {
    type: "note",
    slug: "test-note",
    meta: {
      title: "Test Note",
      description: "A test note",
      publishedAt: "2026-01-15",
      updatedAt: "2026-01-20",
      category: "langgraph",
      tags: ["agent", "state"],
      draft: false,
      featured: false,
    },
    body: "",
    excerpt: "",
    searchText: "",
    readingTime: 3,
    ...overrides,
  };
}

describe("getPublished", () => {
  it("excludes drafts", () => {
    const items: ContentItem[] = [
      makeNote({ slug: "a" }),
      makeNote({ slug: "b", meta: { ...makeNote().meta, draft: true } }),
    ];
    const result = getPublished(items);
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("a");
  });

  it("sorts by date descending", () => {
    const items: ContentItem[] = [
      makeNote({ slug: "old", meta: { ...makeNote().meta, publishedAt: "2025-01-01" } }),
      makeNote({ slug: "new", meta: { ...makeNote().meta, publishedAt: "2026-06-01" } }),
    ];
    const result = getPublished(items);
    expect(result[0].slug).toBe("new");
    expect(result[1].slug).toBe("old");
  });
});

describe("getBySlug", () => {
  it("finds by slug", () => {
    const items = [makeNote({ slug: "target" })];
    expect(getBySlug(items, "target")).toBeDefined();
    expect(getBySlug(items, "missing")).toBeUndefined();
  });
});

describe("getByCategory", () => {
  it("filters notes by category", () => {
    const notes = [
      makeNote({ slug: "a", meta: { ...makeNote().meta, category: "python" } }),
      makeNote({ slug: "b", meta: { ...makeNote().meta, category: "langgraph" } }),
    ];
    const result = getByCategory(notes, "langgraph");
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("b");
  });

  it("excludes drafts from category results", () => {
    const notes = [
      makeNote({ slug: "a", meta: { ...makeNote().meta, category: "python", draft: true } }),
    ];
    expect(getByCategory(notes, "python")).toHaveLength(0);
  });
});

describe("getByTag", () => {
  it("finds notes by tag", () => {
    const items: ContentItem[] = [
      makeNote({ slug: "a", meta: { ...makeNote().meta, tags: ["python"] } }),
      makeNote({ slug: "b", meta: { ...makeNote().meta, tags: ["agent"] } }),
    ];
    const result = getByTag(items, "python");
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("a");
  });
});

describe("getFeatured", () => {
  it("returns only featured items", () => {
    const items: ContentItem[] = [
      makeNote({ slug: "normal" }),
      makeNote({ slug: "star", meta: { ...makeNote().meta, featured: true } }),
    ];
    expect(getFeatured(items)).toHaveLength(1);
  });
});

describe("getLatest", () => {
  it("limits to N items", () => {
    const items: ContentItem[] = [makeNote({ slug: "a" }), makeNote({ slug: "b" })];
    expect(getLatest(items, 1)).toHaveLength(1);
  });
});

describe("getPrevNext", () => {
  it("returns prev and next", () => {
    const items = [
      makeNote({ slug: "a", meta: { ...makeNote().meta, publishedAt: "2026-01-03" } }),
      makeNote({ slug: "b", meta: { ...makeNote().meta, publishedAt: "2026-01-02" } }),
      makeNote({ slug: "c", meta: { ...makeNote().meta, publishedAt: "2026-01-01" } }),
    ];
    const { prev, next } = getPrevNext(items, "b");
    expect(prev?.slug).toBe("a");
    expect(next?.slug).toBe("c");
  });

  it("handles edges", () => {
    const items = [
      makeNote({ slug: "first", meta: { ...makeNote().meta, publishedAt: "2026-01-02" } }),
      makeNote({ slug: "last", meta: { ...makeNote().meta, publishedAt: "2026-01-01" } }),
    ];
    const firstResult = getPrevNext(items, "first");
    expect(firstResult.prev).toBeNull();
    expect(firstResult.next?.slug).toBe("last");

    const lastResult = getPrevNext(items, "last");
    expect(lastResult.prev?.slug).toBe("first");
    expect(lastResult.next).toBeNull();
  });
});

describe("getRelated", () => {
  it("returns same-category notes excluding current", () => {
    const current = makeNote({ slug: "current" });
    const items: ContentItem[] = [
      current,
      makeNote({ slug: "related", meta: { ...makeNote().meta, category: "langgraph" } }),
      makeNote({ slug: "unrelated", meta: { ...makeNote().meta, category: "python" } }),
    ];
    const result = getRelated(items, current);
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("related");
  });
});

describe("getAllTags", () => {
  it("counts tags across items", () => {
    const items: ContentItem[] = [
      makeNote({ slug: "a", meta: { ...makeNote().meta, tags: ["agent", "state"] } }),
      makeNote({ slug: "b", meta: { ...makeNote().meta, tags: ["agent"] } }),
    ];
    const tags = getAllTags(items);
    const agent = tags.find((t) => t.name === "agent");
    expect(agent?.count).toBe(2);
  });

  it("excludes tags that only belong to draft notes", () => {
    const items: ContentItem[] = [
      makeNote({
        slug: "draft-series-note",
        meta: { ...makeNote().meta, tags: ["enterprise-data-agent"], draft: true },
      }),
    ];

    expect(getAllTags(items)).not.toContainEqual({ name: "enterprise-data-agent", count: 1 });
  });
});

describe("getAllCategories", () => {
  it("counts categories", () => {
    const notes = [
      makeNote({ slug: "a" }),
      makeNote({ slug: "b" }),
    ];
    const cats = getAllCategories(notes);
    expect(cats).toHaveLength(1);
    expect(cats[0].count).toBe(2);
  });
});
