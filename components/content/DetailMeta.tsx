import type { ReactNode } from "react";

export interface DetailMetaItem {
  label: string;
  value: ReactNode;
}

interface DetailMetaProps {
  title: string;
  items: DetailMetaItem[];
  className?: string;
}

export function DetailMeta({ title, items, className }: DetailMetaProps) {
  return (
    <aside className={`border-l-2 border-border pl-4 ${className ?? ""}`} aria-label={title}>
      <h2 className="text-auxiliary font-semibold tracking-wide text-text-secondary">{title}</h2>
      <dl className="mt-4 space-y-4 text-sm">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-text-muted">{item.label}</dt>
            <dd className="mt-1 break-words text-text-secondary">{item.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
