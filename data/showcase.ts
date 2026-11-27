// 只收录已经上线的真实作品与仓库。不要写入 star、下载量、用户数或未发布的地址。

export type ExternalAction = {
  label: string;
  href: string;
  tone: "primary" | "secondary";
};

export type FlagshipId = "qisland" | "coursedesk" | "deepunpack" | "xiangqi";

export type Flagship = {
  id: FlagshipId;
  dockLabel: string;
  dockMark: string;
  winTitle: string;
  tag: string;
  kicker: string;
  name: string;
  description: string;
  points: readonly string[];
  actions: readonly ExternalAction[];
};

export type WebWork = {
  name: string;
  description: string;
  href: string;
  action: string;
};

export const flagships: readonly Flagship[] = [
  {
    id: "qisland",
    dockLabel: "Qisland",
    dockMark: "Q",
    winTitle: "Qisland — Windows 灵动岛效率工具",
    tag: "v4.3.0 · C#",
    kicker: "Windows 效率工具",
    name: "Qisland",
    description:
      "把灵动岛体验带到 Windows 桌面顶部边缘，统一承接媒体播放、倒计时与轻提醒，抬眼可见、随手可控。",
    points: [
      "C# 原生桌面端，持续打磨至 v4.3.0",
      "轻巧停靠屏幕顶部，不打断编码与阅读焦点",
      "开源开放，提供独立官网与源码仓库",
    ],
    actions: [
      {
        label: "访问产品官网 ↗",
        href: "https://qiuizi.github.io/Qisland/",
        tone: "primary",
      },
      {
        label: "GitHub 源码",
        href: "https://github.com/Qiuizi/Qisland",
        tone: "secondary",
      },
    ],
  },
  {
    id: "coursedesk",
    dockLabel: "CourseDesk",
    dockMark: "C",
    winTitle: "CourseDesk / CourseWorkspace — 课程 AI 工作台",
    tag: "AI 学习助手",
    kicker: "课程工作台与 AI 伴读",
    name: "CourseDesk / CourseWorkspace",
    description:
      "把课件、课堂录音与教材拖入当前课次，一键串跑分析生成三层笔记与课内知识图谱，并支持随时呼出 AI 追问。",
    points: [
      "拖入资料直接归到当前讲，省去手动整理",
      "本课要点 / 关联前序 / 综合理解三层结构化笔记",
      "内置课程语境 AI 问答与自定义模型支持",
    ],
    actions: [
      {
        label: "访问产品官网 ↗",
        href: "https://qiuizi.github.io/CourseDesk/",
        tone: "primary",
      },
      {
        label: "GitHub 源码",
        href: "https://github.com/Qiuizi/CourseDesk",
        tone: "secondary",
      },
    ],
  },
  {
    id: "deepunpack",
    dockLabel: "DeepUnpack",
    dockMark: "D",
    winTitle: "DeepUnpack（解到底）— 递归解压与文件整理",
    tag: "桌面效率",
    kicker: "本地批量解压与整理",
    name: "DeepUnpack（解到底）",
    description:
      "拖入多层嵌套压缩包一次解到底，自动清理中间冗余包与展平目录，随后直接筛选预览并批量重命名。",
    points: [
      "多层套娃压缩包递归解到底，内置密码本自动尝试",
      "解压后按图片/视频/文档分类预览与快速清理",
      "支持正则/编号规则叠加的实时对照批量重命名",
    ],
    actions: [
      {
        label: "GitHub 源码与发布 ↗",
        href: "https://github.com/Qiuizi/DeepUnpack",
        tone: "primary",
      },
    ],
  },
  {
    id: "xiangqi",
    dockLabel: "XiangqiStudio",
    dockMark: "象",
    winTitle: "XiangqiStudio — 中国象棋工作室桌面端",
    tag: "v1.0.0",
    kicker: "桌面棋艺工作室",
    name: "XiangqiStudio",
    description:
      "面向中国象棋爱好者的纯粹桌面端应用，打磨清晰棋盘视觉与流畅落子体验。",
    points: [
      "已发布 v1.0.0 正式版本",
      "专注清晰克制的象棋桌面交互体验",
      "完整开源托管于 GitHub",
    ],
    actions: [
      {
        label: "GitHub 仓库 ↗",
        href: "https://github.com/Qiuizi/XiangqiStudio",
        tone: "primary",
      },
    ],
  },
];

export const webWorks: readonly WebWork[] = [
  {
    name: "SCU Tutor Finder",
    description: "面向四川大学同学的导师与研究方向快速检索 Web 工具。",
    href: "https://qiuizi.github.io/scu-tutor-finder/",
    action: "在线访问 ↗",
  },
  {
    name: "CloudFitness",
    description: "部署在独立域名的轻量健身记录与训练应用。",
    href: "https://app.cloudfitness.top",
    action: "打开应用 ↗",
  },
  {
    name: "info-station",
    description: "个人信息聚合与动态监控站。",
    href: "https://github.com/Qiuizi/info-station",
    action: "GitHub 源码 ↗",
  },
  {
    name: "fate",
    description: "传统命理文化排盘与辅助解读工具。",
    href: "https://github.com/Qiuizi/fate",
    action: "GitHub 源码 ↗",
  },
  {
    name: "ultimate-tic-tac-toe",
    description: "九宫格嵌套策略棋类——终极井字棋交互实现。",
    href: "https://github.com/Qiuizi/ultimate-tic-tac-toe",
    action: "GitHub 源码 ↗",
  },
  {
    name: "更多开源代码",
    description: "全部仓库、更新记录与发布包统一托管在 GitHub。",
    href: "https://github.com/Qiuizi",
    action: "github.com/Qiuizi ↗",
  },
];

export const flagshipById = (id: FlagshipId) =>
  flagships.find((item) => item.id === id) ?? flagships[0];
