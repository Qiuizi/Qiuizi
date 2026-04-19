"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// 顶栏：毛玻璃 + Playfair italic logo + uppercase tracking-widest 菜单。demo 风。
export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <header className="glass-nav fixed inset-x-0 top-0 z-50 border-b border-line/60">
        <div className="flex items-center justify-between px-6 md:px-10 h-16">
          <Link
            href="/"
            className="font-display italic text-xl leading-none hover:text-accent transition-colors"
          >
            {site.nameLatin.toLowerCase()}
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-[11px] uppercase tracking-[0.3em]">
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
                  {item.labelEn}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
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
                    onClick={close}
                    className="font-display text-4xl"
                  >
                    {item.label}
                    <span className="block text-sm italic text-muted mt-1 text-center">
                      {item.labelEn.toLowerCase()}
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
