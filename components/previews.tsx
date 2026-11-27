"use client";

import { useEffect, useRef, useState } from "react";
import type { FlagshipId } from "@/data/showcase";

const previewShell =
  "relative flex flex-col justify-center gap-3.5 rounded-[18px] border border-slate-900/[0.08] bg-[linear-gradient(145deg,#f8fafc_0%,#eef2ff_100%)] p-[18px] sm:p-[22px] lg:min-h-[290px]";

const previewCard =
  "rounded-[14px] border border-slate-900/[0.08] bg-white px-4 py-3.5 shadow-[0_4px_14px_rgba(15,23,42,0.04)]";

function chip(on = false) {
  return `btn-tactile inline-flex h-9 items-center rounded-full border px-3 text-[12.5px] font-semibold ${
    on ? "border-transparent bg-ink text-white" : "border-slate-900/[0.08] bg-white text-muted"
  }`;
}

type IslandMode = "focus" | "media" | "alert";
type NoteLayer = "current" | "prior" | "synthesis";

const islandModes: { id: IslandMode; label: string; title: string; detail: string }[] = [
  { id: "focus", label: "专注计时", title: "专注 25:00", detail: "停在屏幕顶部，计时不打断当前窗口。" },
  { id: "media", label: "媒体播放", title: "媒体播放中", detail: "抬眼即可暂停或切到下一段。" },
  { id: "alert", label: "轻提醒", title: "一条轻提醒", detail: "不抢焦点的短提示，看完即收。" },
];

const noteLayers: { id: NoteLayer; label: string; body: string }[] = [
  { id: "current", label: "本课要点", body: "这一讲本身讲了什么，收成可以直接回顾的要点。" },
  { id: "prior", label: "关联前序", body: "和前面课次怎么接上，标出重复出现的概念。" },
  { id: "synthesis", label: "综合理解", body: "把本课和前序放在一起后，形成的一层理解。" },
];

const analysisSteps = ["抓取资料", "转写录音", "清洗整理", "单课分析"];

const unpackRows = [
  { nest: "外层压缩包", flat: "图片" },
  { nest: "内层压缩包", flat: "文档" },
  { nest: "再套一层", flat: "视频" },
];

type Piece = { id: string; char: string; tone: "red" | "black"; col: number };

const startPieces: Piece[] = [
  { id: "shuai", char: "帥", tone: "red", col: 0 },
  { id: "pao", char: "炮", tone: "red", col: 1 },
  { id: "che", char: "車", tone: "black", col: 3 },
  { id: "ma", char: "馬", tone: "black", col: 4 },
];

export function StagePreview({ id }: { id: FlagshipId }) {
  return (
    <div className={previewShell}>
      <p className="text-[12px] font-semibold tracking-wide text-muted">点击演示</p>
      {id === "qisland" ? <QislandPreview /> : null}
      {id === "coursedesk" ? <CourseDeskPreview /> : null}
      {id === "deepunpack" ? <DeepUnpackPreview /> : null}
      {id === "xiangqi" ? <XiangqiPreview /> : null}
    </div>
  );
}

function QislandPreview() {
  const [mode, setMode] = useState<IslandMode>("focus");
  const current = islandModes.find((item) => item.id === mode) ?? islandModes[0];

  function cycle() {
    const index = islandModes.findIndex((item) => item.id === mode);
    setMode(islandModes[(index + 1) % islandModes.length].id);
  }

  return (
    <>
      <button type="button" onClick={cycle} className="island-pill btn-tactile" aria-label={`灵动岛当前为${current.label}，点击切换形态`}>
        <span key={current.id} className="stage-in block min-w-0 text-left">
          <span className="block text-[13.5px] font-semibold">{current.title}</span>
          <span className="mt-0.5 block text-[12px] text-white/70">{current.detail}</span>
        </span>
        <span className="shrink-0 font-mono text-xs text-[#60a5fa]">v4.3.0</span>
      </button>
      <div role="radiogroup" aria-label="灵动岛形态" className="flex flex-wrap gap-2">
        {islandModes.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={item.id === mode}
            onClick={() => setMode(item.id)}
            className={chip(item.id === mode)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}

function CourseDeskPreview() {
  const [layer, setLayer] = useState<NoteLayer>("current");
  const [filled, setFilled] = useState(4);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef(0);
  const note = noteLayers.find((item) => item.id === layer) ?? noteLayers[0];

  useEffect(() => () => window.clearInterval(timerRef.current), []);

  function play() {
    window.clearInterval(timerRef.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFilled(4);
      setPlaying(false);
      return;
    }
    setPlaying(true);
    setFilled(0);
    let step = 0;
    timerRef.current = window.setInterval(() => {
      step += 1;
      setFilled(step);
      if (step >= 4) {
        window.clearInterval(timerRef.current);
        setPlaying(false);
      }
    }, 220);
  }

  return (
    <>
      <div className={previewCard}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13.5px] font-semibold">四段分析</p>
          <button type="button" onClick={play} disabled={playing} className={`${chip()} disabled:opacity-60`}>
            {playing ? "进行中…" : "再跑一遍"}
          </button>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {analysisSteps.map((step, index) => (
            <div key={step}>
              <div className="h-2 overflow-hidden rounded-full bg-slate-900/[0.08]">
                <span
                  className="block h-full origin-left bg-accent"
                  style={{ transform: `scaleX(${index < filled ? 1 : 0})`, transition: "transform 200ms cubic-bezier(0.16, 1, 0.3, 1)" }}
                />
              </div>
              <p className="mt-1.5 text-[11px] leading-4 text-muted">{step}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={previewCard}>
        <div role="radiogroup" aria-label="三层笔记" className="flex flex-wrap gap-2">
          {noteLayers.map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={item.id === layer}
              onClick={() => setLayer(item.id)}
              className={chip(item.id === layer)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p key={note.id} className="stage-in mt-3 text-[13px] leading-relaxed text-ink" aria-live="polite">
          {note.body}
        </p>
      </div>
    </>
  );
}

function DeepUnpackPreview() {
  const [flat, setFlat] = useState(false);
  return (
    <div className={previewCard}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13.5px] font-semibold">{flat ? "已展平" : "嵌套压缩包"}</p>
        <button type="button" onClick={() => setFlat((value) => !value)} className={chip(!flat)}>
          {flat ? "恢复套娃" : "一键展平"}
        </button>
      </div>
      <ul className="mt-3" aria-live="polite">
        {unpackRows.map((row, index) => (
          <li
            key={row.nest}
            className="flex h-8 items-center rounded-lg bg-surface px-3 text-[13px]"
            style={{
              marginTop: index === 0 ? 0 : 6,
              transform: flat ? "translate3d(0, 0, 0)" : `translate3d(${index * 16}px, 0, 0)`,
              transition: "transform 240ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {flat ? row.flat : row.nest}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[12px] leading-relaxed text-muted">交互演示，不会读取本机文件。</p>
    </div>
  );
}

function XiangqiPreview() {
  const [pieces, setPieces] = useState<Piece[]>(() => startPieces.map((piece) => ({ ...piece })));
  const [selected, setSelected] = useState<string | null>(null);

  function onColumn(col: number) {
    const occupant = pieces.find((piece) => piece.col === col);
    if (occupant) {
      setSelected(occupant.id);
      return;
    }
    if (!selected) return;
    setPieces((current) => current.map((piece) => (piece.id === selected ? { ...piece, col } : piece)));
    setSelected(null);
  }

  return (
    <div className="rounded-[14px] border border-[#e2d5be] bg-[#fbf7ef] px-4 py-4 text-center">
      <p className="mb-3 text-lg font-bold tracking-[0.4em] text-[#8a6b43]">楚河 汉界</p>
      <div className="relative mx-auto h-12 w-[240px]" role="group" aria-label="微缩棋盘">
        {[0, 1, 2, 3, 4].map((col) =>
          pieces.some((piece) => piece.col === col) ? null : (
            <button
              key={`empty-${col}`}
              type="button"
              onClick={() => onColumn(col)}
              aria-label={`空位 ${col + 1}`}
              className="btn-tactile absolute top-0 grid size-11 place-items-center rounded-full border border-dashed border-[#e2d5be]"
              style={{ transform: `translate3d(${col * 48}px, 0, 0)` }}
            />
          ),
        )}
        {pieces.map((piece) => (
          <button
            key={piece.id}
            type="button"
            onClick={() => onColumn(piece.col)}
            aria-pressed={piece.id === selected}
            aria-label={`${piece.char}${piece.id === selected ? "，已选中" : ""}`}
            className={`btn-tactile absolute top-0 z-[1] grid size-11 place-items-center rounded-full border-[1.5px] bg-white text-base font-bold ${
              piece.tone === "red" ? "border-[#c0281c] text-[#c0281c]" : "border-[#1d1d1f] text-[#1d1d1f]"
            } ${piece.id === selected ? "piece-selected" : ""}`}
            style={{
              transform: `translate3d(${piece.col * 48}px, 0, 0)`,
              transition: "transform 240ms cubic-bezier(0.34, 1.3, 0.64, 1)",
            }}
          >
            {piece.char}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-left text-[12px] leading-relaxed text-[#8a6b43]">点选棋子，再点空位走一步。</p>
        <button
          type="button"
          className={chip()}
          onClick={() => {
            setPieces(startPieces.map((piece) => ({ ...piece })));
            setSelected(null);
          }}
        >
          重新摆子
        </button>
      </div>
    </div>
  );
}
