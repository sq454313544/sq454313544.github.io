interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractToc(body: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  const slugCounts = new Map<string, number>();
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(body)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const baseId = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u4e00-\u9fff-]/g, "");
    const count = slugCounts.get(baseId) ?? 0;
    slugCounts.set(baseId, count + 1);
    const id = count === 0 ? baseId : `${baseId}-${count}`;
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
      className={`border-l-2 border-border pl-4 ${className ?? ""}`}
    >
      <h2 className="text-auxiliary font-semibold tracking-wide text-text-secondary">目录</h2>
      <ul className="mt-3 space-y-1.5">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
          >
            <a
              href={`#${item.id}`}
              className="block text-sm leading-normal text-text-secondary transition-colors duration-150 ease-standard hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
