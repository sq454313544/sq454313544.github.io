import { describe, expect, it } from "vitest";
import { profileData } from "@/data/profile";

describe("profileData", () => {
  it("publishes the combined data-and-AI positioning consistently", () => {
    expect(profileData.profile.siteIdentity).toBe("金仔伟 · 数据与 AI");
    expect(profileData.profile.headline).toBe("数据工程与 AI 应用");
    expect(profileData.profile.subtitle).toBe(
      "数仓建设 · 数据治理 · 智能问数 · 知识库 · Agent 工作流",
    );
    expect(profileData.profile.availability).toBe("在职，考虑机会");
    expect(profileData.profile.location).toBe("长沙");

    // 简介同时覆盖数据与 AI 两侧，并说明验证方式
    const summary = profileData.profile.summary;
    for (const topic of ["数仓建模", "智能问数", "知识库", "Agent 工作流", "对账"]) {
      expect(summary).toContain(topic);
    }

    // 首屏两类能力同等呈现
    expect(profileData.capabilityGroups.map((group) => group.title)).toEqual([
      "数据工程与治理",
      "AI 应用与 Agent 工程",
    ]);
    for (const group of profileData.capabilityGroups) {
      expect(group.description.length).toBeGreaterThan(20);
      expect(group.items.length).toBeGreaterThanOrEqual(2);
    }

    // 旧的单一优先方向不再出现在任何共享资料里
    const serialized = JSON.stringify(profileData);
    for (const retired of ["数据开发工程师｜", "以企业数据仓库建设为主线"]) {
      expect(serialized).not.toContain(retired);
    }
  });

  it("claims only the data-experience duration the periods support", () => {
    const summary = profileData.resumeSummary.join("");
    // 数据岗为 2024.11 起（数据专员 → 数据分析师），合计不足 2 年；
    // 游戏测试不计入数据经验
    expect(summary).toContain("约 2 年数据岗位经验");

    for (const inflated of ["4 年数据", "5 年数据", "2 年以上数据", "多年数据", "资深"]) {
      expect(summary).not.toContain(inflated);
    }
    // 游戏测试经历如实说明，不并入数据年限
    expect(summary).toContain("游戏测试");
  });

  it("derives the data-experience span from the actual data-role periods", () => {
    const dataRoles = ["数据分析师", "数据专员"];
    const months = profileData.workExperiences
      .filter((experience) => dataRoles.includes(experience.role))
      .reduce((total, experience) => {
        const [startYear, startMonth] = experience.period.start.split(".").map(Number);
        // 至今按 2026.09 计（摘要写于当期）
        const [endYear, endMonth] = (experience.period.end ?? "2026.09")
          .split(".")
          .map(Number);
        return total + ((endYear - startYear) * 12 + (endMonth - startMonth));
      }, 0);

    // 2024.11–2026.02 = 15 个月，2026.04–2026.09 = 5 个月，合计 20 个月
    expect(months).toBe(20);
    expect(months).toBeLessThan(24);
    // 因此只能声明“约 2 年”，不能写“2 年以上”或更大
    expect(profileData.resumeSummary.join("")).not.toMatch(/[2-9] 年以上数据/);
  });

  it("keeps the real work history, roles and periods", () => {
    expect(
      profileData.workExperiences.map((experience) => experience.company),
    ).toEqual([
      "湖南昂承律师事务所",
      "长沙恒顺智慧信息科技有限公司",
      "北京途游科技有限公司",
    ]);
    expect(profileData.workExperiences.map((experience) => experience.role)).toEqual([
      "数据分析师",
      "数据专员",
      "游戏测试工程师",
    ]);
    expect(
      profileData.workExperiences.map((experience) => experience.period.start),
    ).toEqual(["2026.04", "2024.11", "2021.04"]);

    // 当前经历覆盖数仓、多源采集、质量治理、企微看板、报表取数、智能问数与知识库
    const current = profileData.workExperiences[0].responsibilities.join("");
    for (const topic of [
      "数据仓库",
      "多源采集",
      "质量",
      "企业微信",
      "报表",
      "智能问数",
      "知识库",
    ]) {
      expect(current).toContain(topic);
    }

    expect(profileData.education[0].school).toBe("湖南机电职业技术学院");
    expect(profileData.education[0].period).toEqual({
      start: "2017.09",
      end: "2020.06",
    });
  });

  it("separates the current local environment from the historical server stage", () => {
    // F1：数仓当前只在本机环境运行、日常走全量刷新；服务器部署是历史阶段。
    // 这三处（经历、项目成果、简介）都必须区分，不能把历史能力写成当前运行状态。
    const current = profileData.workExperiences[0].responsibilities.join("");
    expect(current).toContain("本机环境运行");
    expect(current).toContain("全量刷新");
    expect(current).toContain("增量链路");

    const warehouse = profileData.projectHighlights.find((project) =>
      project.title.startsWith("企业数据仓库与治理"),
    );
    const warehouseText = warehouse?.details.join("") ?? "";
    expect(warehouseText).toContain("本机环境运行");
    expect(warehouseText).toContain("历史阶段");

    // 不能再说当前的“日间增量协同刷新”
    const serialized = JSON.stringify(profileData);
    expect(serialized).not.toContain("日间增量");
    expect(serialized).not.toContain("已完成服务器运行环境部署");
  });

  it("keeps every core work area reachable from the representative projects", () => {
    const titles = profileData.projectHighlights.map((project) => project.title);
    expect(titles).toEqual([
      "企业数据仓库与治理",
      "企业智能问数助手",
      "企业知识库助手",
      "企业微信经营看板",
      "Power BI 经营分析平台（历史交付）",
    ]);

    // 两条主线各有一个代表案例排在最前，其后是知识库与业务交付
    const hrefs = profileData.projectHighlights
      .map((project) => project.href)
      .filter((href): href is string => typeof href === "string");
    for (const href of [
      "/projects/data-warehouse-modernization",
      "/projects/enterprise-qa-assistant",
      "/projects/enterprise-knowledge-assistant",
      "/projects/data-warehouse-modernization#wecom-dashboards",
    ]) {
      expect(hrefs).toContain(href);
    }

    // BI 明确标注为历史交付，避免被读成仍在维护
    const biProject = profileData.projectHighlights.find(
      (project) => project.title.startsWith("Power BI 经营分析平台"),
    );
    const biText = biProject?.details.join("") ?? "";
    expect(biText).toContain("停止维护");
    // 初次搭建与后续切源分开说明，避免被误读为接手已有 BI 平台。
    expect(biText).toContain("从零搭建");
    expect(biText).toContain("基于旧数仓数据设计语义模型并开发报表");
    expect(biText).toContain("自建数仓切源");
    for (const wrong of ["重建语义模型与报表", "从旧数仓及业务表直连切换", "迁移至数仓", "接手他人平台"]) {
      expect(biText).not.toContain(wrong);
    }
  });

  it("organises capabilities into the three agreed groups", () => {
    expect(profileData.skills.map((skill) => skill.title)).toEqual([
      "数据工程与治理",
      "AI 应用与 Agent 工程",
      "BI 与业务交付",
    ]);

    const aiSkills = profileData.skills[1].boundaries;
    for (const topic of ["LangGraph", "MCP", "受控查询", "评测"]) {
      expect(aiSkills).toContain(topic);
    }
  });

  it("describes the AI-assisted workflow without inventing autonomy", () => {
    const workflow = profileData.agentWorkflow;
    expect(workflow.capabilities).toHaveLength(4);
    expect(workflow.summary).toContain("Codex、OpenCode、DeepSeek Harness");
    // Skills、AGENTS.md、MCP 与插件都要有实际落点说明
    for (const topic of ["Skills", "AGENTS.md", "MCP", "插件"]) {
      expect(`${workflow.summary}${workflow.capabilities.map((c) => c.description).join("")}`).toContain(topic);
    }
    expect(workflow.title).toContain("研发工作方式");

    const text = `${workflow.summary}${workflow.example.paragraph}`;
    // 关键口径与发布由本人判断，不写成自动编排平台
    expect(text).toContain("由我判断");
    for (const forbidden of ["全自动", "自动编排平台", "独立架构师", "精通"]) {
      expect(text).not.toContain(forbidden);
    }
  });

  it("keeps project figures scoped to their stated snapshot", () => {
    const serialized = JSON.stringify(profileData);

    for (const value of [
      "102 张可用表",
      "接近 300 张表 / 视图",
      "150 个 DAX 度量",
      "51 条离线检索评估集",
      "39.22% 提升至 82.35%",
      "受控内部验证阶段",
      "内部验证阶段",
    ]) {
      expect(serialized).toContain(value);
    }

    // 行业常见的 143 / 276 与内部字典的 144 / 278 快照日期、统计范围不同，
    // 公开页面不做机械替换，改用可核实的同步表数与定性规模表达
    for (const retired of ["143 张业务源表", "276 张表 / 视图"]) {
      expect(serialized).not.toContain(retired);
    }

    // 规模数字必须说明快照口径，避免被读成实时值
    expect(serialized).toContain("2026-09 快照");

    // 首页不再用并列数字墙；指标应放在有语境的链路与案例中
    expect("siteHighlights" in profileData).toBe(false);

    // 收益类表述没有可靠基线时保持定性
    for (const forbidden of ["效率提升约 60%", "节省", "提升面试率"]) {
      expect(serialized).not.toContain(forbidden);
    }
  });

  it("does not publish a phone number", () => {
    expect(JSON.stringify(profileData)).not.toMatch(/\b1[3-9]\d{9}\b/);
  });
});
