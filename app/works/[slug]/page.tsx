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
      {/* 封面全屏 */}
      <section className="relative h-[100svh] overflow-hidden">
        <Image
          src={work.cover}
          alt={work.coverAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="absolute inset-x-0 bottom-0 px-6 md:px-10 pb-20 md:pb-24">
          <div className="max-w-6xl mx-auto">
            <h1
              className="font-display text-white text-balance"
              style={{
                fontSize: "clamp(2.75rem, 9vw, 8rem)",
                lineHeight: 1.1,
                letterSpacing: "0",
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

      {/* 叙述部分 */}
      <section className="px-6 md:px-10 py-32">
        <div className="max-w-3xl mx-auto">
          <div className="text-sm text-subtle mb-12 tabular-nums">
            {work.year} · {work.location}
          </div>
          <Reveal>
            <p className="font-display text-2xl md:text-[2rem] leading-[1.55] text-balance">
              {work.summary}
            </p>
          </Reveal>
          <div className="mt-16 space-y-7">
            {work.body.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className="text-stone-300 leading-[2]">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 画廊 */}
      <section className="px-6 md:px-10 pb-32">
        <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
          {work.gallery.map((item, i) => (
            <Reveal key={i}>
              <figure className={i % 2 === 0 ? "md:ml-[8%] md:mr-0" : "md:mr-[8%] md:ml-0"}>
                <div className="relative aspect-[4/3] bg-line overflow-hidden">
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
                  <figcaption className="mt-4 text-sm text-subtle italic">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 前后导航 */}
      <section className="border-t border-line px-6 md:px-10 py-10 flex items-center justify-between text-sm">
        <Link href={`/works/${prev.slug}`} className="group flex items-center gap-3">
          <span className="text-subtle group-hover:text-foreground transition">←</span>
          <div>
            <div className="text-xs text-subtle">上一组</div>
            <div className="font-display text-lg group-hover:text-white transition-colors">
              {prev.title}
            </div>
          </div>
        </Link>
        <Link
          href={`/works/${next.slug}`}
          className="group flex items-center gap-3 text-right"
        >
          <div>
            <div className="text-xs text-subtle">下一组</div>
            <div className="font-display text-lg group-hover:text-white transition-colors">
              {next.title}
            </div>
          </div>
          <span className="text-subtle group-hover:text-foreground transition">→</span>
        </Link>
      </section>
    </article>
  );
}
