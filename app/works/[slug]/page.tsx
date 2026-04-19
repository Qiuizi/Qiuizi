import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { works, workBySlug } from "@/data/works";
import { Reveal } from "@/components/reveal";

export async function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const work = workBySlug(slug);
  if (!work) return {};
  return {
    title: `${work.title} · ${work.titleEn}`,
    description: work.summary,
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = workBySlug(slug);
  if (!work) notFound();

  const idx = works.findIndex((w) => w.slug === slug);
  const next = works[(idx + 1) % works.length];
  const prev = works[(idx - 1 + works.length) % works.length];

  return (
    <article>
      {/* 封面 —— 圆角全屏 */}
      <section className="px-6 md:px-10 pt-24">
        <div className="relative h-[85svh] max-w-7xl mx-auto rounded-[2rem] overflow-hidden bg-panel">
          <Image
            src={work.cover}
            alt={work.coverAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
          <div className="absolute inset-x-0 bottom-0 p-8 md:p-14">
            <div className="text-[11px] uppercase tracking-[0.4em] text-accent mb-5">
              {work.year} · {work.location}
            </div>
            <h1
              className="font-display text-white text-balance"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 7rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              {work.title}
              <span className="ml-4 font-display italic text-white/50 text-2xl md:text-4xl align-baseline">
                {work.titleEn.toLowerCase()}
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* 叙述 */}
      <section className="px-6 md:px-10 py-32">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p
              className="font-display text-balance"
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                lineHeight: 1.4,
                letterSpacing: "-0.01em",
              }}
            >
              {work.summary}
            </p>
          </Reveal>
          <div className="mt-14 space-y-7">
            {work.body.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className="text-muted leading-[2]">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 画廊 */}
      <section className="px-6 md:px-10 pb-32">
        <div className="max-w-7xl mx-auto space-y-10 md:space-y-16">
          {work.gallery.map((item, i) => (
            <Reveal key={i}>
              <figure className={i % 2 === 0 ? "md:ml-[6%]" : "md:mr-[6%]"}>
                <div className="relative aspect-[4/3] rounded-[2rem] bg-panel overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 84vw"
                    unoptimized
                  />
                </div>
                {item.caption && (
                  <figcaption className="mt-4 text-xs uppercase tracking-[0.3em] text-subtle">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 前后导航 */}
      <section className="border-t border-line px-6 md:px-10 py-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <Link href={`/works/${prev.slug}`} className="group flex items-center gap-4">
            <span className="text-accent group-hover:-translate-x-1 transition-transform">←</span>
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-subtle">Previous</div>
              <div className="font-display text-lg md:text-xl group-hover:text-accent transition-colors">
                {prev.title}
              </div>
            </div>
          </Link>
          <Link
            href={`/works/${next.slug}`}
            className="group flex items-center gap-4 text-right"
          >
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-subtle">Next</div>
              <div className="font-display text-lg md:text-xl group-hover:text-accent transition-colors">
                {next.title}
              </div>
            </div>
            <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
