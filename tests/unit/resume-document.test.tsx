import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { profileData } from "@/data/profile";

describe("build-only resume document", () => {
  it("preserves full work history and project evidence in the downloadable document", () => {
    const html = renderToStaticMarkup(<ResumeDocument siteUrl="https://sq454313544.github.io" />);
    for (const experience of profileData.workExperiences) {
      expect(html).toContain(experience.company);
      expect(html).toContain(experience.role);
      for (const responsibility of experience.responsibilities) {
        expect(html).toContain(responsibility);
      }
    }
    for (const project of profileData.projectHighlights) {
      expect(html).toContain(project.title);
      for (const detail of project.details) {
        expect(html).toContain(detail);
      }
    }
    expect(html).toContain(profileData.education[0].school);
    for (const paragraph of profileData.agentWorkflow.resumeSummary) {
      expect(html).toContain(paragraph);
    }
    expect(html).toMatch(/<article><h3[^>]*>Agent 辅助研发与流程沉淀<\/h3><p/);
  });

  it("shows readable contact labels while preserving native clickable addresses", () => {
    const html = renderToStaticMarkup(<ResumeDocument siteUrl="https://sq454313544.github.io" />);
    expect(html).toMatch(/href="mailto:454313544@qq.com"[^>]*>邮箱：454313544@qq.com<\/a>/);
    expect(html).toMatch(/href="https:\/\/github.com\/sq454313544"[^>]*>GitHub：github.com\/sq454313544<\/a>/);
    expect(html).not.toContain("(mailto:");
  });

  it("resolves project links to the production site without client scripts", () => {
    const siteUrl = "https://sq454313544.github.io";
    const html = renderToStaticMarkup(<ResumeDocument siteUrl={siteUrl} />);
    for (const project of profileData.projectHighlights) {
      if (project.href) expect(html).toContain(`href="${new URL(project.href, siteUrl).href}"`);
    }
    expect(html).toContain(`href="${siteUrl}/about"`);
    expect(html).not.toContain("localhost");
    expect(html).not.toContain("127.0.0.1");
    expect(html).not.toContain("<script");
  });
});
