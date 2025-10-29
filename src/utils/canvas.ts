import type { WatermarkSettings } from '../types';

/**
 * 将 DataURI 转换为 Blob 对象
 */
export function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}

/**
 * 生成加水印后的文件名
 */
export function generateFileName(originalName: string): string {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0].replace(/:/g, '');
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');

  return `${nameWithoutExt}_watermark_${date} ${time}.png`;
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * 将 hex 颜色转换为 RGBA 字符串
 */
export function makeRGBAColor(color: string, alpha: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * 在 Canvas 上绘制水印
 */
export function drawWatermark(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  settings: WatermarkSettings
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 设置 canvas 尺寸
  canvas.width = img.width;
  canvas.height = img.height;

  // 清除画布并绘制原图
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  // 如果没有水印文字，只显示原图
  if (!settings.text) return;

  // 计算字体大小（自适应图片尺寸）
  const textSize = settings.size * Math.max(15, Math.min(canvas.width, canvas.height) / 25);

  // 设置字体和颜色
  ctx.font = `bold ${textSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif`;
  ctx.fillStyle = makeRGBAColor(settings.color, settings.alpha);

  // 保存当前状态
  ctx.save();

  // 计算平铺所需的重复次数
  const step = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
  const textWidth = ctx.measureText(settings.text).width;
  const margin = textSize * 2;
  const xCount = Math.ceil(step / (textWidth + margin));
  const yCount = Math.ceil(step / (settings.space * textSize)) / 2;

  // 移动到画布中心并旋转
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((settings.angle * Math.PI) / 180);

  // 绘制水印文字（平铺）
  for (let i = -xCount; i < xCount; i++) {
    for (let j = -yCount; j < yCount; j++) {
      const x = i * (textWidth + margin);
      const y = j * (settings.space * textSize);
      ctx.fillText(settings.text, x, y);
    }
  }

  // 恢复状态
  ctx.restore();
}

/**
 * 加载图片到 Canvas
 */
export function loadImageToCanvas(
  file: File,
  settings: WatermarkSettings
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const img = new Image();

    img.onload = () => {
      drawWatermark(canvas, img, settings);
      URL.revokeObjectURL(img.src);
      resolve(canvas);
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}
