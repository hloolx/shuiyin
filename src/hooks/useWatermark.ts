import { useState, useCallback, useEffect, useRef } from 'react';
import type { WatermarkSettings, ImageFile } from '../types';
import { loadImageToCanvas } from '../utils/canvas';

const DEFAULT_SETTINGS: WatermarkSettings = {
  text: 'in.15o.cc',
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
  const abortControllerRef = useRef<AbortController | null>(null);
  const processingRef = useRef<Set<string>>(new Set());
  const lastImageIdRef = useRef<string | null>(null);

  // 更新设置
  const updateSettings = useCallback((partial: Partial<WatermarkSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  // 清除缓存
  const clearCache = useCallback(() => {
    canvasCacheRef.current.clear();
  }, []);

  // 生成预览
  const generatePreview = useCallback(async (image: ImageFile, currentSettings: WatermarkSettings) => {
    const cacheKey = `${image.id}-${JSON.stringify(currentSettings)}`;
    
    // 如果正在处理这个确切的请求，跳过
    if (processingRef.current.has(cacheKey)) return;
    
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    // 检查缓存
    const cachedCanvas = canvasCacheRef.current.get(cacheKey);
    if (cachedCanvas && !signal.aborted) {
      setPreviewCanvas(cachedCanvas);
      setIsLoading(false);
      return;
    }

    processingRef.current.add(cacheKey);

    try {
      const canvas = await loadImageToCanvas(image.file, currentSettings);
      
      if (!signal.aborted) {
        canvasCacheRef.current.set(cacheKey, canvas);
        setPreviewCanvas(canvas);
        lastImageIdRef.current = image.id;
      }
    } catch (error) {
      if (!signal.aborted) {
        console.error('Failed to generate preview:', error);
      }
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
      processingRef.current.delete(cacheKey);
    }
  }, []);

  // 当当前图片或设置改变时，生成预览
  useEffect(() => {
    if (!currentImage) {
      setPreviewCanvas(null);
      setIsLoading(false);
      lastImageIdRef.current = null;
      return;
    }

    // 图片改变时显示加载状态，设置改变时不显示
    const isImageChanged = lastImageIdRef.current !== currentImage.id;
    if (isImageChanged) {
      setIsLoading(true);
    }

    // 使用 requestAnimationFrame 延迟执行，避免阻塞 UI
    const rafId = requestAnimationFrame(() => {
      generatePreview(currentImage, settings);
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [currentImage, settings, generatePreview]);

  // 清理
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
