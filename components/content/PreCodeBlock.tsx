import { codeToHtml } from "shiki";
import type { ReactNode } from "react";

interface PreCodeBlockProps {
  children?: ReactNode;
  className?: string;
}

function extractCodeInfo(children: ReactNode): { code: string; lang: string } {
  let code = "";
  let lang = "text";

  function walk(node: unknown): void {
    if (typeof node === "string") {
      code += node;
    } else if (typeof node === "number") {
      code += String(node);
    } else if (node && typeof node === "object" && "props" in node) {
      const props = (node as { props: Record<string, unknown> }).props;
      if (typeof props.className === "string") {
        const match = props.className.match(/language-(\w+)/);
        if (match) lang = match[1];
      }
      if (props.children) {
        walk(props.children);
      }
    } else if (Array.isArray(node)) {
      for (const child of node) {
        walk(child);
      }
    }
  }

  walk(children);
  return { code, lang };
}

export async function PreCodeBlock({ children, className }: PreCodeBlockProps) {
  const { code, lang } = extractCodeInfo(children);

  let html: string;
  try {
    html = await codeToHtml(code, {
      lang,
      theme: "github-dark",
    });
  } catch {
    html = `<pre><code>${code}</code></pre>`;
  }

  return (
    <div
      className={`my-4 ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
