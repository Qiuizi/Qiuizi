import { ExternalLink } from "@/components/external-link";
import { identityLine, site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-900/[0.08] bg-white/65 px-4 py-2.5 backdrop-blur-[20px] backdrop-saturate-[1.8] sm:flex sm:min-h-11 sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-1">
      <div className="flex items-center justify-between gap-3 sm:min-w-0 sm:flex-1 sm:justify-start sm:gap-4">
        <span className="shrink-0 text-sm font-bold tracking-tight">{site.name}</span>
        <ExternalLink
          href={site.github}
          className="inline-flex h-9 shrink-0 items-center rounded-full bg-accent/10 px-2.5 text-[13px] font-medium text-accent sm:hidden"
        >
          GitHub @{site.name} ↗
        </ExternalLink>
        <span className="hidden truncate text-[13px] text-muted sm:inline">{identityLine}</span>
      </div>
      <p className="mt-1 text-[12.5px] leading-5 text-muted sm:hidden">{identityLine}</p>
      <ExternalLink
        href={site.github}
        className="hidden h-9 shrink-0 items-center rounded-full bg-accent/10 px-3 text-[13px] font-medium text-accent sm:inline-flex"
      >
        GitHub @{site.name} ↗
      </ExternalLink>
    </header>
  );
}
