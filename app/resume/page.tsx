import type { Metadata } from "next";
import { LegacyResumeRedirect } from "@/components/resume/LegacyResumeRedirect";

export const metadata: Metadata = {
  title: "关于我",
  description: "了解金仔伟的职业经历与工作方式，或下载 PDF 简历。",
  alternates: { canonical: "/about" },
  robots: { index: false, follow: true },
};

export default function ResumePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <LegacyResumeRedirect />
      <h1 className="text-h2 font-semibold text-text-primary">个人介绍与简历</h1>
      <p className="mt-4 leading-relaxed text-text-secondary">
        在关于页了解我的经历与工作方式，也可以直接下载 PDF 简历。
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href="/about/" className="rounded-button bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover">
          前往关于我
        </a>
        <a href="/resume/jin-zaiwei-resume.pdf" download className="rounded-button border border-border px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-soft">
          下载简历
        </a>
      </div>
    </main>
  );
}
