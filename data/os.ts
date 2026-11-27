export type WinId = "qisland" | "coursedesk" | "deepunpack" | "xiangqi" | "finder";

export type Geom = { x: number; y: number; w: number };

export type IslandMode = "focus" | "media" | "alert";

export const flagshipOrder = ["qisland", "coursedesk", "deepunpack", "xiangqi"] as const;

export const homeLayout: Record<WinId, Geom> = {
  qisland: { x: 52, y: 66, w: 430 },
  coursedesk: { x: 92, y: 372, w: 460 },
  deepunpack: { x: 910, y: 62, w: 465 },
  xiangqi: { x: 820, y: 360, w: 540 },
  finder: { x: 490, y: 150, w: 470 },
};

export const islandCopy: Record<IslandMode, { title: string; value: string }> = {
  focus: { title: "Qisland v4.3.0 · 专注计时", value: "25:00" },
  media: { title: "Qisland · 正在播放 Nocturne", value: "▶ 02:14" },
  alert: { title: "Qisland 轻提醒 · 所有窗口可拖拽置顶", value: "LIVE" },
};

export const courseNotes = {
  1: "① 自动提取本讲核心定义、公式推导与易错点，告别机械抄写 PPT。",
  2: "② 自动标出与前序章节的概念关联，把零散单讲织成课程图谱。",
  3: "③ 基于本讲课件与录音上下文随时追问 AI，直接生成自测题。",
} as const;

export const xiangqiSteps = [
  { label: "开局 · 红方先行", cannon: [7, 3], horse: [1, 1] },
  { label: "炮二平五（当头炮）", cannon: [4, 3], horse: [1, 1] },
  { label: "马 8 进 7（屏风马）", cannon: [4, 3], horse: [2, 2] },
] as const;

export const finderItems = [
  {
    name: "SCU Tutor Finder",
    detail: "高校导师与研究方向检索工具",
    href: "https://qiuizi.github.io/scu-tutor-finder/",
    action: "访问 ↗",
  },
  {
    name: "CloudFitness",
    detail: "独立域名轻量健身记录与训练应用",
    href: "https://app.cloudfitness.top",
    action: "打开 ↗",
  },
  {
    name: "info-station",
    detail: "个人信息聚合与动态监控站",
    href: "https://github.com/Qiuizi/info-station",
    action: "源码 ↗",
  },
  {
    name: "fate",
    detail: "传统命理文化排盘与辅助解读工具",
    href: "https://github.com/Qiuizi/fate",
    action: "源码 ↗",
  },
  {
    name: "ultimate-tic-tac-toe",
    detail: "九宫嵌套策略棋类——终极井字棋交互实现",
    href: "https://github.com/Qiuizi/ultimate-tic-tac-toe",
    action: "源码 ↗",
  },
  {
    name: "GitHub @Qiuizi",
    detail: "全部开源仓库与发布包主页",
    href: "https://github.com/Qiuizi",
    action: "主页 ↗",
  },
] as const;

export const dockItems: { id: WinId; label: string; mark: string; gradient: string; shortcut?: string }[] = [
  { id: "qisland", label: "Qisland", mark: "Q", gradient: "linear-gradient(145deg,#0EA5E9,#2563EB)", shortcut: "1" },
  { id: "coursedesk", label: "CourseDesk", mark: "C", gradient: "linear-gradient(145deg,#10B981,#047857)", shortcut: "2" },
  { id: "deepunpack", label: "DeepUnpack", mark: "D", gradient: "linear-gradient(145deg,#F59E0B,#D97706)", shortcut: "3" },
  { id: "xiangqi", label: "XiangqiStudio", mark: "象", gradient: "linear-gradient(145deg,#F43F5E,#BE123C)", shortcut: "4" },
  { id: "finder", label: "更多作品 Finder", mark: "+", gradient: "linear-gradient(145deg,#6366F1,#4338CA)" },
];
