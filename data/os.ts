import type { ReleaseRepo } from "@/lib/releases";

export type ProjectId = "qisland" | "course" | "deepunpack" | "lightskip" | "xiangqi";
export type WinId = "welcome" | "about" | "finder" | ProjectId;
export type IslandMode = "focus" | "media" | "alert";
export type Geom = { x: number; y: number; w: number; h: number };

export const windowOrder: WinId[] = ["qisland", "course", "deepunpack", "lightskip", "xiangqi", "finder", "about", "welcome"];

export const flagshipOrder: ProjectId[] = ["qisland", "course", "deepunpack", "lightskip"];

export const launcherOrder: Exclude<WinId, "welcome">[] = ["qisland", "course", "deepunpack", "lightskip", "xiangqi", "about", "finder"];

export const homeLayout: Record<WinId, Geom> = {
  welcome: { x: 72, y: 108, w: 504, h: 372 },
  qisland: { x: 88, y: 96, w: 620, h: 468 },
  course: { x: 112, y: 108, w: 600, h: 456 },
  deepunpack: { x: 128, y: 116, w: 580, h: 448 },
  lightskip: { x: 104, y: 92, w: 540, h: 520 },
  xiangqi: { x: 148, y: 84, w: 500, h: 640 },
  about: { x: 168, y: 120, w: 460, h: 440 },
  finder: { x: 188, y: 128, w: 456, h: 492 },
};

export function islandText(mode: IslandMode, tag: string | null) {
  if (mode === "media") return { title: "Qisland · 正在播放 Nocturne", value: "▶ 02:14" };
  if (mode === "alert") return { title: "Qisland 轻提醒 · 窗口可拖拽与缩放", value: "LIVE" };
  return { title: `${tag ? `Qisland ${tag}` : "Qisland"} · 专注计时`, value: "25:00" };
}

export const courseNotes = {
  1: "① 自动提取本讲核心定义、公式推导与易错点，告别机械抄写 PPT。",
  2: "② 自动标出与前序章节的概念关联，把零散单讲织成课程图谱。",
  3: "③ 基于本讲课件与录音上下文随时追问 AI，直接生成自测题。",
} as const;

export type Project = {
  id: ProjectId;
  name: string;
  title: string;
  badge: string;
  mark: string;
  gradient: string;
  shortcut?: string;
  repo: ReleaseRepo | null;
  github: string;
  website?: string;
  blurb: string;
  problem: string;
  approach: string;
  stack: string[];
  demoHint: string;
  keywords: string;
};

export const projects: Project[] = [
  {
    id: "qisland",
    name: "Qisland",
    title: "Qisland — Windows 灵动岛",
    badge: "C# · WPF",
    mark: "Q",
    gradient: "linear-gradient(145deg,#0EA5E9,#2563EB)",
    shortcut: "1",
    repo: "Qisland",
    github: "https://github.com/Qiuizi/Qisland",
    website: "https://qiuizi.github.io/Qisland/",
    blurb: "把灵动岛带到 Windows 桌面顶部边缘：媒体播放、专注计时与轻提醒顺手停靠，不抢焦点、不弹窗。",
    problem: "媒体、专注计时和轻提醒在 Windows 上各自弹窗，容易把正在使用的窗口抢到后面。",
    approach: "在屏幕顶部放一颗不抢焦点的胶囊，把播放、计时和轻提醒收进同一处。下面的按钮会直接切换这颗胶囊的形态。",
    stack: ["C#", "WPF"],
    demoHint: "切换专注、媒体与提醒",
    keywords: "qisland 灵动岛 专注 计时 媒体 windows",
  },
  {
    id: "course",
    name: "CourseWorkspace",
    title: "CourseWorkspace — 课程工作台",
    badge: "TypeScript",
    mark: "C",
    gradient: "linear-gradient(145deg,#10B981,#047857)",
    shortcut: "2",
    repo: null,
    github: "https://github.com/Qiuizi/CourseDesk",
    website: "https://qiuizi.github.io/CourseDesk/",
    blurb: "本地优先的双平台课程工作台，统一查看在课、随堂题、签到与作业，支持普通 / 开发者双界面。",
    problem: "在课、随堂题、签到和作业分散在不同入口，课件与录音也不容易回到同一门课。",
    approach: "用本地优先的双平台工作台把这些入口收到一处，并保留普通 / 开发者双界面。演示可以把一讲整理成要点、前序关联和追问。",
    stack: ["TypeScript"],
    demoHint: "三层课程笔记",
    keywords: "courseworkspace coursedesk 课程 笔记 作业 签到",
  },
  {
    id: "deepunpack",
    name: "DeepUnpack",
    title: "DeepUnpack（解到底）",
    badge: "Tauri · Rust",
    mark: "D",
    gradient: "linear-gradient(145deg,#F59E0B,#D97706)",
    shortcut: "3",
    repo: "DeepUnpack",
    github: "https://github.com/Qiuizi/DeepUnpack",
    blurb: "多层嵌套与加密压缩包一键递归解压、自动展平目录，并做文件筛选预览与批量整理重命名。",
    problem: "压缩包里再套压缩包，再夹着 __MACOSX 和 .DS_Store，文件只能一层层手工拆开。",
    approach: "递归解压到底、展平目录、清掉系统垃圾，再留下筛选预览和批量重命名。演示会把一套三层套娃拆开展平。",
    stack: ["Tauri", "Rust", "React"],
    demoHint: "一键解到底",
    keywords: "deepunpack 解到底 解压 压缩包 zip",
  },
  {
    id: "lightskip",
    name: "LightSkip",
    title: "轻跳 · LightSkip",
    badge: "Android · Java",
    mark: "L",
    gradient: "linear-gradient(145deg,#A78BFA,#6D28D9)",
    shortcut: "4",
    repo: "LightSkip",
    github: "https://github.com/Qiuizi/LightSkip",
    blurb: "零 INTERNET 权限、无第三方依赖的纯本地 Android 开屏广告自动跳过工具，默认白名单生效，内置 25 套规则。",
    problem: "开屏广告挡在应用前面，而不少跳过工具自己还要联网，或者带上第三方依赖。",
    approach: "纯本地判断，不申请 INTERNET 权限，默认只在白名单里生效，并附上规则、本地录制和国产 ROM 保活说明。",
    stack: ["Java", "Android SDK"],
    demoHint: "开屏跳过计时",
    keywords: "lightskip 轻跳 开屏 广告 android",
  },
  {
    id: "xiangqi",
    name: "XiangqiStudio",
    title: "XiangqiStudio — 中国象棋工作室",
    badge: "TypeScript · Tauri",
    mark: "象",
    gradient: "linear-gradient(145deg,#F43F5E,#BE123C)",
    repo: "XiangqiStudio",
    github: "https://github.com/Qiuizi/XiangqiStudio",
    website: "https://qiuizi.github.io/XiangqiStudio/",
    blurb: "基于 Pikafish 引擎的本地中国象棋分析与复盘桌面工具。这扇窗里有一盘按规则可下的棋。",
    problem: "想复盘时把棋谱交给在线服务，对局就离开了自己的电脑。",
    approach: "桌面端用 Pikafish 在本地做分析与复盘。这里的棋盘按中国象棋规则走子、吃子和将军，用来直接试手。",
    stack: ["TypeScript", "Tauri", "Pikafish"],
    demoHint: "可对弈棋盘",
    keywords: "xiangqistudio 象棋 棋盘 pikafish 对弈",
  },
];

export const projectById: Record<ProjectId, Project> = {
  qisland: projects[0],
  course: projects[1],
  deepunpack: projects[2],
  lightskip: projects[3],
  xiangqi: projects[4],
};

export function isProjectId(id: WinId): id is ProjectId {
  return id in projectById;
}

export const windowChrome: Record<WinId, { appName: string; title: string; badge: string }> = {
  welcome: { appName: "Qiuizi OS", title: "欢迎来到 Qiuizi OS", badge: "桌面" },
  about: { appName: "关于 Qiuizi", title: "关于 Qiuizi", badge: "Qiuizi" },
  finder: { appName: "Finder", title: "Finder — 更多作品", badge: "作品" },
  qisland: { appName: "Qisland", title: projectById.qisland.title, badge: projectById.qisland.badge },
  course: { appName: "CourseWorkspace", title: projectById.course.title, badge: projectById.course.badge },
  deepunpack: { appName: "DeepUnpack", title: projectById.deepunpack.title, badge: projectById.deepunpack.badge },
  lightskip: { appName: "LightSkip", title: projectById.lightskip.title, badge: projectById.lightskip.badge },
  xiangqi: { appName: "XiangqiStudio", title: projectById.xiangqi.title, badge: projectById.xiangqi.badge },
};

export const iconStyle: Record<Exclude<WinId, "welcome">, { label: string; mark: string; gradient: string; shortcut?: string }> = {
  qisland: { label: "Qisland", mark: "Q", gradient: projectById.qisland.gradient, shortcut: "1" },
  course: { label: "CourseWorkspace", mark: "C", gradient: projectById.course.gradient, shortcut: "2" },
  deepunpack: { label: "DeepUnpack", mark: "D", gradient: projectById.deepunpack.gradient, shortcut: "3" },
  lightskip: { label: "LightSkip", mark: "L", gradient: projectById.lightskip.gradient, shortcut: "4" },
  xiangqi: { label: "XiangqiStudio", mark: "象", gradient: projectById.xiangqi.gradient },
  about: { label: "关于", mark: "i", gradient: "linear-gradient(145deg,#94A3B8,#334155)" },
  finder: { label: "更多", mark: "+", gradient: "linear-gradient(145deg,#6366F1,#4338CA)" },
};

export const dockItems: Exclude<WinId, "welcome" | "about">[] = ["qisland", "course", "deepunpack", "lightskip", "xiangqi", "finder"];

export const finderItems = [
  {
    name: "高校导师检索工具",
    detail: "Tutor Finder · 按研究方向检索导师",
    href: "https://qiuizi.github.io/scu-tutor-finder/",
    action: "访问 ↗",
    keywords: "导师 检索 tutor finder",
  },
  {
    name: "CloudFitness",
    detail: "独立域名轻量健身记录与训练应用",
    href: "https://app.cloudfitness.top",
    action: "打开 ↗",
    keywords: "cloudfitness 健身",
  },
  {
    name: "info-station",
    detail: "本地优先的 Windows 桌面信息监控站",
    href: "https://github.com/Qiuizi/info-station",
    action: "源码 ↗",
    keywords: "info-station 信息 监控",
    releaseRepo: "info-station" as ReleaseRepo,
  },
  {
    name: "fate",
    detail: "传统命理文化排盘与辅助解读工具",
    href: "https://github.com/Qiuizi/fate",
    action: "源码 ↗",
    keywords: "fate 排盘",
  },
  {
    name: "ultimate-tic-tac-toe",
    detail: "九宫嵌套策略棋类——终极井字棋交互实现",
    href: "https://github.com/Qiuizi/ultimate-tic-tac-toe",
    action: "源码 ↗",
    keywords: "井字棋 tic-tac-toe",
  },
  {
    name: "GitHub @Qiuizi",
    detail: "全部开源仓库与发布包主页",
    href: "https://github.com/Qiuizi",
    action: "主页 ↗",
    keywords: "github qiuizi",
  },
] as const;
