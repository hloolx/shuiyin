import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function uid(): string {
  return crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

const ua = typeof navigator === 'undefined' ? '' : navigator.userAgent.toLowerCase();

export const isWeChat = ua.includes('micromessenger');

export const isIOS =
  /iphone|ipad|ipod/.test(ua) ||
  (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform);

export function vibrate(ms = 8) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    // 部分浏览器在无用户手势时会抛错，忽略即可
  }
}

/** 读取 localStorage 中的 JSON，失败时返回 null */
export function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 隐私模式或存储已满时静默失败
  }
}
