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
              className="font-display leading-[0.9] tracking-tighter text-balance"
              style={{ fontSize: "clamp(3rem, 11vw, 11rem)" }}
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
              <p className="font-display text-3xl md:text-4xl leading-[1.3] tracking-tight text-balance">
                {site.bio}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-5 text-stone-300 leading-[1.9]">
                <p>
                  我的本职是一个正在读大二的地理系学生。课余在拍照、写字、
                  偶尔剪剪片子。我不把这些当作"爱好"——它们和我的专业一起，
                  构成了我看世界的方式。
                </p>
                <p>
                  我相信一个人的眼睛比他的观点更诚实。所以我拍照时尽量少说话，
                  写字时尽量不说理。
                </p>
                <p>
                  如果你想和我聊聊任何东西——一张让你停下来的照片，一个没有答案的问题，
                  或者只是想告诉我你也喜欢某个下午的光——请随时写信。
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
              <p className="text-sm text-stone-300 leading-relaxed">
                在{site.location}，华中师大地理系大二。
                正在做一组关于长江中游河岸形态的个人项目。
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-subtle font-mono mb-3">
                工具
              </div>
              <ul className="text-sm text-stone-300 space-y-1">
                <li>Ricoh GR III · 日常</li>
                <li>Pentax MX · 胶片</li>
                <li>FUJIFILM X-T30 · 视频</li>
                <li>obsidian · 笔记</li>
                <li>DaVinci Resolve · 剪辑</li>
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
              { year: "2026", text: "开始独立影像项目《长江笔记》第二季" },
              { year: "2025", text: "华中师范大学 · 地理科学学院 · 大二在读" },
              { year: "2024", text: "个人摄影项目《末班车》" },
              { year: "2023", text: "考入华中师大" },
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
