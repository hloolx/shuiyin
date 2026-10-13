import type { WatermarkSettings } from '../types';
import { clamp } from '../lib/utils';

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif';

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** 规范化颜色为 #rrggbb；非法输入返回 null */
export function normalizeHex(input: string): string | null {
  const m = HEX_RE.exec(input.trim());
  if (!m) return null;
  let hex = m[1].toLowerCase();
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  return `#${hex}`;
}

function toRgba(color: string, alpha: number): string {
  const hex = (normalizeHex(color) ?? '#2563eb').slice(1);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * 在已绘制好底图的 canvas 上绘制水印。
 * scale 为「画布像素 / 原图像素」，预览时缩小绘制，导出时为 1，
 * 字号、间距都基于原图尺寸计算，保证预览与导出的视觉比例完全一致。
 */
export function drawWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number,
  s: WatermarkSettings
) {
  const text = s.text.trim();
  if (!text) return;

  const srcShort = Math.min(width, height) / scale;
  const fontSize = s.size * Math.max(15, srcShort / 25) * scale;

  ctx.save();
  ctx.font = `600 ${fontSize}px ${FONT_STACK}`;
  ctx.fillStyle = toRgba(s.color, s.alpha);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const rad = (s.angle * Math.PI) / 180;
  const textWidth = ctx.measureText(text).width;

  if (s.mode === 'single') {
    // 旋转后的包围盒，用于把水印完整地放进边距内
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));
    const halfW = (textWidth * cos + fontSize * sin) / 2;
    const halfH = (textWidth * sin + fontSize * cos) / 2;
    const pad = Math.max(fontSize * 0.8, Math.min(width, height) * 0.04);
    const [v, h] = s.position;
    const place = (anchor: string, half: number, len: number) => {
      if (half * 2 + pad * 2 >= len) return len / 2;
      if (anchor === 'start') return pad + half;
      if (anchor === 'end') return len - pad - half;
      return len / 2;
    };
    const cx = place(h === 'l' ? 'start' : h === 'r' ? 'end' : 'center', halfW, width);
    const cy = place(v === 't' ? 'start' : v === 'b' ? 'end' : 'center', halfH, height);
    ctx.translate(cx, cy);
    ctx.rotate(rad);
    ctx.fillText(text, 0, 0);
  } else {
    const stepX = textWidth + fontSize * 2;
    const stepY = clamp(s.space, 1, 10) * fontSize;
    // 以画布中心旋转，覆盖半径为对角线一半的圆即可铺满
    const radius = Math.hypot(width, height) / 2;
    const nx = Math.ceil(radius / stepX) + 1;
    const ny = Math.ceil(radius / stepY) + 1;
    ctx.translate(width / 2, height / 2);
    ctx.rotate(rad);
    for (let j = -ny; j <= ny; j++) {
      const offset = s.stagger && j & 1 ? stepX / 2 : 0;
      for (let i = -nx; i <= nx; i++) {
        ctx.fillText(text, i * stepX + offset, j * stepY);
      }
    }
  }

  ctx.restore();
}

/** 绘制完整画面：底图 + 水印 */
export function renderComposite(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  width: number,
  height: number,
  scale: number,
  settings: WatermarkSettings | null,
  background?: string
) {
  ctx.clearRect(0, 0, width, height);
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, width, height);
  if (settings) drawWatermark(ctx, width, height, scale, settings);
}
