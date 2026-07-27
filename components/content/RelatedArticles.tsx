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
    <nav aria-label="相关文章" className={`mt-12 border-t border-border pt-6 ${className ?? ""}`}>
      <h2 className="text-h3 font-semibold leading-tight text-text-primary">相关文章</h2>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={`${item.type}:${item.slug}`}>
            <Link
              href={itemPath(item)}
              className="block rounded-button p-2 text-sm text-text-secondary transition-colors duration-150 ease-standard hover:bg-surface-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="mr-1 text-xs text-text-muted">
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
