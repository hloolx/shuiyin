import React, { useCallback, useRef } from 'react';
import { cn } from '../../lib/utils';

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: number;
  onValueChange?: (value: number) => void;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, onChange, ...props }, ref) => {
    const lastVibrateRef = useRef(0);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      onValueChange?.(newValue);
      onChange?.(e);

      // 移动端触觉反馈（每 100ms 最多触发一次）
      const now = Date.now();
      if (navigator.vibrate && now - lastVibrateRef.current > 100) {
        navigator.vibrate(5);
        lastVibrateRef.current = now;
      }
    }, [onValueChange, onChange]);

    return (
      <input
        ref={ref}
        type="range"
        value={value}
        onChange={handleChange}
        className={cn(
          // 基础样式
          'h-3 sm:h-2 w-full cursor-pointer appearance-none rounded-full bg-foreground/10',
          'transition-all duration-200 touch-none',
          // Webkit 滑块样式 - 移动端增大触摸区域
          '[&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 sm:[&::-webkit-slider-thumb]:h-4 sm:[&::-webkit-slider-thumb]:w-4',
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary',
          '[&::-webkit-slider-thumb]:shadow-subtle [&::-webkit-slider-thumb]:transition-all',
          '[&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:hover:shadow-card',
          '[&::-webkit-slider-thumb]:active:scale-95',
          // Mozilla 滑块样式 - 移动端增大
          '[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 sm:[&::-moz-range-thumb]:h-4 sm:[&::-moz-range-thumb]:w-4',
          '[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0',
          '[&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-subtle [&::-moz-range-thumb]:transition-all',
          // 焦点样式
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
          className
        )}
        {...props}
      />
    );
  }
);

Slider.displayName = 'Slider';
