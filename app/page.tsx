import { Hero } from "@/components/hero";
import { SelectedWorks } from "@/components/selected-works";
import { Marquee } from "@/components/marquee";
import { Reveal } from "@/components/reveal";
import { works } from "@/data/works";
import { getAllNotes } from "@/lib/notes";
import Link from "next/link";

export default async function Home() {
  const featured = works.slice(0, 4);
  const notes = (await getAllNotes()).slice(0, 3);

  return (
    <>
      <Hero />

      {/* 简短引子 */}
      <section className="px-6 md:px-10 pt-32 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-3">
              <div className="text-xs uppercase tracking-[0.3em] text-subtle font-mono">
                Introduction
              </div>
              <div className="mt-3 text-sm text-muted font-mono">§ 00</div>
            </div>
            <div className="md:col-span-9">
              <Reveal>
                <p className="font-display text-3xl md:text-[2.6rem] leading-[1.35] tracking-tight text-balance">
                  我是素鹏。我拍一些安静的照片，写一些写给自己看的字。
                  这个网站是我的仓库，也是我的窗口——
                  <span className="text-subtle italic">
                    如果你碰巧进来，请随意停留。
                  </span>
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Marquee
        items={[
          "影像",
          "Photography",
          "随笔",
          "Notes",
          "地理",
          "Geography",
          "私人",
          "Personal",
        ]}
      />

      <SelectedWorks works={featured} />

      {/* 最近的随笔 */}
      <section className="px-6 md:px-10 py-32 border-t border-line">
        <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
          <Reveal>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-subtle font-mono mb-4">
                Recent Notes · 随笔
              </div>
              <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight text-balance">
                写下来的
                <br />
                <span className="italic text-muted">一点点想法。</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/notes"
              className="text-sm underline underline-offset-4 decoration-subtle hover:decoration-foreground transition"
            >
              查看全部随笔 →
            </Link>
          </Reveal>
        </div>

        <ul className="divide-y divide-line border-y border-line">
          {notes.map((n, i) => (
            <Reveal key={n.slug} delay={i * 0.06}>
              <li>
                <Link
                  href={`/notes/${n.slug}`}
                  className="group grid grid-cols-12 gap-4 py-8 items-baseline hover:bg-white/[0.015] transition-colors px-2 -mx-2"
                >
                  <div className="col-span-2 md:col-span-1 text-xs font-mono text-subtle">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="col-span-10 md:col-span-7 font-display text-2xl md:text-3xl tracking-tight group-hover:italic transition-all">
                    {n.title}
                  </div>
                  <div className="hidden md:block md:col-span-3 text-sm text-muted truncate">
                    {n.excerpt}
                  </div>
                  <div className="col-span-12 md:col-span-1 text-xs font-mono text-subtle md:text-right">
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
