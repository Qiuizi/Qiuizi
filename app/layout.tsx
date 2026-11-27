import type { Metadata, Viewport } from "next";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: "Qiuizi OS",
  authors: [{ name: site.name, url: site.github }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: site.title,
    description: site.description,
    url: "/",
    siteName: "Qiuizi OS",
    locale: "zh_CN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".menubar,.os-island,.win,.dock-bar{backdrop-filter:blur(28px) saturate(145%);-webkit-backdrop-filter:blur(28px) saturate(145%)}",
          }}
        />
        {children}
      </body>
    </html>
  );
}
