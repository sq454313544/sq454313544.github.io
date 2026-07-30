import Link from "next/link";
import type { Metadata } from "next";
import { profileData } from "@/data/profile";

export const metadata: Metadata = {
  title: "关于我",
  description: "数据产品工程师，专注于 BI 与 AI 数据应用",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16">
      <header className="border-b border-border pb-10">
        <p className="text-sm font-medium text-primary">关于我</p>
        <h1 className="mt-3 text-h1 font-semibold leading-tight text-text-primary">{profileData.profile.name}</h1>
        <p className="mt-3 text-xl text-text-secondary">{profileData.profile.headline}</p>
        <div className="mt-6 max-w-3xl space-y-3">
          {profileData.resumeSummary.map((paragraph) => (
            <p key={paragraph} className="text-body leading-body text-text-secondary">{paragraph}</p>
          ))}
        </div>
      </header>

      <section className="py-12">
        <h2 className="text-h2 font-semibold text-text-primary">工作经历</h2>
        <p className="mt-1 text-text-muted">持续把数据能力做成可用的产品</p>
        <ol className="mt-8 border-l border-border pl-6 sm:pl-8">
          {profileData.workExperiences.map((experience) => (
            <li key={`${experience.company}-${experience.role}`} className="relative pb-10 last:pb-0">
              <span aria-hidden="true" className="absolute -left-[1.83rem] top-1.5 h-3 w-3 rounded-full border-2 border-surface bg-primary sm:-left-[2.33rem]" />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-card-title font-semibold text-text-primary">{experience.role}</h3>
                <p className="text-sm text-text-muted">{experience.period.start} — {experience.period.end ?? "至今"}</p>
              </div>
              <p className="mt-1 text-sm font-medium text-text-secondary">{experience.company} · {experience.location}</p>
              <h4 className="mt-5 text-sm font-semibold text-text-primary">核心职责</h4>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-secondary">
                {experience.responsibilities.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {experience.keyProjects.map((project) => project.href ? (
                  <Link key={project.title} href={project.href} className="font-medium text-primary hover:text-primary-hover">{project.title} →</Link>
                ) : (
                  <span key={project.title} className="font-medium text-text-secondary">{project.title}</span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {experience.stack.map((item) => <span key={item} className="rounded-tag bg-surface-soft px-2 py-1 text-tag text-text-secondary">{item}</span>)}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-border py-12">
        <h2 className="text-h2 font-semibold text-text-primary">核心能力</h2>
        <div className="mt-6 grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {profileData.skills.map((skill) => <article key={skill.title}><h3 className="text-card-title font-semibold text-text-primary">{skill.title}</h3><p className="mt-2 leading-relaxed text-text-secondary">{skill.boundaries}</p></article>)}
        </div>
      </section>

      <section className="border-t border-border py-12">
        <p className="text-sm text-text-muted">工具与技术</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {profileData.toolsAndTech.map((group) => <article key={group.title}><h2 className="font-semibold text-text-primary">{group.title}</h2><ul className="mt-3 space-y-2 text-sm text-text-secondary">{group.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}
        </div>
      </section>

      <section className="border-t border-border py-12">
        <p className="text-sm text-text-muted">兴趣</p>
        <ul className="mt-4 flex flex-wrap gap-2">{profileData.interests.map((interest) => <li key={interest} className="rounded-tag border border-border px-3 py-1 text-sm text-text-secondary">{interest}</li>)}</ul>
      </section>

      <section className="border-t border-border pt-12">
        <p className="text-sm text-text-muted">联系方式</p>
        {profileData.contacts.length > 0 ? <ul className="mt-4 flex flex-wrap gap-4">{profileData.contacts.map((contact) => <li key={contact.href}><a href={contact.href} className="font-medium text-primary hover:text-primary-hover">{contact.label}</a></li>)}</ul> : <p className="mt-4 text-text-secondary">公开联系方式将在个人资料完善后补充。</p>}
      </section>
    </main>
  );
}
