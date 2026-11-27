"use client";

import { useRef, useState } from "react";
import { ExternalLink } from "@/components/external-link";

type Side = "red" | "black";
type Point = { x: number; y: number };
type Piece = { id: string; side: Side; label: string; x: number; y: number };

const FILES = 9;
const RANKS = 10;
const CELL = 48;
const PAD = 34;
const RADIUS = 20;
const BOARD_W = PAD * 2 + (FILES - 1) * CELL;
const BOARD_H = PAD * 2 + (RANKS - 1) * CELL;
const BLACK_BACK = ["车", "马", "象", "士", "将", "士", "象", "马", "车"] as const;
const RED_BACK = ["车", "马", "相", "仕", "帅", "仕", "相", "马", "车"] as const;
const PAWN_FILES = [0, 2, 4, 6, 8] as const;
const STARS: Point[] = [
  { x: 1, y: 2 },
  { x: 7, y: 2 },
  { x: 0, y: 3 },
  { x: 2, y: 3 },
  { x: 4, y: 3 },
  { x: 6, y: 3 },
  { x: 8, y: 3 },
  { x: 0, y: 6 },
  { x: 2, y: 6 },
  { x: 4, y: 6 },
  { x: 6, y: 6 },
  { x: 8, y: 6 },
  { x: 1, y: 7 },
  { x: 7, y: 7 },
];

function gx(x: number) {
  return PAD + x * CELL;
}

function gy(y: number) {
  return PAD + y * CELL;
}

function initialPieces(): Piece[] {
  const pieces: Piece[] = [];
  BLACK_BACK.forEach((label, x) => {
    pieces.push({ id: `black-back-${x}`, side: "black", label, x, y: 0 });
  });
  pieces.push({ id: "black-cannon-1", side: "black", label: "炮", x: 1, y: 2 });
  pieces.push({ id: "black-cannon-7", side: "black", label: "炮", x: 7, y: 2 });
  PAWN_FILES.forEach((x, index) => {
    pieces.push({ id: `black-pawn-${index}`, side: "black", label: "卒", x, y: 3 });
  });
  RED_BACK.forEach((label, x) => {
    pieces.push({ id: `red-back-${x}`, side: "red", label, x, y: 9 });
  });
  pieces.push({ id: "red-cannon-1", side: "red", label: "炮", x: 1, y: 7 });
  pieces.push({ id: "red-cannon-7", side: "red", label: "炮", x: 7, y: 7 });
  PAWN_FILES.forEach((x, index) => {
    pieces.push({ id: `red-pawn-${index}`, side: "red", label: "兵", x, y: 6 });
  });
  return pieces;
}

function pieceName(piece: Piece) {
  return `${piece.side === "red" ? "红" : "黑"}${piece.label}`;
}

function Star({ x, y }: Point) {
  const cx = gx(x);
  const cy = gy(y);
  const gap = 3.6;
  const len = 8;
  const corners: Array<[number, number]> = [];
  if (x > 0 && y > 0) corners.push([-1, -1]);
  if (x < 8 && y > 0) corners.push([1, -1]);
  if (x > 0 && y < 9) corners.push([-1, 1]);
  if (x < 8 && y < 9) corners.push([1, 1]);
  return (
    <g stroke="rgba(214, 176, 122, 0.72)" strokeWidth="1.2" fill="none" pointerEvents="none">
      {corners.map(([sx, sy]) => (
        <polyline
          key={`${sx}${sy}`}
          points={`${cx + sx * (gap + len)},${cy + sy * gap} ${cx + sx * gap},${cy + sy * gap} ${cx + sx * gap},${cy + sy * (gap + len)}`}
        />
      ))}
    </g>
  );
}

export function XiangqiBoard({ onInteract }: { onInteract?: () => void }) {
  const [pieces, setPieces] = useState<Piece[]>(initialPieces);
  const [selected, setSelected] = useState<string | null>(null);
  const [hover, setHover] = useState<Point | null>(null);
  const [last, setLast] = useState<{ from: Point; to: Point } | null>(null);
  const [history, setHistory] = useState<Piece[][]>([]);
  const [status, setStatus] = useState("点选或拖动任意棋子");
  const [drag, setDrag] = useState<{ id: string; label: string; side: Side; x: number; y: number; size: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ id: string; x: number; y: number; moved: boolean } | null>(null);

  function locate(event: { clientX: number; clientY: number }) {
    const svg = svgRef.current;
    if (!svg) return null;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;
    const local = point.matrixTransform(matrix.inverse());
    const x = Math.round((local.x - PAD) / CELL);
    const y = Math.round((local.y - PAD) / CELL);
    if (x < 0 || x > 8 || y < 0 || y > 9) return null;
    if (Math.hypot(local.x - gx(x), local.y - gy(y)) > CELL * 0.68) return null;
    return { x, y };
  }

  function applyMove(id: string, to: Point) {
    const current = pieces;
    const moving = current.find((piece) => piece.id === id);
    if (!moving) return;
    if (moving.x === to.x && moving.y === to.y) {
      setSelected(id);
      setStatus(`${pieceName(moving)} · 再点交叉点落子`);
      return;
    }
    const captured = current.find((piece) => piece.id !== id && piece.x === to.x && piece.y === to.y) ?? null;
    const next = current
      .filter((piece) => piece.id === id || piece.x !== to.x || piece.y !== to.y)
      .map((piece) => (piece.id === id ? { ...piece, x: to.x, y: to.y } : piece));
    setHistory((stack) => [...stack, current]);
    setPieces(next);
    setLast({ from: { x: moving.x, y: moving.y }, to });
    setSelected(null);
    setStatus(captured ? `${pieceName(moving)} 吃 ${pieceName(captured)}` : `${pieceName(moving)} 落到 ${to.x + 1} 路`);
  }

  function onPointerDown(event: React.PointerEvent<SVGSVGElement>) {
    event.stopPropagation();
    event.preventDefault();
    onInteract?.();
    const svg = svgRef.current;
    if (!svg) return;
    svg.setPointerCapture(event.pointerId);
    const point = locate(event);
    const hit = point ? pieces.find((piece) => piece.x === point.x && piece.y === point.y) : undefined;
    dragRef.current = { id: hit?.id ?? "", x: event.clientX, y: event.clientY, moved: false };
  }

  function onPointerMove(event: React.PointerEvent<SVGSVGElement>) {
    const session = dragRef.current;
    const point = locate(event);
    if (session?.id || selected) setHover(point);
    else setHover(null);
    if (!session?.id) return;
    const dx = event.clientX - session.x;
    const dy = event.clientY - session.y;
    if (!session.moved && dx * dx + dy * dy < 16) return;
    session.moved = true;
    const svg = svgRef.current;
    const matrix = svg?.getScreenCTM();
    const size = matrix ? Math.hypot(matrix.a, matrix.b) * RADIUS * 2 : 40;
    const piece = pieces.find((item) => item.id === session.id);
    if (!piece) return;
    setDrag({ id: piece.id, label: piece.label, side: piece.side, x: event.clientX, y: event.clientY, size });
    setHover(point);
  }

  function finishPointer(event: React.PointerEvent<SVGSVGElement>) {
    const session = dragRef.current;
    dragRef.current = null;
    setDrag(null);
    if (!session) return;
    const point = locate(event);
    if (session.moved && session.id) {
      if (point) applyMove(session.id, point);
      else {
        setSelected(session.id);
        setStatus("未落在交叉点");
      }
      setHover(null);
      return;
    }
    if (session.id) {
      const selectedId = selected;
      if (selectedId && selectedId !== session.id) {
        const target = pieces.find((piece) => piece.id === session.id);
        if (target) applyMove(selectedId, { x: target.x, y: target.y });
      } else if (selectedId === session.id) {
        setSelected(null);
        setStatus("点选或拖动任意棋子");
      } else {
        setSelected(session.id);
        const piece = pieces.find((item) => item.id === session.id);
        setStatus(piece ? `${pieceName(piece)} · 再点交叉点落子` : "点选或拖动任意棋子");
      }
      return;
    }
    if (selected && point) {
      applyMove(selected, point);
      setHover(null);
      return;
    }
    setSelected(null);
    setHover(null);
    setStatus("点选或拖动任意棋子");
  }

  function undo() {
    const previous = history[history.length - 1];
    if (!previous) return;
    setHistory((stack) => stack.slice(0, -1));
    setPieces(previous);
    setSelected(null);
    setLast(null);
    setHover(null);
    setStatus("已悔一步");
  }

  function reset() {
    dragRef.current = null;
    setPieces(initialPieces());
    setHistory([]);
    setSelected(null);
    setLast(null);
    setHover(null);
    setDrag(null);
    setStatus("已重摆开局");
  }

  const riverY = (gy(4) + gy(5)) / 2;

  return (
    <div className="xq-wrap">
      <div className={`xq-board${drag ? " is-dragging" : ""}`}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${BOARD_W} ${BOARD_H}`}
          style={{ fontFamily: "var(--font-sans)" }}
          role="application"
          aria-label="中国象棋棋盘，可自由移动任意棋子"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishPointer}
          onPointerCancel={finishPointer}
        >
          <defs>
            <radialGradient id="xq-red" cx="34%" cy="30%" r="78%">
              <stop offset="0" stopColor="#a8454c" />
              <stop offset="1" stopColor="#5a141b" />
            </radialGradient>
            <radialGradient id="xq-black" cx="34%" cy="30%" r="78%">
              <stop offset="0" stopColor="#323a48" />
              <stop offset="1" stopColor="#10141c" />
            </radialGradient>
            <linearGradient id="xq-wood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2c231b" />
              <stop offset="1" stopColor="#120e0b" />
            </linearGradient>
          </defs>
          <rect width={BOARD_W} height={BOARD_H} fill="url(#xq-wood)" />
          <rect x={gx(0) - 12} y={gy(0) - 12} width={gx(8) - gx(0) + 24} height={gy(9) - gy(0) + 24} rx="3" fill="none" stroke="rgba(214,176,122,0.38)" strokeWidth="1.3" />
          {Array.from({ length: RANKS }, (_, rank) => (
            <line key={`rank-${rank}`} x1={gx(0)} y1={gy(rank)} x2={gx(8)} y2={gy(rank)} stroke="rgba(214,176,122,0.78)" strokeWidth="1.15" />
          ))}
          {Array.from({ length: FILES }, (_, file) =>
            file === 0 || file === 8 ? (
              <line key={`file-${file}`} x1={gx(file)} y1={gy(0)} x2={gx(file)} y2={gy(9)} stroke="rgba(214,176,122,0.78)" strokeWidth="1.15" />
            ) : (
              <g key={`file-${file}`}>
                <line x1={gx(file)} y1={gy(0)} x2={gx(file)} y2={gy(4)} stroke="rgba(214,176,122,0.78)" strokeWidth="1.15" />
                <line x1={gx(file)} y1={gy(5)} x2={gx(file)} y2={gy(9)} stroke="rgba(214,176,122,0.78)" strokeWidth="1.15" />
              </g>
            ),
          )}
          <line x1={gx(3)} y1={gy(0)} x2={gx(5)} y2={gy(2)} stroke="rgba(214,176,122,0.78)" strokeWidth="1.15" />
          <line x1={gx(5)} y1={gy(0)} x2={gx(3)} y2={gy(2)} stroke="rgba(214,176,122,0.78)" strokeWidth="1.15" />
          <line x1={gx(3)} y1={gy(7)} x2={gx(5)} y2={gy(9)} stroke="rgba(214,176,122,0.78)" strokeWidth="1.15" />
          <line x1={gx(5)} y1={gy(7)} x2={gx(3)} y2={gy(9)} stroke="rgba(214,176,122,0.78)" strokeWidth="1.15" />
          {STARS.map((star) => (
            <Star key={`${star.x}-${star.y}`} x={star.x} y={star.y} />
          ))}
          <text x={gx(2)} y={riverY} textAnchor="middle" dominantBaseline="central" fill="rgba(230,198,150,0.72)" fontSize="20" fontWeight="700" style={{ letterSpacing: "0.42em" }}>
            楚河
          </text>
          <text x={gx(6)} y={riverY} textAnchor="middle" dominantBaseline="central" fill="rgba(230,198,150,0.72)" fontSize="20" fontWeight="700" style={{ letterSpacing: "0.42em" }}>
            汉界
          </text>
          {last ? (
            <g pointerEvents="none">
              <circle cx={gx(last.from.x)} cy={gy(last.from.y)} r="7" fill="none" stroke="rgba(226,190,136,0.55)" strokeWidth="1.4" strokeDasharray="2.2 2.2" />
              <circle cx={gx(last.to.x)} cy={gy(last.to.y)} r={RADIUS + 3} fill="rgba(226,190,136,0.13)" stroke="rgba(236,208,160,0.85)" strokeWidth="1.5" />
            </g>
          ) : null}
          {hover ? (
            <circle cx={gx(hover.x)} cy={gy(hover.y)} r={RADIUS + 2} fill="rgba(226,190,136,0.16)" stroke="rgba(244,214,168,0.9)" strokeWidth="1.4" pointerEvents="none" />
          ) : null}
          {pieces.map((piece) => {
            const dragging = drag?.id === piece.id;
            return (
              <g
                key={piece.id}
                className="xq-piece"
                data-x={piece.x}
                data-y={piece.y}
                data-side={piece.side}
                data-label={piece.label}
                transform={`translate(${gx(piece.x)} ${gy(piece.y)})`}
                opacity={dragging ? 0.28 : 1}
                aria-label={pieceName(piece)}
                aria-pressed={selected === piece.id}
              >
                <circle cy="1.6" r={RADIUS} fill="rgba(0,0,0,0.38)" />
                <circle r={RADIUS} fill={piece.side === "red" ? "url(#xq-red)" : "url(#xq-black)"} stroke={piece.side === "red" ? "#f0c4b6" : "#d5deea"} strokeWidth="1.6" />
                <text textAnchor="middle" dominantBaseline="central" fill={piece.side === "red" ? "#fff4ef" : "#f5f7fb"} fontSize="18" fontWeight="700" style={{ fontFamily: "var(--font-sans)" }}>
                  {piece.label}
                </text>
                {selected === piece.id ? <circle r={RADIUS + 3.5} fill="none" stroke="#f6e6cc" strokeWidth="1.7" /> : null}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="xq-side">
        <p className="xq-log" aria-live="polite">{status}</p>
        <div className="xq-actions">
          <button type="button" className="w-chip" onClick={undo} disabled={history.length === 0}>
            悔棋
          </button>
          <button type="button" className="w-chip" onClick={reset}>
            重摆
          </button>
          <ExternalLink className="w-link w-ghost" href="https://github.com/Qiuizi/XiangqiStudio">GitHub ↗</ExternalLink>
        </div>
      </div>
      {drag ? (
        <div className={`xq-ghost ${drag.side}`} style={{ left: drag.x, top: drag.y, width: drag.size, height: drag.size, fontSize: drag.size * 0.42 }}>
          {drag.label}
        </div>
      ) : null}
    </div>
  );
}
