export type Side = "red" | "black";
export type Point = { x: number; y: number };
export type Piece = { id: string; side: Side; label: string; x: number; y: number };

const BLACK_BACK = ["车", "马", "象", "士", "将", "士", "象", "马", "车"] as const;
const RED_BACK = ["车", "马", "相", "仕", "帅", "仕", "相", "马", "车"] as const;
const PAWN_FILES = [0, 2, 4, 6, 8] as const;

export function initialPieces(): Piece[] {
  const pieces: Piece[] = [];
  BLACK_BACK.forEach((label, x) => pieces.push({ id: `black-back-${x}`, side: "black", label, x, y: 0 }));
  pieces.push({ id: "black-cannon-1", side: "black", label: "炮", x: 1, y: 2 });
  pieces.push({ id: "black-cannon-7", side: "black", label: "炮", x: 7, y: 2 });
  PAWN_FILES.forEach((x, index) => pieces.push({ id: `black-pawn-${index}`, side: "black", label: "卒", x, y: 3 }));
  RED_BACK.forEach((label, x) => pieces.push({ id: `red-back-${x}`, side: "red", label, x, y: 9 }));
  pieces.push({ id: "red-cannon-1", side: "red", label: "炮", x: 1, y: 7 });
  pieces.push({ id: "red-cannon-7", side: "red", label: "炮", x: 7, y: 7 });
  PAWN_FILES.forEach((x, index) => pieces.push({ id: `red-pawn-${index}`, side: "red", label: "兵", x, y: 6 }));
  return pieces;
}

export function otherSide(side: Side): Side {
  return side === "red" ? "black" : "red";
}

function onBoard(x: number, y: number) {
  return x >= 0 && x <= 8 && y >= 0 && y <= 9;
}

function at(pieces: Piece[], x: number, y: number) {
  return pieces.find((piece) => piece.x === x && piece.y === y);
}

function inPalace(side: Side, x: number, y: number) {
  if (x < 3 || x > 5) return false;
  return side === "black" ? y >= 0 && y <= 2 : y >= 7 && y <= 9;
}

function generalsFace(pieces: Piece[]) {
  const red = pieces.find((piece) => piece.label === "帅");
  const black = pieces.find((piece) => piece.label === "将");
  if (!red || !black || red.x !== black.x) return false;
  const low = Math.min(red.y, black.y);
  const high = Math.max(red.y, black.y);
  return !pieces.some((piece) => piece.x === red.x && piece.y > low && piece.y < high);
}

export function playMove(pieces: Piece[], id: string, to: Point): Piece[] {
  return pieces
    .filter((piece) => piece.id === id || piece.x !== to.x || piece.y !== to.y)
    .map((piece) => (piece.id === id ? { ...piece, x: to.x, y: to.y } : piece));
}

/** Moves a piece may attempt, before checking whether its own general is left in check. */
export function pseudoMoves(pieces: Piece[], piece: Piece): Point[] {
  const { x, y, side, label } = piece;
  const moves: Point[] = [];
  const add = (tx: number, ty: number) => {
    if (!onBoard(tx, ty)) return;
    const occupier = at(pieces, tx, ty);
    if (occupier && occupier.side === side) return;
    moves.push({ x: tx, y: ty });
  };

  if (label === "帅" || label === "将") {
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const tx = x + dx;
      const ty = y + dy;
      if (inPalace(side, tx, ty)) add(tx, ty);
    }
    return moves;
  }

  if (label === "仕" || label === "士") {
    for (const [dx, dy] of [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]) {
      const tx = x + dx;
      const ty = y + dy;
      if (inPalace(side, tx, ty)) add(tx, ty);
    }
    return moves;
  }

  if (label === "相" || label === "象") {
    for (const [dx, dy] of [
      [2, 2],
      [2, -2],
      [-2, 2],
      [-2, -2],
    ]) {
      const tx = x + dx;
      const ty = y + dy;
      if (!onBoard(tx, ty)) continue;
      if (side === "red" && ty < 5) continue;
      if (side === "black" && ty > 4) continue;
      if (at(pieces, x + dx / 2, y + dy / 2)) continue;
      add(tx, ty);
    }
    return moves;
  }

  if (label === "马") {
    const jumps = [
      { dx: 1, dy: 2, lx: 0, ly: 1 },
      { dx: -1, dy: 2, lx: 0, ly: 1 },
      { dx: 1, dy: -2, lx: 0, ly: -1 },
      { dx: -1, dy: -2, lx: 0, ly: -1 },
      { dx: 2, dy: 1, lx: 1, ly: 0 },
      { dx: 2, dy: -1, lx: 1, ly: 0 },
      { dx: -2, dy: 1, lx: -1, ly: 0 },
      { dx: -2, dy: -1, lx: -1, ly: 0 },
    ];
    for (const jump of jumps) {
      if (!onBoard(x + jump.lx, y + jump.ly) || at(pieces, x + jump.lx, y + jump.ly)) continue;
      add(x + jump.dx, y + jump.dy);
    }
    return moves;
  }

  const rays = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ] as const;

  if (label === "车") {
    for (const [dx, dy] of rays) {
      let tx = x + dx;
      let ty = y + dy;
      while (onBoard(tx, ty)) {
        const occupier = at(pieces, tx, ty);
        if (!occupier) moves.push({ x: tx, y: ty });
        else {
          if (occupier.side !== side) moves.push({ x: tx, y: ty });
          break;
        }
        tx += dx;
        ty += dy;
      }
    }
    return moves;
  }

  if (label === "炮") {
    for (const [dx, dy] of rays) {
      let tx = x + dx;
      let ty = y + dy;
      let screen = false;
      while (onBoard(tx, ty)) {
        const occupier = at(pieces, tx, ty);
        if (!screen) {
          if (!occupier) moves.push({ x: tx, y: ty });
          else screen = true;
        } else if (occupier) {
          if (occupier.side !== side) moves.push({ x: tx, y: ty });
          break;
        }
        tx += dx;
        ty += dy;
      }
    }
    return moves;
  }

  const forward = side === "red" ? -1 : 1;
  const crossed = side === "red" ? y <= 4 : y >= 5;
  add(x, y + forward);
  if (crossed) {
    add(x - 1, y);
    add(x + 1, y);
  }
  return moves;
}

export function inCheck(pieces: Piece[], side: Side) {
  if (generalsFace(pieces)) return true;
  const general = pieces.find((piece) => piece.side === side && (piece.label === "帅" || piece.label === "将"));
  if (!general) return true;
  const enemy = otherSide(side);
  return pieces.some(
    (piece) => piece.side === enemy && pseudoMoves(pieces, piece).some((target) => target.x === general.x && target.y === general.y),
  );
}

export function legalMoves(pieces: Piece[], piece: Piece): Point[] {
  return pseudoMoves(pieces, piece).filter((target) => !inCheck(playMove(pieces, piece.id, target), piece.side));
}

export function sideHasMove(pieces: Piece[], side: Side) {
  return pieces.some((piece) => piece.side === side && legalMoves(pieces, piece).length > 0);
}

export function positionStatus(pieces: Piece[], turn: Side) {
  const stuck = !sideHasMove(pieces, turn);
  if (stuck) return turn === "red" ? "黑方胜" : "红方胜";
  if (inCheck(pieces, turn)) return "将军！";
  return turn === "red" ? "红方走棋" : "黑方走棋";
}
