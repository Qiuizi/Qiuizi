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
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-6 text-xs font-mono tracking-widest text-white/80 mb-6">
              <span>N° {String(idx + 1).padStart(3, "0")}</span>
              <span>·</span>
              <span>{work.year}</span>
              <span>·</span>
              <span>{work.location}</span>
            </div>
            <h1
              className="font-display text-white leading-[0.9] tracking-tighter text-balance"
              style={{ fontSize: "clamp(3rem, 11vw, 11rem)" }}
            >
              {work.title}
            </h1>
            <div className="mt-3 font-display italic text-white/60 text-2xl md:text-4xl">
              {work.titleEn}
            </div>
          </div>
        </div>
      </section>

      {/* 叙述部分 */}
      <section className="px-6 md:px-10 py-32">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-3">
            <div className="sticky top-28">
              <div className="text-xs uppercase tracking-[0.3em] text-subtle font-mono mb-4">
                Info
              </div>
              <dl className="text-sm space-y-3">
                <div>
                  <dt className="text-subtle">媒介</dt>
                  <dd className="mt-0.5">
                    {work.kind === "photo"
                      ? "影像"
                      : work.kind === "video"
                      ? "视频"
                      : "文字"}
                  </dd>
                </div>
                <div>
                  <dt className="text-subtle">年份</dt>
                  <dd className="mt-0.5">{work.year}</dd>
                </div>
                <div>
                  <dt className="text-subtle">地点</dt>
                  <dd className="mt-0.5">{work.location}</dd>
                </div>
                <div>
                  <dt className="text-subtle">标签</dt>
                  <dd className="mt-0.5 flex flex-wrap gap-1.5">
                    {work.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 border border-line text-xs"
                      >
                        {t}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="md:col-span-9">
            <Reveal>
              <p className="font-display text-2xl md:text-3xl leading-[1.45] tracking-tight text-balance">
                {work.summary}
              </p>
            </Reveal>
            <div className="mt-12 space-y-6">
              {work.body.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <p className="text-stone-300 leading-[1.85]">{p}</p>
                </Reveal>
              ))}
            </div>
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
                  <figcaption className="mt-3 text-xs font-mono text-subtle tracking-wide">
                    {String(i + 1).padStart(2, "0")} · {item.caption}
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
