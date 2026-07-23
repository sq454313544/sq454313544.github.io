import type { ContentItem } from "@/lib/content/types";

export interface SearchIndexEntry {
  type: ContentItem["type"];
  slug: string;
  title: string;
  description: string;
  tags: string[];
  searchText: string;
  publishedAt: string;
}

export function buildSearchIndex(items: ContentItem[]): SearchIndexEntry[] {
  return items
    .filter((item) => {
      if (item.type === "note") return !item.meta.draft;
      return true;
    })
    .map((item) => ({
      type: item.type,
      slug: item.slug,
      title: item.meta.title,
      description: item.meta.description,
      tags:
        item.type === "note"
          ? item.meta.tags
          : item.type === "project"
            ? item.meta.techStack
            : [...item.meta.tools, ...item.meta.metrics],
      searchText: item.searchText,
      publishedAt: item.meta.publishedAt,
    }));
}
