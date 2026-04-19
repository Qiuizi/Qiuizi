import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line mt-32">
      <div className="px-6 md:px-10 py-24">
        <a
          href={`mailto:${site.email}`}
          className="font-display italic block hover:opacity-70 transition-opacity"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 7rem)",
            lineHeight: 1.1,
            letterSpacing: "0",
          }}
        >
          {site.email}
        </a>
      </div>

      <div className="px-6 md:px-10 py-6 border-t border-line flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-subtle">
        <div>© {year} {site.name}</div>
        <div className="flex gap-6">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-foreground transition"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex gap-4">
          {site.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
