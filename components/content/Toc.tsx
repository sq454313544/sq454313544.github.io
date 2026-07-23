interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractToc(body: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(body)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u4e00-\u9fff-]/g, "");
    items.push({ id, text, level });
  }

  return items;
}

interface TocProps {
  items: TocItem[];
  className?: string;
}

export function Toc({ items, className }: TocProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="文章目录"
      className={`border-l-2 border-gray-200 pl-4 ${className ?? ""}`}
    >
      <h2 className="text-sm font-semibold text-gray-500 mb-2">目录</h2>
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
          >
            <a
              href={`#${item.id}`}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
