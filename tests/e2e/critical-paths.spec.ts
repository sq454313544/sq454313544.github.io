import { test, expect } from "@playwright/test";

test.describe("首页", () => {
  test("homepage renders", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("金仔伟 · 数据产品工程师");
    await expect(page.locator("h1")).toContainText("数据产品工程师");
    await expect(page.getByRole("link", { name: "金仔伟 · Data & AI" })).toBeVisible();
    await expect(page.getByText("精选项目")).toBeVisible();
    await expect(page.getByRole("heading", { name: "经营分析与数据表达" })).toBeVisible();
    await expect(page.getByText("模拟数据").first()).toBeVisible();
    await expect(page.locator("a[href^='/resume']").last()).toBeVisible();
  });

  test("desktop theme toggle cycles through light, dark, and system", async ({ page }) => {
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
    await expect(page.getByLabel("选择主题")).toBeVisible();
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
  test("projects list page", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.locator("h1")).toContainText("项目");

    await page.goto("/projects?type=agent");
    await expect(page.getByRole("heading", { name: "企业智能问数助手" })).toBeVisible();
  });

  test("project detail pages", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/projects/enterprise-qa-assistant");
    await expect(page.locator("h1")).toContainText("智能问数");

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
    await expect(page.locator("h1")).toContainText("数据仓库重构");
  });
});

test.describe("BI 案例", () => {
  test("dashboards page renders chart", async ({ page }) => {
    await page.goto("/dashboards/operations-process-analysis");
    await expect(page.locator("h1")).toContainText("业务流程");
    const chart = page.locator(".echarts-for-react, canvas");
    // ECharts may render as canvas
    await expect(chart.first()).toBeVisible({ timeout: 10000 });

    await page.goto("/dashboards/payment-performance-analysis");
    await expect(page.locator("h1")).toContainText("回款与团队绩效");

    await page.goto("/dashboards?tool=Power%20Query");
    await expect(page.locator("main ul[data-dashboard-results] a[href^='/dashboards/']")).toHaveCount(1);
    await expect(page.getByText("回款与团队绩效分析看板")).toBeVisible();
    await expect(page.getByText("模拟数据")).toBeVisible();
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

test.describe("辅助页面", () => {
  test("about page", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("h1")).toContainText("金仔伟");
    await expect(page.getByRole("heading", { name: "工作经历" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "核心能力" })).toBeVisible();
    await expect(page.getByText("湖南昂承律师事务所")).toBeVisible();
    await expect(page.getByText(/Codex、OpenCode/)).toBeVisible();
    await expect(page.getByRole("link", { name: "454313544@qq.com" })).toHaveAttribute("href", "mailto:454313544@qq.com");
  });

  test("resume page", async ({ page }) => {
    await page.goto("/resume");
    await expect(page.locator("h1")).toContainText("金仔伟");
    await expect(page.getByText("在线简历")).toBeVisible();
    await expect(page.getByRole("heading", { name: "代表项目" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "教育背景" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /长沙恒顺智慧信息科技有限公司/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /北京途游科技有限公司/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Power BI 经营分析平台重构" })).toBeVisible();
    await expect(page.getByText(/51 条离线评估集/)).toBeVisible();
    await expect(page.getByRole("button", { name: "打印 / 保存为 PDF" })).toBeVisible();
  });
});

test.describe("无横向溢出", () => {
  test("390px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    for (const path of ["/", "/about", "/resume", "/notes/langgraph-state-nodes", "/dashboards"]) {
      await page.goto(path);
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth, `${path} should not overflow`).toBeLessThanOrEqual(viewportWidth + 1);
    }
  });
});
