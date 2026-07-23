"use client";

import { useEffect, useRef, useState } from "react";
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
  const prevChart = useRef<string | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (prevChart.current === chart) return;
    prevChart.current = chart;

    const id = `mermaid-${Math.random().toString(36).slice(2, 8)}`;

    mermaid
      .render(id, chart)
      .then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
          setError(null);
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Mermaid 渲染失败");
      });
  }, [chart]);

  if (error) {
    return (
      <div className={`border border-red-300 bg-red-50 p-4 rounded ${className ?? ""}`}>
        <p className="text-red-700 text-sm">图表渲染失败</p>
        <p className="text-red-600 text-xs mt-1">{error}</p>
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
