import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line mt-24 overflow-hidden">
      <div className="blob" style={{ top: "10%", left: "40%", width: 600, height: 600, background: "#818cf8", opacity: 0.1 }} />
      <div className="relative z-10 px-6 md:px-10 py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs tracking-[0.4em] uppercase text-accent mb-8">
            04 — Get in Touch
          </div>
          <a
            href={`mailto:${site.email}`}
            className="font-display italic inline-block hover:text-accent transition-colors"
            style={{
              fontSize: "clamp(2.25rem, 8vw, 6.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
            }}
          >
            {site.email}
          </a>
        </div>
      </div>

      <div className="relative z-10 px-6 md:px-10 py-6 border-t border-line flex flex-col md:flex-row md:items-center justify-between gap-4 text-[11px] uppercase tracking-[0.25em] text-subtle">
        <div>© {year} {site.name}</div>
        <div className="flex gap-6">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-accent transition"
            >
              {item.labelEn}
            </Link>
          ))}
        </div>
        <div className="flex gap-5">
          {site.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent transition"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
