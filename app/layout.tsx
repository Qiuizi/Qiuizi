import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
// 思源宋体 (Noto Serif SC) —— 用作中文 display 字体。
// 按 unicode-range 分片，每页只下载实际用到的字符子集。
import "@fontsource/noto-serif-sc/chinese-simplified-400.css";
import "@fontsource/noto-serif-sc/chinese-simplified-500.css";
import "./globals.css";
import { site } from "@/lib/site";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

// 唯一的 Latin 字体 —— Instrument Serif, italic 极佳。
// 正文中文走 LXGW 霞鹜文楷屏幕版（<link> 引入）。
// 三件套: Instrument Serif + Noto Serif SC + LXGW.
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
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
    <html lang="zh-CN" className={instrument.variable}>
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
      </body>
    </html>
  );
}
