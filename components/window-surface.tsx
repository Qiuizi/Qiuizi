"use client";

import { useRef, useState } from "react";
import { ExternalLink } from "@/components/external-link";
import { XiangqiBoard } from "@/components/xiangqi-board";
import { courseNotes, finderItems, islandText, projectById, type IslandMode, type Project, type WinId } from "@/data/os";
import type { ReleaseInfo, ReleaseMap } from "@/lib/releases";
import { site } from "@/lib/site";

export type PanelTab = "demo" | "dive";

export type DemoState = {
  island: IslandMode;
  onIsland: (mode: IslandMode) => void;
  note: 1 | 2 | 3;
  onNote: (note: 1 | 2 | 3) => void;
  unpacked: boolean;
  onUnpack: () => void;
};

type SurfaceProps = {
  id: WinId;
  releases: ReleaseMap;
  tab: PanelTab;
  onTab: (tab: PanelTab) => void;
  demo: DemoState;
  onCopyEmail: () => void;
  onOpen: (id: WinId, tab?: PanelTab) => void;
  onXiangqiInteract?: () => void;
  showLinks?: boolean;
};

export function releaseHref(project: { github: string; repo: Project["repo"] }, release?: ReleaseInfo) {
  if (release?.downloadUrl) return release.downloadUrl;
  if (release?.url) return release.url;
  return project.repo ? `https://github.com/Qiuizi/${project.repo}/releases` : project.github;
}

export function releaseLabel(name: string, release?: ReleaseInfo) {
  if (release?.downloadUrl) return release.tag ? `下载 ${release.tag}` : `下载 ${name}`;
  return "GitHub Releases";
}

export function ProjectLinks({ project, release }: { project: Project; release?: ReleaseInfo }) {
  const href = releaseHref(project, release);
  const hasDownload = Boolean(project.repo);
  return (
    <div className="link-block">
      <div className="win-actions">
        {hasDownload ? (
          <ExternalLink className="w-link w-primary" href={href}>
            {releaseLabel(project.name, release)}
          </ExternalLink>
        ) : null}
        {project.website ? (
          <ExternalLink className={hasDownload ? "w-link w-ghost" : "w-link w-primary"} href={project.website}>
            访问官网 ↗
          </ExternalLink>
        ) : null}
        <ExternalLink className="w-link w-ghost" href={project.github}>
          GitHub 源码
        </ExternalLink>
      </div>
      {release?.downloadUrl && release.assetName ? <p className="asset-name">{release.assetName}</p> : null}
    </div>
  );
}

export function WindowSurface({ id, releases, tab, onTab, demo, onCopyEmail, onOpen, onXiangqiInteract, showLinks = true }: SurfaceProps) {
  if (id === "welcome") {
    const featured = projectById.qisland;
    const release = releases.Qisland;
    return (
      <div className="welcome">
        <p className="welcome-kicker">Qiuizi</p>
        <h2 className="welcome-title">{site.positioning}</h2>
        <p className="welcome-copy">先开着这一扇窗。其余应用停在右侧图标和 Dock 里，按 ⌘K 或 Ctrl+K 搜索项目、演示和下载。</p>
        <div className="welcome-feature">
          <span className="d-icon desk-mark" style={{ background: featured.gradient }} aria-hidden="true">
            {featured.mark}
          </span>
          <span className="welcome-feature-copy">
            <strong>Qisland</strong>
            <em>{release.tag ?? "Windows 顶部灵动岛"}</em>
          </span>
          <button type="button" className="w-link w-primary" onClick={() => onOpen("qisland", "demo")}>
            打开
          </button>
        </div>
        <div className="welcome-meta">
          <span>桌面与 Android</span>
          <span>可交互演示</span>
          <span>GitHub Releases</span>
        </div>
      </div>
    );
  }

  if (id === "about") {
    return (
      <div className="about">
        <p className="welcome-kicker">关于 Qiuizi</p>
        <h2 className="welcome-title">{site.positioning}</h2>
        <p className="welcome-copy">公开身份只有 Qiuizi。作品在 GitHub，邮件可以一键复制。</p>
        <ul className="stack-row">
          {site.focus.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="win-actions">
          <ExternalLink className="w-link w-primary" href={site.github}>
            GitHub ↗
          </ExternalLink>
          <button type="button" className="w-link w-ghost" onClick={onCopyEmail}>
            复制邮箱
          </button>
        </div>
        <p className="email-line">{site.email}</p>
      </div>
    );
  }

  if (id === "finder") {
    return <FinderBody releases={releases} />;
  }

  const project = projectById[id];
  const release = project.repo ? releases[project.repo] : undefined;
  return (
    <div className="surface">
      <div className="seg" role="tablist" aria-label={`${project.name} 视图`}>
        <button type="button" role="tab" aria-selected={tab === "demo"} onClick={() => onTab("demo")}>
          交互演示
        </button>
        <button type="button" role="tab" aria-selected={tab === "dive"} onClick={() => onTab("dive")}>
          深潜
        </button>
      </div>
      {tab === "dive" ? (
        <div className="dive">
          <section>
            <h3>问题</h3>
            <p>{project.problem}</p>
          </section>
          <section>
            <h3>做法</h3>
            <p>{project.approach}</p>
          </section>
          <section>
            <h3>技术栈</h3>
            <ul className="stack-row">
              {project.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <h3 className="dive-label">交互演示</h3>
        </div>
      ) : (
        <p className="win-desc">{project.blurb}</p>
      )}
      <ProjectDemo id={id} demo={demo} releaseTag={releases.Qisland.tag} onXiangqiInteract={onXiangqiInteract} />
      {showLinks ? <ProjectLinks project={project} release={release} /> : null}
    </div>
  );
}

function ProjectDemo({
  id,
  demo,
  releaseTag,
  onXiangqiInteract,
}: {
  id: Project["id"];
  demo: DemoState;
  releaseTag: string | null;
  onXiangqiInteract?: () => void;
}) {
  if (id === "qisland") return <QislandBody mode={demo.island} onMode={demo.onIsland} tag={releaseTag} />;
  if (id === "course") return <CourseBody note={demo.note} onNote={demo.onNote} />;
  if (id === "deepunpack") return <UnpackBody unpacked={demo.unpacked} onToggle={demo.onUnpack} />;
  if (id === "lightskip") return <LightSkipBody />;
  return <XiangqiBoard onInteract={onXiangqiInteract} />;
}

function QislandBody({ mode, onMode, tag }: { mode: IslandMode; onMode: (mode: IslandMode) => void; tag: string | null }) {
  const view = islandText(mode, tag);
  const modes: { id: IslandMode; label: string }[] = [
    { id: "focus", label: "专注 25:00" },
    { id: "media", label: "媒体播放" },
    { id: "alert", label: "展开提醒" },
  ];
  return (
    <>
      <div className={`inline-island${mode === "alert" ? " expanded" : ""}`} aria-hidden="true">
        <span className="oi-dot" />
        <span className="oi-title">{view.title}</span>
        <span className="oi-val">{view.value}</span>
      </div>
      <div className="win-actions" role="radiogroup" aria-label="灵动岛形态">
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={mode === item.id}
            className={`w-chip${mode === item.id ? " is-on" : ""}`}
            onClick={() => onMode(item.id)}
          >
            {item.label}
          </button>
        ))}
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
      <div className="win-actions" role="radiogroup" aria-label="笔记层级">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={note === item.id}
            className={`w-chip${note === item.id ? " is-on" : ""}`}
            onClick={() => onNote(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="code-box" aria-live="polite">
        {courseNotes[note]}
      </div>
    </>
  );
}

function UnpackBody({ unpacked, onToggle }: { unpacked: boolean; onToggle: () => void }) {
  return (
    <>
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
            <button type="button" className="w-chip is-on" onClick={skip}>
              跳过
            </button>
          </div>
        ) : null}
        {phase === "skipped" ? (
          <div className="ls-panel">
            <span className="ls-kicker">已跳过</span>
            <strong className="ls-ms">{elapsed} ms</strong>
            <button type="button" className="w-chip" onClick={trigger}>
              再测一次
            </button>
          </div>
        ) : null}
        {phase === "idle" ? (
          <div className="ls-panel">
            <span className="ls-kicker">等待开屏</span>
            <button type="button" className="w-chip is-on" onClick={trigger}>
              触发开屏测试
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}

function FinderBody({ releases }: { releases: ReleaseMap }) {
  return (
    <div className="finder-list">
      {finderItems.map((item) => {
        const release = "releaseRepo" in item ? releases[item.releaseRepo] : undefined;
        if (!release) {
          return (
            <ExternalLink key={item.name} className="finder-item" href={item.href}>
              <span>
                <span className="fi-name">{item.name}</span>
                <span className="fi-sub">{item.detail}</span>
              </span>
              <span className="fi-go">{item.action}</span>
            </ExternalLink>
          );
        }
        return (
          <div key={item.name} className="finder-item">
            <ExternalLink className="finder-main" href={item.href}>
              <span className="fi-name">{item.name}</span>
              <span className="fi-sub">{item.detail}</span>
            </ExternalLink>
            <ExternalLink className="fi-go" href={release.downloadUrl ?? release.url}>
              {release.tag ? `下载 ${release.tag}` : "Releases"}
            </ExternalLink>
          </div>
        );
      })}
    </div>
  );
}
