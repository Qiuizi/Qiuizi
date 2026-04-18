"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { Work } from "@/data/works";
import { Reveal } from "./reveal";

export function SelectedWorks({ works }: { works: Work[] }) {
  return (
    <section className="px-6 md:px-10 py-32">
      <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
        <Reveal>
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-subtle font-mono mb-4">
              Selected Works · 精选
            </div>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight text-balance">
              那些值得
              <br />
              <span className="italic text-muted">被再看一次</span>的。
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <Link
            href="/works"
            className="text-sm underline underline-offset-4 decoration-subtle hover:decoration-foreground transition"
          >
            查看全部作品 →
          </Link>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
        {works.map((w, i) => {
          const span =
            i % 4 === 0
              ? "md:col-span-7"
              : i % 4 === 1
              ? "md:col-span-5"
              : i % 4 === 2
              ? "md:col-span-5"
              : "md:col-span-7";
          const tall = i % 3 === 0;
          return (
            <Reveal key={w.slug} delay={(i % 2) * 0.1} className={span}>
              <WorkCard work={w} aspect={tall ? "tall" : "wide"} />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function WorkCard({
  work,
  aspect,
}: {
  work: Work;
  aspect: "tall" | "wide";
}) {
  return (
    <Link href={`/works/${work.slug}`} className="group block">
      <motion.div
        whileHover={{ scale: 1.005 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`relative overflow-hidden bg-line ${
          aspect === "tall" ? "aspect-[4/5]" : "aspect-[16/10]"
        }`}
      >
        <Image
          src={work.cover}
          alt={work.coverAlt}
          fill
          className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized
        />
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="text-xs font-mono uppercase tracking-widest text-muted">
            {work.kind === "photo" ? "影像" : work.kind === "video" ? "视频" : "文字"} ·{" "}
            {work.year}
          </div>
        </div>
      </motion.div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <div className="font-display text-2xl tracking-tight group-hover:text-white transition-colors">
            {work.title}
          </div>
          <div className="text-xs font-mono tracking-widest text-subtle mt-1">
            {work.titleEn.toUpperCase()}
          </div>
        </div>
        <div className="text-xs font-mono text-subtle shrink-0">
          {work.year}
        </div>
      </div>
    </Link>
  );
}
