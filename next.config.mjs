import createMDX from "@next/mdx";

/** @type {import("next").NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      ["remark-frontmatter", ["yaml"]],
      ["remark-mdx-frontmatter", { name: "meta" }],
    ],
    rehypePlugins: [
      ["rehype-slug", {}],
    ],
  },
});

export default withMDX(nextConfig);
