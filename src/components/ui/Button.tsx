import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-medium',
          'transition-all duration-200 ease-smooth',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
          'disabled:pointer-events-none disabled:opacity-40',
          // 移动端触摸优化
          'active:scale-95 touch-manipulation',
          {
            // 主按钮 - 深蓝强调色
            'bg-primary text-white shadow-subtle hover:bg-primary-800 hover:shadow-card':
              variant === 'primary',
            // 次要按钮 - 浅灰背景
            'bg-foreground/5 text-foreground hover:bg-foreground/10':
              variant === 'secondary',
            // 幽灵按钮 - 透明背景
            'text-muted-foreground hover:bg-foreground/5 hover:text-foreground':
              variant === 'ghost',
            // 描边按钮 - 极细边框
            'border border-border bg-transparent text-foreground hover:border-border-hover hover:bg-foreground/5':
              variant === 'outline',
          },
          {
            // 尺寸 - 移动端增大触摸区域
            'h-9 sm:h-8 px-3.5 sm:px-3 text-sm sm:text-xs': size === 'sm',
            'h-11 sm:h-10 px-5 sm:px-4 text-sm': size === 'md',
            'h-12 sm:h-12 px-6 text-base': size === 'lg',
            'h-11 w-11 sm:h-10 sm:w-10 p-0': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
