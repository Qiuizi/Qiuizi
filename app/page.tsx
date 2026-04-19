import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { SelectedWorks } from "@/components/selected-works";
import { Reveal } from "@/components/reveal";
import { works } from "@/data/works";
import { getAllNotes } from "@/lib/notes";
import { site } from "@/lib/site";

export default async function Home() {
  const featured = works.slice(0, 5);
  const notes = (await getAllNotes()).slice(0, 4);

  return (
    <>
      <Hero />

      {/* 01 — Manifesto：肖像 + 宣言 + stat row */}
      <section className="relative px-6 md:px-10 py-32 md:py-48 border-t border-line overflow-hidden">
        <div className="blob" style={{ top: "10%", right: "-8%", width: 460, height: 460, background: "#818cf8", opacity: 0.12 }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <Reveal>
            <div className="text-xs tracking-[0.4em] uppercase text-accent mb-6">
              01 — Manifesto
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
            <div className="md:col-span-5">
              <Reveal>
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-panel">
                  <Image
                    src="/api/placeholder?seed=sp-manifesto&w=1200&h=1500"
                    alt="portrait placeholder"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    unoptimized
                  />
                </div>
              </Reveal>
            </div>
            <div className="md:col-span-7 space-y-10">
              <Reveal delay={0.1}>
                <h2
                  className="font-display text-balance"
                  style={{
                    fontSize: "clamp(2.25rem, 5.5vw, 4.75rem)",
                    lineHeight: 1.08,
                    letterSpacing: "-0.015em",
                  }}
                >
                  Not every moment needs a{" "}
                  <span className="italic text-accent">caption</span>.
                </h2>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="text-muted leading-[2] max-w-xl">
                  {site.bio}这里是影像、文字与日常观察的存放处。没有目录，没有分类——
                  只有一段段可以慢慢走过的小径。
                </p>
              </Reveal>
              <Reveal delay={0.26}>
                <dl className="grid grid-cols-3 gap-6 pt-6 border-t border-line max-w-xl">
                  {[
                    { k: "Works", v: String(works.length).padStart(2, "0") },
                    { k: "Notes", v: String(notes.length > 0 ? "∞" : "00") },
                    { k: "Since", v: "2023" },
                  ].map((s) => (
                    <div key={s.k}>
                      <dt className="text-[11px] uppercase tracking-[0.3em] text-subtle">
                        {s.k}
                      </dt>
                      <dd className="font-display text-3xl md:text-4xl mt-2">
                        {s.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <SelectedWorks works={featured} />

      {/* 03 — Journal */}
      <section className="relative px-6 md:px-10 py-32 md:py-48 border-t border-line overflow-hidden">
        <div className="blob" style={{ bottom: "-5%", left: "-6%", width: 520, height: 520, background: "#c084fc", opacity: 0.12 }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
            <div>
              <Reveal>
                <div className="text-xs tracking-[0.4em] uppercase text-accent mb-5">
                  03 — Journal
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <h2
                  className="font-display text-balance"
                  style={{
                    fontSize: "clamp(2.5rem, 6vw, 5rem)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                  }}
                >
                  Small <span className="italic text-accent">notes</span>, slow days.
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <Link
                href="/notes"
                className="text-xs uppercase tracking-[0.3em] text-muted hover:text-accent transition-colors"
              >
                Read all ↗
              </Link>
            </Reveal>
          </div>

          <ul className="divide-y divide-line border-y border-line">
            {notes.map((n, i) => (
              <Reveal key={n.slug} delay={i * 0.06}>
                <li>
                  <Link
                    href={`/notes/${n.slug}`}
                    className="group grid grid-cols-12 gap-6 py-8 items-baseline hover:bg-white/[0.015] transition-colors px-2 -mx-2"
                  >
                    <div className="col-span-1 text-[11px] uppercase tracking-[0.3em] text-subtle tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="col-span-11 md:col-span-7 font-display text-2xl md:text-3xl leading-[1.3] group-hover:text-accent transition-colors">
                      {n.title}
                    </div>
                    <div className="hidden md:block md:col-span-3 text-sm text-muted truncate">
                      {n.excerpt}
                    </div>
                    <div className="col-span-12 md:col-span-1 text-xs text-subtle md:text-right tabular-nums">
                      {n.date}
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
