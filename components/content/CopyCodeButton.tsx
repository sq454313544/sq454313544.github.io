"use client";

import { useState } from "react";

interface CopyCodeButtonProps {
  code: string;
  className?: string;
}

export function CopyCodeButton({ code, className }: CopyCodeButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={copyCode}
        className="rounded-button border border-border bg-surface px-2 py-1 text-xs text-text-secondary transition-colors duration-150 ease-standard hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        复制代码
      </button>
      <span className="sr-only" aria-live="polite">
        {status === "copied" ? "代码已复制" : status === "failed" ? "复制失败" : ""}
      </span>
    </div>
  );
}
