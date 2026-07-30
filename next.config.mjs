import createMDX from "@next/mdx";

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      ["remark-frontmatter", ["yaml"]],
      ["remark-mdx-frontmatter", { name: "meta" }],
      ["remark-gfm", {}],
    ],
    rehypePlugins: [
      ["rehype-slug", {}],
    ],
  },
});

export default withMDX(nextConfig);
