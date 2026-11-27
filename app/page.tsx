import { OsDesktop } from "@/components/os-desktop";
import { getReleases } from "@/lib/releases";

export default async function HomePage() {
  const releases = await getReleases();
  return <OsDesktop releases={releases} />;
}
