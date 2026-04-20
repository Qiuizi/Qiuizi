// 整个站点的身份配置。改这一个文件就能替换个人信息。
export const site = {
  name: "Qiuizi",
  nameLatin: "Qiuizi",
  title: "Qiuizi · 记录自己的云空间",
  tagline: "一个记录自己的云空间",
  bio: "Yesterday is history, tomorrow is a mystery, but today is a gift.",
  location: "成都",
  email: "17526747919tzq@gmail.com",
  socials: [
    { label: "GitHub", href: "https://github.com/Qiuizi" },
    { label: "抖音", href: "#" },
    { label: "知乎", href: "#" },
    { label: "小红书", href: "#" },
    { label: "公众号", href: "#" },
    { label: "Email", href: "mailto:17526747919tzq@gmail.com" },
  ],
  nav: [
    { label: "首页", href: "/", labelEn: "Index" },
    { label: "作品", href: "/works", labelEn: "Works" },
    { label: "随笔", href: "/notes", labelEn: "Notes" },
    { label: "关于", href: "/about", labelEn: "About" },
  ],
} as const;
