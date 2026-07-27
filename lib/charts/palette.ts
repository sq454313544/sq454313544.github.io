export const chartPalettes = {
  light: ["#2563EB", "#0F9D8A", "#7C3AED", "#EA580C", "#DC2626", "#64748B"],
  dark: ["#60A5FA", "#2DD4BF", "#A78BFA", "#FB923C", "#F87171", "#94A3B8"],
} as const;

export type ChartTheme = keyof typeof chartPalettes;
