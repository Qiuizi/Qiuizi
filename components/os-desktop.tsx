"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Aurora } from "@/components/aurora";
import { ExternalLink } from "@/components/external-link";
import { MobileHome } from "@/components/mobile-home";
import { Spotlight, type SpotlightCommand } from "@/components/spotlight";
import { WindowSurface, releaseHref, releaseLabel, type DemoState, type PanelTab } from "@/components/window-surface";
import {
  dockItems,
  finderItems,
  flagshipOrder,
  homeLayout,
  iconStyle,
  islandText,
  isProjectId,
  launcherOrder,
  projectById,
  projects,
  windowChrome,
  windowOrder,
  type Geom,
  type IslandMode,
  type WinId,
} from "@/data/os";
import { LAYOUT_KEY, readLayout, readMotion, sanitizeWindow, writeLayout, writeMotion, type StoredLayout } from "@/lib/layout-store";
import type { ReleaseMap } from "@/lib/releases";
import { site } from "@/lib/site";

type Win = {
  id: WinId;
  geom: Geom;
  z: number;
  hidden: boolean;
  max: boolean;
};

type Edge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const EDGES: Edge[] = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];
const MIN_W = 300;
const MIN_H = 220;
const ISLAND_CLEAR = 76;

function buildWindows(): Win[] {
  return windowOrder.map((id, index) => ({
    id,
    geom: homeLayout[id],
    z: 12 + index,
    hidden: id !== "welcome",
    max: false,
  }));
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isMobile() {
  return window.matchMedia("(max-width: 767px)").matches;
}

export function OsDesktop({ releases }: { releases: ReleaseMap }) {
  const [windows, setWindows] = useState(buildWindows);
  const [focused, setFocused] = useState<WinId>("welcome");
  const [island, setIsland] = useState<IslandMode>("focus");
  const [note, setNote] = useState<1 | 2 | 3>(1);
  const [unpacked, setUnpacked] = useState(false);
  const [tabs, setTabs] = useState<Partial<Record<WinId, PanelTab>>>({});
  const [dragging, setDragging] = useState<WinId | null>(null);
  const [resizing, setResizing] = useState<WinId | null>(null);
  const [motionOn, setMotionOn] = useState(true);
  const [reduceMotionOn, setReduceMotionOn] = useState(false);
  const [palette, setPalette] = useState(false);
  const [sheet, setSheet] = useState<WinId | null>(null);
  const [mobile, setMobile] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLElement>(null);
  const zRef = useRef(30);
  const latest = useRef<{
    palette: boolean;
    sheet: WinId | null;
    openWin: (id: WinId, tab?: PanelTab) => void;
    hideWin: (id: WinId) => void;
    resetLayout: () => void;
    copyEmail: () => void;
  }>({
    palette: false,
    sheet: null,
    openWin: () => undefined,
    hideWin: () => undefined,
    resetLayout: () => undefined,
    copyEmail: () => undefined,
  });

  const wallpaperPlaying = motionOn && !reduceMotionOn;
  const islandView = islandText(island, releases.Qisland.tag);

  function box() {
    const node = desktopRef.current;
    const width = node?.clientWidth ?? 0;
    const height = node?.clientHeight ?? 0;
    if (width < 200 || height < 200) return { w: 1280, h: 760 };
    return { w: width, h: height };
  }

  function clamp(geom: Geom): Geom {
    const b = box();
    const w = Math.min(Math.max(MIN_W, geom.w), Math.max(MIN_W, b.w - 16));
    const h = Math.min(Math.max(MIN_H, geom.h), Math.max(MIN_H, b.h - ISLAND_CLEAR - 12));
    return {
      w,
      h,
      x: Math.max(8, Math.min(geom.x, Math.max(8, b.w - w - 8))),
      y: Math.max(ISLAND_CLEAR, Math.min(geom.y, Math.max(ISLAND_CLEAR, b.h - h - 8))),
    };
  }

  function resizeGeom(origin: Geom, edge: Edge, dx: number, dy: number): Geom {
    const b = box();
    const east = edge === "e" || edge === "ne" || edge === "se";
    const west = edge === "w" || edge === "nw" || edge === "sw";
    const south = edge === "s" || edge === "se" || edge === "sw";
    const north = edge === "n" || edge === "ne" || edge === "nw";
    let { x, y, w, h } = origin;
    if (east) w = origin.w + dx;
    if (west) {
      w = origin.w - dx;
      x = origin.x + origin.w - w;
    }
    if (south) h = origin.h + dy;
    if (north) {
      h = origin.h - dy;
      y = origin.y + origin.h - h;
    }
    if (w < MIN_W) {
      if (west) x -= MIN_W - w;
      w = MIN_W;
    }
    if (h < MIN_H) {
      if (north) y -= MIN_H - h;
      h = MIN_H;
    }
    if (x < 8) {
      w -= 8 - x;
      x = 8;
    }
    if (y < ISLAND_CLEAR) {
      h -= ISLAND_CLEAR - y;
      y = ISLAND_CLEAR;
    }
    const maxRight = b.w - 8;
    const maxBottom = b.h - 8;
    if (x + w > maxRight) {
      if (east) w = Math.max(MIN_W, maxRight - x);
      else x = Math.max(8, maxRight - w);
    }
    if (y + h > maxBottom) {
      if (south) h = Math.max(MIN_H, maxBottom - y);
      else y = Math.max(ISLAND_CLEAR, maxBottom - h);
    }
    return { x, y, w, h };
  }

  function focusWin(id: WinId) {
    const z = ++zRef.current;
    setFocused(id);
    setWindows((current) => current.map((win) => (win.id === id ? { ...win, hidden: false, z } : win)));
  }

  function hideWin(id: WinId) {
    const next = windows.map((win) => (win.id === id ? { ...win, hidden: true, max: false } : win));
    const top = [...next].filter((win) => !win.hidden).sort((a, b) => b.z - a.z)[0];
    setWindows(next);
    setFocused(top?.id ?? "welcome");
  }

  function toggleMax(id: WinId) {
    const z = ++zRef.current;
    setFocused(id);
    setWindows((current) =>
      current.map((win) => {
        if (win.id !== id) return win;
        if (win.max) return { ...win, max: false, hidden: false, z };
        return { ...win, max: true, hidden: false, z };
      }),
    );
  }

  function resetLayout() {
    try {
      localStorage.removeItem(LAYOUT_KEY);
    } catch {
      /* Ignore private-mode failures. */
    }
    zRef.current = 30;
    setWindows(buildWindows().map((win) => ({ ...win, geom: clamp(win.geom) })));
    setFocused("welcome");
    setTabs({});
    setPalette(false);
    setSheet(null);
  }

  function openWin(id: WinId, tab: PanelTab = "demo") {
    setTabs((current) => ({ ...current, [id]: tab }));
    setPalette(false);
    if (isMobile()) {
      setSheet(id === "welcome" ? null : id);
      return;
    }
    focusWin(id);
  }

  function onDock(id: WinId) {
    const win = windows.find((item) => item.id === id);
    if (!win || win.hidden || focused !== id) openWin(id, tabs[id] ?? "demo");
    else hideWin(id);
  }

  async function copyEmail() {
    const email = site.email;
    let copied = false;
    try {
      await navigator.clipboard.writeText(email);
      copied = true;
    } catch {
      try {
        const input = document.createElement("textarea");
        input.value = email;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.left = "-9999px";
        document.body.appendChild(input);
        input.select();
        copied = document.execCommand("copy");
        input.remove();
      } catch {
        copied = false;
      }
    }
    setToast(copied ? "已复制邮箱" : "复制失败");
    setPalette(false);
  }

  useLayoutEffect(() => {
    latest.current = { palette, sheet, openWin, hideWin, resetLayout, copyEmail };
  });

  useLayoutEffect(() => {
    // Mount-only: matchMedia and localStorage are unavailable during SSR, and window geometry must be measured.
    /* eslint-disable react-hooks/set-state-in-effect */
    const media = window.matchMedia("(max-width: 767px)");
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyViewport = () => setMobile(media.matches);
    const applyMotion = () => setReduceMotionOn(motionMedia.matches);
    applyViewport();
    applyMotion();
    media.addEventListener("change", applyViewport);
    motionMedia.addEventListener("change", applyMotion);

    const saved = readLayout();
    const motion = readMotion();
    if (motion !== null) setMotionOn(motion);
    if (saved) {
      let maxZ = 30;
      const next = buildWindows().map((win) => {
        const item = sanitizeWindow(saved.windows[win.id]);
        if (!item) return { ...win, geom: clamp(win.geom) };
        maxZ = Math.max(maxZ, item.z);
        return { ...win, hidden: item.hidden, max: item.max, z: item.z, geom: clamp({ x: item.x, y: item.y, w: item.w, h: item.h }) };
      });
      const visible = next.find((win) => win.id === saved.focused && !win.hidden) ?? next.find((win) => !win.hidden);
      zRef.current = maxZ;
      setWindows(next);
      setFocused(visible?.id ?? "welcome");
    } else {
      setWindows((current) => current.map((win) => ({ ...win, geom: clamp(win.geom) })));
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */

    return () => {
      media.removeEventListener("change", applyViewport);
      motionMedia.removeEventListener("change", applyMotion);
    };
    // Clamp once against the real desktop box.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onResize() {
      setWindows((current) => current.map((win) => (win.max ? win : { ...win, geom: clamp(win.geom) })));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const id = window.setTimeout(() => {
      const layout: StoredLayout = {
        v: 1,
        focused,
        windows: Object.fromEntries(
          windows.map((win) => [win.id, { x: win.geom.x, y: win.geom.y, w: win.geom.w, h: win.geom.h, hidden: win.hidden, max: win.max, z: win.z }]),
        ),
      };
      writeLayout(layout);
    }, 220);
    return () => window.clearTimeout(id);
  }, [hydrated, windows, focused]);

  useEffect(() => {
    if (!hydrated) return;
    writeMotion(motionOn);
  }, [hydrated, motionOn]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const key = event.key;
      if ((event.metaKey || event.ctrlKey) && key.toLowerCase() === "k") {
        event.preventDefault();
        setPalette((open) => !open);
        return;
      }
      if (latest.current.palette) {
        if (key === "Escape") {
          event.preventDefault();
          setPalette(false);
        }
        return;
      }
      if (key === "Escape") {
        event.preventDefault();
        if (latest.current.sheet) {
          setSheet(null);
          return;
        }
        latest.current.hideWin("finder");
        return;
      }
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (!event.metaKey && !event.ctrlKey && !event.altKey && key >= "1" && key <= "4") {
        event.preventDefault();
        latest.current.openWin(flagshipOrder[Number(key) - 1]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onBarPointerDown(event: React.PointerEvent<HTMLDivElement>, id: WinId) {
    if (isMobile() || (event.target as HTMLElement).closest("button, a")) return;
    event.preventDefault();
    const win = windows.find((item) => item.id === id);
    if (!win || win.max) return;
    const origin = win.geom;
    const startX = event.clientX;
    const startY = event.clientY;
    const z = ++zRef.current;
    setFocused(id);
    setDragging(id);
    setWindows((current) => current.map((item) => (item.id === id ? { ...item, hidden: false, z } : item)));
    const bar = event.currentTarget;
    bar.setPointerCapture(event.pointerId);
    let raf = 0;
    const move = (ev: PointerEvent) => {
      const b = box();
      const x = Math.max(8, Math.min(Math.max(8, b.w - 140), origin.x + ev.clientX - startX));
      const y = Math.max(ISLAND_CLEAR, Math.min(Math.max(ISLAND_CLEAR, b.h - 72), origin.y + ev.clientY - startY));
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setWindows((current) => current.map((item) => (item.id === id ? { ...item, geom: { ...item.geom, x, y } } : item)));
      });
    };
    const up = () => {
      cancelAnimationFrame(raf);
      bar.removeEventListener("pointermove", move);
      bar.removeEventListener("pointerup", up);
      bar.removeEventListener("pointercancel", up);
      setDragging(null);
    };
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", up);
    bar.addEventListener("pointercancel", up);
  }

  function onResizeDown(event: React.PointerEvent<HTMLDivElement>, id: WinId, edge: Edge) {
    if (isMobile()) return;
    event.preventDefault();
    event.stopPropagation();
    const win = windows.find((item) => item.id === id);
    if (!win || win.max) return;
    const origin = win.geom;
    const startX = event.clientX;
    const startY = event.clientY;
    const z = ++zRef.current;
    setFocused(id);
    setResizing(id);
    setWindows((current) => current.map((item) => (item.id === id ? { ...item, hidden: false, z } : item)));
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);
    let raf = 0;
    const move = (ev: PointerEvent) => {
      const next = resizeGeom(origin, edge, ev.clientX - startX, ev.clientY - startY);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setWindows((current) => current.map((item) => (item.id === id ? { ...item, geom: next } : item)));
      });
    };
    const up = () => {
      cancelAnimationFrame(raf);
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      handle.removeEventListener("pointercancel", up);
      setResizing(null);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", up);
  }

  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;
    const items = [...dock.querySelectorAll<HTMLElement>(".d-app")];
    const allow = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion() && !isMobile();
    const move = (event: PointerEvent) => {
      if (!allow() || event.pointerType !== "mouse") return;
      dock.classList.add("is-live");
      for (const item of items) {
        const rect = item.getBoundingClientRect();
        const distance = Math.abs(event.clientX - (rect.left + rect.width / 2));
        const scale = 1 + Math.max(0, 0.36 * Math.exp(-(distance * distance) / (2 * 70 * 70)));
        item.style.transform = `translate3d(0, ${(-(scale - 1) * 18).toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
      }
    };
    const leave = () => {
      dock.classList.remove("is-live");
      for (const item of items) item.style.transform = "";
    };
    dock.addEventListener("pointermove", move);
    dock.addEventListener("pointerleave", leave);
    return () => {
      dock.removeEventListener("pointermove", move);
      dock.removeEventListener("pointerleave", leave);
    };
  }, []);

  const demo: DemoState = {
    island,
    onIsland: setIsland,
    note,
    onNote: setNote,
    unpacked,
    onUnpack: () => setUnpacked((value) => !value),
  };

  const commands: SpotlightCommand[] = [
    {
      id: "copy-email",
      group: "操作",
      title: "复制邮箱",
      hint: site.email,
      keywords: "email mail 邮箱 联系 contact copy",
      pinned: true,
      run: () => latest.current.copyEmail(),
    },
    {
      id: "toggle-motion",
      group: "操作",
      title: motionOn ? "关闭动效" : "开启动效",
      hint: reduceMotionOn ? "系统正在减少动效" : "壁纸丝绸",
      keywords: "动效 动画 motion wallpaper 壁纸",
      pinned: true,
      run: () => {
        setMotionOn((value) => !value);
        setPalette(false);
      },
    },
    {
      id: "reset-layout",
      group: "操作",
      title: "重置布局",
      hint: "回到欢迎窗口",
      keywords: "重置 布局 reset layout",
      pinned: true,
      run: () => latest.current.resetLayout(),
    },
    {
      id: "open-welcome",
      group: "项目",
      title: "欢迎窗口",
      hint: "Qiuizi OS",
      keywords: "welcome 欢迎",
      pinned: true,
      run: () => latest.current.openWin("welcome"),
    },
    {
      id: "open-about",
      group: "项目",
      title: "关于 Qiuizi",
      hint: "GitHub 与邮箱",
      keywords: "about 关于 联系 github",
      pinned: true,
      run: () => latest.current.openWin("about"),
    },
    {
      id: "open-finder",
      group: "项目",
      title: "更多作品",
      hint: "Finder",
      keywords: "finder 更多 作品",
      pinned: true,
      run: () => latest.current.openWin("finder"),
    },
    ...projects.map((project) => ({
      id: `open-${project.id}`,
      group: "项目",
      title: project.name,
      hint: project.shortcut ? `快捷键 ${project.shortcut}` : "打开窗口",
      keywords: project.keywords,
      pinned: true,
      run: () => latest.current.openWin(project.id, "demo"),
    })),
    ...projects.map((project) => ({
      id: `demo-${project.id}`,
      group: "交互演示",
      title: `${project.name} 演示`,
      hint: project.demoHint,
      keywords: `${project.keywords} 演示 demo`,
      pinned: false,
      run: () => latest.current.openWin(project.id, "demo"),
    })),
    ...projects.map((project) => ({
      id: `dive-${project.id}`,
      group: "深潜",
      title: `${project.name} 深潜`,
      hint: "问题、做法与技术栈",
      keywords: `${project.keywords} 深潜 架构 技术栈`,
      pinned: false,
      run: () => latest.current.openWin(project.id, "dive"),
    })),
    ...projects
      .filter((project) => project.repo)
      .map((project) => {
        const release = releases[project.repo!];
        return {
          id: `dl-${project.id}`,
          group: "下载",
          title: releaseLabel(project.name, release),
          hint: release.assetName ?? "GitHub Releases",
          keywords: `${project.keywords} 下载 release github`,
          pinned: true,
          run: () => {
            window.open(releaseHref(project, release), "_blank", "noopener,noreferrer");
            setPalette(false);
          },
        };
      }),
    {
      id: "dl-info-station",
      group: "下载",
      title: releaseLabel("info-station", releases["info-station"]),
      hint: releases["info-station"].assetName ?? "GitHub Releases",
      keywords: "info-station 下载 release 信息",
      pinned: true,
      run: () => {
        window.open(releases["info-station"].downloadUrl ?? releases["info-station"].url, "_blank", "noopener,noreferrer");
        setPalette(false);
      },
    },
    ...finderItems.map((item) => ({
      id: `find-${item.name}`,
      group: "更多作品",
      title: item.name,
      hint: item.detail,
      keywords: item.keywords,
      pinned: false,
      run: () => {
        window.open(item.href, "_blank", "noopener,noreferrer");
        setPalette(false);
      },
    })),
  ];

  function cycleIsland() {
    setIsland((mode) => (mode === "focus" ? "media" : mode === "media" ? "alert" : "focus"));
  }

  return (
    <div className="os-root" data-hydrated={hydrated ? "true" : "false"} data-viewport={mobile ? "mobile" : "desktop"}>
      <Aurora playing={wallpaperPlaying} />
      <div className="wallpaper-watermark" aria-hidden="true">
        Qiuizi
      </div>
      <h1 className="sr-only">Qiuizi OS</h1>
      <p className="sr-only">按 Command 或 Control 加 K 打开搜索。数字键 1 到 4 打开旗舰窗口，Escape 关闭搜索或 Finder。</p>

      <div className="desktop-shell" inert={mobile ? true : undefined}>
        <header className="menubar">
          <div className="mb-left">
            <button className="mb-brand" type="button" onClick={() => openWin("welcome")}>
              ◆ Qiuizi OS
            </button>
            <button className="mb-btn" type="button" onClick={resetLayout}>
              重置布局
            </button>
            <button className="mb-btn" type="button" onClick={() => openWin("finder")}>
              更多作品
            </button>
            <button className="mb-btn" type="button" onClick={() => openWin("about")}>
              关于
            </button>
          </div>
          <div className="mb-right">
            <button className="mb-search" type="button" onClick={() => setPalette(true)} aria-keyshortcuts="Meta+K Control+K">
              搜索
              <kbd>⌘K</kbd>
            </button>
            <button
              className={`mb-btn${wallpaperPlaying ? " is-on" : ""}`}
              type="button"
              aria-pressed={motionOn}
              aria-label={reduceMotionOn ? "系统已请求减少动效，壁纸保持静止" : motionOn ? "暂停背景动效" : "播放背景动效"}
              title={reduceMotionOn ? "系统已请求减少动效" : undefined}
              onClick={() => setMotionOn((value) => !value)}
            >
              动效
            </button>
            <ExternalLink href={site.github} className="mb-gh">
              GitHub ↗
            </ExternalLink>
          </div>
        </header>

        <button
          type="button"
          className={`os-island${island === "alert" ? " expanded" : ""}`}
          onClick={cycleIsland}
          aria-label={`Qisland 灵动岛，当前${islandView.title}，点击切换形态`}
        >
          <span className="oi-main">
            <span className="oi-dot" aria-hidden="true" />
            <span className="oi-title">{islandView.title}</span>
          </span>
          <span className="oi-val">{islandView.value}</span>
        </button>

        <main ref={desktopRef} className="desktop" id="desktop">
          <div className="desk-icons">
            {launcherOrder.map((id) => {
              const icon = iconStyle[id];
              const win = windows.find((item) => item.id === id);
              const open = Boolean(win && !win.hidden);
              return (
                <button key={id} type="button" className={`desk-icon${open ? " is-open" : ""}`} aria-keyshortcuts={icon.shortcut} onClick={() => openWin(id)}>
                  <span className="d-icon desk-mark" style={{ background: icon.gradient }} aria-hidden="true">
                    {icon.mark}
                  </span>
                  <span className="desk-label">
                    {id === "course" ? (
                      <>
                        Course
                        <br />
                        Workspace
                      </>
                    ) : (
                      icon.label
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          {windows.map((win) => {
            const chrome = windowChrome[win.id];
            const project = isProjectId(win.id) ? projectById[win.id] : null;
            const release = project?.repo ? releases[project.repo] : undefined;
            const badge = release?.tag ? `${release.tag} · ${chrome.badge}` : chrome.badge;
            return (
              <section
                key={win.id}
                id={`win-${win.id}`}
                className={`win${focused === win.id && !win.hidden ? " focused" : ""}${win.hidden ? " hidden" : ""}${win.max ? " maximized" : ""}${dragging === win.id ? " dragging" : ""}${resizing === win.id ? " resizing" : ""}`}
                style={win.max ? { zIndex: win.z } : { left: win.geom.x, top: win.geom.y, width: win.geom.w, height: win.geom.h, zIndex: win.z }}
                aria-hidden={win.hidden}
                inert={win.hidden ? true : undefined}
                onPointerDown={() => {
                  if (!win.hidden) focusWin(win.id);
                }}
              >
                {win.max
                  ? null
                  : EDGES.map((edge) => (
                      <div key={edge} className={`resize-handle resize-${edge}`} onPointerDown={(event) => onResizeDown(event, win.id, edge)} />
                    ))}
                <div
                  className="win-bar"
                  onPointerDown={(event) => onBarPointerDown(event, win.id)}
                  onDoubleClick={(event) => {
                    if ((event.target as HTMLElement).closest("button, a")) return;
                    toggleMax(win.id);
                  }}
                >
                  <div className="traffic">
                    <button className="t-close" type="button" aria-label={`关闭${chrome.appName}`} onClick={() => hideWin(win.id)}>
                      <span />
                    </button>
                    <button className="t-min" type="button" aria-label={`最小化${chrome.appName}`} onClick={() => hideWin(win.id)}>
                      <span />
                    </button>
                    <button
                      className="t-max"
                      type="button"
                      aria-label={win.max ? `还原${chrome.appName}` : `放大${chrome.appName}`}
                      aria-pressed={win.max}
                      onClick={() => toggleMax(win.id)}
                    >
                      <span />
                    </button>
                  </div>
                  <div className="win-title">{chrome.title}</div>
                  <div className="win-badge">{badge}</div>
                </div>
                <div className={`win-body${win.id === "xiangqi" ? " xq-host" : ""}`}>
                  <WindowSurface
                    id={win.id}
                    releases={releases}
                    tab={tabs[win.id] ?? "demo"}
                    onTab={(tab) => setTabs((current) => ({ ...current, [win.id]: tab }))}
                    demo={demo}
                    onCopyEmail={copyEmail}
                    onOpen={openWin}
                    onXiangqiInteract={() => focusWin("xiangqi")}
                  />
                </div>
              </section>
            );
          })}
        </main>

        <nav ref={dockRef} className="dock-bar" aria-label="Qiuizi OS Dock">
          {dockItems.map((id) => {
            const icon = iconStyle[id];
            const win = windows.find((entry) => entry.id === id);
            const open = Boolean(win && !win.hidden);
            return (
              <button key={id} type="button" className="d-app" aria-pressed={open} aria-keyshortcuts={icon.shortcut} onClick={() => onDock(id)}>
                <span className="d-tip">{icon.label === "更多" ? "更多作品" : icon.label}</span>
                <span className="d-icon" style={{ background: icon.gradient }} aria-hidden="true">
                  {icon.mark}
                </span>
                <span className={`d-dot${open ? "" : " off"}`} aria-hidden="true" />
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mobile-shell" inert={mobile ? undefined : true}>
        <MobileHome
          releases={releases}
          sheet={sheet}
          tab={sheet ? (tabs[sheet] ?? "demo") : "demo"}
          onTab={(tab) => {
            if (!sheet) return;
            setTabs((current) => ({ ...current, [sheet]: tab }));
          }}
          demo={demo}
          onOpen={openWin}
          onClose={() => setSheet(null)}
          onSearch={() => setPalette(true)}
          onCopyEmail={copyEmail}
        />
      </div>

      {palette ? <Spotlight commands={commands} onClose={() => setPalette(false)} /> : null}
      {toast ? (
        <div className="toast" role="status">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
