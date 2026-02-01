import { useEffect, useRef, useCallback } from 'react';

interface SwipeConfig {
  threshold?: number;
  timeout?: number;
}

interface SwipeResult {
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
}

export function useTouchGesture(
  onSwipe: (result: SwipeResult) => void,
  config: SwipeConfig = {}
) {
  const { threshold = 50 } = config;
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;
      const deltaTime = Date.now() - touchStart.current.time;

      // 快速滑动或超过阈值的滑动
      const velocity = Math.abs(deltaX) / deltaTime;
      const isQuickSwipe = velocity > 0.5;
      const isLongSwipe = Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold;

      if (isQuickSwipe || isLongSwipe) {
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        let direction: SwipeResult['direction'] = null;

        if (absX > absY) {
          // 水平滑动
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          // 垂直滑动
          direction = deltaY > 0 ? 'down' : 'up';
        }

        onSwipe({
          direction,
          distance: Math.max(absX, absY),
        });
      }

      touchStart.current = null;
    },
    [threshold, onSwipe]
  );

  const setRef = useCallback((element: HTMLElement | null) => {
    if (elementRef.current) {
      elementRef.current.removeEventListener('touchstart', handleTouchStart, { passive: true } as EventListenerOptions);
      elementRef.current.removeEventListener('touchend', handleTouchEnd, { passive: true } as EventListenerOptions);
    }

    if (element) {
      element.addEventListener('touchstart', handleTouchStart, { passive: true });
      element.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    elementRef.current = element;
  }, [handleTouchStart, handleTouchEnd]);

  useEffect(() => {
    return () => {
      if (elementRef.current) {
        elementRef.current.removeEventListener('touchstart', handleTouchStart, { passive: true } as EventListenerOptions);
        elementRef.current.removeEventListener('touchend', handleTouchEnd, { passive: true } as EventListenerOptions);
      }
    };
  }, [handleTouchStart, handleTouchEnd]);

  return setRef;
}

// 长按检测 hook
export function useLongPress(
  onLongPress: (e: TouchEvent) => void,
  onClick?: (e: TouchEvent) => void,
  ms = 500
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const start = useCallback(
    (e: TouchEvent) => {
      isLongPress.current = false;
      const touch = e.touches[0];
      startPos.current = { x: touch.clientX, y: touch.clientY };

      timerRef.current = setTimeout(() => {
        isLongPress.current = true;
        onLongPress(e);
        // 触发触觉反馈
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }, ms);
    },
    [onLongPress, ms]
  );

  const move = useCallback((e: TouchEvent) => {
    if (!timerRef.current) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - startPos.current.x);
    const deltaY = Math.abs(touch.clientY - startPos.current.y);

    // 移动超过 10px 取消长按
    if (deltaX > 10 || deltaY > 10) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const end = useCallback(
    (e: TouchEvent) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;

        if (!isLongPress.current && onClick) {
          onClick(e);
        }
      }
      isLongPress.current = false;
    },
    [onClick]
  );

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    isLongPress.current = false;
  }, []);

  return {
    onTouchStart: start,
    onTouchMove: move,
    onTouchEnd: end,
    onTouchCancel: cancel,
  };
}

// 双击检测 hook
export function useDoubleTap(onDoubleTap: () => void, delay = 300) {
  const lastTap = useRef(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleTap = useCallback(() => {
    const now = Date.now();
    const delta = now - lastTap.current;

    if (delta < delay && delta > 0) {
      // 双击
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      onDoubleTap();
      lastTap.current = 0;
    } else {
      // 单击，等待下一次点击
      lastTap.current = now;
      timer.current = setTimeout(() => {
        timer.current = null;
      }, delay);
    }
  }, [onDoubleTap, delay]);

  return handleTap;
}
