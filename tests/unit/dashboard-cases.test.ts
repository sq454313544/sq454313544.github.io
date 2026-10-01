import { describe, expect, it } from "vitest";
import { getDashboardCases, getDashboardFilters, wecomDashboard } from "@/data/dashboard-cases";
import { loadDashboards } from "@/lib/content/loaders";

describe("BI and operational dashboard entry points", () => {
  const cases = getDashboardCases(loadDashboards());

  it("leads with current WeCom delivery and keeps the historical BI case", () => {
    expect(cases.map((entry) => entry.href)).toEqual([
      "/projects/data-warehouse-modernization#wecom-dashboards",
      "/dashboards/operations-process-analysis",
    ]);
    expect(wecomDashboard.deliveryLines.map((line) => line.status)).toEqual([
      "生产使用", "生产使用", "数据已上线 · 验收收尾",
    ]);
    expect(wecomDashboard.deliveryLines[2].description).toContain("正式验收与切换仍在收尾");
    expect(cases[1].statusLabel).toBe("历史交付 · 已停维");
  });

  it("offers only usable tool filters, with counts matching their results", () => {
    const { domains, tags } = getDashboardFilters(cases);
    expect(domains).toContain("法律业务运营");
    expect(tags).toContainEqual({ name: "企业微信智能表格", count: 1 });
    expect(tags).toContainEqual({ name: "Power Query", count: 1 });
    expect(tags.map((tag) => tag.name)).not.toContain("案件规模");
    for (const tag of tags) {
      expect(cases.filter((entry) => entry.tools.includes(tag.name))).toHaveLength(tag.count);
    }
  });
});
