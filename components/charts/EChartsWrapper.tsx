"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useTheme } from "next-themes";
import { Loading } from "@/components/primitives/states";
import { chartPalettes } from "@/lib/charts/palette";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded">
      <Loading />
    </div>
  ),
});

interface EChartsWrapperProps {
  option: object;
  height?: number;
  className?: string;
}

export function EChartsWrapper({
  option,
  height = 300,
  className,
}: EChartsWrapperProps) {
  const { resolvedTheme } = useTheme();
  const themedOption = useMemo(
    () => ({
      ...option,
      color: resolvedTheme === "dark" ? chartPalettes.dark : chartPalettes.light,
      textStyle: {
        color: resolvedTheme === "dark" ? "#E2E8F0" : "#334155",
      },
    }),
    [option, resolvedTheme]
  );

  if (!option || Object.keys(option).length === 0) {
    return (
      <div className={`h-[${height}px] flex items-center justify-center bg-gray-50 rounded text-gray-400 text-sm ${className ?? ""}`}>
        暂无图表数据
      </div>
    );
  }

  return (
    <div className={className}>
      <ReactECharts
        option={themedOption}
        style={{ height: `${height}px`, width: "100%" }}
        notMerge
        lazyUpdate
      />
    </div>
  );
}
