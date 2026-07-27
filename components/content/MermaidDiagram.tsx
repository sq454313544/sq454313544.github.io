"use client";

import { useEffect, useId, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "strict",
  theme: "default",
});

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export function MermaidDiagram({ chart, className }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const diagramId = useId().replace(/:/g, "");

  useEffect(() => {
    if (!ref.current) return;
    let cancelled = false;

    mermaid
      .render(`mermaid-${diagramId}`, chart)
      .then(({ bindFunctions, svg }) => {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          bindFunctions?.(ref.current);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Mermaid 渲染失败");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chart, diagramId]);

  if (error) {
    return (
      <div className={`rounded-code border border-error-border bg-error-bg p-4 ${className ?? ""}`}>
        <p className="text-sm text-error-text">图表渲染失败，以下保留原始代码。</p>
        <p className="mt-1 text-xs text-error-text">{error}</p>
        <pre className="mt-3 overflow-x-auto rounded-code bg-surface-soft p-3 font-mono text-sm text-text-primary">
          <code>{chart}</code>
        </pre>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`my-6 flex justify-center overflow-x-auto ${className ?? ""}`}
    />
  );
}
