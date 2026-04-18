import { NextRequest } from "next/server";

// 本地占位图生成器：根据 seed/w/h 返回一张确定性的 SVG。
// 完全本地，无外部依赖，国内也能秒开。真实素材替换时，直接把对应的 cover 字段改成自己的图片路径即可。

// 不要设 force-static —— 查询参数 seed/w/h 需要动态解析。
// 缓存策略通过 Response 头的 max-age 实现即可（CDN 和浏览器都会缓存）。
export const dynamic = "force-dynamic";

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const palettes: [string, string, string][] = [
  ["#0a0a0a", "#1f1b16", "#c9a96e"], // 暖金夜
  ["#050810", "#0b1730", "#6684a8"], // 冷蓝
  ["#0c0a07", "#1c1410", "#8f6a4a"], // 焦土
  ["#070807", "#101614", "#5c7a73"], // 苔绿
  ["#0a0707", "#1e0f0f", "#a85f4a"], // 陈砖
  ["#070809", "#131619", "#7a8691"], // 铅灰
  ["#090706", "#1a120c", "#d1b48a"], // 米金
  ["#06070a", "#0f1018", "#5d5a7a"], // 暮紫
];

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const seed = searchParams.get("seed") ?? "sp";
  const w = Number(searchParams.get("w") ?? 1800);
  const h = Number(searchParams.get("h") ?? 1200);
  const label = searchParams.get("label") ?? "";

  const n = hash(seed);
  const [c0, c1, c2] = palettes[n % palettes.length];
  const angle = (n % 180) - 90;
  const rot = ((n >> 3) % 30) - 15;
  const shapeX = 10 + (n % 70);
  const shapeY = 10 + ((n >> 4) % 70);
  const shapeR = 20 + ((n >> 8) % 40);

  // 两种构图：大圆 + 条带，或者纯渐变
  const variant = n % 3;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 100 ${(h / w) * 100}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(${angle} 0.5 0.5)">
      <stop offset="0%" stop-color="${c0}"/>
      <stop offset="60%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}" stop-opacity="0.55"/>
    </linearGradient>
    <radialGradient id="v" cx="50%" cy="50%" r="75%">
      <stop offset="40%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.85"/>
    </radialGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${n % 100}"/>
      <feColorMatrix values="0 0 0 0 0.9  0 0 0 0 0.9  0 0 0 0 0.9  0 0 0 0.22 0"/>
      <feComposite in2="SourceGraphic" operator="in"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  ${
    variant === 0
      ? `<circle cx="${shapeX}" cy="${shapeY}" r="${shapeR}" fill="${c2}" opacity="0.12"/>`
      : variant === 1
      ? `<rect x="-20" y="${shapeY}" width="140" height="${shapeR / 4}" fill="${c2}" opacity="0.08" transform="rotate(${rot} ${shapeX} ${shapeY})"/>`
      : ``
  }
  <rect width="100%" height="100%" fill="url(#v)"/>
  <rect width="100%" height="100%" filter="url(#grain)"/>
  ${
    label
      ? `<text x="6" y="${(h / w) * 100 - 4}" font-family="serif" font-style="italic" font-size="3" fill="${c2}" opacity="0.45">${label}</text>`
      : ""
  }
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
