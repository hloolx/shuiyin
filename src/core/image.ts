import { isIOS } from '../lib/utils';

export type ImageSource = ImageBitmap | HTMLImageElement;

export interface Decoded {
  source: ImageSource;
  width: number;
  height: number;
}

/** iOS Safari 单个 canvas 面积上限约 1677 万像素，超出会静默画出空白图 */
export const MAX_CANVAS_PIXELS = isIOS ? 16_777_216 : 100_000_000;

const SUPPORTED_EXT = /\.(png|jpe?g|webp|gif|bmp|avif|heic|heif)$/i;

export function isSupportedImage(file: File) {
  if (file.type === 'image/svg+xml') return false;
  return file.type.startsWith('image/') || SUPPORTED_EXT.test(file.name);
}

/** 解码图片：优先 createImageBitmap（可离主线程解码），失败则回退到 <img> */
export async function decodeFile(file: Blob): Promise<Decoded> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
      return { source: bmp, width: bmp.width, height: bmp.height };
    } catch {
      // Safari 旧版本不支持部分参数或格式，回退
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    return { source: img, width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function releaseSource(source: ImageSource) {
  if ('close' in source) source.close();
}

/**
 * 已解码图片的 LRU 缓存。
 * 只保留最近使用的少量原图（当前图 + 前后切换），避免大图把内存吃光。
 */
class SourceCache {
  private map = new Map<string, Promise<Decoded>>();
  private limit: number;
  constructor(limit: number) {
    this.limit = limit;
  }

  get(id: string, file: Blob): Promise<Decoded> {
    const hit = this.map.get(id);
    if (hit) {
      this.map.delete(id);
      this.map.set(id, hit);
      return hit;
    }
    const pending = decodeFile(file);
    pending.catch(() => {
      if (this.map.get(id) === pending) this.map.delete(id);
    });
    this.map.set(id, pending);
    this.evict();
    return pending;
  }

  /** 放入一个已解码结果（例如生成缩略图时顺带解码的当前图） */
  put(id: string, decoded: Decoded) {
    const old = this.map.get(id);
    if (old) old.then((d) => d.source !== decoded.source && releaseSource(d.source)).catch(() => {});
    this.map.delete(id);
    this.map.set(id, Promise.resolve(decoded));
    this.evict();
  }

  has(id: string) {
    return this.map.has(id);
  }

  delete(id: string) {
    const p = this.map.get(id);
    if (!p) return;
    this.map.delete(id);
    p.then((d) => releaseSource(d.source)).catch(() => {});
  }

  clear() {
    for (const id of [...this.map.keys()]) this.delete(id);
  }

  private evict() {
    while (this.map.size > this.limit) {
      const oldest = this.map.keys().next().value as string;
      this.delete(oldest);
    }
  }
}

export const sourceCache = new SourceCache(3);

export function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('图片编码失败'))), type, quality);
  });
}

/** 生成列表缩略图，返回 object URL */
export async function makeThumbnail(decoded: Decoded, file: File, max = 192): Promise<string> {
  const { source, width, height } = decoded;
  const s = Math.min(1, max / Math.max(width, height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width * s));
  canvas.height = Math.max(1, Math.round(height * s));
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  const opaque = file.type === 'image/jpeg' || /\.jpe?g$/i.test(file.name);
  const blob = await canvasToBlob(canvas, opaque ? 'image/jpeg' : 'image/png', 0.8);
  canvas.width = canvas.height = 0;
  return URL.createObjectURL(blob);
}
