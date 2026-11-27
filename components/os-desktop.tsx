"use client";

import { useEffect, useRef, useState } from "react";
import { Aurora } from "@/components/aurora";
import { ExternalLink } from "@/components/external-link";
import { XiangqiBoard } from "@/components/xiangqi-board";
import {
  courseNotes,
  dockItems,
  finderItems,
  flagshipOrder,
  homeLayout,
  islandCopy,
  type Geom,
  type IslandMode,
  type WinId,
} from "@/data/os";
import { site } from "@/lib/site";

type Win = {
  id: WinId;
  appName: string;
  title: string;
  badge: string;
  geom: Geom;
  z: number;
  hidden: boolean;
  max: boolean;
  restore?: Geom;
};

const initialWindows: Win[] = [
  { id: "qisland", appName: "Qisland", title: "Qisland — Windows 灵动岛", badge: "v4.3.0 · C#", geom: homeLayout.qisland, z: 14, hidden: false, max: false },
  { id: "deepunpack", appName: "DeepUnpack", title: "DeepUnpack（解到底）", badge: "递归解压", geom: homeLayout.deepunpack, z: 13, hidden: false, max: false },
  { id: "coursedesk", appName: "CourseDesk", title: "CourseDesk / CourseWorkspace", badge: "AI 工作台", geom: homeLayout.coursedesk, z: 12, hidden: false, max: false },
  { id: "lightskip", appName: "LightSkip", title: "轻跳 · LightSkip — Android 开屏跳过", badge: "v0.2.0 · Android / Java", geom: homeLayout.lightskip, z: 15, hidden: false, max: false },
  { id: "xiangqi", appName: "XiangqiStudio", title: "XiangqiStudio — 中国象棋工作室", badge: "v1.0.0", geom: homeLayout.xiangqi, z: 16, hidden: true, max: false },
  { id: "finder", appName: "Finder · 更多作品", title: "Finder — 更多在线 Web 与开源作品", badge: "05 — 10", geom: homeLayout.finder, z: 20, hidden: true, max: false },
];

const defaultOpen = new Set<WinId>(["qisland", "deepunpack", "coursedesk", "lightskip"]);
const islandClear = 76;

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isMobile() {
  return window.matchMedia("(max-width: 767px)").matches;
}

export function OsDesktop() {
  const [windows, setWindows] = useState(initialWindows);
  const [focused, setFocused] = useState<WinId>("qisland");
  const [island, setIsland] = useState<IslandMode>("focus");
  const [note, setNote] = useState<1 | 2 | 3>(1);
  const [unpacked, setUnpacked] = useState(false);
  const [dragging, setDragging] = useState<WinId | null>(null);
  const [wallpaperOn, setWallpaperOn] = useState(true);
  const desktopRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLElement>(null);
  const zRef = useRef(25);

  function box() {
    const node = desktopRef.current;
    if (!node) return { w: window.innerWidth, h: Math.max(320, window.innerHeight - 122) };
    return { w: node.clientWidth, h: node.clientHeight };
  }

  function clamp(geom: Geom): Geom {
    const b = box();
    const w = Math.min(geom.w, Math.max(260, b.w - 16));
    return {
      w,
      x: Math.max(8, Math.min(Math.max(8, b.w - 140), geom.x)),
      y: Math.max(islandClear, Math.min(Math.max(islandClear, b.h - 72), geom.y)),
    };
  }

  function focusWin(id: WinId) {
    const z = ++zRef.current;
    setFocused(id);
    setWindows((current) => current.map((win) => (win.id === id ? { ...win, hidden: false, z } : win)));
    if (isMobile()) {
      const behavior = reducedMotion() ? "auto" : "smooth";
      document.getElementById(`win-${id}`)?.scrollIntoView({ behavior, block: "start" });
    }
  }

  function hideWin(id: WinId) {
    setWindows((current) => {
      const next = current.map((win) => (win.id === id ? { ...win, hidden: true, max: false } : win));
      const top = [...next].filter((win) => !win.hidden).sort((a, b) => b.z - a.z)[0];
      setFocused(top?.id ?? "qisland");
      return next;
    });
  }

  function toggleMax(id: WinId) {
    const z = ++zRef.current;
    setFocused(id);
    setWindows((current) =>
      current.map((win) => {
        if (win.id !== id) return win;
        if (win.max) return { ...win, max: false, hidden: false, z, geom: win.restore ?? win.geom };
        return { ...win, max: true, hidden: false, z, restore: win.geom };
      }),
    );
  }

  function resetLayout() {
    setWindows((current) =>
      current.map((win) => ({
        ...win,
        max: false,
        hidden: !defaultOpen.has(win.id),
        geom: clamp(homeLayout[win.id]),
      })),
    );
    setFocused("qisland");
  }

  function onDock(id: WinId) {
    const win = windows.find((item) => item.id === id);
    if (!win || win.hidden || focused !== id) focusWin(id);
    else hideWin(id);
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setWindows((current) => current.map((win) => ({ ...win, geom: clamp(win.geom) })));
    });
    function onResize() {
      setWindows((current) => current.map((win) => (win.max ? win : { ...win, geom: clamp(win.geom) })));
    }
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
    // Clamp once against the real desktop box, then again only when the viewport changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (event.key === "Escape") {
        event.preventDefault();
        hideWin("finder");
        return;
      }
      if (event.key >= "1" && event.key <= "4") {
        event.preventDefault();
        focusWin(flagshipOrder[Number(event.key) - 1]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onBarPointerDown(event: React.PointerEvent<HTMLDivElement>, id: WinId) {
    if (isMobile() || (event.target as HTMLElement).closest("button")) return;
    event.preventDefault();
    const win = windows.find((item) => item.id === id);
    if (!win) return;
    const origin = win.max && win.restore ? win.restore : win.geom;
    const startX = event.clientX;
    const startY = event.clientY;
    const z = ++zRef.current;
    setFocused(id);
    setDragging(id);
    setWindows((current) =>
      current.map((item) => (item.id === id ? { ...item, hidden: false, max: false, z, geom: origin } : item)),
    );
    const bar = event.currentTarget;
    bar.setPointerCapture(event.pointerId);
    let raf = 0;
    const move = (ev: PointerEvent) => {
      const b = box();
      const x = Math.max(8, Math.min(Math.max(8, b.w - 140), origin.x + ev.clientX - startX));
      const y = Math.max(islandClear, Math.min(Math.max(islandClear, b.h - 72), origin.y + ev.clientY - startY));
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setWindows((current) => current.map((item) => (item.id === id ? { ...item, geom: { ...item.geom, x, y } } : item)));
      });
    };
    const up = () => {
      cancelAnimationFrame(raf);
      bar.removeEventListener("pointermove", move);
      bar.removeEventListener("pointerup", up);
      setDragging(null);
    };
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", up);
  }

  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;
    const items = [...dock.querySelectorAll<HTMLElement>(".d-app")];
    const allow = () =>
      window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion() && !isMobile();
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

  const islandView = islandCopy[island];

  function cycleIsland() {
    setIsland((mode) => (mode === "focus" ? "media" : mode === "media" ? "alert" : "focus"));
  }

  return (
    <div className="os-root">
      <Aurora playing={wallpaperOn} />
      <div className="wallpaper-watermark" aria-hidden="true">
        Qiuizi
      </div>
      <p className="sr-only">数字键 1 到 4 唤起旗舰窗口，Escape 关闭 Finder。</p>

      <header className="menubar">
        <div className="mb-left">
          <span className="mb-brand">◆ Qiuizi OS</span>
          <button className="mb-btn" type="button" onClick={resetLayout}>
            重置布局
          </button>
          <button className="mb-btn" type="button" onClick={() => focusWin("finder")}>
            更多作品
          </button>
        </div>
        <div className="mb-right">
          <button
            className={`mb-btn${wallpaperOn ? " is-on" : ""}`}
            type="button"
            aria-pressed={wallpaperOn}
            aria-label={wallpaperOn ? "暂停背景动效" : "播放背景动效"}
            onClick={() => setWallpaperOn((value) => !value)}
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
        {windows.map((win) => (
          <section
            key={win.id}
            id={`win-${win.id}`}
            className={`win${focused === win.id && !win.hidden ? " focused" : ""}${win.hidden ? " hidden" : ""}${win.max ? " maximized" : ""}${dragging === win.id ? " dragging" : ""}`}
            style={{ left: win.geom.x, top: win.geom.y, width: win.geom.w, zIndex: win.z }}
            aria-hidden={win.hidden}
            onPointerDown={() => {
              if (!win.hidden) focusWin(win.id);
            }}
          >
            <div className="win-bar" onPointerDown={(event) => onBarPointerDown(event, win.id)}>
              <div className="traffic">
                <button className="t-close" type="button" aria-label={`关闭${win.appName}`} onClick={() => hideWin(win.id)}>
                  <span />
                </button>
                <button className="t-min" type="button" aria-label={`最小化${win.appName}`} onClick={() => hideWin(win.id)}>
                  <span />
                </button>
                <button
                  className="t-max"
                  type="button"
                  aria-label={win.max ? `还原${win.appName}` : `放大${win.appName}`}
                  aria-pressed={win.max}
                  onClick={() => toggleMax(win.id)}
                >
                  <span />
                </button>
              </div>
              <div className="win-title">{win.title}</div>
              <div className="win-badge">{win.badge}</div>
            </div>
            <div className={`win-body${win.id === "xiangqi" ? " xq-host" : ""}`}>
              {win.id === "qisland" ? (
                <QislandBody mode={island} onMode={setIsland} />
              ) : null}
              {win.id === "coursedesk" ? <CourseBody note={note} onNote={setNote} /> : null}
              {win.id === "deepunpack" ? <UnpackBody unpacked={unpacked} onToggle={() => setUnpacked((value) => !value)} /> : null}
              {win.id === "lightskip" ? <LightSkipBody /> : null}
              {win.id === "xiangqi" ? <XiangqiBoard onInteract={() => focusWin("xiangqi")} /> : null}
              {win.id === "finder" ? <FinderBody /> : null}
            </div>
          </section>
        ))}
      </main>

      <nav ref={dockRef} className="dock-bar" aria-label="Qiuizi OS Dock">
        {dockItems.map((item) => {
          const win = windows.find((entry) => entry.id === item.id);
          const open = Boolean(win && !win.hidden);
          return (
            <button
              key={item.id}
              type="button"
              className="d-app"
              aria-pressed={open}
              aria-keyshortcuts={item.shortcut}
              onClick={() => onDock(item.id)}
            >
              <span className="d-tip">{item.label}</span>
              <span className="d-icon" style={{ background: item.gradient }} aria-hidden="true">
                {item.mark}
              </span>
              <span className={`d-dot${open ? "" : " off"}`} aria-hidden="true" />
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function QislandBody({ mode, onMode }: { mode: IslandMode; onMode: (mode: IslandMode) => void }) {
  const modes: { id: IslandMode; label: string }[] = [
    { id: "focus", label: "专注 25:00" },
    { id: "media", label: "媒体播放" },
    { id: "alert", label: "展开提醒" },
  ];
  return (
    <>
      <p className="win-desc">把灵动岛带到 Windows 桌面顶部边缘：媒体播放、专注计时与轻提醒顺手停靠，点击下方实时控制上方灵动岛胶囊。</p>
      <div className="win-actions" role="radiogroup" aria-label="灵动岛形态">
        {modes.map((item) => (
          <button key={item.id} type="button" role="radio" aria-checked={mode === item.id} className={`w-chip${mode === item.id ? " is-on" : ""}`} onClick={() => onMode(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="win-actions">
        <ExternalLink className="w-link w-primary" href="https://qiuizi.github.io/Qisland/">访问官网 ↗</ExternalLink>
        <ExternalLink className="w-link w-ghost" href="https://github.com/Qiuizi/Qisland">GitHub 源码</ExternalLink>
      </div>
    </>
  );
}

function CourseBody({ note, onNote }: { note: 1 | 2 | 3; onNote: (note: 1 | 2 | 3) => void }) {
  const tabs = [
    { id: 1 as const, label: "本课要点" },
    { id: 2 as const, label: "关联前序" },
    { id: 3 as const, label: "随手问 AI" },
  ];
  return (
    <>
      <p className="win-desc">课件与录音拖入即自动归课，一键串跑输出三层结构化笔记并随时追问单课 AI。</p>
      <div className="win-actions" role="radiogroup" aria-label="笔记层级">
        {tabs.map((tab) => (
          <button key={tab.id} type="button" role="radio" aria-checked={note === tab.id} className={`w-chip${note === tab.id ? " is-on" : ""}`} onClick={() => onNote(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="code-box" aria-live="polite">{courseNotes[note]}</div>
      <div className="win-actions">
        <ExternalLink className="w-link w-primary" href="https://qiuizi.github.io/CourseDesk/">访问官网 ↗</ExternalLink>
        <ExternalLink className="w-link w-ghost" href="https://github.com/Qiuizi/CourseDesk">GitHub 源码</ExternalLink>
      </div>
    </>
  );
}

function UnpackBody({ unpacked, onToggle }: { unpacked: boolean; onToggle: () => void }) {
  return (
    <>
      <p className="win-desc">多层套娃压缩包一键解到底、自动展平目录并清理系统垃圾，内置筛选预览与批量重命名。</p>
      <div className="code-box" aria-live="polite">
        {unpacked ? (
          <>
            <span className="code-ok">✓ 已递归拆解 3 层并展平目录</span>
            <br />
            spec.pdf · preview.png · data.csv（已清理垃圾）
          </>
        ) : (
          <>
            📦 delivery.zip → 📁 delivery/ → 📦 assets.rar → 📦 pack.7z
            <br />
            <span className="code-muted">含 __MACOSX / .DS_Store 垃圾文件</span>
          </>
        )}
      </div>
      <div className="win-actions">
        <button type="button" className={`w-chip${unpacked ? "" : " is-on"}`} onClick={onToggle}>
          {unpacked ? "复位压缩包" : "一键解到底"}
        </button>
        <ExternalLink className="w-link w-ghost" href="https://github.com/Qiuizi/DeepUnpack">GitHub 源码 ↗</ExternalLink>
      </div>
    </>
  );
}

function LightSkipBody() {
  const [phase, setPhase] = useState<"idle" | "splash" | "skipped">("idle");
  const [elapsed, setElapsed] = useState(0);
  const started = useRef(0);

  function trigger() {
    started.current = performance.now();
    setPhase("splash");
  }

  function skip() {
    setElapsed(Math.max(1, Math.round(performance.now() - started.current)));
    setPhase("skipped");
  }

  return (
    <>
      <p className="win-desc">不联网、零第三方依赖的 Android 开屏广告自动跳过工具。零 INTERNET 权限，默认白名单生效，内置 25 套规则与本地录制，并附国产 ROM 保活指引。</p>
      <div className="ls-badges" aria-label="LightSkip 特性">
        <span className="ls-pill">零联网</span>
        <span className="ls-pill">白名单</span>
        <span className="ls-pill">25 套规则</span>
      </div>
      <div className="ls-stage" aria-live="polite">
        {phase === "splash" ? (
          <div className="ls-panel">
            <span className="ls-kicker">开屏广告</span>
            <strong>全屏素材</strong>
            <button type="button" className="w-chip is-on" onClick={skip}>跳过</button>
          </div>
        ) : null}
        {phase === "skipped" ? (
          <div className="ls-panel">
            <span className="ls-kicker">已跳过</span>
            <strong className="ls-ms">{elapsed} ms</strong>
            <button type="button" className="w-chip" onClick={trigger}>再测一次</button>
          </div>
        ) : null}
        {phase === "idle" ? (
          <div className="ls-panel">
            <span className="ls-kicker">等待开屏</span>
            <button type="button" className="w-chip is-on" onClick={trigger}>触发开屏测试</button>
          </div>
        ) : null}
      </div>
      <div className="win-actions">
        <ExternalLink className="w-link w-ghost" href="https://github.com/Qiuizi/LightSkip">GitHub 源码 ↗</ExternalLink>
      </div>
    </>
  );
}

function FinderBody() {
  return (
    <div className="finder-list">
      {finderItems.map((item) => (
        <ExternalLink key={item.name} className="finder-item" href={item.href}>
          <span>
            <span className="fi-name">{item.name}</span>
            <span className="fi-sub">{item.detail}</span>
          </span>
          <span className="fi-go">{item.action}</span>
        </ExternalLink>
      ))}
    </div>
  );
}
