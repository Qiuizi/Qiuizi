"use client";

import { useRef } from "react";
import { iconStyle, projectById, type WinId } from "@/data/os";
import type { ReleaseMap } from "@/lib/releases";
import { site } from "@/lib/site";
import { ProjectLinks, WindowSurface, type DemoState, type PanelTab } from "@/components/window-surface";

type MobileHomeProps = {
  releases: ReleaseMap;
  sheet: WinId | null;
  tab: PanelTab;
  onTab: (tab: PanelTab) => void;
  demo: DemoState;
  onOpen: (id: WinId, tab?: PanelTab) => void;
  onClose: () => void;
  onSearch: () => void;
  onCopyEmail: () => void;
};

const gridOrder: Exclude<WinId, "welcome" | "qisland">[] = ["xiangqi", "course", "deepunpack", "lightskip", "about", "finder"];

export function MobileHome(props: MobileHomeProps) {
  const { releases, onOpen, onSearch, onCopyEmail } = props;
  const qisland = projectById.qisland;
  return (
    <div className="m-home">
      <header className="m-top">
        <p className="m-kicker">Qiuizi</p>
        <h2>{site.positioning}</h2>
      </header>
      <div className="m-quick">
        <button type="button" className="m-search" onClick={onSearch}>
          搜索
        </button>
        <button type="button" className="m-mail" onClick={onCopyEmail}>
          {site.email}
        </button>
      </div>
      <button type="button" className="m-feature" onClick={() => onOpen("qisland", "demo")}>
        <span className="d-icon m-mark" style={{ background: qisland.gradient }} aria-hidden="true">
          {qisland.mark}
        </span>
        <span className="m-copy">
          <strong>Qisland</strong>
          <em>{releases.Qisland.tag ? `${releases.Qisland.tag} · Windows 灵动岛` : "Windows 顶部灵动岛"}</em>
        </span>
        <span className="m-go">打开</span>
      </button>
      <div className="m-grid">
        {gridOrder.map((id) => {
          const icon = iconStyle[id];
          const wide = id === "xiangqi" || id === "finder";
          return (
            <button
              key={id}
              type="button"
              className={`m-app${wide ? " wide" : ""}${id === "xiangqi" ? " xiangqi" : ""}`}
              onClick={() => onOpen(id, "demo")}
            >
              <span className="d-icon m-mark" style={{ background: icon.gradient }} aria-hidden="true">
                {icon.mark}
              </span>
              <span className="m-copy">
                <strong>{icon.label === "更多" ? "更多作品" : icon.label === "关于" ? "关于 Qiuizi" : icon.label}</strong>
                <em>{id === "xiangqi" ? "可对弈" : id === "about" ? "联系与定位" : id === "finder" ? "其余在线作品" : "打开"}</em>
              </span>
            </button>
          );
        })}
      </div>
      {props.sheet ? <MobileSheet {...props} sheet={props.sheet} /> : null}
    </div>
  );
}

function MobileSheet({
  sheet,
  releases,
  tab,
  onTab,
  demo,
  onClose,
  onCopyEmail,
  onOpen,
}: MobileHomeProps & { sheet: WinId }) {
  const panelRef = useRef<HTMLElement>(null);
  const project = sheet === "qisland" || sheet === "course" || sheet === "deepunpack" || sheet === "lightskip" || sheet === "xiangqi" ? projectById[sheet] : null;
  const release = project?.repo ? releases[project.repo] : undefined;

  function onGrabDown(event: React.PointerEvent<HTMLButtonElement>) {
    const panel = panelRef.current;
    if (!panel) return;
    const startY = event.clientY;
    const grab = event.currentTarget;
    grab.setPointerCapture(event.pointerId);
    let delta = 0;
    const move = (ev: PointerEvent) => {
      delta = Math.max(0, ev.clientY - startY);
      panel.style.transform = `translateY(${delta}px)`;
    };
    const up = () => {
      grab.removeEventListener("pointermove", move);
      grab.removeEventListener("pointerup", up);
      grab.removeEventListener("pointercancel", up);
      if (delta > 96) onClose();
      else panel.style.transform = "";
    };
    grab.addEventListener("pointermove", move);
    grab.addEventListener("pointerup", up);
    grab.addEventListener("pointercancel", up);
  }

  const title =
    sheet === "welcome" ? "Qiuizi OS" : sheet === "about" ? "关于 Qiuizi" : sheet === "finder" ? "更多作品" : projectById[sheet].name;

  return (
    <div className="sheet-root">
      <button type="button" className="sheet-backdrop" aria-label="关闭" onClick={onClose} />
      <section ref={panelRef} className="sheet" role="dialog" aria-modal="true" aria-label={title}>
        <button type="button" className="sheet-grab" aria-label="下拉关闭" onPointerDown={onGrabDown}>
          <span className="sheet-handle" />
        </button>
        <header className="sheet-head">
          <h2>{title}</h2>
          <button type="button" className="sheet-close" onClick={onClose}>
            关闭
          </button>
        </header>
        <div className="sheet-body">
          <WindowSurface
            id={sheet}
            releases={releases}
            tab={tab}
            onTab={onTab}
            demo={demo}
            onCopyEmail={onCopyEmail}
            onOpen={onOpen}
            showLinks={!project}
          />
        </div>
        {project ? (
          <footer className="sheet-foot">
            <ProjectLinks project={project} release={release} />
          </footer>
        ) : null}
      </section>
    </div>
  );
}
