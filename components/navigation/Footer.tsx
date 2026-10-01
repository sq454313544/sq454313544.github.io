import { profileData } from "@/data/profile";
import { SamePageNavLink } from "./SamePageNavLink";

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={`site-footer border-t border-border py-8 text-sm text-text-muted ${className ?? ""}`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {profileData.profile.siteIdentity}</p>
        <nav aria-label="页脚导航" className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-text-secondary">
          <SamePageNavLink href="/projects" className="transition-colors duration-150 ease-standard hover:text-primary">项目案例</SamePageNavLink>
          <a href="/resume/jin-zaiwei-resume.pdf" download className="transition-colors duration-150 ease-standard hover:text-primary">下载简历</a>
          <SamePageNavLink href="/notes" className="transition-colors duration-150 ease-standard hover:text-primary">实践笔记</SamePageNavLink>
          <SamePageNavLink href="/dashboards" className="transition-colors duration-150 ease-standard hover:text-primary">BI 案例</SamePageNavLink>
          <SamePageNavLink href="/about" className="transition-colors duration-150 ease-standard hover:text-primary">关于</SamePageNavLink>
          <a href="https://github.com/sq454313544" target="_blank" rel="noopener noreferrer" className="transition-colors duration-150 ease-standard hover:text-primary">GitHub</a>
          <a href="mailto:454313544@qq.com" className="transition-colors duration-150 ease-standard hover:text-primary">邮箱</a>
          <SamePageNavLink href="/search" className="transition-colors duration-150 ease-standard hover:text-primary">搜索</SamePageNavLink>
        </nav>
      </div>
    </footer>
  );
}
