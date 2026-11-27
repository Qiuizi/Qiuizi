"use client";

import { useRef, useState } from "react";
import { ExternalLink } from "@/components/external-link";
import { StagePreview } from "@/components/previews";
import { flagshipById, flagships, type FlagshipId } from "@/data/showcase";

const dockItem =
  "inline-flex h-[46px] shrink-0 items-center gap-[9px] whitespace-nowrap rounded-[14px] px-4 text-[13.5px] font-semibold transition duration-150 motion-reduce:transition-none";

export function Showcase() {
  const [activeId, setActiveId] = useState<FlagshipId>("qisland");
  const [animate, setAnimate] = useState(false);
  const stageRef = useRef<HTMLElement>(null);
  const app = flagshipById(activeId);

  function revealStage() {
    const node = stageRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const mostlyOffscreen = rect.bottom < 140 || rect.top > window.innerHeight - 160;
    if (!mostlyOffscreen) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  function select(id: FlagshipId, button?: HTMLElement) {
    if (id !== activeId) {
      setAnimate(true);
      setActiveId(id);
    }
    if (button?.parentElement) {
      const dock = button.parentElement;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const left = button.offsetLeft - (dock.clientWidth - button.clientWidth) / 2;
      dock.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
    }
    revealStage();
  }

  return (
    <>
      <section
        ref={stageRef}
        id="stage"
        aria-labelledby="stage-name"
        className="scroll-mt-4 overflow-hidden rounded-[22px] border border-white/85 bg-white/92 shadow-[0_18px_50px_rgba(15,23,42,0.10),0_1px_3px_rgba(15,23,42,0.06)] backdrop-blur-[22px]"
      >
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
          <p className="shrink-0 rounded-full border border-slate-900/[0.08] bg-white px-2.5 py-[3px] font-mono text-xs text-muted">
            {app.tag}
          </p>
        </div>

        <div
          key={app.id}
          aria-live="polite"
          className={`grid items-center gap-8 px-5 py-7 sm:px-9 sm:py-[34px] lg:min-h-[390px] lg:grid-cols-[1.05fr_0.95fr] ${
            animate ? "stage-in" : ""
          }`}
        >
          <div>
            <p className="mb-3.5 inline-flex items-center rounded-full bg-accent/10 px-3 py-[5px] text-[12.5px] font-semibold text-accent">
              {app.kicker}
            </p>
            <h1 id="stage-name" className="text-[2rem] font-bold leading-[1.15] tracking-[-0.03em] sm:text-4xl">
              {app.name}
            </h1>
            <p className="mt-3 text-[15px] leading-[1.65] text-muted">{app.description}</p>
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
                  className={
                    action.tone === "primary"
                      ? "inline-flex h-10 items-center rounded-xl bg-accent px-5 text-sm font-semibold text-white transition hover:opacity-90"
                      : "inline-flex h-10 items-center rounded-xl border border-slate-900/[0.08] bg-surface px-5 text-sm font-semibold text-ink transition hover:bg-[#edf0f5]"
                  }
                >
                  {action.label}
                </ExternalLink>
              ))}
            </div>
          </div>
          <StagePreview id={app.id} />
        </div>
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-[max(18px,env(safe-area-inset-bottom))] z-50 flex justify-center px-3">
        <nav
          aria-label="旗舰软件 Dock 切换"
          className="pointer-events-auto flex max-w-[calc(100vw-24px)] items-center gap-1.5 overflow-x-auto rounded-[22px] border border-white/90 bg-white/78 p-2 shadow-[0_14px_40px_rgba(15,23,42,0.16)] backdrop-blur-[24px] backdrop-saturate-[1.8] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {flagships.map((item) => {
            const active = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={(event) => select(item.id, event.currentTarget)}
                className={`${dockItem} ${
                  active
                    ? "bg-ink text-white"
                    : "text-muted hover:-translate-y-0.5 hover:bg-slate-900/[0.06] hover:text-ink motion-reduce:hover:translate-y-0"
                }`}
              >
                <span
                  className={`grid size-6 place-items-center rounded-[7px] text-xs font-bold ${
                    active ? "bg-white/20 text-white" : "bg-accent/15 text-accent"
                  }`}
                  aria-hidden="true"
                >
                  {item.dockMark}
                </span>
                {item.dockLabel}
              </button>
            );
          })}
          <span className="mx-1 h-6 w-px shrink-0 bg-slate-900/10" aria-hidden="true" />
          <a href="#all-works" className={`${dockItem} text-muted hover:-translate-y-0.5 hover:bg-slate-900/[0.06] hover:text-ink motion-reduce:hover:translate-y-0`}>
            <span
              className="grid size-6 place-items-center rounded-[7px] bg-accent/15 text-xs font-bold text-accent"
              aria-hidden="true"
            >
              +
            </span>
            全部 9 款
          </a>
        </nav>
      </div>
    </>
  );
}
