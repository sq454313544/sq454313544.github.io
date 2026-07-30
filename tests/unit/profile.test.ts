import { describe, expect, it } from "vitest";
import { profileData } from "@/data/profile";

describe("profileData", () => {
  it("preserves the complete July 2026 resume structure", () => {
    expect(profileData.profile.headline).toBe(
      "数据产品工程师｜Power BI｜AI 数据应用｜数据工程",
    );
    expect(profileData.profile.availability).toBe("在职，考虑机会");
    expect(profileData.resumeSummary).toHaveLength(2);
    expect(profileData.resumeSummary[1]).toContain("Codex、OpenCode");

    expect(
      profileData.workExperiences.map((experience) => experience.company),
    ).toEqual([
      "湖南昂承律师事务所",
      "长沙恒顺智慧信息科技有限公司",
      "北京途游科技有限公司",
    ]);
    expect(
      profileData.workExperiences.map(
        (experience) => experience.responsibilities.length,
      ),
    ).toEqual([6, 3, 2]);

    expect(
      profileData.projectHighlights.map((project) => project.title),
    ).toEqual([
      "企业数据仓库建设",
      "Power BI 经营分析平台重构",
      "企业智能问数助手",
    ]);
    expect(
      profileData.projectHighlights.map((project) => project.details.length),
    ).toEqual([3, 3, 3]);
  });

  it("uses the latest public project figures", () => {
    const serialized = JSON.stringify(profileData);

    for (const value of [
      "143 张业务源表",
      "102 张可用表",
      "276 张表/视图",
      "150 个 DAX 度量值",
      "51 条离线评估集",
      "39.22% 提升至 82.35%",
      "MRR 从 0.412 提升至 0.833",
      "246 项通过",
    ]) {
      expect(serialized).toContain(value);
    }
  });

  it("does not publish a phone number", () => {
    expect(JSON.stringify(profileData)).not.toMatch(/\b1[3-9]\d{9}\b/);
  });
});
