"use client";

import { useEffect, useState } from "react";

// 首次进站 loader：居中旋转 ring + "Entering Space"，1.1s 后淡出并让位给光标。
export function Loader() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-700"
      style={{
        opacity: gone ? 0 : 1,
        visibility: gone ? "hidden" : "visible",
      }}
    >
      <div
        className="h-12 w-12 rounded-full border border-line border-t-accent animate-spin"
        style={{ animationDuration: "0.9s" }}
      />
      <div className="mt-6 text-xs tracking-[0.4em] uppercase text-muted">
        Entering Space
      </div>
    </div>
  );
}
