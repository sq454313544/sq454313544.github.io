import { extname } from "node:path";
import type { ContentItem } from "./types";

export function generateSlug(filename: string): string {
  return filename.replace(extname(filename), "");
}

export function findDuplicateSlugs(items: ContentItem[]): string[] {
  const seen = new Map<string, string[]>();
  for (const item of items) {
    const key = `${item.type}:${item.slug}`;
    const existing = seen.get(key) ?? [];
    existing.push(item.slug);
    seen.set(key, existing);
  }
  const duplicates: string[] = [];
  for (const [, slugs] of seen) {
    if (slugs.length > 1) {
      duplicates.push(slugs[0]);
    }
  }
  return duplicates;
}
