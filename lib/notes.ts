import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

export type NoteMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  readingMinutes: number;
};

const NOTES_DIR = path.join(process.cwd(), "content", "notes");

export async function getAllNotes(): Promise<NoteMeta[]> {
  const files = await fs.readdir(NOTES_DIR).catch(() => [] as string[]);
  const mdx = files.filter((f) => f.endsWith(".mdx"));

  const notes = await Promise.all(
    mdx.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = await fs.readFile(path.join(NOTES_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const stats = readingTime(content);
      return {
        slug,
        title: String(data.title ?? slug),
        date: String(data.date ?? ""),
        excerpt: String(data.excerpt ?? ""),
        tags: (data.tags as string[]) ?? [],
        readingMinutes: Math.max(1, Math.round(stats.minutes)),
      };
    })
  );

  return notes.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getNoteSlugs(): Promise<string[]> {
  const files = await fs.readdir(NOTES_DIR).catch(() => [] as string[]);
  return files.filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, ""));
}
