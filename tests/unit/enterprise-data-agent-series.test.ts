import { describe, expect, it } from "vitest";
import { loadNotes } from "@/lib/content/loaders";

const seriesTag = "enterprise-data-agent";
const seriesSlugs = [
  "registry-first-for-enterprise-analytics",
  "controlled-query-mcp-security",
  "enterprise-analytics-agent-architecture",
];

describe("enterprise data agent series", () => {
  it("publishes the three articles with consistent series navigation", () => {
    const notesBySlug = new Map(loadNotes().map((note) => [note.slug, note]));

    for (const slug of seriesSlugs) {
      const note = notesBySlug.get(slug);
      expect(note).toBeDefined();
      expect(note?.meta.draft).toBe(false);
      expect(note?.meta.tags).toContain(seriesTag);
      expect(note?.body).toContain("## 专题导航");
      expect(note?.body).toContain("## 更新记录");
    }
  });
});
