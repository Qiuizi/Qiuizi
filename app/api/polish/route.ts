import { NextResponse } from "next/server";

// 诗意润色：有 GEMINI_API_KEY 时调 Gemini，否则直接回显原文。
// Gemini prompt 与 demo 一致。
export async function POST(req: Request) {
  const { text } = await req.json().catch(() => ({ text: "" }));
  const original = typeof text === "string" ? text.trim() : "";
  if (!original) return NextResponse.json({ polished: "" });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ polished: original, note: "no-api-key" });
  }

  const prompt = `你是一个高级极简主义艺术展的AI策展人。访客留下了一句简单的留言，请将其重写为一句富有诗意、充满哲理、文笔优雅的中文留言（保留正常标点符号，语气真诚自然，适合作为艺术展留言）。字数不要太长。\n\n原始留言：${original}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data = await res.json();
    const polished: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || original;
    return NextResponse.json({ polished });
  } catch {
    return NextResponse.json({ polished: original, note: "upstream-error" });
  }
}
