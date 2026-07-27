import Link from "next/link";
import type { Metadata } from "next";
import { profileData } from "@/data/profile";
import { loadDashboards, loadNotes, loadProjects } from "@/lib/content/loaders";

export const metadata: Metadata = {
  title: "数据产品工程师 · BI / AI 数据应用",
};

export default function HomePage() {
  const projects = [...loadProjects()]
    .sort((a, b) => Number(b.meta.featured) - Number(a.meta.featured))
    .slice(0, 3);
  const dashboards = [...loadDashboards()]
    .sort((a, b) => Number(b.meta.featured) - Number(a.meta.featured))
    .slice(0, 2);
  const notes = [...loadNotes()]
    .filter((note) => !note.meta.draft)
    .sort(
      (a, b) =>
        new Date(b.meta.publishedAt).getTime() -
        new Date(a.meta.publishedAt).getTime()
    )
    .slice(0, 5);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
      <section className="grid gap-8 border-b border-border pb-12 lg:grid-cols-[minmax(0,7fr)_minmax(18rem,5fr)]">
        <div>
          <p className="text-sm font-medium text-primary">数据产品工程师</p>
          <h1 className="mt-3 text-h1 font-semibold leading-tight text-text-primary">
            数据产品工程师 · BI / AI 数据应用
          </h1>
          <p className="mt-5 max-w-2xl text-body leading-body text-text-secondary">
            {profileData.profile.summary}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/projects" className="rounded-button bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 ease-standard hover:bg-primary-hover">
              查看项目
            </Link>
            <Link href="/notes" className="rounded-button border border-border px-4 py-2.5 text-sm font-medium text-text-primary transition-colors duration-150 ease-standard hover:bg-surface-soft">
              阅读笔记
            </Link>
          </div>
        </div>
        <aside aria-label="能力概览" className="border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-text-primary">能力概览</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 text-sm text-text-secondary">
            {['Data Product', 'Power BI', 'Agent / RAG', 'SQL', 'Python', '指标治理'].map((skill) => (
              <li key={skill} className="border-l-2 border-accent-border pl-3">{skill}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-text-muted">精选项目</p>
            <h2 className="mt-1 text-h2 font-semibold text-text-primary">从问题到可维护的方案</h2>
          </div>
          <Link href="/projects" className="text-sm font-medium text-primary hover:text-primary-hover">全部项目 →</Link>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article key={project.slug} className="flex min-h-56 flex-col border border-border bg-surface p-5">
              <p className="text-tag text-text-muted">{project.meta.projectType}</p>
              <h3 className="mt-3 text-card-title font-semibold text-text-primary">{project.meta.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">{project.meta.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.meta.techStack.slice(0, 3).map((item) => <span key={item} className="rounded-tag bg-surface-soft px-2 py-1 text-tag text-text-secondary">{item}</span>)}
              </div>
              <Link href={`/projects/${project.slug}`} className="mt-5 text-sm font-medium text-primary hover:text-primary-hover">查看案例 →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border py-12">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-sm text-text-muted">BI 案例</p><h2 className="mt-1 text-h2 font-semibold text-text-primary">经营分析与数据表达</h2></div>
          <Link href="/dashboards" className="text-sm font-medium text-primary hover:text-primary-hover">全部案例 →</Link>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {dashboards.map((dashboard) => (
            <article key={dashboard.slug} className="border border-border bg-surface p-5">
              <p className="text-tag text-text-muted">{dashboard.meta.businessDomain} · 模拟数据</p>
              <h3 className="mt-3 text-card-title font-semibold text-text-primary">{dashboard.meta.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{dashboard.meta.description}</p>
              <p className="mt-4 text-sm text-text-muted">{dashboard.meta.metrics.slice(0, 3).join(' · ')}</p>
              <Link href={`/dashboards/${dashboard.slug}`} className="mt-5 inline-block text-sm font-medium text-primary hover:text-primary-hover">查看分析过程 →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border py-12">
        <p className="text-sm text-text-muted">核心能力</p>
        <h2 className="mt-1 text-h2 font-semibold text-text-primary">把分析能力落到产品和工程中</h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profileData.skills.map((skill) => <article key={skill.title} className="border-t-2 border-accent-border pt-4"><h3 className="font-semibold text-text-primary">{skill.title}</h3><p className="mt-2 text-sm leading-relaxed text-text-secondary">{skill.boundaries}</p></article>)}
        </div>
      </section>

      <section className="border-t border-border py-12">
        <div className="flex items-end justify-between gap-4"><div><p className="text-sm text-text-muted">最新笔记</p><h2 className="mt-1 text-h2 font-semibold text-text-primary">学习与复盘</h2></div><Link href="/notes" className="text-sm font-medium text-primary hover:text-primary-hover">全部笔记 →</Link></div>
        <ol className="mt-7 divide-y divide-border border-y border-border">
          {notes.map((note) => <li key={note.slug}><Link href={`/notes/${note.slug}`} className="grid gap-1 py-4 transition-colors hover:bg-surface-soft sm:grid-cols-[7rem_8rem_1fr_auto] sm:items-center sm:gap-4"><time className="text-sm text-text-muted">{note.meta.publishedAt}</time><span className="text-sm text-text-secondary">{note.meta.category}</span><span className="font-medium text-text-primary">{note.meta.title}</span><span className="text-sm text-text-muted">{note.readingTime} 分钟</span></Link></li>)}
        </ol>
      </section>

      <section className="border-t border-border py-12">
        <p className="max-w-2xl text-body leading-body text-text-secondary">{profileData.profile.summary}</p>
        <div className="mt-6 flex flex-wrap gap-4"><Link href="/about" className="text-sm font-medium text-primary hover:text-primary-hover">关于我 →</Link><Link href="/resume" className="text-sm font-medium text-primary hover:text-primary-hover">查看在线简历 →</Link></div>
      </section>
    </main>
  );
}
