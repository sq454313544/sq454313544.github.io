import type { MDXComponents } from "mdx/types";
import { MermaidDiagram } from "@/components/content/MermaidDiagram";
import { PreCodeBlock } from "@/components/content/PreCodeBlock";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    pre: PreCodeBlock as unknown as MDXComponents["pre"],
    MermaidDiagram,
    ...components,
  };
}
