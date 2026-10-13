import type { ExportOptions, Position, WatermarkSettings } from '../types';
import { normalizeHex } from '../core/watermark';
import { TEXT_MAX_LENGTH } from './constants';

const POSITIONS: Position[] = ['tl', 'tc', 'tr', 'ml', 'mc', 'mr', 'bl', 'bc', 'br'];

const num = (v: unknown, min: number, max: number) =>
  typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max ? v : undefined;

/** 过滤本地存储中的脏数据，只保留合法字段 */
export function sanitizeSettings(v: Partial<WatermarkSettings>): Partial<WatermarkSettings> {
  const out: Partial<WatermarkSettings> = {};
  if (typeof v.text === 'string') out.text = v.text.slice(0, TEXT_MAX_LENGTH);
  const color = typeof v.color === 'string' ? normalizeHex(v.color) : null;
  if (color) out.color = color;
  out.alpha = num(v.alpha, 0.05, 1);
  out.angle = num(v.angle, -90, 90);
  out.space = num(v.space, 1.5, 8);
  out.size = num(v.size, 0.5, 3);
  if (v.mode === 'tile' || v.mode === 'single') out.mode = v.mode;
  if (typeof v.stagger === 'boolean') out.stagger = v.stagger;
  if (v.position && POSITIONS.includes(v.position)) out.position = v.position;
  return Object.fromEntries(Object.entries(out).filter(([, val]) => val !== undefined));
}

export function sanitizeExport(v: Partial<ExportOptions>): Partial<ExportOptions> {
  const out: Partial<ExportOptions> = {};
  if (v.format && ['auto', 'jpeg', 'png', 'webp'].includes(v.format)) out.format = v.format;
  const q = num(v.quality, 0.6, 1);
  if (q !== undefined) out.quality = q;
  return out;
}
