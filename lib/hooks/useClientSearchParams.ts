"use client";

import { useEffect, useState } from "react";

/** 查询参数在客户端被改动后派发，用于让读取方立即刷新 */
export const SEARCH_PARAMS_EVENT = "app:searchparams";

/** 通知查询参数已变化 */
export function notifySearchParamsChanged(): void {
  window.dispatchEvent(new Event(SEARCH_PARAMS_EVENT));
}

/**
 * 读取当前地址的查询参数（仅客户端）。
 *
 * 与 `useSearchParams` 的区别：首屏（服务端渲染与静态导出）返回空参数，
 * 因此列表页可以在静态 HTML 中输出完整内容，而不是退回 Suspense 骨架或空壳；
 * 挂载后再按真实参数筛选。静态托管下同一地址的筛选结果仍会正确生效。
 *
 * 同步时机覆盖三种情况：
 * 1. 首次挂载：读取直接访问参数页时的参数；
 * 2. 浏览器后退/前进：监听 popstate；
 * 3. 同页链接改动查询参数（见 SamePageNavLink）：监听自定义事件。
 */
export function useClientSearchParams(): URLSearchParams {
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    () => new URLSearchParams(),
  );

  useEffect(() => {
    const sync = () => setSearchParams(new URLSearchParams(window.location.search));
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener(SEARCH_PARAMS_EVENT, sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener(SEARCH_PARAMS_EVENT, sync);
    };
  }, []);

  return searchParams;
}
