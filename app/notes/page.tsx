import type { Metadata } from "next";
import Link from "next/link";
import { getAllNotes } from "@/lib/notes";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "随笔 · Notes",
};

export default async function NotesIndex() {
  const notes = await getAllNotes();

  return (
    <>
      <section className="px-6 md:px-10 pt-40 pb-16">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.3em] text-subtle font-mono mb-6">
              Notes · 随笔
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1
              className="font-display leading-[0.9] tracking-tighter text-balance"
              style={{ fontSize: "clamp(3rem, 11vw, 11rem)" }}
            >
              慢一点，
              <br />
              <span className="italic text-muted">想清楚再说。</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-10 max-w-xl text-muted leading-[1.9] text-lg">
              这里是一些没在朋友圈发的想法。长短不一，语气不一，但都是认真写的。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-40">
        <div className="max-w-6xl mx-auto">
          <ul className="border-y border-line divide-y divide-line">
            {notes.map((n, i) => (
              <Reveal key={n.slug} delay={i * 0.06}>
                <li>
                  <Link
                    href={`/notes/${n.slug}`}
                    className="group grid grid-cols-12 gap-4 py-10 items-baseline hover:bg-white/[0.015] transition px-2 -mx-2"
                  >
                    <div className="col-span-2 md:col-span-1 text-xs font-mono text-subtle pt-2">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="col-span-10 md:col-span-7">
                      <div className="font-display text-3xl md:text-4xl tracking-tight group-hover:text-white transition-colors text-balance">
                        {n.title}
                      </div>
                      <div className="mt-3 text-sm text-muted leading-[1.9]">
                        {n.excerpt}
                      </div>
                    </div>
                    <div className="hidden md:flex md:col-span-3 text-xs text-subtle gap-2 flex-wrap pt-2">
                      {n.tags?.map((t) => (
                        <span key={t} className="px-2 py-0.5 border border-line">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="col-span-12 md:col-span-1 text-xs font-mono text-subtle md:text-right pt-2 flex md:block gap-3">
                      <span>{n.date}</span>
                      <span className="md:block md:mt-1">
                        {n.readingMinutes} 分钟
                      </span>
                    </div>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
