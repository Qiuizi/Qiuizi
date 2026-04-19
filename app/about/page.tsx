import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/lib/site";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "关于 · About",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative px-6 md:px-10 pt-40 pb-24 overflow-hidden">
        <div className="blob" style={{ top: "0%", right: "-10%", width: 560, height: 560, background: "#818cf8", opacity: 0.12 }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <Reveal>
            <div className="text-xs tracking-[0.4em] uppercase text-accent mb-6">
              About · Colophon
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
              Hi, I&rsquo;m{" "}
              <span className="italic text-accent">{site.nameLatin.toLowerCase()}</span>.
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-5">
            <Reveal>
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-panel">
                <Image
                  src="/api/placeholder?seed=sp-about&w=1200&h=1500"
                  alt="portrait placeholder"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  unoptimized
                />
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-7 space-y-12">
            <Reveal>
              <p
                className="font-display text-balance"
                style={{
                  fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)",
                  lineHeight: 1.35,
                  letterSpacing: "-0.01em",
                }}
              >
                {site.bio}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-6 text-muted leading-[2] max-w-xl">
                <p>
                  这里是一段关于你自己的介绍占位文字。你可以写你是谁、你在做什么、
                  你为什么做这些事。不用追求完整或者华丽——真诚比什么都重要。
                </p>
                <p>
                  第二段可以继续展开：你的兴趣、你看世界的方式、或者任何你愿意
                  让读者知道的事。也可以写你的日常——光、食物、天气、习惯。
                </p>
                <p>
                  最后可以留一个开口：如果有人看到这里，他们怎么联系你？
                  一封信、一条消息，或者只是一声问候。
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-24 border-t border-line">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-xs tracking-[0.4em] uppercase text-accent mb-12">
              Timeline
            </div>
          </Reveal>
          <ul className="divide-y divide-line border-y border-line">
            {[
              { year: "2026", text: "一件你在做的事（占位）" },
              { year: "2025", text: "上一年发生的事（占位）" },
              { year: "2024", text: "再上一年（占位）" },
              { year: "2023", text: "更早的一件事（占位）" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <li className="grid grid-cols-12 gap-6 py-8 items-baseline">
                  <div className="col-span-3 md:col-span-2 text-[11px] uppercase tracking-[0.3em] text-accent tabular-nums">
                    {item.year}
                  </div>
                  <div className="col-span-9 md:col-span-10 font-display text-xl md:text-2xl leading-[1.5]">
                    {item.text}
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
