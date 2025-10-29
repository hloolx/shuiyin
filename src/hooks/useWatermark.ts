import { useState, useCallback, useEffect, useRef } from 'react';
import type { WatermarkSettings, ImageFile } from '../types';
import { loadImageToCanvas } from '../utils/canvas';

const DEFAULT_SETTINGS: WatermarkSettings = {
  text: '',
  color: '#2563eb',
  alpha: 0.15,
  angle: 45,
  space: 4,
  size: 1,
};

export function useWatermark(currentImage: ImageFile | null) {
  const [settings, setSettings] = useState<WatermarkSettings>(DEFAULT_SETTINGS);
  const [previewCanvas, setPreviewCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const canvasCacheRef = useRef<Map<string, HTMLCanvasElement>>(new Map());

  // 更新设置
  const updateSettings = useCallback((partial: Partial<WatermarkSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  // 清除缓存
  const clearCache = useCallback(() => {
    canvasCacheRef.current.clear();
  }, []);

  // 生成预览
  const generatePreview = useCallback(async () => {
    if (!currentImage) {
      setPreviewCanvas(null);
      return;
    }

    setIsLoading(true);

    try {
      // 检查缓存
      const cacheKey = `${currentImage.id}-${JSON.stringify(settings)}`;
      let canvas = canvasCacheRef.current.get(cacheKey);

      if (!canvas) {
        // 生成新的 canvas
        canvas = await loadImageToCanvas(currentImage.file, settings);
        canvasCacheRef.current.set(cacheKey, canvas);
      }

      setPreviewCanvas(canvas);
    } catch (error) {
      console.error('Failed to generate preview:', error);
      setPreviewCanvas(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentImage, settings]);

  // 当设置改变时，自动重新生成预览
  useEffect(() => {
    clearCache();
    generatePreview();
  }, [settings, clearCache, generatePreview]);

  // 当当前图片改变时，生成预览
  useEffect(() => {
    generatePreview();
  }, [currentImage?.id]); // 只监听图片 ID 变化

  // 生成指定图片的 canvas（用于批量下载）
  const generateCanvas = useCallback(
    async (imageFile: ImageFile): Promise<HTMLCanvasElement> => {
      return loadImageToCanvas(imageFile.file, settings);
    },
    [settings]
  );

  return {
    settings,
    previewCanvas,
    isLoading,
    updateSettings,
    generateCanvas,
    clearCache,
  };
}
