// 整个站点的身份配置。领导你只需要改这一个文件就能替换个人信息。
// 下面都是占位内容，请替换成你自己的。
export const site = {
  name: "你的名字",
  nameLatin: "YOUR NAME",
  title: "作品与随笔",
  tagline: "影像与文字的私人空间",
  bio: "一句话介绍你自己。这里的占位内容都可以在 lib/site.ts 里改掉。",
  location: "所在地",
  email: "hello@example.com",
  socials: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Email", href: "mailto:hello@example.com" },
  ],
  nav: [
    { label: "首页", href: "/", labelEn: "Index" },
    { label: "作品", href: "/works", labelEn: "Works" },
    { label: "随笔", href: "/notes", labelEn: "Notes" },
    { label: "关于", href: "/about", labelEn: "About" },
  ],
} as const;
