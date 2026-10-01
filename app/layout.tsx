import type { Metadata, Viewport } from "next";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { profileData } from "@/data/profile";
import { geistMono, geistSans } from "./fonts";
import { ThemeProvider } from "./theme-provider";
import "./globals.css";

const SITE_DESCRIPTION = profileData.profile.summary;

export const metadata: Metadata = {
  metadataBase: new URL("https://sq454313544.github.io"),
  title: {
    default: profileData.profile.siteIdentity,
    template: "%s | 金仔伟",
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: profileData.profile.siteIdentity,
    title: profileData.profile.siteIdentity,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: "金仔伟的数据工程与 AI 应用作品集" }],
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
