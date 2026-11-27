import { identityLine, site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto w-full max-w-[1040px] px-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-slate-900/[0.08] py-4 text-[13px] text-muted">
        <p>© {year} {site.name}</p>
        <p>{identityLine}</p>
      </div>
    </footer>
  );
}
