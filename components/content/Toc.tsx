interface TocItem {
  id: string;
  text: string;
  level: number;
}

function toId(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fff-]/g, "");
}

export function extractToc(body: string): TocItem[] {
  const markdownHeadingRegex = /^(#{2,3})\s+(.+)$/gm;
  const htmlHeadingRegex = /^<h([23])([^>]*)>([\s\S]*?)<\/h\1>\s*$/gm;
  const slugCounts = new Map<string, number>();
  const headings: { index: number; level: number; text: string; id?: string }[] = [];

  let match: RegExpExecArray | null;
  while ((match = markdownHeadingRegex.exec(body)) !== null) {
    headings.push({ index: match.index, level: match[1].length, text: match[2] });
  }

  let htmlMatch: RegExpExecArray | null;
  while ((htmlMatch = htmlHeadingRegex.exec(body)) !== null) {
    headings.push({
      index: htmlMatch.index,
      level: Number(htmlMatch[1]),
      text: htmlMatch[3],
      id: /\bid="([^"]+)"/.exec(htmlMatch[2])?.[1],
    });
  }

  // 按正文出现顺序输出，保证目录顺序与阅读顺序一致
  return headings
    .sort((a, b) => a.index - b.index)
    .flatMap((heading) => {
      const text = heading.text.replace(/<[^>]+>/g, "").trim();
      if (!text) return [];
      // 显式 id 的标题写法固定，不参与 rehype-slug 的重名递增
      if (heading.id) return [{ id: heading.id, text, level: heading.level }];
      const baseId = toId(text);
      const count = slugCounts.get(baseId) ?? 0;
      slugCounts.set(baseId, count + 1);
      return [
        {
          id: count === 0 ? baseId : `${baseId}-${count}`,
          text,
          level: heading.level,
        },
      ];
    });
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
