"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const TOTAL = 5;

// 照搬 demo：5 屏全屏 wheel/touch 分页 + 顶部 glass nav + 每屏 reveal-fade。
// unsplash 图 → /api/placeholder。Gemini 润色保留 UI，走 /api/polish。
export function PaginatedHome() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const screenRefs = useRef<(HTMLElement | null)[]>([]);
  const currentRef = useRef(0);
  const unlockRef = useRef(0);
  const touchStartRef = useRef(0);

  const goToScreen = useCallback((index: number) => {
    if (index < 0 || index >= TOTAL) return;
    currentRef.current = index;
    if (wrapperRef.current) {
      wrapperRef.current.style.transform = `translateY(-${index * 100}vh)`;
    }
    screenRefs.current.forEach((s, i) => {
      if (!s) return;
      if (i === index) {
        setTimeout(() => s.classList.add("active"), 100);
      } else {
        s.classList.remove("active");
      }
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => goToScreen(0), 50);
    return () => clearTimeout(t);
  }, [goToScreen]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const h = target.closest(".horizontal-scroll");
      if (h && Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const v = target.closest(".vertical-scroll") as HTMLElement | null;
      if (v) {
        const atTop = v.scrollTop === 0;
        const atBottom = Math.abs(v.scrollHeight - v.scrollTop - v.clientHeight) < 1;
        if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) return;
      }

      e.preventDefault();
      const now = Date.now();
      if (now < unlockRef.current) {
        unlockRef.current = Math.max(unlockRef.current, now + 50);
        return;
      }
      if (e.deltaY > 25) {
        goToScreen(Math.min(currentRef.current + 1, TOTAL - 1));
        unlockRef.current = now + 1200;
      } else if (e.deltaY < -25) {
        goToScreen(Math.max(currentRef.current - 1, 0));
        unlockRef.current = now + 1200;
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest(".horizontal-scroll") || t?.closest(".vertical-scroll")) return;
      touchStartRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest(".horizontal-scroll") || t?.closest(".vertical-scroll")) return;
      e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest(".horizontal-scroll") || t?.closest(".vertical-scroll")) return;

      const delta = touchStartRef.current - (e.changedTouches[0]?.clientY ?? touchStartRef.current);
      const now = Date.now();
      if (now < unlockRef.current) return;
      if (delta > 50) {
        goToScreen(Math.min(currentRef.current + 1, TOTAL - 1));
        unlockRef.current = now + 1200;
      } else if (delta < -50) {
        goToScreen(Math.max(currentRef.current - 1, 0));
        unlockRef.current = now + 1200;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [goToScreen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = e.currentTarget.dataset.target;
    if (!target) return;
    unlockRef.current = Date.now() + 1200;
    goToScreen(parseInt(target, 10));
  };

  const setScreenRef = useCallback(
    (i: number) => (el: HTMLElement | null) => {
      screenRefs.current[i] = el;
    },
    []
  );

  return (
    <>
      {/* Glass nav */}
      <nav className="glass-nav fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a
            href="#"
            data-target="0"
            onClick={handleNavClick}
            className="text-sm tracking-[0.3em] uppercase text-white font-medium"
          >
            Visual Poetry
          </a>
          <div className="hidden md:flex items-center gap-10 text-[11px] tracking-[0.3em] uppercase text-zinc-400">
            <a href="#" data-target="1" onClick={handleNavClick} className="hover:text-white transition-colors">理念</a>
            <a href="#" data-target="2" onClick={handleNavClick} className="hover:text-white transition-colors">作品</a>
            <a href="#" data-target="3" onClick={handleNavClick} className="hover:text-white transition-colors">随笔</a>
            <a href="#" data-target="4" onClick={handleNavClick} className="hover:text-white transition-colors">留痕</a>
          </div>
        </div>
      </nav>

      {/* Paginated container */}
      <div className="h-screen w-full overflow-hidden relative">
        <div ref={wrapperRef} className="paginated-wrapper w-full h-full">
          {/* 01 — Hero */}
          <header
            ref={setScreenRef(0)}
            className="screen h-screen w-full flex flex-col justify-center relative bg-zinc-950 px-6"
          >
            <div className="absolute inset-0 overflow-hidden z-0">
              <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-indigo-500/10 rounded-full blur-[120px]" />
              <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>
            <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center text-center mt-12">
              <span className="reveal-fade text-[11px] font-display tracking-[0.5em] text-zinc-500 mb-10">
                个人数字空间
              </span>
              <h1 className="reveal-fade delay-100 text-6xl md:text-8xl lg:text-[10rem] font-display tracking-tight leading-none text-white mb-8">
                Visual <span className="italic text-zinc-500">Poetry</span>
              </h1>
              <p className="reveal-fade delay-200 text-sm md:text-base font-display font-light text-zinc-400 max-w-xl leading-[2.5] tracking-[0.3em] mt-4">
                捕捉光影与情绪的微妙平衡<br />用镜头与文字寻找片刻宁静
              </p>
              <a
                href="#"
                data-target="1"
                onClick={handleNavClick}
                className="reveal-fade delay-300 mt-20 relative flex items-center justify-center w-32 h-32 text-zinc-500 hover:text-white transition-colors group"
              >
                <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity duration-700" viewBox="0 0 100 100">
                  <path id="scrollTextPath" d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" fill="none" />
                  <text className="text-[9px] tracking-[0.2em] uppercase fill-current" style={{ fontFamily: "var(--font-inter)" }}>
                    <textPath href="#scrollTextPath" startOffset="0%">
                      SCROLL TO EXPLORE • SCROLL TO EXPLORE •
                    </textPath>
                  </text>
                </svg>
                <div className="w-12 h-12 rounded-full border border-zinc-800 group-hover:border-white group-hover:bg-white group-hover:text-black flex items-center justify-center transition-all duration-700">
                  <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </a>
            </div>
          </header>

          {/* 02 — Manifesto */}
          <section
            ref={setScreenRef(1)}
            className="screen h-screen w-full flex flex-col justify-center bg-zinc-950 px-6"
          >
            <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-16 md:gap-24">
              <div className="w-full md:w-1/2 relative reveal-fade">
                <div className="aspect-[4/5] w-full rounded-[2rem] overflow-hidden border border-white/10 relative group">
                  <Image
                    src="/api/placeholder?seed=sp-studio&w=1200&h=1500"
                    alt="Studio"
                    fill
                    className="object-cover img-scale opacity-80"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                </div>
              </div>
              <div className="w-full md:w-1/2 flex flex-col pl-0 md:pl-10 lg:pl-16">
                <span className="reveal-fade text-[10px] tracking-[0.3em] text-zinc-500 uppercase mb-6">
                  02 — Manifesto
                </span>
                <h2 className="reveal-fade text-5xl md:text-6xl lg:text-7xl font-display text-white mb-10 leading-[1.1] tracking-tight">
                  Reshaping<br />
                  <span className="italic text-zinc-500">Perception</span>
                </h2>
                <div className="reveal-fade delay-100 flex flex-col gap-6 text-zinc-400 text-sm leading-[2] font-light">
                  <p>极简并不是简单地删除一切，而是深思熟虑后的克制。它要求我们在这个充满噪音的世界里，精准地找到核心的表达。</p>
                  <p>无论是按下快门的瞬间，还是敲击键盘的片刻，我都试图剥离多余的装饰，让视觉本身去诉说故事，让情感在留白处自然流淌。</p>
                </div>
                <div className="reveal-fade delay-200 mt-16 pt-8 border-t border-white/10 flex items-center gap-16">
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-display text-white tracking-wider">2018</span>
                    <span className="text-[10px] tracking-widest text-zinc-500 uppercase">创立至今</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-display text-white tracking-wider">Chengdu</span>
                    <span className="text-[10px] tracking-widest text-zinc-500 uppercase">常驻城市</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 03 — Selected Works */}
          <section
            ref={setScreenRef(2)}
            className="screen h-screen w-full flex flex-col justify-center bg-zinc-950 px-6"
          >
            <div className="max-w-7xl mx-auto w-full h-full py-32 flex flex-col">
              <div className="flex items-end justify-between mb-12 flex-none reveal-fade">
                <h2 className="text-4xl md:text-5xl font-display text-white">Selected Works</h2>
                <Link href="/works" className="hidden md:inline-flex text-sm text-zinc-400 hover:text-white transition-colors items-center gap-2">
                  查看全部
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <div className="flex-grow flex gap-6 overflow-x-auto hide-scrollbar horizontal-scroll items-center pb-8">
                {[
                  { category: "Architecture", title: "无声之境", seed: "sp-arch", delay: "delay-100" },
                  { category: "Urban Space", title: "霓虹回响", seed: "sp-urban", delay: "delay-200" },
                  { category: "Minimal Forms", title: "抽象边界", seed: "sp-minimal", delay: "delay-300" },
                ].map((w) => (
                  <Link
                    key={w.seed}
                    href="/works"
                    className={`reveal-fade ${w.delay} flex-shrink-0 w-[85vw] md:w-[400px] h-[55vh] group block relative overflow-hidden rounded-[2rem] border border-white/5`}
                  >
                    <Image
                      src={`/api/placeholder?seed=${w.seed}&w=1200&h=1500`}
                      alt={w.title}
                      fill
                      className="object-cover img-scale opacity-70 group-hover:opacity-100 transition-opacity duration-700"
                      sizes="(max-width: 768px) 85vw, 400px"
                      unoptimized
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent">
                      <span className="text-xs tracking-widest text-zinc-400 uppercase mb-2">{w.category}</span>
                      <span className="text-2xl font-display text-white">{w.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* 04 — Journal */}
          <section
            ref={setScreenRef(3)}
            className="screen h-screen w-full flex flex-col justify-center bg-zinc-950 px-6"
          >
            <div className="max-w-7xl mx-auto w-full flex flex-col h-full py-32 justify-center">
              <div className="mb-16 border-b border-zinc-800 pb-8 reveal-fade">
                <h2 className="text-4xl md:text-5xl font-display text-white">Journal &amp; Thoughts</h2>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { t: "回归胶片的温度：在慢节奏中寻找质感", e: "在这个追求效率的时代，我重新拿起了那台老旧的胶片机，试图找回摄影最初的仪式感。", d: "Apr 18, 2026", delay: "delay-100" },
                  { t: "空间留白：极简主义的视觉哲学", e: "极简不仅仅是视觉上的清爽，它更是对信息层级的精准把控和对观看者感受的尊重。", d: "Mar 22, 2026", delay: "delay-200" },
                  { t: "街头摄影的色彩几何学", e: "穿梭在城市森林中，那些看似杂乱的色彩和线条，在特定的视角下会构成完美的几何图形。", d: "Feb 05, 2026", delay: "delay-300" },
                ].map((n) => (
                  <Link
                    key={n.t}
                    href="/notes"
                    className={`reveal-fade ${n.delay} group flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl hover:bg-white/5 transition-colors duration-300 border border-transparent hover:border-white/10`}
                  >
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl md:text-2xl font-display text-white group-hover:text-indigo-400 transition-colors">
                        {n.t}
                      </h3>
                      <p className="text-sm text-zinc-500 line-clamp-1 max-w-2xl">{n.e}</p>
                    </div>
                    <span className="text-xs text-zinc-500 mt-4 md:mt-0 tracking-widest uppercase">{n.d}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* 05 — Guestbook */}
          <section
            ref={setScreenRef(4)}
            className="screen h-screen w-full flex flex-col justify-center bg-zinc-950 px-6"
          >
            <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-16 md:gap-24 py-24 h-full">
              <Guestbook />
            </div>
          </section>
        </div>
      </div>

      {/* demo 专用样式：只在 paginated 首页生效 */}
      <style jsx global>{`
        .paginated-wrapper {
          transition: transform 1.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          will-change: transform;
        }
        .reveal-fade {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1),
            transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .screen.active .reveal-fade { opacity: 1; transform: translateY(0); }
        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }
        .delay-300 { transition-delay: 300ms; }
        .delay-400 { transition-delay: 400ms; }
        .delay-500 { transition-delay: 500ms; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .img-scale { transition: transform 1.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .group:hover .img-scale { transform: scale(1.05); }
        html, body { overflow: hidden; }
      `}</style>
    </>
  );
}

function Guestbook() {
  const [msg, setMsg] = useState("");
  const [polishing, setPolishing] = useState(false);

  const polish = async () => {
    const original = msg.trim();
    if (!original) return;
    setPolishing(true);
    try {
      const res = await fetch("/api/polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: original }),
      });
      const data = await res.json();
      setMsg(data.polished || original);
    } catch {
      // 网络失败保持原文
    } finally {
      setPolishing(false);
    }
  };

  return (
    <>
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <h2 className="reveal-fade text-4xl md:text-5xl font-display text-white mb-4">
          Leave a Mark
        </h2>
        <p className="reveal-fade delay-100 text-sm text-zinc-400 mb-12 leading-relaxed">
          在这个数字空间里留下你的足迹。每一句真诚的感受，都是共鸣的开始。
        </p>
        <form className="reveal-fade delay-200 flex flex-col gap-6 w-full max-w-md">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">
              称呼
            </label>
            <input
              type="text"
              placeholder="Your Name"
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-zinc-700"
              required
            />
          </div>
          <div className="flex flex-col gap-2 relative">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">
              留言
            </label>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="写下你的感受..."
              rows={4}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-zinc-700 resize-none leading-relaxed"
              required
            />
            <button
              type="button"
              onClick={polish}
              disabled={polishing}
              className="absolute right-3 bottom-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 hover:border-indigo-500/40 disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              {polishing ? "润色中…" : "诗意润色"}
            </button>
          </div>
          <button
            type="button"
            className="mt-4 w-full bg-white text-black font-medium text-sm py-3.5 rounded-xl hover:bg-zinc-200 transition-colors"
          >
            提交留言
          </button>
        </form>
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center relative h-[40vh] md:h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950 z-10 pointer-events-none" />
        <div className="overflow-y-auto hide-scrollbar vertical-scroll flex flex-col gap-6 py-12 relative z-0 h-full">
          {[
            { t: "光影的交错间，我仿佛听到了时间流逝的声音，极为动人。感谢这份宁静的数字角落。", a: "子吟", delay: "delay-300" },
            { t: "极简不仅是一种风格，更是一种对待生活的克制与高级。你的作品给我带来了很多启发。", a: "木兮", delay: "delay-400" },
            { t: "留白处皆是风景。非常喜欢《无声之境》系列，期待看到更多优秀的作品。", a: "远山", delay: "delay-500" },
          ].map((m) => (
            <div
              key={m.a}
              className={`reveal-fade ${m.delay} bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6`}
            >
              <p className="text-zinc-300 text-sm leading-relaxed mb-4">&ldquo;{m.t}&rdquo;</p>
              <span className="text-xs tracking-widest text-zinc-500 uppercase">{m.a}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
