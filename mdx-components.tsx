import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="font-display text-4xl md:text-5xl leading-tight mt-16 mb-6 tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-2xl md:text-3xl leading-snug mt-14 mb-4 tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-medium mt-10 mb-3">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="leading-[2] my-6 text-zinc-300">{children}</p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-accent underline underline-offset-4 decoration-accent/40 hover:decoration-accent transition-colors"
      >
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l border-accent pl-6 my-8 italic text-zinc-400 font-display text-xl">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-16 border-line" />,
    ul: ({ children }) => (
      <ul className="list-disc marker:text-accent pl-6 my-6 space-y-3 leading-[1.9] text-zinc-300">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal marker:text-accent pl-6 my-6 space-y-3 leading-[1.9] text-zinc-300">
        {children}
      </ol>
    ),
    img: ({ src, alt }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src as string}
        alt={alt}
        className="my-10 w-full rounded-[1.5rem]"
        loading="lazy"
      />
    ),
    code: ({ children }) => (
      <code className="font-mono text-[0.9em] bg-panel px-1.5 py-0.5 rounded">
        {children}
      </code>
    ),
    ...components,
  };
}
