"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { Work } from "@/data/works";
import { Reveal } from "./reveal";

// 精选作品 —— 横向滚动条，rounded-[2rem] 圆角卡片 + caption overlay。
export function SelectedWorks({ works }: { works: Work[] }) {
  return (
    <section className="py-32 border-t border-line">
      <div className="px-6 md:px-10 mb-16">
        <div className="flex items-end justify-between flex-wrap gap-6 max-w-7xl mx-auto">
          <div>
            <Reveal>
              <div className="text-xs tracking-[0.4em] uppercase text-accent mb-5">
                02 — Selected Works
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
                Fragments of <span className="italic text-accent">stillness</span>.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <Link
              href="/works"
              className="text-xs uppercase tracking-[0.3em] text-muted hover:text-accent transition-colors"
            >
              View all ↗
            </Link>
          </Reveal>
        </div>
      </div>

      <div className="no-scrollbar overflow-x-auto">
        <div className="flex gap-6 md:gap-8 px-6 md:px-10 pb-2">
          {works.map((w, i) => (
            <Reveal key={w.slug} delay={i * 0.06}>
              <WorkCard work={w} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkCard({ work, index }: { work: Work; index: number }) {
  return (
    <Link href={`/works/${work.slug}`} className="group block shrink-0">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-[78vw] sm:w-[60vw] md:w-[36rem] aspect-[4/5] rounded-[2rem] overflow-hidden bg-panel"
      >
        <Image
          src={work.cover}
          alt={work.coverAlt}
          fill
          className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          sizes="(max-width: 768px) 78vw, 36rem"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute left-0 right-0 bottom-0 p-7">
          <div className="flex items-baseline justify-between gap-4">
            <div className="font-display text-white text-2xl md:text-3xl leading-tight">
              {work.title}
              <div className="italic text-white/60 text-sm md:text-base mt-1">
                {work.titleEn.toLowerCase()}
              </div>
            </div>
            <div className="text-[11px] tracking-[0.3em] uppercase text-white/70 tabular-nums shrink-0">
              {String(index + 1).padStart(2, "0")}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
