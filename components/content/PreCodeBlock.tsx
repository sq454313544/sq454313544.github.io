import { codeToHtml } from "shiki";
import { isValidElement, type ReactNode } from "react";
import { CopyCodeButton } from "@/components/content/CopyCodeButton";
import { MermaidDiagram } from "@/components/content/MermaidDiagram";

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
    } else if (Array.isArray(node)) {
      for (const child of node) {
        walk(child);
      }
    } else if (isValidElement<{ className?: string; children?: ReactNode }>(node)) {
      const props = node.props;
      if (typeof props.className === "string") {
        const match = props.className.match(/language-([^\s]+)/);
        if (match) lang = match[1];
      }
      if (props.children !== undefined) {
        walk(props.children);
      }
    }
  }

  walk(children);
  return { code, lang };
}

export async function PreCodeBlock({ children, className }: PreCodeBlockProps) {
  const { code, lang } = extractCodeInfo(children);

  if (lang === "mermaid") {
    return <MermaidDiagram chart={code} className={className} />;
  }

  let highlightedHtml: string | null = null;
  try {
    highlightedHtml = await codeToHtml(code, {
      lang,
      theme: "github-dark-dimmed",
    });
  } catch {
    highlightedHtml = null;
  }

  return (
    <section className={`my-4 ${className ?? ""}`}>
      <CopyCodeButton code={code} className="mb-2 flex justify-end" />
      {highlightedHtml ? (
        <div dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      ) : (
        <pre className="overflow-x-auto rounded-code bg-surface-soft p-4 font-mono text-sm text-text-primary">
          <code>{code}</code>
        </pre>
      )}
    </section>
  );
}
