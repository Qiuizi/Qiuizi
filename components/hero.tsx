"use client";

import { motion } from "motion/react";
import { site } from "@/lib/site";

// 首页 Hero —— 纯排版，无装饰。
// 整屏中文大字 + 一行 Latin 斜体署名。图片、vignette、meta 标签、"向下滚动" 全部砍掉。
export function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full flex items-end">
      <div className="px-6 md:px-10 pb-16 md:pb-24 pt-40 w-full">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-balance"
          style={{
            fontSize: "clamp(3.25rem, 13vw, 13rem)",
            lineHeight: 1.04,
            letterSpacing: "0",
          }}
        >
          <Line delay={0.1}>{site.tagline}。</Line>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-12 md:mt-16 font-display italic text-muted"
          style={{ fontSize: "clamp(1rem, 1.6vw, 1.5rem)" }}
        >
          — {site.nameLatin.toLowerCase()}
        </motion.div>
      </div>
    </section>
  );
}

function Line({
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
