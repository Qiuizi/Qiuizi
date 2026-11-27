import { ExternalLink } from "@/components/external-link";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="flex min-h-11 items-center justify-between gap-3 border-b border-slate-900/[0.08] bg-white/65 px-4 py-2 backdrop-blur-[20px] backdrop-saturate-[1.8] sm:px-6">
      <div className="flex min-w-0 items-baseline gap-3">
        <span className="shrink-0 text-sm font-bold tracking-tight">{site.name}</span>
        <span className="truncate text-[13px] text-muted">{site.tagline}</span>
      </div>
      <ExternalLink
        href={site.github}
        className="btn-tactile inline-flex h-9 shrink-0 items-center rounded-full bg-accent/10 px-3 text-[13px] font-medium text-accent"
      >
        GitHub @{site.name}
      </ExternalLink>
    </header>
  );
}
