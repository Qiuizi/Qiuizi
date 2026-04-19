"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// 只在有鼠标的设备上渲染。useSyncExternalStore SSR 下返回 false，
// 客户端再返回真实值，避免 effect 里直接 setState 的 React 19 警告。
const subscribeHover = (cb: () => void) => {
  const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getHoverSnapshot = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const getHoverServerSnapshot = () => false;

// 自定义光标：12px 实心圆，mix-blend-mode: difference。
// hover 在交互元素上时放大为 56px 镂空圆。触屏设备不渲染。
export function Cursor() {
  const enabled = useSyncExternalStore(
    subscribeHover,
    getHoverSnapshot,
    getHoverServerSnapshot
  );
  const ref = useRef<HTMLDivElement | null>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const state = { x: 0, y: 0, tx: 0, ty: 0, raf: 0 };

    const onMove = (e: MouseEvent) => {
      state.tx = e.clientX;
      state.ty = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const hot = t.closest("a, button, [role='button'], input, textarea, label");
      setHovering(!!hot);
    };

    const tick = () => {
      state.x += (state.tx - state.x) * 0.2;
      state.y += (state.ty - state.y) * 0.2;
      el.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) translate(-50%, -50%)`;
      state.raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    state.raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(state.raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full transition-[width,height,background,border] duration-200 ease-out"
      style={{
        width: hovering ? 56 : 12,
        height: hovering ? 56 : 12,
        background: hovering ? "transparent" : "#fafafa",
        border: hovering ? "1px solid #fafafa" : "none",
        mixBlendMode: "difference",
      }}
    />
  );
}
