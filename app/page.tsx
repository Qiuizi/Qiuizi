import { Hero } from "@/components/hero";
import { SelectedWorks } from "@/components/selected-works";
import { Reveal } from "@/components/reveal";
import { works } from "@/data/works";
import { getAllNotes } from "@/lib/notes";
import { site } from "@/lib/site";
import Link from "next/link";

export default async function Home() {
  const featured = works.slice(0, 4);
  const notes = (await getAllNotes()).slice(0, 3);

  return (
    <>
      <Hero />

      {/* 引子：单列，无装饰 */}
      <section className="px-6 md:px-10 pt-40 pb-24">
        <div className="max-w-3xl">
          <Reveal>
            <p className="font-display text-2xl md:text-[1.9rem] leading-[1.7] text-balance">
              {site.bio}
            </p>
          </Reveal>
        </div>
      </section>

      <SelectedWorks works={featured} />

      {/* 最近的随笔 */}
      <section className="px-6 md:px-10 py-32 border-t border-line">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <Reveal>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.15] text-balance">
              写下来的
              <br />
              <span className="italic text-muted">一点点想法。</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/notes"
              className="text-sm underline underline-offset-4 decoration-subtle hover:decoration-foreground transition"
            >
              查看全部 →
            </Link>
          </Reveal>
        </div>

        <ul className="divide-y divide-line border-y border-line">
          {notes.map((n, i) => (
            <Reveal key={n.slug} delay={i * 0.06}>
              <li>
                <Link
                  href={`/notes/${n.slug}`}
                  className="group grid grid-cols-12 gap-6 py-10 items-baseline hover:bg-white/[0.015] transition-colors px-2 -mx-2"
                >
                  <div className="col-span-12 md:col-span-8 font-display text-2xl md:text-3xl leading-[1.35] group-hover:text-white transition-colors">
                    {n.title}
                  </div>
                  <div className="hidden md:block md:col-span-3 text-sm text-muted truncate">
                    {n.excerpt}
                  </div>
                  <div className="col-span-12 md:col-span-1 text-xs text-subtle md:text-right">
                    {n.date}
                  </div>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
