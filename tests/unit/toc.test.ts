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

  it("includes explicit-anchor headings in document order", () => {
    const items = extractToc(
      [
        "## 关键交付",
        "",
        '### 分层模型与数据资产',
        "",
        '<h3 id="wecom-dashboards" className="scroll-mt-24">企业微信经营看板</h3>',
        "",
        "正文",
        "",
        "## 可公开成果",
      ].join("\n"),
    );

    expect(items.map((item) => item.id)).toEqual([
      "关键交付",
      "分层模型与数据资产",
      "wecom-dashboards",
      "可公开成果",
    ]);
    expect(items[2]).toEqual({ id: "wecom-dashboards", text: "企业微信经营看板", level: 3 });
  });
});
