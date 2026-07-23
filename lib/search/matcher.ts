import type { SearchIndexEntry } from "./index";

function normalize(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

interface ScoredResult {
  entry: SearchIndexEntry;
  score: number;
}

export function search(
  index: SearchIndexEntry[],
  query: string
): ScoredResult[] {
  const q = normalize(query);
  if (!q) return [];

  const results: ScoredResult[] = [];

  for (const entry of index) {
    let score = 0;
    const title = normalize(entry.title);
    const description = normalize(entry.description);
    const searchText = normalize(entry.searchText);

    // Exact title match (highest weight)
    if (title === q) score += 100;

    // Partial title match
    if (title.includes(q)) score += 50;

    // Word-level title match
    const titleWords = title.split(" ");
    const queryWords = q.split(" ");
    for (const qw of queryWords) {
      for (const tw of titleWords) {
        if (tw.includes(qw) && tw.length > 1) score += 10;
      }
    }

    // Description match
    if (description.includes(q)) score += 8;

    // Search text match
    if (searchText.includes(q)) score += 5;

    // Tag match
    for (const tag of entry.tags) {
      if (normalize(tag).includes(q)) score += 6;
    }

    if (score > 0) {
      results.push({ entry, score });
    }
  }

  return results.sort((a, b) => {
    // Sort by score descending, then by date descending
    if (b.score !== a.score) return b.score - a.score;
    return (
      new Date(b.entry.publishedAt).getTime() -
      new Date(a.entry.publishedAt).getTime()
    );
  });
}
