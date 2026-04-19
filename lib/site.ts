// 整个站点的身份配置。领导你只需要改这一个文件就能替换个人信息。
export const site = {
  name: "唐梓棋",
  nameLatin: "Ziqi Tang",
  title: "作品与随笔",
  tagline: "影像与文字的私人空间",
  bio: "一句话介绍你自己。这里的占位内容可以在 lib/site.ts 里改掉。",
  location: "成都",
  email: "17526747919tzq@gmail.com",
  socials: [
    { label: "GitHub", href: "https://github.com/Qiuizi" },
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Email", href: "mailto:17526747919tzq@gmail.com" },
  ],
  nav: [
    { label: "首页", href: "/", labelEn: "Index" },
    { label: "作品", href: "/works", labelEn: "Works" },
    { label: "随笔", href: "/notes", labelEn: "Notes" },
    { label: "关于", href: "/about", labelEn: "About" },
  ],
} as const;
