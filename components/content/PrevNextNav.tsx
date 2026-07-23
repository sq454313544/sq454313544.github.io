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
      className={`flex justify-between gap-4 mt-8 pt-4 border-t ${className ?? ""}`}
    >
      <div className="flex-1 min-w-0">
        {prev && (
          <Link
            href={`${basePath}/${prev.slug}`}
            className="block text-sm group"
          >
            <span className="text-gray-400 text-xs">上一篇</span>
            <span className="text-gray-700 group-hover:text-gray-900 truncate block">
              {prev.meta.title}
            </span>
          </Link>
        )}
      </div>
      <div className="flex-1 min-w-0 text-right">
        {next && (
          <Link
            href={`${basePath}/${next.slug}`}
            className="block text-sm group"
          >
            <span className="text-gray-400 text-xs">下一篇</span>
            <span className="text-gray-700 group-hover:text-gray-900 truncate block">
              {next.meta.title}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
