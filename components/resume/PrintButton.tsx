"use client";

export function PrintButton({ className }: { className?: string }) {
  return <button type="button" onClick={() => window.print()} className={`rounded-button bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 ease-standard hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className ?? ""}`}>打印 / 保存为 PDF</button>;
}
