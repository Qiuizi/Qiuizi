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
              慢一点，
              <br />
              <span className="italic text-muted">想清楚再说。</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-40">
        <div className="max-w-5xl mx-auto">
          <ul className="border-y border-line divide-y divide-line">
            {notes.map((n, i) => (
              <Reveal key={n.slug} delay={i * 0.06}>
                <li>
                  <Link
                    href={`/notes/${n.slug}`}
                    className="group grid grid-cols-12 gap-6 py-12 items-baseline hover:bg-white/[0.015] transition px-2 -mx-2"
                  >
                    <div className="col-span-12 md:col-span-8">
                      <div className="font-display text-3xl md:text-[2.5rem] leading-[1.3] group-hover:text-white transition-colors text-balance">
                        {n.title}
                      </div>
                      <div className="mt-4 text-muted leading-[1.85] text-balance">
                        {n.excerpt}
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-4 text-sm text-subtle md:text-right flex md:block gap-3 pt-2">
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
