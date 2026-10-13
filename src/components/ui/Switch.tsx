import { m } from 'motion/react';
import { cn } from '../../lib/utils';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 py-1 text-sm text-foreground-secondary"
    >
      <span>{label}</span>
      <span
        className={cn(
          'relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200',
          checked ? 'bg-primary' : 'bg-border-strong'
        )}
      >
        <m.span
          className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgb(15_23_42/0.3)]"
          initial={false}
          animate={{ x: checked ? 16 : 0 }}
          transition={{ type: 'spring', stiffness: 600, damping: 32 }}
        />
      </span>
    </button>
  );
}
