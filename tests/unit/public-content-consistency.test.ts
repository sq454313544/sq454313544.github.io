import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { profileData } from "@/data/profile";

function source(path: string): string {
  return readFileSync(resolve(path), "utf-8");
}

describe("公开内容口径一致性", () => {
  it("首页、BI 案例与说明文档使用简历中的停维月份", () => {
    const bi = profileData.projectHighlights.find((project) =>
      project.title.startsWith("Power BI 经营分析平台"),
    );
    const month = bi?.details.join("").match(/已于 (\d{4}-\d{2}) 停止维护/)?.[1];
    expect(month).toBe("2026-08");
    for (const path of ["app/page.tsx", "content/dashboards/operations-process-analysis.mdx", "README.md"]) {
      expect(source(path), path).toContain(`${month} 停止维护`);
      expect(source(path), path).not.toMatch(/2026-09\s*停止维护/);
    }
  });

  it("数仓案例、关联笔记与简历区分服务器运行和未采用的增量设计", () => {
    const warehouse = profileData.projectHighlights.find((project) =>
      project.title.startsWith("企业数据仓库与治理"),
    );
    const texts = [
      profileData.workExperiences[0].responsibilities.join(""),
      warehouse?.details.join("") ?? "",
      source("content/projects/data-warehouse-modernization.mdx"),
      source("content/notes/warehouse-layers-facts-and-dimensions.mdx"),
      source("README.md"),
    ];
    for (const text of texts) {
      expect(text).toContain("当前在服务器运行");
      expect(text).toContain("因业务数据库本身情况暂未采用增量");
      expect(text).not.toMatch(/本机环境运行|保留待|后恢复|服务器部署属历史阶段/);
    }
    // 数据资产的快照月份与 BI 停维月份含义不同，不能全局替换日期。
    expect(warehouse?.details.join("")).toContain("2026-09 快照口径");
    expect(source("content/projects/data-warehouse-modernization.mdx")).toContain("2026-09 的公开快照记录");
  });

  it("简历、问数案例与封面均不再发布已删除的 Recall 数字", () => {
    for (const text of [
      JSON.stringify(profileData),
      source("content/projects/enterprise-qa-assistant.mdx"),
      source("public/covers/enterprise-qa-assistant.svg"),
    ]) {
      expect(text).not.toMatch(/51\s*条|39\.22%|82\.35%|Recall\s*40%|0\.412|0\.833/);
    }
  });

  it("简介与经历同步职位，能力说明明确增量属于设计", () => {
    expect(profileData.resumeSummary.join("")).toContain(profileData.workExperiences[0].role);
    const skills = profileData.skills.map((skill) => skill.boundaries).join("");
    expect(skills).toContain("全量刷新与增量链路设计");
    expect(skills).not.toContain("全量与增量协同刷新");
  });
});
