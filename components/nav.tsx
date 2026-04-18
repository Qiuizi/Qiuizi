"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "backdrop-blur-md bg-black/30 border-b border-white/5"
            : "bg-transparent"
        )}
        style={{ mixBlendMode: "normal" }}
      >
        <div className="flex items-center justify-between px-6 md:px-10 h-16">
          <Link
            href="/"
            className="font-display text-lg tracking-tight hover:opacity-70 transition-opacity"
          >
            {site.name}
            <span className="ml-2 text-xs font-sans text-muted tracking-[0.2em]">
              {site.nameLatin}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-sm">
            {site.nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative py-1 transition-colors",
                    active ? "text-foreground" : "text-muted hover:text-foreground"
                  )}
                >
                  <span className="relative">
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-px bg-foreground"
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          <button
            aria-label="menu"
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={cn(
                "block w-6 h-px bg-foreground transition-transform",
                open && "translate-y-[7px] rotate-45"
              )}
            />
            <span
              className={cn(
                "block w-6 h-px bg-foreground transition-opacity",
                open && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block w-6 h-px bg-foreground transition-transform",
                open && "-translate-y-[7px] -rotate-45"
              )}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden bg-background"
          >
            <nav className="flex flex-col items-center justify-center h-full gap-8">
              {site.nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  <Link
                    href={item.href}
                    className="font-display text-4xl tracking-tight"
                  >
                    {item.label}
                    <span className="ml-3 text-sm font-sans text-muted align-middle">
                      {item.labelEn}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
