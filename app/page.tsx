import { Showcase } from "@/components/showcase";
import { WorksGrid } from "@/components/works-grid";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-[1040px] px-4 pt-[26px] sm:px-6">
      <Showcase />
      <WorksGrid />
    </main>
  );
}
