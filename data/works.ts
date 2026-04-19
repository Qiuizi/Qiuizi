// 作品数据。
// 替换成你自己的作品：改下面每条的 title/titleEn/year/summary/body/tags/location，
// 把 cover / gallery.src 换成 "/works/xxx.jpg"（文件放 public/works/ 目录下）。
// 下面都是占位内容，展示的是版式本身，不是真实作品。

export type Work = {
  slug: string;
  title: string;
  titleEn: string;
  year: string;
  kind: "photo" | "video" | "text";
  tags: string[];
  location?: string;
  cover: string;
  coverAlt: string;
  summary: string;
  body: string[];
  gallery: { src: string; alt: string; caption?: string }[];
};

const pic = (id: number, w = 1800, h = 1200, label = "") =>
  `/api/placeholder?seed=sp-${id}&w=${w}&h=${h}${label ? `&label=${encodeURIComponent(label)}` : ""}`;

const lorem = [
  "这里是作品的第一段说明。你可以描述这组作品的缘起、时间、地点或者拍摄思路——写多写少都没关系。",
  "第二段可以是一些具体的拍摄细节、技术选择、或者当时心境。文字不用追求完美，真实比漂亮重要。",
  "第三段可以收尾，或者留一个悬念。读者看完作品之后还愿意回头读文字，说明它们互相成全了。",
];

export const works: Work[] = [
  {
    slug: "untitled-01",
    title: "无题一",
    titleEn: "Untitled 01",
    year: "2026",
    kind: "photo",
    tags: ["占位", "影像"],
    location: "某地",
    cover: pic(11, 2000, 2600),
    coverAlt: "占位封面 01",
    summary: "这是一组占位作品。替换成你真实的作品吧。",
    body: lorem,
    gallery: [
      { src: pic(12), alt: "占位 01", caption: "示意 · 01" },
      { src: pic(13), alt: "占位 02" },
      { src: pic(14), alt: "占位 03" },
      { src: pic(15), alt: "占位 04", caption: "示意 · 04" },
    ],
  },
  {
    slug: "untitled-02",
    title: "无题二",
    titleEn: "Untitled 02",
    year: "2025",
    kind: "video",
    tags: ["占位", "视频"],
    location: "某地",
    cover: pic(21, 2000, 1400),
    coverAlt: "占位封面 02",
    summary: "示例视频作品占位。替换为你自己的视频缩略图和介绍。",
    body: lorem,
    gallery: [
      { src: pic(22), alt: "占位 01" },
      { src: pic(23), alt: "占位 02" },
      { src: pic(24), alt: "占位 03" },
    ],
  },
  {
    slug: "untitled-03",
    title: "无题三",
    titleEn: "Untitled 03",
    year: "2025",
    kind: "photo",
    tags: ["占位"],
    location: "某地",
    cover: pic(31, 2000, 1300),
    coverAlt: "占位封面 03",
    summary: "第三组占位。你可以把它换成任何你愿意展示的东西——一段旅程、一组静物、一次实验。",
    body: lorem,
    gallery: [
      { src: pic(32), alt: "占位 01" },
      { src: pic(33), alt: "占位 02" },
      { src: pic(34), alt: "占位 03" },
    ],
  },
  {
    slug: "untitled-04",
    title: "无题四",
    titleEn: "Untitled 04",
    year: "2024",
    kind: "photo",
    tags: ["占位"],
    location: "某地",
    cover: pic(41, 2000, 1500),
    coverAlt: "占位封面 04",
    summary: "这里写一句话让读者想点进去。",
    body: lorem,
    gallery: [
      { src: pic(42), alt: "占位 01" },
      { src: pic(43), alt: "占位 02" },
      { src: pic(44), alt: "占位 03" },
    ],
  },
  {
    slug: "untitled-05",
    title: "无题五",
    titleEn: "Untitled 05",
    year: "2024",
    kind: "photo",
    tags: ["占位"],
    location: "某地",
    cover: pic(51, 2000, 1800),
    coverAlt: "占位封面 05",
    summary: "把这组作品的灵魂写在这里，一句话就够。",
    body: lorem,
    gallery: [
      { src: pic(52), alt: "占位 01" },
      { src: pic(53), alt: "占位 02" },
      { src: pic(54), alt: "占位 03" },
      { src: pic(55), alt: "占位 04" },
    ],
  },
  {
    slug: "untitled-06",
    title: "无题六",
    titleEn: "Untitled 06",
    year: "2024",
    kind: "photo",
    tags: ["占位"],
    location: "某地",
    cover: pic(61, 2000, 2600),
    coverAlt: "占位封面 06",
    summary: "最后一组占位。你可以加更多，也可以把它们都删掉重新开始。",
    body: lorem,
    gallery: [
      { src: pic(62), alt: "占位 01" },
      { src: pic(63), alt: "占位 02" },
      { src: pic(64), alt: "占位 03" },
    ],
  },
];

export const workBySlug = (slug: string) => works.find((w) => w.slug === slug);
