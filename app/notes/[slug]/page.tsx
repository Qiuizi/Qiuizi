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
    <article className="relative px-6 md:px-10 pt-32 pb-32 overflow-hidden">
      <div className="blob" style={{ top: "5%", left: "-10%", width: 520, height: 520, background: "#818cf8", opacity: 0.1 }} />
      <div className="max-w-3xl mx-auto relative z-10">
        <Reveal>
          <div className="text-[11px] uppercase tracking-[0.4em] text-accent">
            {meta.date} · {meta.readingMinutes} min read
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h1
            className="font-display mt-8 text-balance"
            style={{
              fontSize: "clamp(2.25rem, 6vw, 5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
            }}
          >
            {meta.title}
          </h1>
        </Reveal>

        {meta.excerpt && (
          <Reveal delay={0.15}>
            <p className="mt-10 text-muted font-display italic text-xl md:text-2xl leading-[1.6] border-l border-accent pl-6">
              {meta.excerpt}
            </p>
          </Reveal>
        )}

        <div className="mt-16">
          <Content />
        </div>

        <div className="mt-24 pt-10 border-t border-line grid grid-cols-2 gap-6">
          {prev ? (
            <Link href={`/notes/${prev.slug}`} className="group">
              <div className="text-[11px] uppercase tracking-[0.3em] text-subtle mb-2">
                Next ↘
              </div>
              <div className="font-display text-xl group-hover:text-accent transition-colors">
                {prev.title}
              </div>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/notes/${next.slug}`} className="group text-right">
              <div className="text-[11px] uppercase tracking-[0.3em] text-subtle mb-2">
                ↖ Previous
              </div>
              <div className="font-display text-xl group-hover:text-accent transition-colors">
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
