import type { ComponentPropsWithoutRef, ReactNode } from "react";

type IconProps = ComponentPropsWithoutRef<"svg">;

function IconFrame({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return <IconFrame {...props}><path d="M4 7h16M4 12h16M4 17h16" /></IconFrame>;
}

export function CloseIcon(props: IconProps) {
  return <IconFrame {...props}><path d="m6 6 12 12M18 6 6 18" /></IconFrame>;
}

export function SunIcon(props: IconProps) {
  return <IconFrame {...props}><circle cx="12" cy="12" r="3.5" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" /></IconFrame>;
}

export function MoonIcon(props: IconProps) {
  return <IconFrame {...props}><path d="M20.5 15.2A8.7 8.7 0 0 1 8.8 3.5 8.7 8.7 0 1 0 20.5 15.2Z" /></IconFrame>;
}

export function SystemIcon(props: IconProps) {
  return <IconFrame {...props}><rect x="3.5" y="4" width="17" height="12" rx="1.5" /><path d="M9 20h6M12 16v4" /></IconFrame>;
}
