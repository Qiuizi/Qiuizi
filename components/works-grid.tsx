"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "@/components/external-link";
import { webWorks, type WorkKind } from "@/data/showcase";

const filters: { id: "all" | WorkKind; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "live", label: "在线作品" },
  { id: "source", label: "源码" },
];

export function WorksGrid() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [seen, setSeen] = useState(false);
  const visible = webWorks.filter((work) => filter === "all" || work.kind === filter);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = document.getElementById("all-works");
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setSeen(true);
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="all-works" aria-labelledby="all-works-title" className="mt-[26px] scroll-mt-4">
      <div className="mb-3.5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="all-works-title" className="text-lg font-bold">
            更多在线 Web 与工具作品
          </h2>
          <p className="mt-1 text-[13px] text-muted">按形态筛选，或用底部 Dock 切换 4 款旗舰软件</p>
        </div>
        <div role="radiogroup" aria-label="作品筛选" className="flex flex-wrap gap-2">
          {filters.map((item) => {
            const active = item.id === filter;
            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setFilter(item.id)}
                className={`btn-tactile inline-flex h-9 items-center rounded-full px-3.5 text-[13px] font-semibold ${
                  active ? "bg-ink text-white" : "border border-slate-900/[0.08] bg-white/80 text-muted"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
      <div key={filter} className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((work, index) => (
          <article
            key={work.name}
            className={`work-card relative flex flex-col justify-between gap-2.5 rounded-2xl border border-slate-900/[0.08] bg-white/85 px-[18px] py-4 ${
              seen ? "rise-in" : ""
            }`}
            style={seen ? { animationDelay: `${Math.min(index, 5) * 40}ms` } : undefined}
          >
            <span className="work-sheen" aria-hidden="true" />
            <div className="relative">
              <h3 className="text-[15.5px] font-semibold">{work.name}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{work.description}</p>
            </div>
            <ExternalLink
              href={work.href}
              className="relative inline-flex min-h-9 items-center self-start text-[13px] font-semibold text-accent after:absolute after:inset-0"
            >
              {work.action}
            </ExternalLink>
          </article>
        ))}
      </div>
    </section>
  );
}
