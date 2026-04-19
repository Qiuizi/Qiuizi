import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { works } from "@/data/works";

export const metadata: Metadata = {
  title: "作品 · Works",
};

export default function WorksPage() {
  return (
    <>
      {/* 页首 */}
      <section className="relative px-6 md:px-10 pt-40 pb-20 overflow-hidden">
        <div className="blob" style={{ top: "-10%", right: "-5%", width: 520, height: 520, background: "#818cf8", opacity: 0.12 }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <Reveal>
            <div className="text-xs tracking-[0.4em] uppercase text-accent mb-6">
              Archive · {String(works.length).padStart(2, "0")} pieces
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1
              className="font-display text-balance"
              style={{
                fontSize: "clamp(2.75rem, 10vw, 9rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
              }}
            >
              Every frame, <span className="italic text-accent">a sentence</span>.
            </h1>
          </Reveal>
        </div>
      </section>

      {/* 网格 */}
      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {works.map((w, i) => (
            <Reveal key={w.slug} delay={(i % 2) * 0.08}>
              <Link href={`/works/${w.slug}`} className="group block">
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-panel">
                  <Image
                    src={w.cover}
                    alt={w.coverAlt}
                    fill
                    className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-5 left-6 text-[11px] uppercase tracking-[0.3em] text-white/80 tabular-nums">
                    {String(i + 1).padStart(2, "0")} — {w.year}
                  </div>
                </div>
                <div className="mt-6 flex items-baseline justify-between gap-4">
                  <div className="font-display text-2xl md:text-3xl group-hover:text-accent transition-colors leading-tight">
                    {w.title}
                    <span className="ml-3 italic text-subtle text-base md:text-lg">
                      {w.titleEn.toLowerCase()}
                    </span>
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.3em] text-subtle shrink-0">
                    {w.tags[0]}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
