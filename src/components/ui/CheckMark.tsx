import { m } from 'motion/react';
import { cn } from '../../lib/utils';

/** 纯展示的勾选框，带描边动画；mixed 为半选 */
export function CheckMark({ checked, mixed = false, className }: { checked: boolean; mixed?: boolean; className?: string }) {
  const on = checked || mixed;
  return (
    <span
      aria-hidden
      className={cn(
        'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[6px] border-[1.5px] transition-colors duration-150',
        on ? 'border-primary bg-primary' : 'border-border-strong bg-surface',
        className
      )}
    >
      <svg viewBox="0 0 16 16" className="h-3 w-3 text-white">
        {mixed ? (
          <path d="M4 8h8" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" />
        ) : (
          <m.path
            d="M3.5 8.5l3 3 6-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          />
        )}
      </svg>
    </span>
  );
}
