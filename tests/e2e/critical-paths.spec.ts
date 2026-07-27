import { test, expect } from "@playwright/test";

test.describe("首页", () => {
  test("homepage renders", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/BI.*AI|数据产品工程师/);
    await expect(page.locator("h1")).toContainText("数据产品工程师");
    await expect(page.getByText("精选项目")).toBeVisible();
    await expect(page.locator("a[href='/resume']").last()).toBeVisible();
  });

  test("theme switch supports light, dark, and system", async ({ page }) => {
    await page.goto("/");

    const themeSelect = page.getByLabel("选择主题");
    await expect(themeSelect).toBeVisible();

    await themeSelect.selectOption("dark");
    await expect(page.locator("html")).toHaveClass(/dark/);

    await themeSelect.selectOption("light");
    await expect(page.locator("html")).toHaveClass(/light/);

    await themeSelect.selectOption("system");
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("theme")))
      .toBe("system");
  });
});

test.describe("笔记", () => {
  test("notes list page", async ({ page }) => {
    await page.goto("/notes");
    await expect(page.locator("h1")).toContainText("学习笔记");
    const links = page.locator("a[href^='/notes/']");
    await expect(links.first()).toBeVisible();
  });

  test("note detail page", async ({ page }) => {
    await page.goto("/notes/langgraph-state-nodes");
    await expect(page.locator("h1")).toContainText("LangGraph");
    await expect(page.locator("pre").first()).toBeVisible();
    await expect(page.locator("nav[aria-label='文章目录']").last()).toBeVisible();
  });
});

test.describe("项目", () => {
  test("projects list page", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.locator("h1")).toContainText("项目");
  });

  test("project detail page", async ({ page }) => {
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
  });
});

test.describe("BI 案例", () => {
  test("dashboards page renders chart", async ({ page }) => {
    await page.goto("/dashboards/business-analysis-mock");
    await expect(page.locator("h1")).toContainText("经营分析");
    const chart = page.locator(".echarts-for-react, canvas");
    // ECharts may render as canvas
    await expect(chart.first()).toBeVisible({ timeout: 10000 });
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
    await expect(page.locator("h1")).toContainText("数据产品工程师");
    await expect(page.getByRole("heading", { name: "工作经历" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "核心能力" })).toBeVisible();
  });

  test("resume page", async ({ page }) => {
    await page.goto("/resume");
    await expect(page.locator("h1")).toContainText("数据产品工程师");
    await expect(page.getByText("在线简历")).toBeVisible();
    await expect(page.getByRole("heading", { name: "项目亮点" })).toBeVisible();
  });
});

test.describe("无横向溢出", () => {
  test("390px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    for (const path of ["/", "/about", "/resume", "/notes/langgraph-state-nodes"]) {
      await page.goto(path);
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth, `${path} should not overflow`).toBeLessThanOrEqual(viewportWidth + 1);
    }
  });
});
