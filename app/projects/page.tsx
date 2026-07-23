import Link from "next/link";
import { loadProjects } from "@/lib/content/loaders";
import { getPublished, getAllTags } from "@/lib/content/queries";
import type { ProjectItem } from "@/lib/content/types";
import { Empty } from "@/components/primitives/states";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "项目作品集",
  description: "数据产品与 AI Agent 相关项目案例",
};

export default function ProjectsPage() {
  const projects = loadProjects();
  const published = getPublished(projects).filter(
    (p): p is ProjectItem => p.type === "project"
  );
  const tags = getAllTags(projects);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">项目作品集</h1>
      <p className="text-gray-500 mb-6">数据产品与 AI Agent 相关项目案例</p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {tags.map((tag) => (
            <span
              key={tag.name}
              className="text-xs bg-gray-50 px-2 py-0.5 rounded"
            >
              {tag.name} ({tag.count})
            </span>
          ))}
        </div>
      )}

      {published.length === 0 ? (
        <Empty message="暂无项目案例" />
      ) : (
        <ul className="divide-y">
          {published.map((project) => (
            <li key={project.slug} className="py-4">
              <Link
                href={`/projects/${project.slug}`}
                className="block group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-medium group-hover:text-gray-600">
                    {project.meta.title}
                  </h3>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                    {project.meta.status === "completed"
                      ? "已完成"
                      : project.meta.status === "in_progress"
                        ? "进行中"
                        : project.meta.status === "maintained"
                          ? "维护中"
                          : "已归档"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {project.meta.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                  <span>{project.meta.publishedAt}</span>
                  <span>·</span>
                  <span>{project.meta.projectType}</span>
                  {project.meta.techStack.slice(0, 4).map((tech) => (
                    <span key={tech} className="bg-gray-50 px-1.5 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
