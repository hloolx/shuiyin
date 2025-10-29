import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { dataURItoBlob, generateFileName } from './canvas';

/**
 * 下载单个 Canvas 为图片
 */
export function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  const dataURL = canvas.toDataURL('image/png');
  const blob = dataURItoBlob(dataURL);
  saveAs(blob, filename);
}

/**
 * 批量下载多个 Canvas 为 ZIP
 */
export async function downloadMultipleAsZip(
  canvases: HTMLCanvasElement[],
  originalNames: string[],
  onProgress?: (current: number, total: number, fileName: string) => void
): Promise<void> {
  const zip = new JSZip();
  const total = canvases.length;

  for (let i = 0; i < total; i++) {
    const canvas = canvases[i];
    const originalName = originalNames[i];
    const fileName = generateFileName(originalName);

    if (onProgress) {
      onProgress(i + 1, total, fileName);
    }

    // 将 canvas 转换为 blob
    const dataURL = canvas.toDataURL('image/png');
    const blob = dataURItoBlob(dataURL);

    // 添加到 zip
    zip.file(fileName, blob);
  }

  // 生成 ZIP 文件并下载
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const zipFileName = `watermark_${new Date().getTime()}.zip`;
  saveAs(zipBlob, zipFileName);
}
