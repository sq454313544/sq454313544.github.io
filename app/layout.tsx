import type { Metadata, Viewport } from "next";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { geistMono, geistSans } from "./fonts";
import { ThemeProvider } from "./theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sq454313544.github.io"),
  title: {
    default: "个人技术博客",
    template: "%s | 个人技术博客",
  },
  description:
    "数据产品工程师的个人技术平台，涵盖数据分析、Power BI、SQL、Python、RAG、LangGraph 与 Agent 工程。",
  openGraph: {
    title: "金仔伟 · 数据产品工程师",
    description: "数据产品、数据工程与 AI 数据应用的个人技术平台。",
    images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: "金仔伟的数据产品工程作品集" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F8FA" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F17" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-background font-sans text-text-primary">
        <ThemeProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
