import { ExternalLink } from "@/components/external-link";
import { webWorks } from "@/data/showcase";

export function WorksGrid() {
  return (
    <section
      id="all-works"
      aria-labelledby="all-works-title"
      className="mt-[26px] scroll-mt-4"
    >
      <div className="mb-3.5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="all-works-title" className="text-lg font-bold">
          更多在线 Web 与工具作品
        </h2>
        <p className="text-[13px] text-muted">点击底部 Dock 切换 4 款旗舰软件</p>
      </div>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {webWorks.map((work) => (
          <article
            key={work.name}
            className="relative flex flex-col justify-between gap-2.5 rounded-2xl border border-slate-900/[0.08] bg-white/85 px-[18px] py-4 transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(15,23,42,0.07)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <div>
              <h3 className="text-[15.5px] font-semibold">{work.name}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{work.description}</p>
            </div>
            <ExternalLink
              href={work.href}
              className="inline-flex min-h-9 items-center self-start text-[13px] font-semibold text-accent after:absolute after:inset-0"
            >
              {work.action}
            </ExternalLink>
          </article>
        ))}
      </div>
    </section>
  );
}
