import type { Metadata } from "next";
import { HorizontalGallery } from "@/components/horizontal-gallery";
import { Reveal } from "@/components/reveal";
import { works } from "@/data/works";

export const metadata: Metadata = {
  title: "作品 · Works",
};

export default function WorksPage() {
  return (
    <>
      <section className="px-6 md:px-10 pt-40 pb-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.3em] text-subtle font-mono mb-6">
              All Works · 作品
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1
              className="font-display text-balance"
              style={{
                fontSize: "clamp(2.75rem, 9vw, 8.5rem)",
                lineHeight: 1.1,
                letterSpacing: "0",
              }}
            >
              我看见的，
              <br />
              <span className="italic text-muted">和我想让你看见的。</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-10 max-w-xl text-muted leading-[1.9] text-lg">
              一共 {works.length} 组。它们按时间倒序排列。向下滚动，它们会横着走。
            </p>
          </Reveal>
        </div>
      </section>

      <HorizontalGallery works={works} />

      <section className="px-6 md:px-10 py-20 border-t border-line">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs uppercase tracking-[0.3em] text-subtle font-mono mb-8">
            Index · 索引
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {works.map((w, i) => (
              <li key={w.slug}>
                <a
                  href={`/works/${w.slug}`}
                  className="group grid grid-cols-12 gap-4 py-6 items-baseline hover:bg-white/[0.015] transition px-2 -mx-2"
                >
                  <div className="col-span-2 md:col-span-1 text-xs font-mono text-subtle">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="col-span-10 md:col-span-5 font-display text-xl md:text-2xl leading-[1.35] group-hover:text-white transition-colors">
                    {w.title}
                    <span className="ml-3 text-sm font-sans text-subtle align-middle">
                      {w.titleEn}
                    </span>
                  </div>
                  <div className="hidden md:block md:col-span-4 text-sm text-muted">
                    {w.tags.join(" · ")}
                  </div>
                  <div className="col-span-12 md:col-span-2 text-xs font-mono text-subtle md:text-right">
                    {w.year}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
