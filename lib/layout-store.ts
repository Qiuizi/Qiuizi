import { windowOrder, type WinId } from "@/data/os";

export const LAYOUT_KEY = "qiuizi-os-layout";
export const MOTION_KEY = "qiuizi-os-motion";

export type StoredWindow = {
  x: number;
  y: number;
  w: number;
  h: number;
  hidden: boolean;
  max: boolean;
  z: number;
};

export type StoredLayout = {
  v: 1;
  focused: WinId;
  windows: Partial<Record<WinId, StoredWindow>>;
};

function isWinId(value: unknown): value is WinId {
  return typeof value === "string" && (windowOrder as readonly string[]).includes(value);
}

export function sanitizeWindow(value: unknown): StoredWindow | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<StoredWindow>;
  const nums = [item.x, item.y, item.w, item.h, item.z];
  if (!nums.every((n) => typeof n === "number" && Number.isFinite(n))) return null;
  if (typeof item.hidden !== "boolean" || typeof item.max !== "boolean") return null;
  return {
    x: item.x as number,
    y: item.y as number,
    w: item.w as number,
    h: item.h as number,
    hidden: item.hidden,
    max: item.max,
    z: item.z as number,
  };
}

export function readLayout(): StoredLayout | null {
  try {
    const raw = localStorage.getItem(LAYOUT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<StoredLayout>;
    if (data.v !== 1 || !data.windows || typeof data.windows !== "object") return null;
    return {
      v: 1,
      focused: isWinId(data.focused) ? data.focused : "welcome",
      windows: data.windows,
    };
  } catch {
    return null;
  }
}

export function writeLayout(layout: StoredLayout) {
  try {
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout));
  } catch {
    /* Ignore private-mode and quota failures. */
  }
}

export function readMotion(): boolean | null {
  try {
    const value = localStorage.getItem(MOTION_KEY);
    if (value === "0") return false;
    if (value === "1") return true;
    return null;
  } catch {
    return null;
  }
}

export function writeMotion(enabled: boolean) {
  try {
    localStorage.setItem(MOTION_KEY, enabled ? "1" : "0");
  } catch {
    /* Ignore private-mode and quota failures. */
  }
}
