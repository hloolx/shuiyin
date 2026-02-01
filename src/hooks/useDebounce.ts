import { useEffect, useRef, useCallback, useState } from 'react';

// 防抖 hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 防抖回调 hook
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

// 节流 hook
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const remaining = limit - (now - lastRan.current);

    if (remaining <= 0) {
      setThrottledValue(value);
      lastRan.current = now;
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [value, limit]);

  return throttledValue;
}

// 节流回调 hook
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T {
  const lastRan = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      const remaining = limit - (now - lastRan.current);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (remaining <= 0) {
        callback(...args);
        lastRan.current = now;
      } else {
        timeoutRef.current = setTimeout(() => {
          callback(...args);
          lastRan.current = Date.now();
        }, remaining);
      }
    }) as T,
    [callback, limit]
  );
}

// RAF (requestAnimationFrame) 节流 - 适用于高频更新的场景
export function useRAFThrottle<T extends (...args: any[]) => any>(callback: T): T {
  const rafRef = useRef<number | null>(null);
  const latestArgs = useRef<Parameters<T> | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      latestArgs.current = args;

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          if (latestArgs.current) {
            callback(...latestArgs.current);
          }
          rafRef.current = null;
        });
      }
    }) as T,
    [callback]
  );
}

// 用于 Canvas 渲染的性能优化 hook
export function useCanvasOptimizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // 获取优化的 canvas 上下文
  const getOptimizedContext = useCallback((canvas: HTMLCanvasElement) => {
    if (canvasRef.current === canvas && ctxRef.current) {
      return ctxRef.current;
    }

    const ctx = canvas.getContext('2d', {
      alpha: false, // 不透明，提升性能
      desynchronized: true, // 减少延迟（如果支持）
    });

    if (ctx) {
      // 关闭抗锯齿以提升性能（可选）
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'low'; // 移动端使用低质量以提升性能
    }

    canvasRef.current = canvas;
    ctxRef.current = ctx;

    return ctx;
  }, []);

  // 清理函数
  const cleanup = useCallback(() => {
    canvasRef.current = null;
    ctxRef.current = null;
  }, []);

  return { getOptimizedContext, cleanup };
}
