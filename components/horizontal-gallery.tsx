"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { Work } from "@/data/works";

// 横向滚动画廊。通过垂直滚动驱动横向位移。
export function HorizontalGallery({ works }: { works: Work[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // 计算横向总宽度：card 宽度 ~ 70vw，留一些余量
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${works.length * 55 - 40}vw`]
  );

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: `${works.length * 80}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <motion.div
          style={{ x }}
          className="flex gap-10 pl-[8vw] will-change-transform"
        >
          {works.map((w) => (
            <Link
              key={w.slug}
              href={`/works/${w.slug}`}
              className="group shrink-0 w-[70vw] md:w-[48vw]"
            >
              <div className="relative overflow-hidden bg-line aspect-[4/5]">
                <Image
                  src={w.cover}
                  alt={w.coverAlt}
                  fill
                  className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 70vw, 48vw"
                  unoptimized
                />
              </div>
              <div className="mt-6 flex items-baseline justify-between gap-6">
                <div className="font-display text-2xl md:text-3xl leading-[1.3] group-hover:text-white transition-colors">
                  {w.title}
                  <span className="ml-3 italic text-subtle text-base md:text-lg">
                    {w.titleEn.toLowerCase()}
                  </span>
                </div>
                <div className="text-sm text-subtle shrink-0 tabular-nums">
                  {w.year}
                </div>
              </div>
            </Link>
          ))}
          <div className="shrink-0 w-[40vw]" />
        </motion.div>
      </div>
    </section>
  );
}
