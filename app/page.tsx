import Link from "next/link";
import { profileData } from "@/data/profile";
import { loadDashboards, loadNotes, loadProjects } from "@/lib/content/loaders";
import { PROJECT_TYPE_LABELS } from "@/lib/content/types";
import { ContentCover } from "@/components/content/ContentCover";

const highlightClasses = {
  primary: "border-primary/40 bg-accent-bg",
  standard: "bg-surface",
  quiet: "bg-surface-soft shadow-none",
} as const;

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
        new Date(a.meta.publishedAt).getTime(),
    )
    .slice(0, 5);

  return (
    <main className="w-full">
      <section className="border-b border-border">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:py-16 lg:grid-cols-[minmax(0,7fr)_minmax(18rem,5fr)]">
          <div>
            <p className="hero-enter text-sm font-medium text-primary">{profileData.profile.name} · {profileData.profile.location}</p>
            <h1 className="hero-enter hero-delay-60 mt-3 text-h1 font-semibold leading-tight text-text-primary">
              {profileData.profile.headline}
            </h1>
            <p className="hero-enter hero-delay-120 mt-5 max-w-2xl text-body leading-body text-text-secondary">
              {profileData.profile.summary}
            </p>
            <div className="hero-enter hero-delay-160 mt-7 flex flex-wrap gap-3">
              <Link href="/projects" className="rounded-button bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 ease-standard hover:bg-primary-hover">
                查看项目
              </Link>
              <Link href="/notes" className="rounded-button border border-border px-4 py-2.5 text-sm font-medium text-text-primary transition-colors duration-150 ease-standard hover:bg-surface-soft">
                阅读笔记
              </Link>
              <a href="https://github.com/sq454313544" target="_blank" rel="noopener noreferrer" className="rounded-button border border-border px-4 py-2.5 text-sm font-medium text-text-primary transition-colors duration-150 ease-standard hover:bg-surface-soft">GitHub</a>
            </div>
          </div>
          <aside aria-label="项目成果概览" className="hero-enter hero-delay-160 grid grid-cols-2 gap-3">
            {profileData.siteHighlights.map((highlight) => (
              <article
                key={highlight.label}
                className={`flex flex-col items-center justify-center rounded-card border border-border p-4 text-center shadow-card ${highlightClasses[highlight.emphasis ?? "standard"]}`}
              >
                <p className={`font-semibold leading-tight text-primary ${highlight.emphasis === "primary" ? "text-h2" : "text-h3"}`}>{highlight.value}</p>
                {highlight.unit && <p className="mt-1 text-xs text-text-muted">{highlight.unit}</p>}
                <p className="mt-2 text-xs text-text-secondary">{highlight.label}</p>
              </article>
            ))}
          </aside>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-text-muted">精选项目</p>
              <h2 className="mt-1 text-h2 font-semibold text-text-primary">从问题到可维护的方案</h2>
            </div>
            <Link href="/projects" className="text-sm font-medium text-primary hover:text-primary-hover">全部项目 →</Link>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article key={project.slug} className="group flex min-h-56 flex-col overflow-hidden rounded-card border border-border bg-surface p-5 shadow-card transition duration-150 ease-standard hover:-translate-y-0.5 hover:shadow-card-hover">
                <ContentCover slug={project.slug} priority className="mb-5 aspect-[2/1]" />
                <p className="text-tag text-text-muted">{PROJECT_TYPE_LABELS[project.meta.projectType]}</p>
                <h3 className="mt-3 text-card-title font-semibold text-text-primary">{project.meta.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">{project.meta.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.meta.techStack.slice(0, 3).map((item) => <span key={item} className="rounded-tag bg-surface-soft px-2 py-1 text-tag text-text-secondary">{item}</span>)}
                </div>
                <Link href={`/projects/${project.slug}`} className="mt-5 text-sm font-medium text-primary hover:text-primary-hover">查看案例 <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">→</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface-soft">
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-sm text-text-muted">BI 案例</p><h2 className="mt-1 text-h2 font-semibold text-text-primary">经营分析与数据表达</h2></div>
            <Link href="/dashboards" className="text-sm font-medium text-primary hover:text-primary-hover">全部案例 →</Link>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {dashboards.map((dashboard) => (
              <article key={dashboard.slug} className="group flex min-h-56 flex-col overflow-hidden rounded-card border border-border bg-surface p-5 shadow-card transition duration-150 ease-standard hover:-translate-y-0.5 hover:shadow-card-hover">
                <ContentCover slug={dashboard.slug} className="mb-5 aspect-[2/1]" />
                <div className="flex flex-wrap gap-2"><span className="rounded-tag bg-surface-soft px-2 py-0.5 text-tag text-text-secondary">{dashboard.meta.businessDomain}</span><span className="rounded-tag bg-accent-bg px-2 py-0.5 text-tag text-accent-text">模拟数据</span></div>
                <h3 className="mt-3 text-card-title font-semibold text-text-primary">{dashboard.meta.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">{dashboard.meta.description}</p>
                <p className="mt-4 text-sm text-text-muted">{dashboard.meta.metrics.slice(0, 3).join(" · ")}</p>
                <Link href={`/dashboards/${dashboard.slug}`} className="mt-5 text-sm font-medium text-primary hover:text-primary-hover">查看分析过程 <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">→</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <p className="text-sm text-text-muted">核心能力</p>
          <h2 className="mt-1 text-h2 font-semibold text-text-primary">把分析能力落到产品和工程中</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {profileData.skills.map((skill) => <article key={skill.title} className="border-t-2 border-accent-border pt-4"><h3 className="font-semibold text-text-primary">{skill.title}</h3><p className="mt-2 text-sm leading-relaxed text-text-secondary">{skill.boundaries}</p></article>)}
          </div>
        </div>
      </section>

      <section className="border-y border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <div className="flex items-end justify-between gap-4"><div><p className="text-sm text-text-muted">最新笔记</p><h2 className="mt-1 text-h2 font-semibold text-text-primary">学习与复盘</h2></div><Link href="/notes" className="text-sm font-medium text-primary hover:text-primary-hover">全部笔记 →</Link></div>
          <ol className="mt-7 divide-y divide-border border-y border-border">
            {notes.map((note) => <li key={note.slug}><Link href={`/notes/${note.slug}`} className="grid gap-1 py-4 transition-colors hover:bg-surface-soft sm:grid-cols-[7rem_8rem_1fr_auto] sm:items-center sm:gap-4"><time className="text-sm text-text-muted">{note.meta.publishedAt}</time><span className="text-sm text-text-secondary">{note.meta.category}</span><span className="font-medium text-text-primary">{note.meta.title}</span><span className="text-sm text-text-muted">{note.readingTime} 分钟</span></Link></li>)}
          </ol>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-6xl px-4 py-12 text-center">
          <div className="border-t-2 border-accent-border pt-10">
            <h2 className="text-h3 font-semibold text-text-primary">正在寻找新的机会</h2>
            <p className="mt-2 text-text-secondary">期待数据产品工程、BI 数据应用或 AI 应用工程方向的合作机会。</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/resume" className="rounded-button bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 ease-standard hover:bg-primary-hover">查看简历</Link><a href="https://github.com/sq454313544" target="_blank" rel="noopener noreferrer" className="rounded-button border border-border px-4 py-2.5 text-sm font-medium text-text-primary transition-colors duration-150 ease-standard hover:bg-surface-soft">GitHub</a><a href="mailto:454313544@qq.com" className="rounded-button border border-border px-4 py-2.5 text-sm font-medium text-text-primary transition-colors duration-150 ease-standard hover:bg-surface-soft">邮件联系</a></div>
          </div>
        </div>
      </section>
    </main>
  );
}
