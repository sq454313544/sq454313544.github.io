import type { MDXComponents } from "mdx/types";
import { MermaidDiagram } from "@/components/content/MermaidDiagram";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    MermaidDiagram,
    ...components,
  };
}
