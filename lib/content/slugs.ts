import type { ContentType } from "./types";

export function generateSlug(filename: string): string {
  return filename.replace(/\.[^.]+$/, "");
}

export function findDuplicateSlugs(
  items: { type: ContentType; slug: string }[]
): string[] {
  const seen = new Map<string, number>();
  const duplicates: string[] = [];
  for (const item of items) {
    const key = `${item.type}:${item.slug}`;
    const count = (seen.get(key) ?? 0) + 1;
    seen.set(key, count);
    if (count === 2) duplicates.push(key);
  }
  return duplicates;
}
