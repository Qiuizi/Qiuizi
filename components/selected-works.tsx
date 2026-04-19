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
          <h2 className="font-display text-4xl md:text-6xl leading-[1.15] text-balance">
            那些值得
            <br />
            <span className="italic text-muted">被再看一次</span>的。
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <Link
            href="/works"
            className="text-sm underline underline-offset-4 decoration-subtle hover:decoration-foreground transition"
          >
            查看全部 →
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
      </motion.div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <div className="font-display text-xl md:text-2xl group-hover:text-white transition-colors">
          {work.title}
          <span className="ml-3 italic text-subtle text-base">
            {work.titleEn.toLowerCase()}
          </span>
        </div>
        <div className="text-sm text-subtle shrink-0 tabular-nums">
          {work.year}
        </div>
      </div>
    </Link>
  );
}
