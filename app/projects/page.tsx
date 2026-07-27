import { loadProjects } from "@/lib/content/loaders";
import { getPublished, getAllTags } from "@/lib/content/queries";
import type { ProjectItem } from "@/lib/content/types";
import { ProjectList } from "@/components/projects/ProjectList";
import { Loading } from "@/components/primitives/states";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "项目作品集", description: "数据产品与自动化项目案例" };

export default function ProjectsPage() {
  const projects = loadProjects();
  const published = getPublished(projects).filter((item): item is ProjectItem => item.type === "project");
  const tags = getAllTags(projects);

  return (
    <main className="mx-auto w-full max-w-default px-5 py-10 sm:px-8 sm:py-14">
      <header className="border-b border-border pb-6"><p className="text-auxiliary font-medium text-primary">PROJECT WORK</p><h1 className="mt-2 text-h2 font-semibold leading-tight text-text-primary sm:text-h1">项目作品集</h1><p className="mt-3 text-body leading-body text-text-secondary">数据产品、自动化流程与智能应用的项目复盘。</p></header>
      <Suspense fallback={<Loading className="py-10" />}>
        <ProjectList projects={published} tags={tags} />
      </Suspense>
    </main>
  );
}
