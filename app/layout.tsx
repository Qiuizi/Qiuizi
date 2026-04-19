import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
// 思源宋体 (Noto Serif SC) —— 中文 display (给 .font-display 兜底).
import "@fontsource/noto-serif-sc/chinese-simplified-400.css";
import "@fontsource/noto-serif-sc/chinese-simplified-500.css";
import "./globals.css";
import { site } from "@/lib/site";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Loader } from "@/components/loader";
import { Cursor } from "@/components/cursor";

// Playfair Display —— Latin display (italic 极佳).
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

// Inter —— 现代无衬线正文.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
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
    <html lang="zh-CN" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-background text-foreground font-sans">
        <Loader />
        <Cursor />
        <SmoothScroll />
        <Nav />
        <main className="relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
