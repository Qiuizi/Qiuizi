// 作品数据。添加新作品：在这里加一条，图片放 /public/works/ 下即可。
// 目前用 Picsum 占位图，领导替换成自己的图/视频时，改 cover 字段。

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
  // 详情页素材
  summary: string;
  body: string[];
  gallery: { src: string; alt: string; caption?: string }[];
};

const pic = (id: number, w = 1800, h = 1200) =>
  `https://picsum.photos/seed/sp-${id}/${w}/${h}`;

export const works: Work[] = [
  {
    slug: "empty-hours",
    title: "空时",
    titleEn: "Empty Hours",
    year: "2026",
    kind: "photo",
    tags: ["街头", "冬"],
    location: "武汉",
    cover: pic(11, 2000, 2600),
    coverAlt: "一条空荡的巷道在清晨的光里",
    summary: "冬日清晨，我在桂子山脚下走了两个小时，什么都没想。",
    body: [
      "寒假回家前的最后一个周六。清晨六点半起床，天是深灰色的，只有体育馆顶上的灯还亮着。",
      "我带着一只胶片机出门，没有拍摄计划。只是想让身体代替大脑走路。",
      "这组照片就是那两个小时里的副产品——它们不是我主动在看的，是被它们看到了。",
    ],
    gallery: [
      { src: pic(12), alt: "空旷的街", caption: "文化路 · 6:52" },
      { src: pic(13), alt: "水洼里的倒影" },
      { src: pic(14), alt: "没开门的早餐铺" },
      { src: pic(15), alt: "被雾压住的楼群", caption: "从二教望过去" },
    ],
  },
  {
    slug: "river-notes",
    title: "长江笔记",
    titleEn: "River Notes",
    year: "2025",
    kind: "video",
    tags: ["影像", "长江"],
    location: "武汉 · 南京 · 上海",
    cover: pic(21, 2000, 1400),
    coverAlt: "江面上的一艘货船",
    summary: "沿长江下游拍的三段短片，每段都只在黄昏开机。",
    body: [
      "我对河流有一种莫名的偏执。从 2025 年 7 月到 10 月，我用三个周末分别去了武汉、南京、上海的江边。",
      "拍摄原则只有两条：只在黄昏前后一小时，并且不让人进入画面。",
      "最终剪成了一个八分钟的片子。这里放的是其中三段定格。",
    ],
    gallery: [
      { src: pic(22), alt: "武汉江滩" },
      { src: pic(23), alt: "南京下关码头" },
      { src: pic(24), alt: "上海外滩尽头" },
    ],
  },
  {
    slug: "stone-language",
    title: "石头的语言",
    titleEn: "Stone Language",
    year: "2025",
    kind: "photo",
    tags: ["地理", "田野"],
    location: "大别山",
    cover: pic(31, 2000, 1300),
    coverAlt: "山涧中的一块大石",
    summary: "一次地理系野外实习的副产物。教授在讲岩性，我在拍石头的纹理。",
    body: [
      "大二上学期的野外实习。老师让我们记录岩石节理、产状、风化程度。",
      "我认真做了笔记，但镜头里记录的是另外一些东西——光打在石头上的方式，苔藓把时间写在表面的笔迹。",
      "地理学训练我看见尺度，摄影训练我看见质感。我想这两件事其实是同一件。",
    ],
    gallery: [
      { src: pic(32), alt: "花岗岩节理" },
      { src: pic(33), alt: "溪水切开的断面" },
      { src: pic(34), alt: "一块被覆盖的砾岩" },
    ],
  },
  {
    slug: "late-bus",
    title: "末班车",
    titleEn: "Late Bus",
    year: "2024",
    kind: "photo",
    tags: ["夜", "街头"],
    location: "武汉",
    cover: pic(41, 2000, 1500),
    coverAlt: "夜晚公交车内的乘客",
    summary: "连续一个月搭乘 724 路末班车拍摄的记录。",
    body: [
      "724 路是武汉连接光谷和洪山的一条夜班线。末班车 23:40 从虎泉发车。",
      "我从大一暑假一个月里每晚都坐它。有时候只是坐到终点再坐回来。",
      "这些是从车窗里看出去、从车厢里回望的样子。",
    ],
    gallery: [
      { src: pic(42), alt: "玻璃上的雨和灯" },
      { src: pic(43), alt: "打瞌睡的乘客" },
      { src: pic(44), alt: "末站的空座位" },
    ],
  },
  {
    slug: "north-window",
    title: "北窗",
    titleEn: "North Window",
    year: "2024",
    kind: "photo",
    tags: ["静物", "光"],
    location: "宿舍",
    cover: pic(51, 2000, 1800),
    coverAlt: "阳光从北窗斜进来",
    summary: "宿舍北窗里一年四季的光。",
    body: [
      "我住在朝北的宿舍。起初觉得亏，后来发现北窗的光是最诚实的——没有直射，只有反射回来的天空。",
      "从 2024 年 3 月开始，每周日上午九点我在同一个位置按一下快门。",
      "一年下来我有 52 张照片。它们几乎一模一样。",
    ],
    gallery: [
      { src: pic(52), alt: "春" },
      { src: pic(53), alt: "夏" },
      { src: pic(54), alt: "秋" },
      { src: pic(55), alt: "冬" },
    ],
  },
  {
    slug: "first-snow",
    title: "初雪",
    titleEn: "First Snow",
    year: "2024",
    kind: "photo",
    tags: ["武汉", "冬"],
    location: "桂子山",
    cover: pic(61, 2000, 2600),
    coverAlt: "被雪覆盖的校园小径",
    summary: "今年武汉只下了一场像样的雪。我用半天把整个校园走了一遍。",
    body: [
      "2024 年 12 月 17 日清晨，武汉下雪了。那天没有课。",
      "我从六点出发，九点回到宿舍。",
      "雪很快化了，但它在照片里还下着。",
    ],
    gallery: [
      { src: pic(62), alt: "铺满雪的台阶" },
      { src: pic(63), alt: "一棵独立的树" },
      { src: pic(64), alt: "雪化后的水洼" },
    ],
  },
];

export const workBySlug = (slug: string) => works.find((w) => w.slug === slug);
