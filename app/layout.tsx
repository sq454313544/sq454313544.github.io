import type { Metadata } from "next";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "个人技术博客",
    template: "%s | 个人技术博客",
  },
  description:
    "数据产品工程师的个人技术平台，涵盖数据分析、Power BI、SQL、Python、RAG、LangGraph 与 Agent 工程。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
