import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllNotes, getNoteSlugs } from "@/lib/notes";
import { Reveal } from "@/components/reveal";

export async function generateStaticParams() {
  const slugs = await getNoteSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const all = await getAllNotes();
  const meta = all.find((n) => n.slug === slug);
  if (!meta) return {};
  return { title: `${meta.title} · 随笔`, description: meta.excerpt };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const all = await getAllNotes();
  const meta = all.find((n) => n.slug === slug);
  if (!meta) notFound();

  let Content: React.ComponentType;
  try {
    const mod = await import(`@/content/notes/${slug}.mdx`);
    Content = mod.default;
  } catch {
    notFound();
  }

  const idx = all.findIndex((n) => n.slug === slug);
  const next = all[idx + 1];
  const prev = all[idx - 1];

  return (
    <article className="px-6 md:px-10 pt-40 pb-32">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="text-xs font-mono text-subtle tracking-widest">
            {meta.date} · {meta.readingMinutes} 分钟阅读
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="font-display mt-6 text-balance"
              style={{
                fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)",
                lineHeight: 1.2,
                letterSpacing: "0",
              }}>
            {meta.title}
          </h1>
        </Reveal>

        {meta.excerpt && (
          <Reveal delay={0.15}>
            <p className="mt-8 text-muted font-display italic text-xl md:text-2xl leading-[1.7] border-l border-line pl-6">
              {meta.excerpt}
            </p>
          </Reveal>
        )}

        <div className="mt-16">
          <Content />
        </div>

        <div className="mt-24 pt-10 border-t border-line grid grid-cols-2 gap-6 text-sm">
          {prev ? (
            <Link href={`/notes/${prev.slug}`} className="group">
              <div className="text-xs text-subtle mb-1">下一篇 ↘</div>
              <div className="font-display text-xl group-hover:text-white transition-colors">
                {prev.title}
              </div>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/notes/${next.slug}`} className="group text-right">
              <div className="text-xs text-subtle mb-1">↖ 上一篇</div>
              <div className="font-display text-xl group-hover:text-white transition-colors">
                {next.title}
              </div>
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </article>
  );
}
