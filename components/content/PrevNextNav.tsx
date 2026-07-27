import Link from "next/link";
import type { ContentItem } from "@/lib/content/types";

interface PrevNextNavProps {
  prev: ContentItem | null;
  next: ContentItem | null;
  basePath: string;
  className?: string;
}

export function PrevNextNav({ prev, next, basePath, className }: PrevNextNavProps) {
  return (
    <nav
      aria-label="前后篇导航"
      className={`mt-12 flex justify-between gap-6 border-t border-border pt-6 ${className ?? ""}`}
    >
      <div className="flex-1 min-w-0">
        {prev && (
          <Link
            href={`${basePath}/${prev.slug}`}
            className="group block rounded-button p-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="text-xs text-text-muted">上一篇</span>
            <span className="block truncate text-text-secondary transition-colors duration-150 ease-standard group-hover:text-primary">
              {prev.meta.title}
            </span>
          </Link>
        )}
      </div>
      <div className="flex-1 min-w-0 text-right">
        {next && (
          <Link
            href={`${basePath}/${next.slug}`}
            className="group block rounded-button p-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="text-xs text-text-muted">下一篇</span>
            <span className="block truncate text-text-secondary transition-colors duration-150 ease-standard group-hover:text-primary">
              {next.meta.title}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
