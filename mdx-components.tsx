import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="font-display text-4xl md:text-5xl leading-tight mt-16 mb-6">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-2xl md:text-3xl leading-snug mt-14 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-medium mt-10 mb-3">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="leading-[2] my-6 text-stone-300">{children}</p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="underline underline-offset-4 decoration-stone-600 hover:decoration-stone-200 transition-colors"
      >
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l border-stone-700 pl-6 my-8 italic text-stone-400 font-display text-xl">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-16 border-stone-800" />,
    ul: ({ children }) => (
      <ul className="list-disc marker:text-stone-600 pl-6 my-6 space-y-3 leading-[1.9] text-stone-300">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal marker:text-stone-600 pl-6 my-6 space-y-3 leading-[1.9] text-stone-300">
        {children}
      </ol>
    ),
    img: ({ src, alt }) => (
      <img
        src={src as string}
        alt={alt}
        className="my-10 w-full rounded-sm"
        loading="lazy"
      />
    ),
    code: ({ children }) => (
      <code className="font-mono text-[0.9em] bg-stone-900 px-1.5 py-0.5 rounded">
        {children}
      </code>
    ),
    ...components,
  };
}
