import { saveAs } from 'file-saver';
import type { ExportOptions, ExportProgress, ImageItem, WatermarkSettings } from '../types';
import { MAX_CANVAS_PIXELS, canvasToBlob, decodeFile, releaseSource, sourceCache } from './image';
import { renderComposite } from './watermark';

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

/** 根据原图类型与用户选择决定输出格式 */
function targetMime(file: File, format: ExportOptions['format']): string {
  if (format === 'jpeg') return 'image/jpeg';
  if (format === 'png') return 'image/png';
  if (format === 'webp') return 'image/webp';
  // 原格式：照片保持 JPEG 避免体积暴涨；其余无损格式统一 PNG
  if (file.type === 'image/jpeg' || /\.jpe?g$/i.test(file.name)) return 'image/jpeg';
  if (file.type === 'image/webp') return 'image/webp';
  if (/image\/hei[cf]/.test(file.type) || /\.hei[cf]$/i.test(file.name)) return 'image/jpeg';
  return 'image/png';
}

export function outputName(original: string, ext: string) {
  const base = original.replace(/\.[^./\\]+$/, '') || 'image';
  return `${base}_watermark.${ext}`;
}

/** 同名文件追加 (2)、(3)… 防止 ZIP 内被覆盖 */
function uniqueName(name: string, used: Set<string>) {
  if (!used.has(name)) {
    used.add(name);
    return name;
  }
  const dot = name.lastIndexOf('.');
  const stem = name.slice(0, dot);
  const ext = name.slice(dot);
  let n = 2;
  while (used.has(`${stem} (${n})${ext}`)) n++;
  const unique = `${stem} (${n})${ext}`;
  used.add(unique);
  return unique;
}

function timestamp() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

const nextFrame = () => new Promise<void>((r) => setTimeout(r, 0));

/** 以原图分辨率渲染单张图片（超出画布上限时等比缩小） */
export async function renderImage(
  item: ImageItem,
  settings: WatermarkSettings,
  options: ExportOptions
): Promise<{ blob: Blob; name: string }> {
  // 缓存里有就复用（不释放），否则临时解码、用完立即释放
  const cached = sourceCache.has(item.id);
  const decoded = cached ? await sourceCache.get(item.id, item.file) : await decodeFile(item.file);

  try {
    const scale = Math.min(1, Math.sqrt(MAX_CANVAS_PIXELS / (decoded.width * decoded.height)));
    const width = Math.max(1, Math.round(decoded.width * scale));
    const height = Math.max(1, Math.round(decoded.height * scale));
    const mime = targetMime(item.file, options.format);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    // JPEG 不支持透明，先铺白底，避免透明区域变黑
    renderComposite(ctx, decoded.source, width, height, scale, settings, mime === 'image/jpeg' ? '#ffffff' : undefined);

    const blob = await canvasToBlob(canvas, mime, mime === 'image/png' ? undefined : options.quality);
    canvas.width = canvas.height = 0;
    // Safari 不支持编码 WebP 时会回退为 PNG，以实际类型为准
    const ext = EXT_BY_MIME[blob.type] ?? 'png';
    return { blob, name: outputName(item.name, ext) };
  } finally {
    if (!cached) releaseSource(decoded.source);
  }
}

export async function downloadImage(item: ImageItem, settings: WatermarkSettings, options: ExportOptions) {
  const { blob, name } = await renderImage(item, settings, options);
  saveAs(blob, name);
}

/**
 * 批量导出：逐张渲染 → 编码 → 写入 ZIP，同一时刻只持有一张大图。
 * 只有一张时直接下载图片本身。
 */
export async function exportImages(
  items: ImageItem[],
  settings: WatermarkSettings,
  options: ExportOptions,
  onProgress: (p: ExportProgress) => void,
  signal: AbortSignal
): Promise<void> {
  const total = items.length;
  const abortIfNeeded = () => {
    if (signal.aborted) throw new DOMException('已取消', 'AbortError');
  };

  if (total === 1) {
    onProgress({ phase: 'render', current: 1, total, name: items[0].name, ratio: 0.3 });
    const { blob, name } = await renderImage(items[0], settings, options);
    abortIfNeeded();
    onProgress({ phase: 'done', current: 1, total, name, ratio: 1 });
    saveAs(blob, name);
    return;
  }

  // JSZip 体积较大，按需加载
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  const used = new Set<string>();

  for (let i = 0; i < total; i++) {
    abortIfNeeded();
    const item = items[i];
    onProgress({ phase: 'render', current: i + 1, total, name: item.name, ratio: (i / total) * 0.9 });
    const { blob, name } = await renderImage(item, settings, options);
    zip.file(uniqueName(name, used), blob);
    await nextFrame();
  }

  abortIfNeeded();
  onProgress({ phase: 'zip', current: total, total, name: '', ratio: 0.9 });
  // 图片本身已压缩，STORE 模式打包最快
  const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'STORE' }, (meta) => {
    onProgress({ phase: 'zip', current: total, total, name: '', ratio: 0.9 + (meta.percent / 100) * 0.1 });
  });
  abortIfNeeded();
  onProgress({ phase: 'done', current: total, total, name: '', ratio: 1 });
  saveAs(zipBlob, `watermark_${timestamp()}.zip`);
}

export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
