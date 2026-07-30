import type { MDXComponents } from "mdx/types";
import { DashboardScreenshot } from "@/components/content/DashboardScreenshot";
import { MermaidDiagram } from "@/components/content/MermaidDiagram";
import { PreCodeBlock } from "@/components/content/PreCodeBlock";

function joinClassNames(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    pre: PreCodeBlock as unknown as MDXComponents["pre"],
    DashboardScreenshot,
    MermaidDiagram,
    h2: ({ className, ...props }) => (
      <h2
        className={joinClassNames("mt-12 scroll-mt-20 text-h2 font-semibold leading-tight text-text-primary", className)}
        {...props}
      />
    ),
    h3: ({ className, ...props }) => (
      <h3
        className={joinClassNames("mt-8 scroll-mt-20 text-h3 font-semibold leading-tight text-text-primary", className)}
        {...props}
      />
    ),
    p: ({ className, ...props }) => (
      <p className={joinClassNames("mt-5 text-body leading-body text-text-secondary", className)} {...props} />
    ),
    a: ({ className, ...props }) => (
      <a
        className={joinClassNames("text-primary underline decoration-primary/40 underline-offset-4 transition-colors duration-150 ease-standard hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", className)}
        {...props}
      />
    ),
    ul: ({ className, ...props }) => (
      <ul className={joinClassNames("mt-5 list-disc space-y-2 pl-6 text-body leading-body text-text-secondary", className)} {...props} />
    ),
    ol: ({ className, ...props }) => (
      <ol className={joinClassNames("mt-5 list-decimal space-y-2 pl-6 text-body leading-body text-text-secondary", className)} {...props} />
    ),
    blockquote: ({ className, ...props }) => (
      <blockquote
        className={joinClassNames("mt-6 border-l-4 border-info-border bg-info-bg px-5 py-4 text-body leading-body text-info-text", className)}
        {...props}
      />
    ),
    table: ({ className, ...props }) => (
      <table className={joinClassNames("mt-6 w-full border-collapse text-left text-sm text-text-secondary", className)} {...props} />
    ),
    th: ({ className, ...props }) => (
      <th className={joinClassNames("border-b border-border bg-surface-soft px-3 py-2 font-semibold text-text-primary", className)} {...props} />
    ),
    td: ({ className, ...props }) => (
      <td className={joinClassNames("border-b border-border px-3 py-2 align-top", className)} {...props} />
    ),
    hr: ({ className, ...props }) => (
      <hr className={joinClassNames("my-10 border-border", className)} {...props} />
    ),
    ...components,
  };
}
