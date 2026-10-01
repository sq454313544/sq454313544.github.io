import Link from "next/link";
import type { Metadata } from "next";
import { profileData } from "@/data/profile";

export const metadata: Metadata = {
  title: "关于我",
  description: profileData.profile.summary,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
      <header className="border-b border-border pb-8 sm:pb-10">
        <p className="text-sm font-medium text-primary">关于我</p>
        <h1 className="mt-3 text-h1 font-semibold leading-tight text-text-primary">
          {profileData.profile.name}
        </h1>
        <p className="mt-3 text-xl text-text-secondary">
          <span className="whitespace-nowrap">数据工程与</span>{" "}
          <span className="whitespace-nowrap">AI 应用</span>
        </p>
        <p className="mt-3 text-sm text-text-muted">
          {profileData.profile.location} · {profileData.profile.availability}
        </p>
        <ul aria-label="联系方式" className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {profileData.contacts.map((contact) => (
            <li key={contact.href}>
              <a href={contact.href} className="font-medium text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                {contact.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-body leading-body text-text-secondary">
          {profileData.profile.summary}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/resume/jin-zaiwei-resume.pdf" download className="rounded-button bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 ease-standard hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            下载简历
          </a>
          <Link href="/projects" className="rounded-button border border-border px-4 py-2.5 text-sm font-medium text-text-primary transition-colors duration-150 ease-standard hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            查看项目
          </Link>
        </div>
      </header>

      <section className="py-8 sm:py-10">
        <h2 className="text-h2 font-semibold text-text-primary">我能做什么</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {profileData.skills.map((skill) => (
            <article key={skill.title} className="rounded-card border border-border bg-surface p-5">
              <h3 className="text-card-title font-semibold text-text-primary">{skill.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{skill.summary}</p>
            </article>
          ))}
        </div>
        <Link href="/projects" className="mt-5 inline-block text-sm font-medium text-primary hover:text-primary-hover">
          查看数据与 AI 项目 →
        </Link>
      </section>

      <section className="border-t border-border py-8 sm:py-10">
        <h2 className="text-h2 font-semibold text-text-primary">职业经历</h2>
        <ol className="mt-6 divide-y divide-border">
          {profileData.workExperiences.map((experience) => (
            <li key={`${experience.company}-${experience.role}`} className="py-5 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-medium text-text-primary">
                  {experience.company}｜{experience.role}
                </h3>
                <p className="text-sm text-text-muted">
                  {experience.period.start} — {experience.period.end ?? "至今"}
                </p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{experience.summary}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-border py-8 sm:py-10">
        <h2 id="agent-workflow" className="scroll-mt-24 text-h2 font-semibold text-text-primary">
          我的 Agent 工作方式
        </h2>
        <p className="mt-4 max-w-3xl text-body leading-body text-text-secondary">
          {profileData.agentWorkflow.summary}
        </p>
        <article className="mt-6 rounded-card border border-border bg-surface-soft p-5 sm:p-6">
          <h3 className="text-card-title font-semibold text-text-primary">
            一个实例：{profileData.agentWorkflow.example.title}
          </h3>
          <p className="mt-3 leading-relaxed text-text-secondary">
            {profileData.agentWorkflow.example.paragraph}
          </p>
        </article>
      </section>

      <section className="border-t border-border pt-8 sm:pt-10">
        <h2 className="text-h3 font-semibold text-text-primary">教育背景</h2>
        <div className="mt-4 space-y-3">
          {profileData.education.map((entry) => (
            <div key={`${entry.school}-${entry.degree}`} className="text-sm text-text-secondary">
              <p>{entry.school}｜{entry.degree}</p>
              <p className="mt-1 text-text-muted">{entry.period.start} — {entry.period.end}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
