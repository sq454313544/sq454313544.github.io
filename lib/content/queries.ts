import type { ContentItem, NoteItem, ProjectItem, DashboardItem } from "./types";

/** All published content (exclude drafts) - sorted by date descending */
export function getPublished(items: ContentItem[]): ContentItem[] {
  return items
    .filter((item) => {
      if (item.type === "note") return !item.meta.draft;
      return true; // projects and dashboards have no draft field
    })
    .sort(
      (a, b) =>
        new Date(b.meta.publishedAt).getTime() -
        new Date(a.meta.publishedAt).getTime()
    );
}

/** Get by slug within a specific type */
export function getBySlug<T extends ContentItem>(
  items: T[],
  slug: string
): T | undefined {
  return items.find((item) => item.slug === slug);
}

/** Get published items by category (notes only) */
export function getByCategory(
  notes: NoteItem[],
  category: string
): NoteItem[] {
  return notes
    .filter((n) => n.meta.category === category && !n.meta.draft)
    .sort(
      (a, b) =>
        new Date(b.meta.publishedAt).getTime() -
        new Date(a.meta.publishedAt).getTime()
    );
}

/** Get published items containing a tag (all types) */
export function getByTag(items: ContentItem[], tag: string): ContentItem[] {
  return items
    .filter((item) => {
      if (item.type === "note") {
        return item.meta.tags.includes(tag) && !item.meta.draft;
      }
      if (item.type === "project") {
        return item.meta.techStack.includes(tag);
      }
      if (item.type === "dashboard") {
        return item.meta.tools.includes(tag) || item.meta.metrics.includes(tag);
      }
      return false;
    })
    .sort(
      (a, b) =>
        new Date(b.meta.publishedAt).getTime() -
        new Date(a.meta.publishedAt).getTime()
    );
}

/** Get featured items */
export function getFeatured(items: ContentItem[]): ContentItem[] {
  return items
    .filter((item) => item.meta.featured)
    .sort(
      (a, b) =>
        new Date(b.meta.publishedAt).getTime() -
        new Date(a.meta.publishedAt).getTime()
    );
}

/** Get latest N published items */
export function getLatest(items: ContentItem[], limit = 5): ContentItem[] {
  return getPublished(items).slice(0, limit);
}

/** Get previous and next items in the same type */
export function getPrevNext<T extends ContentItem>(
  items: T[],
  currentSlug: string
): { prev: T | null; next: T | null } {
  const published = getPublished(items);
  const idx = published.findIndex((item) => item.slug === currentSlug);
  return {
    prev: idx > 0 ? (published[idx - 1] as T) : null,
    next: idx < published.length - 1 ? (published[idx + 1] as T) : null,
  };
}

/** Get related items (same category for notes, same projectType for projects, same businessDomain for dashboards) */
export function getRelated(
  items: ContentItem[],
  current: ContentItem,
  limit = 3
): ContentItem[] {
  const published = getPublished(items).filter(
    (item) => item.slug !== current.slug
  );

  if (current.type === "note") {
    return published
      .filter(
        (item) =>
          item.type === "note" &&
          (item as NoteItem).meta.category ===
            (current as NoteItem).meta.category
      )
      .slice(0, limit);
  }

  if (current.type === "project") {
    return published
      .filter(
        (item) =>
          item.type === "project" &&
          (item as ProjectItem).meta.projectType ===
            (current as ProjectItem).meta.projectType
      )
      .slice(0, limit);
  }

  if (current.type === "dashboard") {
    return published
      .filter(
        (item) =>
          item.type === "dashboard" &&
          (item as DashboardItem).meta.businessDomain ===
            (current as DashboardItem).meta.businessDomain
      )
      .slice(0, limit);
  }

  return [];
}

/** Get all unique tags across all content types */
export function getAllTags(items: ContentItem[]): { name: string; count: number }[] {
  const tagMap = new Map<string, number>();
  for (const item of items) {
    if (item.type === "note" && item.meta.draft) continue;
    const tags: string[] =
      item.type === "note"
        ? item.meta.tags
        : item.type === "project"
          ? item.meta.techStack
          : [...item.meta.tools, ...item.meta.metrics];
    for (const tag of tags) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
  }
  return [...tagMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/** Get all unique categories (notes only) */
export function getAllCategories(notes: NoteItem[]): { name: string; count: number }[] {
  const catMap = new Map<string, number>();
  for (const note of notes) {
    if (note.meta.draft) continue;
    catMap.set(note.meta.category, (catMap.get(note.meta.category) ?? 0) + 1);
  }
  return [...catMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
