"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { site } from "@/lib/site";

// 首页 Hero —— demo 风：居中编辑排版 + indigo 氛围光斑 + 圆形 CTA。
// Latin 大字 Playfair + italic accent 字，中文小一号作副标题。
export function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden flex items-center justify-center">
      {/* 氛围光斑 */}
      <div className="blob" style={{ top: "-10%", left: "-10%", width: 520, height: 520, background: "#818cf8" }} />
      <div className="blob" style={{ bottom: "-15%", right: "-10%", width: 620, height: 620, background: "#c084fc", opacity: 0.18 }} />

      <div className="relative z-10 px-6 md:px-10 w-full max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="text-xs tracking-[0.5em] uppercase text-muted"
        >
          A Personal Space · {site.location}
        </motion.div>

        <h1
          className="font-display text-balance mt-10"
          style={{
            fontSize: "clamp(3rem, 11vw, 11rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
          }}
        >
          <Line delay={1.05}>Visual</Line>{" "}
          <Line delay={1.18}>
            <span className="italic text-accent">Poetry</span>
          </Line>
          <br />
          <Line delay={1.32}>in Motion</Line>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.7 }}
          className="mt-12 font-display text-muted max-w-2xl mx-auto text-balance"
          style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)", lineHeight: 1.7 }}
        >
          {site.tagline}。{site.bio}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.95 }}
          className="mt-20 flex justify-center"
        >
          <Link
            href="/works"
            className="group relative grid place-items-center h-36 w-36 rounded-full border border-line hover:border-accent transition-colors"
          >
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full animate-[spin_18s_linear_infinite] text-muted"
            >
              <defs>
                <path
                  id="cta-ring"
                  d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                />
              </defs>
              <text
                fill="currentColor"
                fontSize="8"
                letterSpacing="3"
                className="uppercase"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <textPath href="#cta-ring">
                  SCROLL TO EXPLORE · SCROLL TO EXPLORE ·
                </textPath>
              </text>
            </svg>
            <span className="text-accent text-xl group-hover:translate-y-1 transition-transform">
              ↓
            </span>
          </Link>
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
