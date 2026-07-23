import Link from "next/link";
import type { ContentItem } from "@/lib/content/types";

interface RelatedArticlesProps {
  items: ContentItem[];
  className?: string;
}

function itemPath(item: ContentItem): string {
  const base = item.type === "note" ? "/notes" : item.type === "project" ? "/projects" : "/dashboards";
  return `${base}/${item.slug}`;
}

export function RelatedArticles({ items, className }: RelatedArticlesProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="相关文章" className={`mt-8 pt-4 border-t ${className ?? ""}`}>
      <h2 className="text-sm font-semibold text-gray-500 mb-3">相关文章</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={`${item.type}:${item.slug}`}>
            <Link
              href={itemPath(item)}
              className="block text-sm text-gray-700 hover:text-gray-900"
            >
              <span className="text-xs text-gray-400 mr-1">
                [{item.type === "note" ? "笔记" : item.type === "project" ? "项目" : "BI"}]
              </span>
              {item.meta.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
