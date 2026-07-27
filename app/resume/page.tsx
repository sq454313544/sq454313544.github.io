import Link from "next/link";
import type { Metadata } from "next";
import { profileData } from "@/data/profile";

export const metadata: Metadata = {
  title: "在线简历",
  description: "个人简历",
};

export default function ResumePage() {
  return (
    <main className="resume-page mx-auto w-full max-w-[52rem] px-4 py-10 sm:py-14">
      <article className="resume-card border border-border bg-surface p-6 sm:p-10">
        <header className="border-b border-border pb-6">
          <p className="text-sm font-medium text-primary">在线简历</p>
          <h1 className="mt-2 text-h1 font-semibold leading-tight text-text-primary">{profileData.profile.name}</h1>
          <p className="mt-2 text-lg text-text-secondary">{profileData.profile.headline}</p>
          <p className="mt-5 leading-relaxed text-text-secondary">{profileData.resumeSummary}</p>
        </header>

        <section className="resume-section mt-8">
          <h2 className="text-h3 font-semibold text-text-primary">工作经历</h2>
          <div className="mt-5 space-y-7">
            {profileData.workExperiences.map((experience) => <article key={`${experience.company}-${experience.role}`} className="resume-experience"><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="font-semibold text-text-primary">{experience.role} · {experience.company}</h3><p className="text-sm text-text-muted">{experience.period.start} — {experience.period.end ?? "至今"}</p></div><p className="mt-3 text-sm leading-relaxed text-text-secondary">{experience.background}</p><ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-text-secondary">{experience.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></article>)}
          </div>
        </section>

        <section className="resume-section mt-8 border-t border-border pt-8">
          <h2 className="text-h3 font-semibold text-text-primary">项目亮点</h2>
          <div className="mt-5 space-y-5">
            {profileData.projectHighlights.map((project) => <article key={project.href} className="resume-experience"><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="font-semibold text-text-primary">{project.title}</h3><p className="text-sm text-text-muted">{project.role}</p></div><p className="mt-2 text-sm leading-relaxed text-text-secondary">{project.description}</p><Link href={project.href} className="mt-2 inline-block text-sm font-medium text-primary hover:text-primary-hover">查看项目案例 →</Link></article>)}
          </div>
        </section>

        <section className="resume-section mt-8 border-t border-border pt-8">
          <h2 className="text-h3 font-semibold text-text-primary">核心能力</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">{profileData.skills.map((skill) => <article key={skill.title}><h3 className="font-semibold text-text-primary">{skill.title}</h3><p className="mt-1 text-sm leading-relaxed text-text-secondary">{skill.boundaries}</p></article>)}</div>
        </section>

        <section className="resume-section mt-8 border-t border-border pt-8">
          <h2 className="text-h3 font-semibold text-text-primary">教育与认证</h2>
          {profileData.education.length > 0 || profileData.certifications.length > 0 ? <div className="mt-5" /> : <p className="mt-4 text-sm text-text-secondary">教育与认证信息将在资料完善后补充。</p>}
        </section>

        <footer className="mt-8 border-t border-border pt-6 text-sm text-text-muted">
          PDF 文件暂未提供；可使用浏览器的打印功能保存为 PDF。
        </footer>
      </article>
    </main>
  );
}
