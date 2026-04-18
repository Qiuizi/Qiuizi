"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { site } from "@/lib/site";

// 首页 Hero：滚动驱动的全屏视差 + 文字遮罩揭示
// 领导想替换成视频：把 Image 换成 <video src="/hero.mp4" autoPlay muted loop playsInline />
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.35, 0.85]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] w-full overflow-hidden vignette"
    >
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src="/api/placeholder?seed=sp-hero&w=2400&h=1600"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
          unoptimized
        />
      </motion.div>

      <motion.div
        style={{ opacity: overlay }}
        className="absolute inset-0 bg-background"
      />

      <motion.div
        style={{ y: titleY }}
        className="relative z-10 h-full flex flex-col justify-between px-6 md:px-10 py-24 md:py-28"
      >
        <div className="flex items-start justify-between">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-xs uppercase tracking-[0.3em] text-muted font-mono"
          >
            Portfolio · 2020 — 2026
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xs uppercase tracking-[0.3em] text-muted font-mono text-right"
          >
            {site.location}
          </motion.div>
        </div>

        <div>
          <motion.h1
            className="font-display leading-[0.88] tracking-tighter"
            style={{ fontSize: "clamp(3.5rem, 14vw, 14rem)" }}
          >
            <TextReveal delay={0.3}>{site.name}</TextReveal>
            <br />
            <span className="italic text-muted">
              <TextReveal delay={0.55}>的空间</TextReveal>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-8 max-w-md text-muted leading-relaxed text-balance"
          >
            {site.tagline}。{site.bio}
          </motion.p>
        </div>

        <div className="flex items-end justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="text-xs font-mono tracking-widest text-subtle"
          >
            向下滚动 ↓
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="text-xs font-mono tracking-widest text-subtle"
          >
            N° 001
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function TextReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <span className="inline-block overflow-hidden align-top">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{
          duration: 1.1,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
}
