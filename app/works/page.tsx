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
      <section className="px-6 md:px-10 pt-48 pb-24">
        <div className="max-w-5xl">
          <Reveal>
            <h1
              className="font-display text-balance"
              style={{
                fontSize: "clamp(2.75rem, 9vw, 8rem)",
                lineHeight: 1.1,
                letterSpacing: "0",
              }}
            >
              我看见的，
              <br />
              <span className="italic text-muted">和我想让你看见的。</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <HorizontalGallery works={works} />

      <section className="px-6 md:px-10 py-32 border-t border-line">
        <div className="max-w-6xl mx-auto">
          <ul className="divide-y divide-line border-y border-line">
            {works.map((w) => (
              <li key={w.slug}>
                <a
                  href={`/works/${w.slug}`}
                  className="group grid grid-cols-12 gap-6 py-8 items-baseline hover:bg-white/[0.015] transition px-2 -mx-2"
                >
                  <div className="col-span-12 md:col-span-7 font-display text-2xl md:text-3xl leading-[1.35] group-hover:text-white transition-colors">
                    {w.title}
                    <span className="ml-4 font-display italic text-subtle text-lg md:text-xl">
                      {w.titleEn.toLowerCase()}
                    </span>
                  </div>
                  <div className="hidden md:block md:col-span-3 text-sm text-muted">
                    {w.tags.join(" · ")}
                  </div>
                  <div className="col-span-12 md:col-span-2 text-xs text-subtle md:text-right">
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
