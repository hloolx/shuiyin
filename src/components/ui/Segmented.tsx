import { m } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface Option<T extends string> {
  value: T;
  label: ReactNode;
}

interface SegmentedProps<T extends string> {
  /** 用于区分多个分段控件的滑块动画 */
  name: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  className?: string;
  'aria-label'?: string;
}

export function Segmented<T extends string>({ name, value, options, onChange, className, ...rest }: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={rest['aria-label']}
      className={cn('grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-surface-2 p-1', className)}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'relative isolate flex h-8 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors sm:text-sm',
              active ? 'text-foreground' : 'text-foreground-tertiary hover:text-foreground-secondary'
            )}
          >
            {active && (
              <m.span
                layoutId={`seg-${name}`}
                className="absolute inset-0 -z-10 rounded-lg bg-surface shadow-[0_1px_3px_rgb(15_23_42/0.12)]"
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
