import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { site } from "@/lib/site";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

// Latin 显示衬线 —— 保留 Instrument Serif（italic 很好看）
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// 等宽
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.bio,
  openGraph: {
    title: site.title,
    description: site.bio,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-CN"
      className={`${GeistSans.variable} ${instrument.variable} ${jetbrains.variable}`}
    >
      <head>
        {/* 自托管霞鹜文楷屏幕阅读版（GB 子集版）—— 97 个 woff2 按 unicode-range 分片，
            每页实际只下载几个子集，首屏也能用。文件在 /public/fonts/lxgw/ 下。 */}
        <link
          rel="stylesheet"
          href="/fonts/lxgw/lxgwwenkaigbscreen.css"
        />
      </head>
      <body className="bg-background text-foreground font-sans">
        <SmoothScroll />
        <Nav />
        <main className="relative">{children}</main>
        <Footer />
        <div className="noise" aria-hidden />
      </body>
    </html>
  );
}
