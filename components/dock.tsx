"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { flagships, type FlagshipId } from "@/data/showcase";

const hints: Record<string, string> = {
  qisland: "Windows 灵动岛",
  coursedesk: "课程工作台",
  deepunpack: "解到底",
  xiangqi: "象棋工作室",
  all: "滚到全部作品",
};

type DockProps = {
  activeId: FlagshipId;
  onSelect: (id: FlagshipId) => void;
};

export function Dock({ activeId, onSelect }: DockProps) {
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const allRef = useRef<HTMLAnchorElement>(null);
  const baseWidth = useRef(0);
  const activeRef = useRef(activeId);
  const tipX = useRef(0);
  const canMagnify = useRef(false);
  const placed = useRef(false);

  function targets() {
    const nodes: Array<HTMLElement | null> = [...buttonsRef.current, allRef.current];
    return nodes.filter((node): node is HTMLElement => node !== null);
  }

  function placeIndicator(instant: boolean) {
    const indicator = indicatorRef.current;
    const nav = navRef.current;
    const index = flagships.findIndex((item) => item.id === activeRef.current);
    const button = buttonsRef.current[index];
    if (!indicator || !nav || !button) return;
    if (!baseWidth.current) baseWidth.current = button.offsetWidth || 1;
    const scale = button.offsetWidth / baseWidth.current;
    if (instant) indicator.style.transition = "none";
    indicator.style.width = `${baseWidth.current}px`;
    indicator.style.transform = `translate3d(${button.offsetLeft}px, 0, 0) scaleX(${scale})`;
    indicator.style.opacity = "1";
    nav.classList.add("is-ready");
    if (instant) {
      indicator.getBoundingClientRect();
      indicator.style.transition = "";
    }
  }

  useLayoutEffect(() => {
    activeRef.current = activeId;
    placeIndicator(!placed.current);
    placed.current = true;
  }, [activeId]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const syncPointer = () => {
      canMagnify.current =
        window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        window.innerWidth > 860;
    };
    syncPointer();
    window.addEventListener("resize", syncPointer);
    const observer = new ResizeObserver(() => placeIndicator(true));
    observer.observe(nav);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncPointer);
    };
  }, []);

  function showTip(text: string, x: number, open: boolean) {
    const tip = tipRef.current;
    if (!tip) return;
    tipX.current = x;
    tip.textContent = text;
    tip.style.opacity = open ? "1" : "0";
    tip.style.transform = `translate3d(${x}px, ${open ? -50 : -42}px, 0) translateX(-50%) scale(${open ? 1 : 0.96})`;
  }

  function onMove(event: React.PointerEvent<HTMLElement>) {
    const nav = navRef.current;
    if (!nav || event.pointerType !== "mouse") return;
    const allowMagnify = canMagnify.current && nav.scrollWidth <= nav.clientWidth + 4;
    if (!allowMagnify) return;
    nav.classList.add("is-live");
    let nearest: HTMLElement | null = null;
    let nearestDist = Infinity;
    for (const el of targets()) {
      const rect = el.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = Math.abs(event.clientX - center);
      const t = Math.max(0, 1 - distance / 280);
      const influence = t * t * (3 - 2 * t);
      const scale = 1 + 0.38 * influence;
      const lift = (scale - 1) * 28;
      el.style.transform = `translate3d(0, ${-lift}px, 0) scale(${scale})`;
      if (distance < nearestDist) {
        nearest = el;
        nearestDist = distance;
      }
    }
    if (nearest && nearestDist < 78) {
      const x = nearest.offsetLeft - nav.scrollLeft + nearest.offsetWidth / 2;
      showTip(nearest.dataset.hint ?? "", x, true);
    } else {
      showTip(tipRef.current?.textContent ?? "", tipX.current, false);
    }
  }

  function onLeave() {
    navRef.current?.classList.remove("is-live");
    for (const el of targets()) el.style.transform = "";
    showTip(tipRef.current?.textContent ?? "", tipX.current, false);
  }

  function focusInDock(id: FlagshipId) {
    const index = flagships.findIndex((item) => item.id === id);
    const button = buttonsRef.current[index];
    button?.focus({ preventScroll: true });
    const nav = navRef.current;
    if (!nav || !button || nav.scrollWidth <= nav.clientWidth) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const left = button.offsetLeft - (nav.clientWidth - button.offsetWidth) / 2;
    nav.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(18px,env(safe-area-inset-bottom))] z-50 flex justify-center px-3">
      <div className="dock-slot pointer-events-auto" onPointerMove={onMove} onPointerLeave={onLeave}>
        <span ref={tipRef} className="dock-tip" />
        <nav ref={navRef} aria-label="旗舰软件切换" className="dock">
        <span ref={indicatorRef} className="dock-indicator" aria-hidden="true" />
        {flagships.map((item, index) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              ref={(node) => {
                buttonsRef.current[index] = node;
              }}
              type="button"
              data-app={item.id}
              data-hint={hints[item.id]}
              aria-pressed={active}
              aria-keyshortcuts={String(index + 1)}
              onClick={() => {
                onSelect(item.id);
                focusInDock(item.id);
              }}
              className={`dock-btn${active ? " is-active" : ""}`}
            >
              <span className="dock-ico" aria-hidden="true">
                {item.dockMark}
              </span>
              {item.dockLabel}
            </button>
          );
        })}
        <span className="dock-sep" aria-hidden="true" />
        <a ref={allRef} href="#all-works" data-hint={hints.all} className="dock-btn">
          <span className="dock-ico" aria-hidden="true">
            +
          </span>
          全部 9 款
        </a>
        </nav>
      </div>
    </div>
  );
}
