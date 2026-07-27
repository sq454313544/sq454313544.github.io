import { describe, expect, it } from "vitest";
import { extractToc } from "@/components/content/Toc";

describe("extractToc", () => {
  it("keeps duplicate heading IDs unique in rehype-slug order", () => {
    const items = extractToc("## 重复标题\n\n## 重复标题\n\n### 子标题");

    expect(items).toEqual([
      { id: "重复标题", text: "重复标题", level: 2 },
      { id: "重复标题-1", text: "重复标题", level: 2 },
      { id: "子标题", text: "子标题", level: 3 },
    ]);
  });
});
