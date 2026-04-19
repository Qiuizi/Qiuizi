import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line mt-32">
      <div className="px-6 md:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <div className="font-display text-4xl md:text-6xl leading-[1.15]">
            让我们
            <br />
            保持联系。
          </div>
          <a
            href={`mailto:${site.email}`}
            className="inline-block mt-6 text-sm underline underline-offset-4 decoration-subtle hover:decoration-foreground transition"
          >
            {site.email}
          </a>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-subtle mb-4">
            导航
          </div>
          <ul className="space-y-2 text-sm">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted hover:text-foreground transition"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-subtle mb-4">
            别处找到我
          </div>
          <ul className="space-y-2 text-sm">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted hover:text-foreground transition"
                >
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-6 md:px-10 py-6 border-t border-line flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-subtle font-mono">
        <div>© {year} {site.name} · All works herein are personal.</div>
        <div>{site.location}</div>
      </div>
    </footer>
  );
}
