"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { notifySearchParamsChanged } from "@/lib/hooks/useClientSearchParams";

/**
 * 导航链接：当目标是不带查询参数的当前页时，先清除地址上的查询参数。
 *
 * 背景：`/projects/?type=agent` 下点击顶部「项目案例」（href="/projects"）
 * 时，Next 认为这是同一路由，地址上的 `type=agent` 会保留，列表与搜索框
 * 都停留在筛选状态，用户无法通过导航回到默认视图。
 *
 * 处理方式：只在「同页 + 目标无查询参数 + 当前确有查询参数」时改写地址。
 * 用 pushState 而不是 replaceState，保留筛选态那条历史记录，
 * 这样浏览器返回键仍能回到用户刚才看过的筛选结果。
 * 跨页导航、带参数的筛选链接、外部链接都不受影响。
 */
export function SamePageNavLink({
  href,
  onClick,
  ...props
}: ComponentProps<typeof Link>) {
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || typeof href !== "string") return;

    const [rawPath, hash = ""] = href.split("#");
    const target = rawPath.split("?")[0].replace(/\/+$/, "") || "/";
    const current = (pathname ?? "").replace(/\/+$/, "") || "/";
    const targetHasQuery = rawPath.includes("?");
    const currentHasQuery = window.location.search.length > 1;

    if (target !== current || targetHasQuery || !currentHasQuery) return;

    const next = `${window.location.pathname}${hash ? `#${hash}` : ""}`;
    window.history.pushState(window.history.state, "", next);
    notifySearchParamsChanged();
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
