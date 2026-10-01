import { test, expect } from "@playwright/test";

test.describe("静态导出可读性", () => {
  test.use({ javaScriptEnabled: false });

  test("列表页与详情页在禁用脚本时仍有完整内容", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.locator("main ul[data-project-results] > li")).toHaveCount(3);
    await expect(page.getByRole("heading", { name: "企业数据仓库与治理" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "企业微信经营看板" })).toBeVisible();
    await expect(
      page.locator("a[href='/projects/data-warehouse-modernization/#wecom-dashboards']"),
    ).toBeVisible();

    await page.goto("/dashboards");
    await expect(page.locator("main ul[data-dashboard-results] > li")).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "法律业务经营分析看板" })).toBeVisible();
    await page.goto("/search");
    await expect(page.locator("input[type='search']")).toBeVisible();

    // 两个锚点在无脚本时也必须存在
    await page.goto("/projects/data-warehouse-modernization");
    await expect(page.locator("#wecom-dashboards")).toHaveCount(1);
    await expect(page.locator("#report-automation")).toHaveCount(1);
    await page.goto("/about");
    await expect(page.locator("#agent-workflow")).toHaveCount(1);
  });
});

test.describe("首页", () => {
  test("homepage leads with the combined data-and-AI positioning", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("金仔伟 · 数据与 AI");

    // 主标题与副标题按已确认文案呈现
    const h1 = page.locator("h1");
    await expect(h1).toContainText("数据工程与 AI 应用");
    await expect(page.getByText("数仓建设 · 数据治理 · 智能问数 · 知识库 · Agent 工作流")).toBeVisible();
    await expect(page.getByRole("link", { name: "金仔伟 · 数据与 AI" })).toBeVisible();

    // 首屏主行动：项目与简历
    await expect(page.getByRole("link", { name: "查看项目" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "下载简历" }).first()).toBeVisible();

    // 两类能力在首屏同时出现
    await expect(page.getByRole("heading", { name: "数据工程与治理" }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "AI 应用与 Agent 工程" }).first()).toBeVisible();
  });

  test("hero headline wraps without a single trailing character", async ({ page }) => {
    // F7：1440px 下主标题不应出现末尾单字独占一行
    for (const width of [1440, 1024, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const lineBoxes = await page.evaluate(() => {
        const heading = document.querySelector("h1");
        if (!heading) return [];
        // 用 Range 逐字测量，统计每个字所在的行
        const text = heading.textContent ?? "";
        const range = document.createRange();
        const lines = new Map<number, number>();
        let index = 0;
        for (const node of Array.from(heading.childNodes)) {
          if (node.nodeType !== Node.TEXT_NODE && node.nodeType !== Node.ELEMENT_NODE) continue;
          const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
          let textNode = walker.nextNode();
          while (textNode) {
            for (let i = 0; i < (textNode.textContent ?? "").length; i += 1) {
              range.setStart(textNode, i);
              range.setEnd(textNode, i + 1);
              const top = Math.round(range.getBoundingClientRect().top);
              lines.set(top, (lines.get(top) ?? 0) + 1);
              index += 1;
            }
            textNode = walker.nextNode();
          }
        }
        void text;
        void index;
        return [...lines.values()];
      });

      expect(lineBoxes.length, `${width}px 下未取到标题行信息`).toBeGreaterThan(0);
      // 每一行的字数都不应为 1（避免「践」单独占行）
      for (const count of lineBoxes) {
        expect(count, `${width}px 下主标题有 ${count} 字的一行`).toBeGreaterThan(1);
      }
    }
  });

  test("homepage lists all projects in one section led by two representative cases", async ({ page }) => {
    await page.goto("/");

    // 只有一个小节承载项目列表
    const section = page.locator("section").filter({ hasText: "数据、知识与应用的实际落地" });
    await expect(section).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "数据、知识与应用的实际落地" })).toHaveCount(1);

    // 旧的两块结构与复述主标题的小节标题都不应存在
    await expect(page.getByRole("heading", { name: /两条主线/ })).toHaveCount(0);
    await expect(page.locator("p").filter({ hasText: /^更多交付$/ })).toHaveCount(0);
    await expect(page.locator("p").filter({ hasText: /^代表案例$/ })).toHaveCount(0);

    // 一个列表里六张项目卡片（演示说明不算条目），两个代表案例排在最前
    const items = section.locator("ul[data-home-projects] > li:not([data-note])");
    await expect(items).toHaveCount(6);
    await expect(items.nth(0)).toContainText("企业数据仓库与治理");
    await expect(items.nth(1)).toContainText("企业智能问数助手");
    await expect(items.nth(2)).toContainText("企业知识库助手");
    await expect(items.nth(3)).toContainText("企业微信经营看板");
    await expect(items.nth(4)).toContainText("业务报表自动化");
    await expect(items.nth(5)).toContainText("Power BI 经营分析平台");

    // 前两张是代表案例，桌面占两列
    await expect(items.nth(0)).toHaveAttribute("data-featured", "true");
    await expect(items.nth(1)).toHaveAttribute("data-featured", "true");

    // 六张卡片都用了同一组字段
    for (let index = 0; index < 6; index += 1) {
      const card = items.nth(index);
      await expect(card.getByText("业务问题")).toBeVisible();
      await expect(card.getByText("我的工作")).toBeVisible();
      await expect(card.getByText("交付结果")).toBeVisible();
    }

    // 真实阶段分别表达：数仓本机运行 / 问数受控内部验证
    await expect(section.getByText("本机环境运行 · 日常全量刷新")).toBeVisible();
    await expect(section.getByText("受控内部验证阶段")).toBeVisible();
    await expect(section.getByText("历史交付 · 已停维")).toBeVisible();
  });

  test("homepage keeps knowledge base, wecom, report automation and BI entries", async ({ page }) => {
    await page.goto("/");

    // 报表自动化入口指向数仓详情的 report-automation 专节
    await expect(
      page.locator("a[href='/projects/data-warehouse-modernization/#report-automation']"),
    ).toBeVisible();
    await expect(
      page.locator("a[href='/projects/data-warehouse-modernization/#wecom-dashboards']").first(),
    ).toBeVisible();

    // 历史 BI 成果保留入口与演示说明
    await expect(page.locator("a[href^='/dashboards/operations-process-analysis']")).toHaveCount(1);
    await expect(page.locator("a[href='/resume/jin-zaiwei-resume.pdf']").first()).toBeVisible();
  });

  test("homepage Agent section explains the workflow and links to the about page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Agent 工作流：研发工作方式/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /了解我的工作方式/ })).toHaveAttribute(
      "href",
      "/about/#agent-workflow",
    );
    // 覆盖 Skills、AGENTS.md、MCP 与插件
    const section = page.locator("section").filter({ hasText: "Agent 工作流：研发工作方式" });
    await expect(section.getByText(/AGENTS\.md/).first()).toBeVisible();
    await expect(section.getByText(/Skill/).first()).toBeVisible();
    await expect(section.getByText(/MCP/).first()).toBeVisible();
  });

  test("homepage notes are curated across both data and AI topics", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("人工挑选，数据侧与 AI 侧各两篇，不按发布日期自动排序。")).toBeVisible();

    // 四篇精选：数据侧两篇 + AI 侧两篇
    for (const slug of [
      "multi-source-pipeline-self-audit",
      "wecom-batch-lifecycle-orphan-rows",
      "controlled-query-mcp-security",
      "agent-tool-calling-evaluation",
    ]) {
      await expect(page.locator(`a[href^='/notes/${slug}']`)).toBeVisible();
    }
  });

  test("desktop theme toggle cycles through light, dark, and system", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const themeToggle = page.getByRole("button", { name: /当前主题/ });
    await expect(themeToggle).toBeVisible();

    await themeToggle.click();
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("theme")))
      .toBe("light");

    await themeToggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await themeToggle.click();
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("theme")))
      .toBe("system");
  });

  test("mobile navigation closes with Escape and exposes the theme select", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: "打开导航菜单" });
    await expect(menuButton.locator("svg")).toBeVisible();
    await menuButton.click();
    await expect(page.getByLabel("移动端主导航")).toBeVisible();
    await expect(page.getByLabel("移动端主导航").getByLabel("选择主题")).toBeVisible();
    await expect(page.getByLabel("移动端主导航").getByRole("link", { name: "关于" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByLabel("移动端主导航")).toBeHidden();
  });
});

test.describe("笔记", () => {
  test("notes list page", async ({ page }) => {
    await page.goto("/notes");
    await expect(page.locator("h1")).toContainText("学习笔记");
    const links = page.locator("a[href^='/notes/']");
    await expect(links.first()).toBeVisible();
    await expect(page.locator("main img")).toHaveCount(0);
  });

  test("note detail page", async ({ page }) => {
    await page.goto("/notes/langgraph-state-nodes");
    await expect(page.locator("h1")).toContainText("LangGraph");
    await expect(page.locator("pre").first()).toBeVisible();
    await expect(page.locator("nav[aria-label='文章目录']").last()).toBeVisible();
  });

  test("enterprise data agent series is available through its shared tag", async ({ page }) => {
    await page.goto("/tags/enterprise-data-agent");
    await expect(page.locator("h1")).toContainText("enterprise-data-agent");

    for (const slug of [
      "registry-first-for-enterprise-analytics",
      "controlled-query-mcp-security",
      "enterprise-analytics-agent-architecture",
      "agent-tool-calling-evaluation",
      "agent-planner-optimization",
    ]) {
      await expect(page.locator(`a[href^='/notes/${slug}']`)).toBeVisible();
    }

    await page.goto("/notes/agent-tool-calling-evaluation");
    await expect(page.locator("h1")).toContainText("工具调用质量");
    const evaluationTable = page.locator("table").filter({ hasText: "工具选择" });
    await expect(evaluationTable).toHaveCount(1);
    await expect(evaluationTable).toContainText("端到端体验");

    await page.goto("/notes/agent-planner-optimization");
    await expect(page.locator("h1")).toContainText("Planner 优化");
  });
});

test.describe("项目", () => {
  test("projects list defaults to the combined order", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.locator("h1")).toContainText("项目案例");

    const cards = page.locator("main ul[data-project-results] > li");
    await expect(cards).toHaveCount(3);
    // 首组是数据工程与 AI 应用两个代表案例，其后是知识库
    await expect(cards.nth(0)).toContainText("企业数据仓库与治理");
    await expect(cards.nth(1)).toContainText("企业智能问数助手");
    await expect(cards.nth(2)).toContainText("企业知识库助手");

    // 企业微信交付作为数仓摘要展示，不重复建详情页
    await expect(page.getByRole("heading", { name: "企业微信经营看板" })).toBeVisible();
    await expect(
      page.locator("a[href='/projects/data-warehouse-modernization/#wecom-dashboards']"),
    ).toBeVisible();
  });

  test("projects list filters by display group, type and tech", async ({ page }) => {
    // 展示分类：数据工程 / AI 应用
    await page.goto("/projects?group=data");
    await expect(page.locator("main ul[data-project-results] > li")).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "企业数据仓库与治理" })).toBeVisible();

    await page.goto("/projects?group=ai");
    await expect(page.locator("main ul[data-project-results] > li")).toHaveCount(2);
    await expect(page.getByRole("heading", { name: "企业智能问数助手" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "企业知识库助手" })).toBeVisible();

    await page.goto("/projects?type=agent");
    await expect(page.locator("main ul[data-project-results] > li")).toHaveCount(2);
    // 技术栈筛选存在时不展示数仓交付摘要，避免误导
    await expect(page.getByRole("heading", { name: "企业微信经营看板" })).toBeHidden();

    await page.goto("/projects?tech=WeKnora");
    await expect(page.getByRole("heading", { name: "企业知识库助手" })).toBeVisible();
    await expect(page.locator("main ul[data-project-results] > li")).toHaveCount(1);

    await page.goto("/projects?tech=NotARealTech");
    await expect(page.getByText("暂无符合条件的项目案例")).toBeVisible();
  });

  test("project detail pages, including the warehouse delivery anchors", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/projects/enterprise-qa-assistant");
    await expect(page.locator("h1")).toContainText("智能问数");
    // 统一阅读框架：概览 → 架构 → 工程重点 → 取舍 → 复盘
    await expect(page.getByRole("heading", { name: "概览" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "架构" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "工程重点" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /一个值得追问的取舍/ })).toBeVisible();

    const layout = await page.evaluate(() => {
      const main = document.querySelector("main");
      const body = document.body.getBoundingClientRect();
      const rect = main?.getBoundingClientRect();
      return rect
        ? {
            bodyLeft: body.left,
            bodyRight: body.right,
            left: rect.left,
            right: rect.right,
            width: rect.width,
          }
        : null;
    });

    expect(layout).not.toBeNull();
    expect(layout?.width).toBeLessThanOrEqual(1080);
    expect(Math.abs(((layout?.left ?? 0) - (layout?.bodyLeft ?? 0)) - ((layout?.bodyRight ?? 0) - (layout?.right ?? 0)))).toBeLessThanOrEqual(1);

    await page.goto("/projects/data-warehouse-modernization");
    await expect(page.locator("h1")).toContainText("企业数据仓库与治理");
    // F1：历史实现与当前运行状态要区分
    await expect(page.getByText(/历史阶段/).first()).toBeVisible();
    await expect(page.getByText(/本机环境运行/).first()).toBeVisible();
    // 规模数字带快照口径，不写成实时值
    await expect(page.getByText(/2026-09 的公开快照记录/)).toBeVisible();
  });

  test("knowledge base case leads with an overview and folds the detail", async ({ page }) => {
    await page.goto("/projects/enterprise-knowledge-assistant");
    await expect(page.locator("h1")).toContainText("企业知识库助手");
    await expect(page.getByText("WeKnora").first()).toBeVisible();

    // F5：首屏可读到问题、职责、结果与阶段
    await expect(page.getByRole("heading", { name: "概览" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "我的工作" })).toBeVisible();
    const overview = page.locator("table").first();
    for (const label of ["业务问题", "我的职责", "已交付结果", "当前阶段"]) {
      await expect(overview).toContainText(label);
    }

    // 联调日志与完整待办移出主要阅读路径，按需展开
    await expect(page.getByText("以下内容属于实施过程记录，按需展开。")).toBeVisible();
    await expect(page.locator("main details")).toHaveCount(2);
    await expect(page.getByText("独立抽样验收题库（30 题）与人工裁定尚未启动")).toBeHidden();
    await page.locator("main details").nth(1).locator("summary").click();
    await expect(page.getByText("独立抽样验收题库（30 题）与人工裁定尚未启动")).toBeVisible();
  });
});

test.describe("锚点", () => {
  test("enterprise wecom dashboards anchor resolves without being hidden by the header", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/projects/data-warehouse-modernization#wecom-dashboards");

    const heading = page.getByRole("heading", { name: "企业微信经营看板" });
    await expect(heading).toBeVisible();

    const { top, headerBottom } = await page.evaluate(() => {
      const target = document.getElementById("wecom-dashboards");
      const header = document.querySelector(".site-header");
      return {
        top: target?.getBoundingClientRect().top ?? -1,
        headerBottom: header?.getBoundingClientRect().bottom ?? 0,
      };
    });

    expect(top).toBeGreaterThanOrEqual(-1);
    // 滚动定位不应被粘性导航遮挡
    expect(top).toBeGreaterThanOrEqual(headerBottom - 1);
  });

  test("agent workflow anchor resolves on the about page", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto("/about#agent-workflow");

    const heading = page.getByRole("heading", { name: "我的 Agent 工作方式" });
    await expect(heading).toBeVisible();

    const { top, headerBottom } = await page.evaluate(() => {
      const target = document.getElementById("agent-workflow");
      const header = document.querySelector(".site-header");
      return {
        top: target?.getBoundingClientRect().top ?? -1,
        headerBottom: header?.getBoundingClientRect().bottom ?? 0,
      };
    });

    expect(top).toBeGreaterThanOrEqual(-1);
    expect(top).toBeGreaterThanOrEqual(headerBottom - 1);
  });
});

test.describe("BI 案例", () => {
  test("single dashboard case renders sanitized screenshots", async ({ page }) => {
    await page.goto("/dashboards");
    await expect(page.locator("main ul[data-dashboard-results] a[href^='/dashboards/']")).toHaveCount(1);
    await expect(page.getByText("法律业务经营分析看板")).toBeVisible();
    await expect(page.getByText("真实项目 · 脱敏演示")).toBeVisible();
    await expect(page.getByText("历史交付 · 已停维").first()).toBeVisible();

    await page.goto("/dashboards/operations-process-analysis");
    await expect(page.locator("h1")).toContainText("法律业务经营分析");
    await expect(page.getByAltText(/案件运营总览脱敏截图/)).toBeVisible();
    await expect(page.getByAltText(/地区法院分析脱敏截图/)).toBeVisible();
    await expect(page.getByText("公开图片不包含真实客户")).toBeVisible();
    await expect(page.getByText("该平台已于 2026-09 停止维护")).toBeVisible();
    await expect(page.locator(".echarts-for-react, canvas")).toHaveCount(0);

    await page.goto("/dashboards?tool=Power%20Query");
    await expect(page.locator("main ul[data-dashboard-results] a[href^='/dashboards/']")).toHaveCount(1);
    await expect(page.getByText("法律业务经营分析看板")).toBeVisible();

    const oldResponse = await page.goto("/dashboards/payment-performance-analysis");
    expect(oldResponse?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
  });
});

test.describe("搜索", () => {
  test("search with URL param", async ({ page }) => {
    await page.goto("/search?q=LangGraph");
    await expect(page.locator("h1")).toContainText("搜索");
    const input = page.locator("input[type='search']");
    await expect(input).toHaveValue("LangGraph");
    const results = page.locator("a[href^='/notes/']");
    await expect(results.first()).toBeVisible();
  });

  test("new content is searchable", async ({ page }) => {
    await page.goto("/search?q=知识库");
    await expect(
      page.locator("a[href^='/projects/enterprise-knowledge-assistant']").first(),
    ).toBeVisible();

    await page.goto("/search?q=企业微信");
    await expect(
      page.locator("a[href^='/projects/data-warehouse-modernization']").first(),
    ).toBeVisible();

    // 标题里的词也要能搜到（全文检索含标题与描述）
    await page.goto("/search?q=批量数据同步");
    await expect(
      page.locator("a[href^='/notes/wecom-batch-lifecycle-orphan-rows']").first(),
    ).toBeVisible();

    await page.goto("/search?q=逐格一致");
    await expect(
      page.locator("a[href^='/notes/multi-source-pipeline-self-audit']").first(),
    ).toBeVisible();
  });

  test("search no results", async ({ page }) => {
    await page.goto("/search?q=xyznonexistent");
    await expect(page.getByText("未找到")).toBeVisible();
  });
});

test.describe("标签和分类", () => {
  test("tags page", async ({ page }) => {
    await page.goto("/tags");
    await expect(page.locator("h1")).toContainText("标签");
    await expect(page.locator("a[href^='/tags/']").first()).toBeVisible();
  });

  test("categories page", async ({ page }) => {
    await page.goto("/categories");
    await expect(page.locator("h1")).toContainText("分类");
  });
});

test.describe("404", () => {
  test("unknown slug returns 404", async ({ page }) => {
    const response = await page.goto("/notes/nonexistent-slug");
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toContainText("404");
  });

});

test.describe("导航与查询参数", () => {
  test("clicking a parameterless nav link on the same page clears the filter", async ({ page }) => {
    // F3：/projects/?type=agent 下点击顶部无参数「项目案例」应清除参数
    await page.goto("/projects?type=agent");
    await expect(page.locator("main ul[data-project-results] > li")).toHaveCount(2);

    const navLink = page.getByLabel("主导航").getByRole("link", { name: "项目案例" });
    await navLink.click();
    await page.waitForURL((url) => url.search === "");

    expect(new URL(page.url()).search).toBe("");
    await expect(page.locator("main ul[data-project-results] > li")).toHaveCount(3);
    await expect(page.getByRole("heading", { name: "企业数据仓库与治理" })).toBeVisible();
  });

  test("clicking the search entry on the search page clears the query", async ({ page }) => {
    // F3：/search/?q=知识库 下点击顶部无参数「搜索」应清除关键词
    await page.goto("/search?q=知识库");
    const input = page.locator("input[type='search']");
    await expect(input).toHaveValue("知识库");

    // 搜索入口在页头的工具区，不在 <nav aria-label="主导航"> 内
    await page.locator("header").getByRole("link", { name: "搜索" }).click();
    await page.waitForURL((url) => url.search === "");

    expect(new URL(page.url()).search).toBe("");
    await expect(input).toHaveValue("");
  });

  test("back and forward keep working after the reset", async ({ page }) => {
    await page.goto("/projects?type=agent");
    await expect(page.locator("main ul[data-project-results] > li")).toHaveCount(2);

    await page.getByLabel("主导航").getByRole("link", { name: "项目案例" }).click();
    await page.waitForURL((url) => url.search === "");
    await expect(page.locator("main ul[data-project-results] > li")).toHaveCount(3);

    // 返回键必须落在项目列表且可正常渲染，不能出现空白或错误页；
    // 浏览器对同路由 replaceState 的历史条目合并行为因浏览器而异，
    // 因此断言“仍在项目页且列表可用”，不绑定具体查询串。
    await page.goBack();
    await expect.poll(() => new URL(page.url()).pathname.replace(/\/+$/, "")).toBe("/projects");
    await expect(page.locator("h1")).toContainText("项目案例");
    const afterBack = await page.locator("main ul[data-project-results] > li").count();
    expect([2, 3]).toContain(afterBack);

    await page.goForward();
    await expect.poll(() => new URL(page.url()).pathname.replace(/\/+$/, "")).toBe("/projects");
    await expect(page.locator("main ul[data-project-results] > li")).toHaveCount(3);
    await expect(page.getByRole("heading", { name: "企业数据仓库与治理" })).toBeVisible();
  });

  test("filter links still apply parameters when they should", async ({ page }) => {
    await page.goto("/projects");
    await page.getByRole("link", { name: "AI 应用", exact: true }).click();
    await page.waitForURL((url) => url.searchParams.get("group") === "ai");
    await expect(page.locator("main ul[data-project-results] > li")).toHaveCount(2);
  });

  test("static navigation issues no unexpected resource requests", async ({ page }) => {
    // F4：静态导出下 RSC 预取路径必须可解析，否则导航退回整页 HTML 并产生 404
    const failures: string[] = [];
    const consoleErrors: string[] = [];
    page.on("response", (response) => {
      if (response.status() >= 400) {
        failures.push(`${response.status()} ${response.url()}`);
      }
    });
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    await page.goto("/");
    // 悬停触发预取
    for (const label of ["项目案例", "实践笔记", "关于"]) {
      await page.getByLabel("主导航").getByRole("link", { name: label }).hover();
      await page.waitForTimeout(150);
    }
    // 实际点击也要走一遍
    await page.getByLabel("主导航").getByRole("link", { name: "项目案例" }).click();
    await page.waitForTimeout(600);
    await page.locator("main ul[data-project-results] > li a").first().click();
    await page.waitForTimeout(600);

    expect(failures, `导航资源请求失败：\n${failures.join("\n")}`).toEqual([]);
    expect(consoleErrors, `控制台错误：\n${consoleErrors.join("\n")}`).toEqual([]);
  });
});

test.describe("关于与简历下载", () => {
  test("about presents concise capabilities, work history and one Agent example", async ({ page }) => {
    await page.goto("/about");
    const main = page.locator("main");
    await expect(main.locator("h1")).toContainText("金仔伟");
    await expect(main.getByRole("heading", { name: "我能做什么" })).toBeVisible();
    await expect(main.getByRole("heading", { name: "职业经历" })).toBeVisible();
    for (const group of ["数据工程与治理", "AI 应用与 Agent 工程", "BI 与业务交付"]) {
      await expect(main.getByRole("heading", { name: group, exact: true })).toHaveCount(1);
    }
    await expect(main.getByRole("heading", { name: "我的 Agent 工作方式" })).toBeVisible();
    await expect(main.getByRole("heading", { name: /一个实例/ })).toHaveCount(1);
    await expect(main.getByText(/Codex、OpenCode、DeepSeek Harness/)).toBeVisible();
    for (const company of ["湖南昂承律师事务所", "长沙恒顺智慧信息科技有限公司", "北京途游科技有限公司"]) {
      await expect(main.getByRole("heading", { name: new RegExp(company) })).toBeVisible();
    }
    await expect(main.getByText(/湖南机电职业技术学院/)).toBeVisible();
    await expect(main.getByRole("heading", { name: "工具与技术" })).toHaveCount(0);
    await expect(main.getByRole("heading", { name: "我在 AI 应用里实际做了什么" })).toHaveCount(0);
    await expect(main.getByText(/建设统一数据仓库：梳理业务源数据接入范围/)).toHaveCount(0);
    await expect(main.locator("a[href='/resume'], a[href='/resume/']")).toHaveCount(0);
  });

  test("contacts and resume download are visible in the first mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/about");
    const header = page.locator("main > header");
    const email = header.getByRole("link", { name: "454313544@qq.com" });
    await expect(email).toHaveAttribute("href", "mailto:454313544@qq.com");
    for (const link of [email, header.getByRole("link", { name: "GitHub" }), header.getByRole("link", { name: "下载简历" })]) {
      await expect(link).toBeVisible();
      const box = await link.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.y).toBeGreaterThan(0);
      expect(box!.y + box!.height).toBeLessThanOrEqual(844);
    }
  });

  test("navigation has one profile page and homepage downloads the resume", async ({ page }) => {
    await page.goto("/");
    const navigation = page.getByLabel("主导航", { exact: true });
    await expect(navigation.getByRole("link")).toHaveCount(3);
    await expect(navigation.getByRole("link", { name: "关于", exact: true })).toHaveAttribute("href", "/about/");
    await expect(navigation.locator("a[href='/resume'], a[href='/resume/']")).toHaveCount(0);
    const downloadLink = page.locator("main").getByRole("link", { name: "下载简历", exact: true }).first();
    await expect(downloadLink).toHaveAttribute("href", "/resume/jin-zaiwei-resume.pdf");
    const downloadPromise = page.waitForEvent("download");
    await downloadLink.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("jin-zaiwei-resume.pdf");
    expect(await download.failure()).toBeNull();
  });

  test("legacy resume URL reaches about without duplicating the profile", async ({ page }) => {
    await page.goto("/resume/");
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(page.locator("main h1")).toContainText("金仔伟");
  });

  test("legacy static fallback works without JavaScript and is excluded from indexing", async ({ browser, baseURL, request }) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      const response = await page.goto("/resume/");
      expect(response?.status()).toBe(200);
      await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", /noindex/);
      await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", "https://sq454313544.github.io/about/");
      await expect(page.locator("main .resume-card")).toHaveCount(0);
      await expect(page.locator("main").getByRole("link", { name: "下载简历" })).toHaveAttribute("href", "/resume/jin-zaiwei-resume.pdf");
      await page.getByRole("link", { name: "前往关于我" }).click();
      await expect(page).toHaveURL(/\/about\/$/);
      await expect(page.locator("main h1")).toContainText("金仔伟");
    } finally {
      await context.close();
    }
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).not.toMatch(/<loc>[^<]*\/resume\/?<\/loc>/);
  });

  test("standalone PDF downloads as two pages and the print template is not published", async ({ page, request }) => {
    await page.goto("/about");
    const link = page.locator("main").getByRole("link", { name: "下载简历" });
    await expect(link).toHaveAttribute("href", "/resume/jin-zaiwei-resume.pdf");
    const response = await request.get("/resume/jin-zaiwei-resume.pdf");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    const body = await response.body();
    expect(body.subarray(0, 5).toString("latin1")).toBe("%PDF-");
    const pdf = body.toString("latin1");
    expect(pdf).not.toContain("localhost");
    expect(pdf).not.toContain("127.0.0.1");
    expect(Number(/\/Count\s+(\d+)/.exec(pdf)?.[1] ?? 0)).toBe(2);
    expect((await request.get("/__resume-print__/")).status()).toBe(404);
  });
});

test.describe("无横向溢出", () => {
  test("390px 与 768px 主要页面", async ({ page }) => {
    for (const width of [390, 768]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of [
        "/",
        "/projects",
        "/projects/data-warehouse-modernization",
        "/projects/enterprise-knowledge-assistant",
        "/about",
        "/resume",
        "/notes/langgraph-state-nodes",
        "/dashboards",
      ]) {
        await page.goto(path);
        if (path === "/resume") await expect(page).toHaveURL(/\/about\/$/);
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = await page.evaluate(() => window.innerWidth);
        expect(bodyWidth, `${path} @ ${width}px should not overflow`).toBeLessThanOrEqual(viewportWidth + 1);
      }
    }
  });

  test("1440px 主要页面", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const path of ["/", "/projects", "/projects/data-warehouse-modernization", "/about", "/resume"]) {
      await page.goto(path);
      if (path === "/resume") await expect(page).toHaveURL(/\/about\/$/);
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth, `${path} @ 1440px should not overflow`).toBeLessThanOrEqual(viewportWidth + 1);
    }
  });
});
