export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative w-full overflow-hidden border-y border-line py-6 my-20">
      <div className="flex gap-14 animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-display text-5xl md:text-7xl tracking-tight text-subtle"
          >
            {item}
            <span className="mx-10 text-foreground/40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
