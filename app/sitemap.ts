import { loadNotes, loadProjects, loadDashboards } from "@/lib/content/loaders";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const notes = loadNotes().filter((n) => !n.meta.draft);
  const projects = loadProjects();
  const dashboards = loadDashboards();

  const staticRoutes = ["", "/notes", "/projects", "/dashboards", "/search", "/tags", "/categories", "/about", "/resume"].map(
    (path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  const noteRoutes = notes.map((n) => ({
    url: `${BASE_URL}/notes/${n.slug}`,
    lastModified: new Date(n.meta.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    lastModified: new Date(p.meta.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const dashboardRoutes = dashboards.map((d) => ({
    url: `${BASE_URL}/dashboards/${d.slug}`,
    lastModified: new Date(d.meta.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...noteRoutes, ...projectRoutes, ...dashboardRoutes];
}
