// 整个站点的身份配置。领导你只需要改这一个文件就能替换个人信息。
export const site = {
  name: "素鹏",
  nameLatin: "SUPENG",
  title: "素鹏 · 作品与随笔",
  tagline: "影像与文字的私人空间",
  bio: "19 岁，华中师大地理系。用相机和键盘记录一些值得记住的瞬间。",
  location: "武汉 · 桂子山",
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
