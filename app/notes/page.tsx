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
      <section className="relative px-6 md:px-10 pt-40 pb-20 overflow-hidden">
        <div className="blob" style={{ top: "-10%", left: "-5%", width: 520, height: 520, background: "#c084fc", opacity: 0.12 }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <Reveal>
            <div className="text-xs tracking-[0.4em] uppercase text-accent mb-6">
              Journal · {String(notes.length).padStart(2, "0")} entries
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
              Slow <span className="italic text-accent">thoughts</span>, written down.
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
                    className="group grid grid-cols-12 gap-6 py-10 items-baseline hover:bg-white/[0.015] transition px-2 -mx-2"
                  >
                    <div className="col-span-1 text-[11px] uppercase tracking-[0.3em] text-subtle tabular-nums pt-2">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="col-span-11 md:col-span-7">
                      <div className="font-display text-3xl md:text-[2.25rem] leading-[1.2] group-hover:text-accent transition-colors text-balance">
                        {n.title}
                      </div>
                      <div className="mt-4 text-muted leading-[1.85] text-balance">
                        {n.excerpt}
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-4 text-[11px] uppercase tracking-[0.25em] text-subtle md:text-right flex md:block gap-3 pt-2">
                      <span className="tabular-nums">{n.date}</span>
                      <span className="md:block md:mt-1">
                        {n.readingMinutes} min read
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
