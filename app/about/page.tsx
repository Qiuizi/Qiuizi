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
      <section className="px-6 md:px-10 pt-40 pb-16">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.3em] text-subtle font-mono mb-6">
              About · 关于
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1
              className="font-display text-balance"
              style={{
                fontSize: "clamp(2.75rem, 9vw, 8.5rem)",
                lineHeight: 1.1,
                letterSpacing: "0",
              }}
            >
              我是
              <span className="italic text-muted">{site.name}</span>。
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <Reveal>
              <div className="relative aspect-[4/5] bg-line overflow-hidden">
                <Image
                  src="/api/placeholder?seed=sp-about&w=1200&h=1500"
                  alt="肖像占位"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  unoptimized
                />
              </div>
              <div className="mt-3 text-xs font-mono text-subtle">
                * 肖像占位中，领导你换成自己的。
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-7 space-y-10">
            <Reveal>
              <p className="font-display text-3xl md:text-4xl leading-[1.5] text-balance">
                {site.bio}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-6 text-stone-300 leading-[2]">
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

      <section className="px-6 md:px-10 py-20 border-t border-line">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <Reveal>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-subtle font-mono mb-3">
                现在
              </div>
              <p className="text-sm text-stone-300 leading-[1.9]">
                在{site.location}。
                这里写一两句你当下在做的事——不必很"重要"，
                但最好是真的。
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-subtle font-mono mb-3">
                工具
              </div>
              <ul className="text-sm text-stone-300 space-y-2 leading-[1.8]">
                <li>相机 · 占位</li>
                <li>胶片机 · 占位</li>
                <li>视频设备 · 占位</li>
                <li>笔记软件 · 占位</li>
                <li>剪辑软件 · 占位</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-subtle font-mono mb-3">
                联系
              </div>
              <ul className="text-sm space-y-2">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      className="underline underline-offset-4 decoration-subtle hover:decoration-foreground transition"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {s.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-6 md:px-10 py-20 border-t border-line">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs uppercase tracking-[0.3em] text-subtle font-mono mb-8">
            简历 · Timeline
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {[
              { year: "2026", text: "一件你在做的事（占位）" },
              { year: "2025", text: "上一年发生的事（占位）" },
              { year: "2024", text: "再上一年（占位）" },
              { year: "2023", text: "更早的一件事（占位）" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <li className="grid grid-cols-12 gap-4 py-6 items-baseline">
                  <div className="col-span-3 md:col-span-2 text-sm font-mono text-muted">
                    {item.year}
                  </div>
                  <div className="col-span-9 md:col-span-10 text-stone-200">
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
