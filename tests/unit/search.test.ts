import { describe, it, expect } from "vitest";
import { buildSearchIndex } from "@/lib/search/index";
import { search } from "@/lib/search/matcher";
import type { ContentItem, NoteMeta } from "@/lib/content/types";

function makeNote(overrides: {
  slug?: string;
  title?: string;
  description?: string;
  tags?: string[];
  searchText?: string;
  draft?: boolean;
}): ContentItem {
  return {
    type: "note",
    slug: overrides.slug ?? "test",
    meta: {
      title: overrides.title ?? "Test Note",
      description: overrides.description ?? "A note about LangGraph agents",
      publishedAt: "2026-01-01",
      updatedAt: "2026-01-01",
      category: "langgraph",
      tags: overrides.tags ?? ["agent"],
      draft: overrides.draft ?? false,
      featured: false,
    },
    body: "",
    excerpt: "",
    searchText: overrides.searchText ?? "This is a comprehensive guide to LangGraph state management.",
    readingTime: 3,
  };
}

describe("buildSearchIndex", () => {
  it("includes published notes", () => {
    const items = [makeNote({ slug: "a" })];
    const index = buildSearchIndex(items);
    expect(index).toHaveLength(1);
    expect(index[0].slug).toBe("a");
  });

  it("excludes drafts", () => {
    const items = [makeNote({ draft: true })];
    expect(buildSearchIndex(items)).toHaveLength(0);
  });
});

describe("search", () => {
  it("matches by title", () => {
    const items = [
      makeNote({ slug: "a", title: "LangGraph Guide", description: "A guide", tags: ["guide"], searchText: "LangGraph state management" }),
      makeNote({ slug: "b", title: "Python Tips", description: "Python basics", tags: ["python"], searchText: "Python programming" }),
    ];
    const index = buildSearchIndex(items);
    const results = search(index, "langgraph");
    expect(results).toHaveLength(1);
    expect(results[0].entry.slug).toBe("a");
  });

  it("matches by description", () => {
    const items = [makeNote({ description: "Learning RAG techniques" })];
    const index = buildSearchIndex(items);
    const results = search(index, "RAG");
    expect(results).toHaveLength(1);
  });

  it("matches by tag", () => {
    const items = [makeNote({ tags: ["langgraph"] })];
    const index = buildSearchIndex(items);
    const results = search(index, "langgraph");
    expect(results).toHaveLength(1);
  });

  it("matches by searchText", () => {
    const items = [makeNote({ searchText: "Deep dive into state graphs" })];
    const index = buildSearchIndex(items);
    const results = search(index, "state graphs");
    expect(results).toHaveLength(1);
  });

  it("returns empty for no matches", () => {
    const items = [makeNote({})];
    const index = buildSearchIndex(items);
    expect(search(index, "nonexistent")).toHaveLength(0);
  });

  it("returns empty for empty query", () => {
    const items = [makeNote({})];
    const index = buildSearchIndex(items);
    expect(search(index, "")).toHaveLength(0);
  });

  it("scores exact title matches highest", () => {
    const items = [
      makeNote({ slug: "partial", title: "Some LangGraph Stuff" }),
      makeNote({ slug: "exact", title: "LangGraph" }),
    ];
    const index = buildSearchIndex(items);
    const results = search(index, "langgraph");
    expect(results[0].entry.slug).toBe("exact");
  });

  it("sorts by date for equal scores", () => {
    const items: ContentItem[] = [
      makeNote({ slug: "old", title: "Guide" }),
      makeNote({ slug: "new", title: "Guide" }),
    ];
    (items[1].meta as NoteMeta).publishedAt = "2026-06-01";
    const index = buildSearchIndex(items);
    const results = search(index, "guide");
    expect(results[0].entry.slug).toBe("new");
  });
});
