import { afterEach, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { checkContent } from "@/lib/content/content-check";

const temporaryDirectories: string[] = [];

function createContentFixture(type: "notes" | "projects" | "dashboards", filename: string, content: string): string {
  const directory = mkdtempSync(join(tmpdir(), "personal-tech-site-content-check-"));
  temporaryDirectories.push(directory);
  const contentDirectory = join(directory, type);
  mkdirSync(contentDirectory);
  writeFileSync(join(contentDirectory, filename), content, "utf-8");
  return directory;
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("checkContent", () => {
  it("reports a file path and Schema error for an invalid project type", () => {
    const directory = createContentFixture(
      "projects",
      "invalid-project.mdx",
      `---
title: "Invalid project"
description: "Schema test"
publishedAt: "2026-01-01"
updatedAt: "2026-01-01"
projectType: "invalid"
status: "completed"
techStack: ["TypeScript"]
---`,
    );

    const result = checkContent(directory);

    expect(result.totalFiles).toBe(1);
    expect(result.validFiles).toBe(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain("invalid-project.mdx");
    expect(result.errors[0]).toContain("projectType");
  });

  it("reports missing Dashboard metrics", () => {
    const directory = createContentFixture(
      "dashboards",
      "missing-metrics.mdx",
      `---
title: "Missing metrics"
description: "Schema test"
publishedAt: "2026-01-01"
updatedAt: "2026-01-01"
businessDomain: "运营"
tools: ["Power BI"]
---`,
    );

    const result = checkContent(directory);

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain("missing-metrics.mdx");
    expect(result.errors[0]).toContain("metrics");
  });
});
