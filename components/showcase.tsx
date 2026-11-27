"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Dock } from "@/components/dock";
import { ExternalLink } from "@/components/external-link";
import { StagePreview } from "@/components/previews";
import { flagshipById, flagships, type FlagshipId } from "@/data/showcase";

export function Showcase() {
  const [activeId, setActiveId] = useState<FlagshipId>("qisland");
  const [animate, setAnimate] = useState(false);
  const stageRef = useRef<HTMLElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const activeRef = useRef(activeId);
  const app = flagshipById(activeId);

  const select = useCallback((id: FlagshipId) => {
    if (id !== activeRef.current) {
      activeRef.current = id;
      setAnimate(true);
      setActiveId(id);
    }
    const node = stageRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const mostlyOffscreen = rect.bottom < 140 || rect.top > window.innerHeight - 160;
    if (!mostlyOffscreen) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      const index = flagships.findIndex((item) => item.id === activeRef.current);
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        const next = event.key === "ArrowRight" ? (index + 1) % flagships.length : (index - 1 + flagships.length) % flagships.length;
        select(flagships[next].id);
        document.querySelector<HTMLButtonElement>(`[data-app="${flagships[next].id}"]`)?.focus({ preventScroll: true });
      }
      if (event.key >= "1" && event.key <= "4") {
        const next = flagships[Number(event.key) - 1];
        if (!next) return;
        event.preventDefault();
        select(next.id);
        document.querySelector<HTMLButtonElement>(`[data-app="${next.id}"]`)?.focus({ preventScroll: true });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [select]);

  function onPointerMove(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    const node = stageRef.current;
    const sheen = sheenRef.current;
    if (!node || !sheen) return;
    const rect = node.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      sheen.style.transform = `translate3d(${x - 160}px, ${y - 160}px, 0)`;
      sheen.style.opacity = "1";
    });
  }

  function onPointerLeave() {
    const sheen = sheenRef.current;
    if (!sheen) return;
    sheen.style.opacity = "0";
  }

  return (
    <>
      <p className="sr-only">使用左右方向键或数字键 1 到 4 切换四款旗舰软件。</p>
      <section
        ref={stageRef}
        id="stage"
        aria-labelledby="stage-name"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="relative scroll-mt-4 overflow-hidden rounded-[22px] border border-white/85 bg-white/92 shadow-[0_18px_50px_rgba(15,23,42,0.10),0_1px_3px_rgba(15,23,42,0.06)] backdrop-blur-[22px]"
      >
        <div ref={sheenRef} className="stage-sheen" aria-hidden="true" />
        <div className="relative z-[1]">
          <div className="relative flex min-h-12 items-center justify-between gap-2.5 border-b border-slate-900/[0.08] bg-slate-50/85 px-4 sm:px-5">
            <div className="flex shrink-0 gap-[7px]" aria-hidden="true">
              <span className="size-[11px] rounded-full bg-[#ff5f57]" />
              <span className="size-[11px] rounded-full bg-[#febc2e]" />
              <span className="size-[11px] rounded-full bg-[#28c840]" />
            </div>
            <p
              className="min-w-0 flex-1 truncate text-left text-[13px] font-semibold text-muted sm:absolute sm:left-1/2 sm:w-max sm:max-w-[52%] sm:flex-none sm:-translate-x-1/2 sm:text-center sm:text-[13.5px]"
              title={app.winTitle}
            >
              {app.winTitle}
            </p>
            <p className="shrink-0 rounded-full border border-slate-900/[0.08] bg-white px-2.5 py-[3px] font-mono text-xs tabular-nums text-muted">
              {app.tag}
            </p>
          </div>

          <div
            key={app.id}
            className={`grid items-center gap-8 px-5 py-7 sm:px-9 sm:py-[34px] lg:min-h-[390px] lg:grid-cols-[1.05fr_0.95fr] ${
              animate ? "stage-in" : ""
            }`}
          >
            <div>
              <p className="mb-3.5 inline-flex items-center rounded-full bg-accent/10 px-3 py-[5px] text-[12.5px] font-semibold text-accent">
                {app.kicker}
              </p>
              <h1 id="stage-name" className="text-balance text-[2rem] font-bold leading-[1.15] tracking-[-0.03em] sm:text-4xl">
                {app.name}
              </h1>
              <p className="sr-only" aria-live="polite">
                当前展台 {app.name}
              </p>
              <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.65] text-muted">{app.description}</p>
              <ul className="mt-5 mb-6 flex flex-col gap-[9px]">
                {app.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm leading-6">
                    <span className="mt-[7px] size-[7px] shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2.5">
                {app.actions.map((action) => (
                  <ExternalLink
                    key={action.href}
                    href={action.href}
                    className={action.tone === "primary" ? "btn-tactile btn-primary" : "btn-tactile btn-secondary"}
                  >
                    {action.label}
                  </ExternalLink>
                ))}
              </div>
            </div>
            <StagePreview id={app.id} />
          </div>
        </div>
      </section>
      <Dock activeId={activeId} onSelect={select} />
    </>
  );
}
